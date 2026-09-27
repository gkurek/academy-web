# Phoenix 17000 / "Stream finished" — Investigation Report

Sep 25, 2026 · @Grzegorz

## Summary

Users running **Preview** or **Generate** in the DDC Phoenix drawing tool intermittently get `Unable to complete operation. Error: Stream finished [Success]. (Error Code: 500)`. Each occurrence pairs 1:1 with a SEVERE code `17000` on `Phoenix.MapServer`. **Both paths are now confirmed by worked example: `DrawingToolScript` throughout the census, and `APRXGenerationToolScript` in the Sep 25 incident (F7).**

**Rate.** Roughly **9–13% of drawing-tool jobs** are affected. Measured over Sep 1–24 across 618 jobs: custprev 32 of 350 (9.1%), TEST 36 of 268 (13.4%, inflated by non-GP traffic — see F1). This is not a rare edge case, and it has run continuously for at least a month. It is not a recent regression.

**Cause.** The server intermittently loses its connection to the Aurora PostgreSQL geodatabase. `Underlying DBMS error [no connection to the server]` appears in the log immediately before failure bursts. When the connection goes, every instance in the pool fails together — up to all four within 60 seconds — and freshly created replacements fail within seconds of birth because they reconnect to the same unhealthy workspace. _Why_ the connection drops is not answerable from log data and is the one question that must go to infrastructure.

**Aggravating defect.** Both environments publish `Phoenix.MapServer` from a **branch-versioned** SDE workspace (`BRANCH=sde.DEFAULT`) while the **`VersionManagementServer` extension is disabled**. This is an unsupported configuration, and it is the most likely reason a dropped connection produces an unrecoverable 500 rather than a retried query.

**The original thesis is wrong.** `report.md` attributes the failures to worker instances aging past a 30-minute idle limit without being recycled. Both halves are refuted: 281 instances were created into 4-slot pools over 30 days (recycling works — teardown simply is not logged at INFO), and 12 of 30 measured instances failed before they were 10 minutes old, the youngest at 2 minutes. Section 5 and the 30-minute thesis must be retracted before any external contact.

**Ship first, regardless of root cause.** There is no retry or backoff anywhere in `backend/`. Every write is single-shot, so one transient 500 destroys a whole user job. Failures are short and bursty — a retry 2–5 seconds later lands on a different instance. Most of the 186 observed failures would have been invisible to users.

**A silent data-correctness path is confirmed, not theoretical.** The Generate status update deletes `Expired`/`Discarded` rows inside a bare `try/except: pass`, then re-queries **without a status filter** and stamps every remaining row `Generated`. When the delete fails, expired and discarded features are promoted to live. The failure is unobservable after the fact — the update erases its own evidence — so this cannot be audited retrospectively, only prevented. Observed failing twice on Sep 25 (F7).

## The failure

**What the user sees**

```
Unable to complete operation. Error: Stream finished [Success]. (Error Code: 500)
Failed to execute (DrawingToolScript).
```

**What the server logs**

A SEVERE code `17000` on `Phoenix.MapServer`, on one of three methods:

| Method                                                          | TEST    | custprev |
| --------------------------------------------------------------- | ------- | -------- |
| `GraphicFeatureServer::HandleREST_ApplyEditsOperation`          | 51      | 56       |
| `GraphicFeatureServer::HandleREST_DeleteFeaturesOperation`      | 38      | 15       |
| `GraphicFeatureServer::HandleREST_ApplyEditsRootLevelOperation` | 24      | 2        |
| **Total**                                                       | **113** | **73**   |

186 events over the census window. The 1:1 pairing between the user-facing error and the server `17000` is the one claim from the original report that survives intact.

**Which code can produce it**

A full read-only audit of the repository (frontend, backend, scripts, tooling) was run to establish the complete write surface. Phoenix writes originate from exactly three places:

1. **DrawingToolScript** (`backend/main.py` → `DrawingScript/`) — 15 add-only call sites, reached only through `ProcedureProcessor`. Fired by **Preview**.
2. **APRXGenerationToolScript** (`backend/chartMainScript.py:84` → `handle_element_status` → `featureClassGdb.update_layer_status`) — one `delete_features` pass plus one `edit_features(updates=)` pass over 11 carto layers, so up to **22 Phoenix calls per Generate**.
3. **Two operator-run scripts** — `cleanUpScript.py` (`--env`, deletes rows older than 48h with `status <> 'Generated'`) and `cleanData.py` (hard-coded `dev`, `where 1=1` full wipe). Neither has any scheduler, cron, CI job or Task Scheduler entry anywhere in the repo.

**The frontend issues no Phoenix writes at all.** Every `applyEdits` in `frontend/src` targets the separate Charts hosted table; the only `SketchViewModel` is bound to a client-side `GraphicsLayer` for the chart frame and never round-trips to the server. This was verified independently by two audits and confirmed by call-graph check — the six `PhoenixApi.add_*_features` methods are called only from `DrawingScript/`.

**Consequence:** `ApplyEdits*` failures come from Preview's add path or Generate's status update; `DeleteFeatures` failures come from `featureClassGdb.py:68` or `cleanUpScript.py:81`. Nothing else in the codebase can produce either.

## Evidence base and method

Log analysis only. Reproduction was not methodical enough to serve as a test. All data comes from the ArcGIS Server Admin API `logs/query` on two environments:

- **TEST** — `IP-10-28-19-246.EU-WEST-1.COMPUTE.INTERNAL`
- **custprev** — `IP-10-28-35-202.EU-WEST-1.COMPUTE.INTERNAL`

**Dataset**

| Set                             | Span            | Events                  |
| ------------------------------- | --------------- | ----------------------- |
| Filtered census, TEST           | Sep 1 – Sep 24  | 1,933                   |
| Filtered census, custprev       | Aug 25 – Sep 24 | 1,632                   |
| Job denominator (`20034`), both | Sep 1 – Sep 24  | 489 TEST / 556 custprev |
| Unfiltered `7572` pulls, both   | Sep 8 – Sep 23  | 23 TEST / 87 custprev   |

All pulls returned `hasMore: false`. The denominator window starts Sep 1 because earlier start timestamps returned zero rows on both environments.

**The working filter**

```
filter   = {"machines":"*","server":"*",
            "codes":[7563,7565,7566,7570,7571,7572,7573,
                     8000,8001,8002,8003,8004,
                     13000,17000,17001]}
level    = INFO
pageSize = 10000
```

**Three traps, found the hard way**

1. **The `services` filter is broken on 11.4.0 build 54309.** Passing `{"services":["Phoenix.MapServer"]}` does not restrict results, and silently _omits_ events that genuinely belong to the named service. It hid 6 Phoenix `7572` events on custprev and nearly produced a false headline finding. **Filter by `codes` only**, and verify every pull against the returned `source` and `machine` values. Any finding phrased as "X never happens" must be re-verified without this filter.
2. **`pageSize` is hard-capped at 10,000.** Unfiltered, one day of TEST is roughly 246,000 events (\~108 MB). Always check `hasMore`.
3. **\~96% of unfiltered volume is noise** — codes `9999`, `9029`, `7615`, dominated by `/arcgis/rest/info/healthCheck` polling. Code-filtering reduces a day from \~246,000 events to \~200.

**Also note:** codes `7563`, `7565`, `7566`, `7570`, `7572` are logged under the **server host process**, not the instance PID. Only `8000`, `8001`, `17000`, `17001` carry the instance PID. Never filter lifecycle codes by `processIds`.

**The `user` field on `Phoenix.MapServer` rows does not identify who ran the job.** All four `17000`s in the Sep 25 incident report `user: test.user`, while the GP jobs were initiated by `custprev.user1`. Phoenix writes always travel through the backend service account (`backend/envs.py`, U3). Any attribution that leaned on this field needs re-checking; use the GP-side `20034` rows instead.

**Log code reference (`plan.md` dictionary — corrected)**

| Code   | Source | Meaning                                                                                                                                                                      |
| ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `8003` | `<svc>` | **Failed to initialize server object** — _not_ a teardown event. Observed on custprev Sep 25 at 13:43:49 and 13:44:49 on `Airspace.MapServer`, paired with `7570`. |

`8002` and `8004` remain unobserved. This is a second, independent reason the original report's Section 5 argument fails: it looked for teardown in a code that does not signal teardown.

The `7570` row — previously recorded as Falcon-only — is now seen twice on `Airspace.MapServer` (custprev), minutes after Phoenix's bad window. Alongside the `Polaris_Capture` observation, another service on the same host failing to construct in the same period.

**Denominator method.** Code `20034` (_"Initialized job: j…"_) logs exactly one row per geoprocessing job. Filtering to `source == "DrawingToolScript.GPServer"` gives jobs attempted. Failures were attributed to jobs by nearest preceding job initialisation; the 5-minute and 60-minute windows are reported where they differ.

## Main findings

These seven findings bear directly on the `17000` failures. Unrelated observations are kept separate, further down.

### F1 — 9–13% of drawing-tool jobs fail

Measured Sep 1–24, attributing each `Stream finished` to the nearest preceding `DrawingToolScript` job initialisation:

|                                      | TEST           | custprev      |
| ------------------------------------ | -------------- | ------------- |
| `DrawingToolScript` jobs             | 268            | 350           |
| `Stream finished` events             | 113            | 47            |
| Jobs with ≥1 failure (5-min window)  | **36 (13.4%)** | **32 (9.1%)** |
| Failures with no GP job within 5 min | 61             | 1             |

**custprev is the clean measurement at 9.1%.** TEST's 13.4% is inflated: 61 of its 113 failures have no geoprocessing job within five minutes (36 still have none within sixty), they cluster in working hours rather than at a nightly slot, and they are dominated by `DeleteFeatures` and `ApplyEditsRootLevel`. The most likely source is `backend/localServer.py` — developers running `main.py` or `chartMainScript.py` locally against the TEST environment write to Phoenix with no server-side GP job logged at all, and `--mode test` is the documented local-dev default. Report the rate as a range, not a point.

The pre-agreed decision rule _"failure rate low single-digit % → H1 untenable"_ does **not** fire. The rate is an order of magnitude higher than that threshold.

### F2 — H1 (instance aging) is rejected

Age at first `Stream finished`, for all 30 instances whose birth (`8000`) is observable in the 30-day census, in minutes:

```
 2.0   2.2   3.2   4.2   4.6   4.9   5.4   6.2   6.7   6.8
 9.0   9.3  10.1  14.3  18.1  19.0  26.0  30.8  31.9  34.6
35.4  67.5  67.6  87.6 101.6 125.5 145.6 154.1 233.1 253.9
```

min 2.0 · median 18.6 · max 253.9 · **12 of 30 under 10 minutes** · **19 of 30 under 30 minutes**

A further instance (TEST PID 31966, Sep 24) failed **17 seconds** after creation. The pre-agreed rule _"any 17000 on an instance aged < 10 min → H1 rejected outright"_ fires twelve times over.

The recycling half of the thesis fails on arithmetic: **281 Phoenix instances were created** over 30 days (TEST 129, custprev 152) into pools with a hard ceiling of **4 per environment** (one machine per env, `maxInstancesPerNode: 4`). Instances are destroyed constantly. `8002`/`8003`/`8004` never appear because teardown is not logged at INFO — the original report measured the logging configuration, not the server's behaviour.

### F3 — H2 confirmed: the database connection drops, pool-wide

Four independent strands:

1. **DBMS errors precede failures on the same PID.** TEST Sep 17: `no connection to the server` on PID 42184 at 21:09:28 → all four PIDs fail 21:13:56–21:14:08 → four new instances born 21:14:10–21 → the new ones begin throwing `Stream finished` at 21:16:20.
2. **Six pool-wide collapses** — four distinct PIDs failing within 60 seconds, which is incompatible with independent per-instance aging:

| Env      | UTC            | PIDs                       |
| -------- | -------------- | -------------------------- |
| TEST     | 09-17 21:13:56 | 37941, 42183, 42184, 42304 |
| TEST     | 09-18 14:19:32 | 11921, 26828, 26899, 26902 |
| custprev | 09-08 12:18:00 | 18244, 18625, 18692, 18693 |
| custprev | 09-22 08:19:37 | 4432, 10646, 10647, 10750  |
| custprev | 09-22 08:59:08 | 18743, 19279, 19311, 19394 |
| custprev | 09-24 15:38:54 | 22717, 24469, 24503, 24504 |

3. **`7563 "Service instance activation failed… Underlying DBMS error in esriDataSourcesGDB.SdeWorkspace"`** — 31 on Phoenix (TEST 14, custprev 17), plus 64 on `Polaris_Capture` and 3 on `Polaris_Data_Init`. Not Phoenix-specific, which points at the workspace or the connection, not the service.
4. **Replacements fail immediately**, because they reconnect to the same unhealthy workspace.

This is a diagnosis, not a root cause. _Why_ the connection drops — firewall/NAT idle reap, database-side session timeout, connection-pool exhaustion, maintenance — is not visible in log data.

### F4 — Branch versioning without the version management service

The `Phoenix.MapServer` manifest on **both** environments registers its workspace as:

```
onServerWorkspaceFactoryProgID: esriDataSourcesGDB.SdeWorkspaceFactory
byReference: true
onServerName: "sde.DEFAULT (geodb-<env>.aerodata-nonprod.internal)"
connectionString: …;DBCLIENT=postgresql;DATABASE=aerodata<env>geodb;USER=sde;
                  AUTHENTICATION_MODE=DBMS;BRANCH=sde.DEFAULT
```

`BRANCH=sde.DEFAULT` means **branch versioning**. Meanwhile `VersionManagementServer` is **disabled** on both environments (confirmed in the service JSON). Serving edits against a branch-versioned workspace without that extension is not a supported configuration.

Supporting evidence: **1,263 `17000` events reading `Failed to find Version 'sde.DEFAULT'`** (TEST 533, custprev 730), every one of them on `HandleREST_QueryOperation`. And inside the custprev Sep 21 window, three `StartMultiuserEditSession` failures — a branch-versioning call — each accompanied by `Underlying DBMS error [no connection to the server]`.

This is the condition that turns a transient connection loss into an unrecoverable 500 rather than a retried query. It is also independently wrong and worth fixing on its own merits.

Confirmable without admin credentials, from `/arcgis/rest/services/Phoenix/MapServer?f=json`: `hasVersionedData: true` and `supportedExtensions: "FeatureServer"` — versioned data, no `VersionManagementServer`. Individual layers report `isDataVersioned: true`. This is the easiest form in which to show the mismatch to Esri or to whoever owns the data model.

### F5 — the two error families are siblings, not cause and effect

Zero of the 186 `Stream finished` events fall within 60 seconds of a `sde.DEFAULT` event, on either environment. The `sde.DEFAULT` family is exclusively **reads** (`HandleREST_QueryOperation`); `Stream finished` is exclusively **writes**. Both descend from the same underlying condition — lost connection against a branch-versioned workspace — on two different paths.

One caveat on the counts: TEST's 533 `sde.DEFAULT` events are really two single-instance bursts. On Sep 21, **all 271 came from one PID (22733)** inside 2.5 minutes, 195 of them in a single minute. custprev's Sep 21 flood is the opposite shape — 654 events over 2.5 hours across **24 distinct PIDs**. Count episodes, not events; the raw totals overstate how widespread this is on TEST.

### F6 — H3 narrowed: shared network, not shared database

The two environments do **not** share a database:

|                           | TEST                                                                    | custprev                                                                    |
| ------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Cluster                   | `aerodata-test-geodb-…cluster-co7yyeqkhfbq.eu-west-1.rds.amazonaws.com` | `aerodata-custprev-geodb-…cluster-co7yyeqkhfbq.eu-west-1.rds.amazonaws.com` |
| Database                  | `aerodatatestgeodb`                                                     | `aerodatacustprevgeodb`                                                     |
| Alias used by the service | `geodb-test.aerodata-nonprod.internal`                                  | `geodb-custprev.aerodata-nonprod.internal`                                  |

Two distinct Aurora PostgreSQL clusters. So the cross-environment events cannot be one database going away. But there are **two** of them:

- **Sep 21** — TEST's burst runs 12:35:29–12:38:02; custprev's begins 12:38:50, 48 seconds later, on a different server against a different cluster.
- **Sep 24** — both environments lose their entire Phoenix pool between 15:38:29 and 15:40:13 UTC, six instances across two machines in 104 seconds.

Across 30 days there are 4 cross-environment `8001` pairings within 5 minutes against roughly 2 expected by chance — not statistically significant on its own. Combined with the two qualitative events above, the surviving mechanism is **shared network infrastructure**: both servers reach their databases through the `*.aerodata-nonprod.internal` DNS/proxy layer, and both clusters sit behind the same `co7yyeqkhfbq` AWS endpoint suffix, so almost certainly the same VPC and NAT path. That layer, not the database, is where to look.

### F7 — Sep 25: the Generate path, caught end to end

The first fully-traced incident on `APRXGenerationToolScript`. custprev, one user, three consecutive Generate attempts on `STANLEMDSTAR33` (LEMD, chart reference `{0793A08A-6024-43C5-AF47-F4936C9ED1EC}`).

```
12:10:50   last GP job of the morning
           ── 72 min idle, no events of any monitored code ──
12:39:54   Polaris_Capture pool rebuilt — 4 instances, ~17.6 s construct
           ── 43 min, nothing ──
13:22:54   Phoenix pool rebuilt — 3 × 7566, same second
13:23:10   PIDs 23023 / 23022 / 23120 born (8000, ~15.9 s each)
13:23:50   first GP job in 73 minutes (DrawingToolScript)

13:26:01   job j8a7417a29de849568488da79dcd698af   Generate, attempt 1
13:26:05   17000  PID 23022  ApplyEdits        FAIL   job +4.4 s, instance age 2.9 min
13:31:38   job jcb657d79f3b04e0f89c12e327f8f627a  Generate, attempt 2
13:31:43   17000  PID 23023  ApplyEdits        FAIL   job +4.5 s, instance age 8.5 min
13:38:10   job j284e9579f8ab4addbddfa90c2a5d7158  Generate, attempt 3
13:38:14   17000  PID 23022  DeleteFeatures    FAIL   instance age 15.0 min
13:38:15   17000  PID 23023  DeleteFeatures    FAIL   instance age 15.1 min
13:38:20   15 rows written to status 'Generated' — job reports SUCCESS
13:43:12   job ja1c93b6c61ad4d7b993ac53b03a7f489  Generate — clean
```

**Four things this establishes.**

**(a) The Generate write path fails identically to Preview.** Both failures at 13:26 and 13:31 are `edit_features(updates=)` inside `featureClassGdb.update_layer_status`, reached from `chartMainScript` → `handle_element_status`. Same error string, same service, same method family as the 186 census events. Two unrelated scripts, one broken write surface — the fault is not in application logic.

**(b) Attempts 1 and 2 wrote nothing.** All 15 surviving rows carry `last_edited_date` 13:38:20. No partial writes from 13:26 or 13:31. Failures on this path are all-or-nothing, so the retry in recommendation 1 carries no duplicate-row risk here — unlike the Preview add path.

**(c) Attempt 3 reported success while failing twice.** Both `DeleteFeatures` calls threw `Stream finished`; the bare `except: pass` swallowed them; the job completed and the user saw a chart. See the correction to recommendation 2 below.

**(d) Ages at failure: 2.9, 8.5, 15.0 minutes.** All three on instances from the same cold pool. Consistent with F2 and independent of it.

**Absent signature — state this plainly.** No `7563`, no `7572`, no `8001`, no `no connection to the server` anywhere between 09:30 and 13:45 UTC. The instances activated cleanly at 13:23:10; if the SDE workspace had been unreachable, activation would have failed. Reads worked throughout. **This incident does not carry the F3 fingerprint.** Writes failed while service health looked normal, which fits F4 — the first edit sessions of a cold pool against a branch-versioned workspace with no version management service — better than it fits F3. Both conditions remain live; this episode is the cleanest F4 example in the document and should not be filed under F3 merely because the error string matches.

**Open pattern (untested).** The failing pool was built cold after a 72-minute idle gap, and the failures ran for 12 minutes before resolving on their own. Hypothesis: _writes are unreliable on a freshly rebuilt pool and reliable thereafter._ Testable against data already in hand — see Open items.

## Environment facts on record

Collected for the record and for any Esri contact.

**Version — identical on both environments**

`currentversion 11.4.0` · `fullVersion 11.4.0` · `currentbuild 54309` · `configStoreVersion 25`

Byte-identical responses from `/arcgis/admin/info`. No version or patch drift between the environments, so none of the observed asymmetries can be explained that way.

**Service policy — identical on both environments**

`minInstancesPerNode 1` · `maxInstancesPerNode 4` · `instancesPerContainer 1` · `maxIdleTime 1800` · `maxUsageTime 600` · `maxWaitTime 60` · `recycleInterval 24` · `recycleStartTime 00:00` · `isolationLevel HIGH` · `loadBalancing ROUND_ROBIN` · `provider ArcObjects11` · `keepAliveInterval 1800`

Exactly **one machine per environment**, so the hard ceiling is 4 Phoenix instances per environment. `DrawingToolScript.GPServer` has `maxInstancesPerNode: 2` and `executionType: Asynchronous` — at most 2 concurrent drawing jobs per environment.

**Logging** — `logLevel: INFO`, `maxLogFileAge: 90` on both. No FINE history exists. Note that despite the 90-day setting, GP-side (`20034`) pulls return nothing before Sep 1 on either environment, so effective retrospective reach for job data is shorter than configured.

**Registered data stores**

TEST has **four** enterprise geodatabase registrations all resolving to the same database (`aerodatatestgeodb`): the datastore-managed one via the RDS cluster endpoint, plus `NewDbConnection`, `test_sde_connection` and `NewDBConnectionServer` via the internal alias. custprev has **two**. All carry `totalRefCount: 0`, and the `Phoenix.MapServer` manifest holds its own embedded connection string, so the services do not reference these registrations.

Five of the six registrations carry `BRANCH=sde.DEFAULT`; one (`test_sde_connection`) carries `VERSION=sde.DEFAULT` instead. That inconsistency is worth resolving alongside F4.

**Service provenance**

Both `.msd` files were published from developer workstations onto a network path:

| Env      | Published from                     | Client            | Server path                |
| -------- | ---------------------------------- | ----------------- | -------------------------- |
| TEST     | `D:\Users\jgamba\…\Phoenix.aprx`   | `WSAMZN-CCH30TSL` | `Z:\…\Updated_Phoenix.msd` |
| custprev | `D:\Users\custprev\…\Phoenix.aprx` | `WSAMZN-OHHLCUJS` | `Z:\…\Updated_Phoenix.msd` |

Publishing from an individual's workstation means the authoritative project lives outside version control, and the `Z:` drive means service definitions are read across a network mount. Neither causes the `17000` failures, but both are worth knowing before anyone tries to reproduce or rebuild the service.

## Recommended actions

### Ship now — does not wait for root cause

**1. Add idempotent retry with backoff to every Phoenix write.** Highest value available, and it is also a discriminating experiment: if retries succeed, transient connection loss is confirmed.

Scope is **two** places, not one:

- `backend/DrawingScript/*` — 15 add call sites. Nine go through `PhoenixApi.add_*_features` wrappers (`createAdhpFeatures.py:74`, `createAirspaceFeatures.py:174`, `createRunwayFeatures.py:199`, `createMsaFeatures.py:565,566,581,583`); six call `edit_features` directly in `createFeaturesProcedureLine.py:838,847,850,854` and `createFeaturesFixHolding.py:1022,1026,1029,1251,1253`.
- `backend/utils/featureClassGdb.py` — `update_layer_status`, up to 22 calls per Generate.

Suggested shape: 3 attempts, 2 s → 5 s → 10 s, retrying only on 500/connection errors. Adds are keyed by `chartreference_id`, so a retried add after a partial success risks duplicate rows — check the layer for the GUID before re-adding, or make the whole per-layer add transactional.

**2. Fix `update_layer_status` — the bare `except: pass` corrupts data, it does not merely hide errors.**

```python
try:
    feature_layer.delete_features(
        where=f"chartreference_id = '{ref}' AND status in ('Expired','Discarded')")
except:
    pass

carto_query_result = feature_layer.query(
    where=f"chartreference_id = '{ref}'",   # <-- no status filter
    out_fields="*", return_geometry=False)
# every returned row is then set to status = 'Generated'
```

The delete removes expired and discarded features. The query that follows does **not** filter on status. So a swallowed delete failure does not leave stale rows behind — the update promotes them to `Generated`. Expired and discarded features become live features on the chart.

Confirmed failing on Sep 25 at 13:38:14 and 13:38:15, on a job that reported success.

This cannot be audited after the fact: the update rewrites the status that would have identified the affected rows. Whether the Sep 25 chart was corrupted is unknowable, and the report should say so rather than claim it was.

Four changes, in priority order:

1. **Add `AND status NOT IN ('Expired','Discarded')` to the query's `where`.** One line, removes the corruption path entirely, independent of any retry work. Do this first.
2. **Remove the bare `except`.** Catch the specific exception, log it, and fail the job — a failed delete is load-bearing.
3. **Add the retry from recommendation 1** to both the delete and the update.
4. **Paginate the query.** `maxRecordCount` on these layers is 2000 and there is no pagination, so a chart exceeding 2000 features in one carto layer is silently truncated and only part of it is updated. Not observed, but latent.

Also in this function: an f-string builds the SQL `where` from `amdt_chart_reference` with no escaping, and a `# ADD CHART REFERENCE ID ALSO` TODO is still in the loop body. Both are worth clearing while the file is open.

**3. Surface the failure properly.** Even with retry, exhausted attempts should tell the user the server is temporarily unavailable and the job can be re-run — not `Stream finished [Success]`, which is meaningless to them.

### Configuration — needs a change window

**4. Resolve the branch-versioning mismatch (F4).** Either enable `VersionManagementServer` on `Phoenix.MapServer`, or re-register the workspace as non-versioned if branch versioning is not actually wanted. This needs a decision from whoever owns the data model, because it changes editing semantics. It should be settled before contacting Esri, since they will ask.

**5. Tidy the TEST data store registrations.** Four registrations to one database, three of them named like accidents (`NewDbConnection`, `NewDBConnectionServer`), one using `VERSION=` where the others use `BRANCH=`.

**6. Decide what `cleanUpScript.py` is.** It is written as a daily job, has no scheduler anywhere in the repo, and deletes from ten Phoenix layers. Either schedule it properly and document it, or confirm it is manual-only. Right now nobody can say from the repo whether it runs.

### Ask infrastructure

The decisive outstanding question. Suggested wording:

> `Phoenix.MapServer` on both `gisdata-test` and `gisdata-custprev` connects to Aurora PostgreSQL through the internal aliases `geodb-test.aerodata-nonprod.internal` and `geodb-custprev.aerodata-nonprod.internal`. We see recurring `Underlying DBMS error [no connection to the server]`, after which the whole service pool fails and replacement instances fail immediately. On Sep 21 and Sep 24 both environments — different servers, different Aurora clusters — degraded within \~100 seconds of each other, which points at a shared network path rather than either database.
>
> Can you tell us: (a) what sits between ArcGIS Server and Aurora on that path — NAT gateway, proxy, RDS Proxy, load balancer — and what its **idle connection timeout** is; (b) the Aurora `idle_in_transaction_session_timeout` and `tcp_keepalives_*` settings on both clusters; (c) whether any scheduled maintenance, failover, DNS change or security-group update occurred on **Sep 21 around 12:35–15:10 UTC** and **Sep 24 around 15:38–15:40 UTC**; (d) whether both environments share a NAT gateway or VPC endpoint.

Note that ArcGIS's own `keepAliveInterval` is 1800 s. If anything on that path reaps idle connections faster than 30 minutes, connections die between keep-alives and the server only discovers it on the next real request — which matches the observed pattern exactly.

### Ask Esri — only after the above

Environment: ArcGIS Enterprise **11.4.0 build 54309**, single machine per environment, `Phoenix.MapServer` with `provider: ArcObjects11` over a branch-versioned PostgreSQL SDE workspace.

1. Is serving edits against a workspace registered with `BRANCH=sde.DEFAULT` supported when `VersionManagementServer` is disabled? If not, is `Stream finished [Success]` the expected failure mode?
2. Why does a lost DBMS connection surface as `Stream finished [Success]` with HTTP 500 rather than a connection error? The message is actively misleading.
3. Does the keep-alive mechanism (`7572`) detect only some classes of stale connection? Phoenix fired `7572` **zero** times on TEST across Sep 10–23 despite having the heaviest churn on that machine, versus 6 on custprev.
4. **Separate low-priority defect:** the `services` filter on `logs/query` does not restrict results and silently omits events belonging to the named service.

## Corrections to `report.md`

The first-pass investigation produced `report.md`. Its central thesis is rejected. These corrections must be applied before the document is shown to Esri, to infrastructure, or to anyone outside the team.

| Claim in `report.md`                                                                  | Verdict                                                                                                                                                    |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _"Zero recycle events across a full week → recycling is not firing"_ (Section 5)      | **RETRACT.** 281 creations into 4-slot pools over 30 days. Teardown is not logged at INFO. The section measured the logging configuration, not the server. |
| _"Instances that live past the 30-minute idle limit degrade and fail every write"_    | **RETRACT.** 19 of 30 failures occur under 30 minutes; the youngest was 2 minutes old.                                                                     |
| _"Failures occur only on instances older than \~30 min; never earlier"_               | **RETRACT.** Directly contradicted. PID 15476's 29.4-minute failure in the original data already contradicted it.                                          |
| _"37× the 10-minute usage limit"_                                                     | **RETRACT.** `maxUsageTime` is cumulative busy time, not wall-clock age.                                                                                   |
| _"Fig. 2 — quiet warning an hour before failure"_                                     | **RETRACT.** n=1, and for PID 15476 the gap is 83 seconds.                                                                                                 |
| `4361 / 313.7 min` lifetime row                                                       | **CORRECT.** It measures birth → code 8001; every other row measures birth → first 17000. 4361's first 17000 is at 373.96 min.                             |
| _"`sde.DEFAULT` / DBMS connectivity is out of scope"_                                 | **REVERSE.** It is the same root cause on the read path. See F4, F5.                                                                                       |
| Policy/configuration table                                                            | **KEEP.** Confirmed accurate on both environments.                                                                                                         |
| _"`Stream finished` pairs 1:1 with SEVERE 17000 on `HandleREST_ApplyEditsOperation`"_ | **KEEP.** Solid, reconfirmed across 186 events.                                                                                                            |
| _"TEST-labelled job runs on the custprev machine"_, filed as a labelling artifact     | **STILL OPEN.** Not excluded as a real misconfiguration.                                                                                                   |

One methodological correction to this investigation's own earlier work: **Q17 (TEST Sep 22, "11 failures in 4 s") is a single PID, 27809** — one job firing many edit calls, consistent with the 2-instance GP cap. It is not evidence of multi-instance failure and must not be used in any burst argument.

## Unrelated findings — flags for the team

Turned up during the investigation. **None of these cause the `17000` failures.** They are raised because they are real, and because several are cheap to fix.

### U1 — misspelled column name, two different ways

custprev, Sep 21, 13:28–13:29 UTC:

```
Error: Attribute column not found [ERROR: column "chartrefrenceid" does not exist]
Error: Attribute column not found [ERROR: column "chartrefrence_id" does not exist]
```

The correct field is `chartreference_id`. Two distinct misspellings, both missing the second `e` in "reference", one also missing the underscore, from three different PIDs within 45 seconds. This is a live application bug producing failed queries, not a log artifact. Worth its own ticket and a repo-wide grep for the typo.

### U2 — annotation test layers published to TEST

The TEST `Phoenix.MapServer` manifest contains two datasets that custprev's does not: `ProcedureLeg_AnnotationTest` and `DesignatedPoint_AnnoTest`.

This fully explains a previously unexplained asymmetry: **`17001` "Type of Layer: 'Class 1' is 'Annotation SubLayer', which is not supported" appears 522 times on TEST and zero times on custprev.** Leftover test data published into the service. Cleanup ticket, not a defect.

### U3 — plaintext credentials in version control

`backend/envs.py` contains ArcGIS `test.user` passwords, and `e2e/config/user_login.py` holds e2e credentials. Both are committed. Separately, `frontend/.env.*` files are committed while also listed in `frontend/.gitignore`.

### U4 — destructive scripts hard-coded to an environment

`backend/cleanData.py` deletes **everything** (`where 1=1`) from ten Phoenix carto layers with `env = 'dev'` hard-coded at line 7, no `argparse`, no `__main__` guard. `backend/cleanChartData.py` does the same for the Charts table. A one-character edit points either at a different environment. At minimum they need a confirmation prompt and a guard against non-`dev` values.

### U5 — no garbage collection guarantee for preview rows

`setup` always mints a new `chartReferenceGuid` and ignores the one passed in, so every preview creates a fresh family of carto rows and nothing in the preview pipeline removes the previous ones. `cleanUpScript.py` (48 h, `status <> 'Generated'`) appears to be the only garbage collection, and as noted in recommendation 6, nothing in the repo schedules it.

Confirmed in data, Sep 25. `ProcedureLeg_C` holds 26 rows for `STANLEMDSTAR33` with status `Initialized` under two abandoned `chartreference_id` values (`{E34CE74F-…}` at 05:44–05:45, `{3DC2A4CF-…}` at 06:54–06:55), owner `admin`, still present eight hours later. The Generate delete is scoped to the _current_ `chartreference_id`, so it can never remove a previous preview's rows. With `cleanUpScript.py` unscheduled, nothing collects them.

### U6 — orphaned placeholder rows

The upload flow adds a placeholder row (`icao: 'XXXX'`, `chart_reference: 'temp'`) and deletes it in the script's `finally`. If the GP job never starts — auth failure, timeout — the row survives. `uiStore.tableSearchBarFilter` hides only `%Template%`, so `temp` rows appear in the user-facing table.

### U7 — other error families seen in the logs

Out of scope for this investigation, but present and unexplained:

- **`Advanced Editing` licensing errors** — separate ticket.
- **`holdQuery` 400 family** — separate ticket.
- **`7570` "Failed to construct instance — Unspecified error"** — observed on `Falcon.MapServer`; also twice on `Airspace.MapServer` (custprev Sep 25), paired with `8003`, minutes after Phoenix's bad window.
- **`7563` on `Polaris_Capture.MapServer`** — 64 occurrences, more than Phoenix's 31. Polaris shares the connection problem, so any fix should be validated against it too.

## Investigation history

Every hypothesis and line of enquiry, what made it plausible, and what settled it. Ordered roughly as they arose.

| #                                           | Idea                                                                                                                            | What supported it                                                                                                                         | How it was settled                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **H1**                                      | **Instance aging** — instances live past the 30-min idle limit, degrade, and fail every write. `report.md`'s thesis.            | A handful of long-lived PIDs observed failing; `maxIdleTime 1800` in config; no `8002`/`8003` teardown events anywhere in a week of logs. | **REJECTED.** Age-at-failure measured for all 30 instances with an observable birth: 12 under 10 minutes, minimum 2.0 min, one failure 17 s after creation. Six pool-wide collapses (4 PIDs in 60 s) are impossible under independent per-instance aging. → F2                                                                           |
| **H1b**                                     | **Keep-alive defeats the idle timer** — `keepAliveInterval == maxIdleTime == 1800`, so the idle timeout may never fire.         | Genuinely odd config; would have rescued H1 by explaining why instances never retire.                                                     | **MOOT.** Was only needed to prop up H1. With H1 rejected on age data, the mechanism needs no explaining. Retained as a config hygiene item. The 45-min idle-drain test (C8) was dropped — it could not run during working hours and was no longer decision-relevant.                                                                    |
| **Recycling is broken**                     | `report.md` Section 5: zero recycle events across a full week proves recycling never fires.                                     | Literally zero `8002`/`8003`/`8004` events in the logs.                                                                                   | **REFUTED by arithmetic.** 281 instance creations over 30 days into pools with a ceiling of 4. Creations arrive in batches of 3–4 within 1–2 seconds — the signature of a pool-wide recycle. Destruction happens; it is not logged at INFO. → F2                                                                                         |
| **H2**                                      | **Stale backend connection** — originally per-instance, revised to a shared SDE workspace condition.                            | `7563 "Underlying DBMS error in SdeWorkspace"` on both envs; `no connection to the server` preceding failures on the same PID.            | **CONFIRMED, revised.** Not per-instance: replacements fail within seconds of birth because they reconnect to the same unhealthy workspace. Four strands of evidence. → F3                                                                                                                                                               |
| **H3**                                      | **Transient shared infrastructure** — something outside both servers fails simultaneously.                                      | Sep 24: both environments lose their entire Phoenix pool within 104 s, on separate machines.                                              | **NARROWED, not confirmed.** Only 4 cross-env `8001` pairings in 30 days vs \~2 expected by chance — not significant. But the databases were then proven separate (two Aurora clusters, two databases), and a second qualitative event found on Sep 21 (48 s apart). Surviving mechanism: shared network path, not shared database. → F6 |
| **H4**                                      | **Payload-specific** — certain requests, feature counts or geometry trigger it.                                                 | Never positively supported; listed for completeness.                                                                                      | **UNTESTED.** Requires `9999` elapsed times, which the code filter excludes. Low priority given F3 explains the pattern without it.                                                                                                                                                                                                      |
| **Phoenix never recreates**                 | Keep-alive `7572` fired 40× across other services and **zero** times for Phoenix — proposed as the strongest question for Esri. | Clean, striking asymmetry in the pulled data.                                                                                             | **WITHDRAWN — filter artifact.** The `services` filter silently omitted 6 Phoenix `7572` events on custprev. Unfiltered re-pulls: TEST 23 total / 0 Phoenix, custprev 87 / 6. What survives is a much weaker observation, worth one line to Esri, not a centrepiece.                                                                     |
| **Frontend writes directly**                | Would explain TEST failures with no geoprocessing job nearby.                                                                   | 61 of 113 TEST `Stream finished` events have no GP job within 5 minutes, dominated by `DeleteFeatures`.                                   | **EXCLUDED by code audit.** Two independent audits plus a call-graph check: every `applyEdits` in `frontend/src` targets the Charts table; the only `SketchViewModel` is bound to a client-side `GraphicsLayer`. No frontend path reaches a Phoenix layer. Residual explanation is `localServer.py` local-dev runs. → F1                 |
| **`sde.DEFAULT` causes the write failures** | Both are `17000` on the same service; 1,263 events looked like a flood driving everything else.                                 | Sheer volume and co-occurrence on the same bad days.                                                                                      | **REJECTED as causal, kept as sibling.** Zero of 186 `Stream finished` events fall within 60 s of a `sde.DEFAULT` event. The families split cleanly: `sde.DEFAULT` is reads only, `Stream finished` is writes only. Same root cause, two paths. → F5                                                                                     |
| **TEST and custprev share an SDE host**     | Would collapse H2 and H3 into one root cause and make the Sep 24 event decisive.                                                | Two cross-environment simultaneous events; identical symptoms on both.                                                                    | **DISPROVEN.** Data store registrations and service manifests show two distinct Aurora clusters and two distinct databases. H3 survives only in the weaker shared-network form. → F6                                                                                                                                                     |
| **Sep 21 was one sustained outage**         | It is the densest day in the dataset — 668 events on custprev, 271 on TEST, five Phoenix `7572` recreations.                    | Same day, both environments, huge event counts.                                                                                           | **SPLIT INTO TWO SHAPES.** TEST: one PID (22733), 2.5 minutes, 195 events in a single minute — one sick instance. custprev: 24 PIDs over 2.5 hours — pool-wide churn. Contiguous (48 s apart) but structurally different. Counts must be reported as episodes, not events. → F5, F6                                                      |
| **Q17 burst = multi-instance failure**      | 11 failures in 4 seconds on TEST, Sep 22 — looked like a pool-wide collapse.                                                    | Tight clustering.                                                                                                                         | **WITHDRAWN.** All 11 are a single PID (27809): one job firing many edit calls, consistent with the 2-instance GP cap. Removed from every burst argument.                                                                                                                                                                                |
| **Instrumentation needed (Phase 2)**        | Raise log level to FINE to measure age-at-_success_, the decisive comparison against age-at-failure.                            | Correct — if the goal were to _confirm_ H1.                                                                                               | **NOT NEEDED.** H1 was _rejected_ on age-at-failure alone, which INFO already carries. Phase 2 never ran and is off the critical path.                                                                                                                                                                                                   |
| **`usagereports` for the denominator**      | Standard endpoint for job counts.                                                                                               | It is the documented way to get this.                                                                                                     | **404 on both envs.** Replaced by code `20034` ("Initialized job: j…"), one row per job, one pull per environment. First attempt at this also failed — it used the broken `services` filter and returned 10,000 rows covering 8 hours of a 7-day window. → F1                                                                            |
| **custprev has shorter log retention**      | `report.md` review finding #8.                                                                                                  | The custprev Server Manager dump covered only 3–4 days versus 7 for TEST.                                                                 | **WITHDRAWN.** Retention is `maxLogFileAge: 90` on both. The short dump was a Server Manager UI paging limit, not a retention difference.                                                                                                                                                                                                |

## Open items

**Blocking root cause**

- [ ] Infrastructure: idle timeouts and maintenance history on the path between ArcGIS Server and Aurora (wording in Recommended actions).
- [ ] Decision on the branch-versioning mismatch (F4) — enable `VersionManagementServer` or re-register the workspace.

**Confirmable from here**

- [ ] Verify the `localServer.py` explanation for TEST's 61 unattributed failures — ask the team who ran local backends against TEST during working hours on Sep 1, 8, 15, 17 and 22.
- [ ] H4 (payload correlation) — needs `9999` elapsed times, excluded by the current code filter. Low priority.
- [ ] _"TEST-labelled job runs on the custprev machine"_ — carried over from `report.md`, still not excluded as a real misconfiguration.
- [ ] **Test the cold-rebuild pattern against the existing 30-day census.** For each of the 186 `Stream finished` events, measure the time since the nearest preceding `8000` burst. If failures concentrate in the first ~20 minutes of a rebuilt pool, F1's "9–13%, intermittent" becomes "unreliable on the first writes after an idle period" — a predictable window, a concrete mitigation (pre-warm, or retry harder on first write), and a specific thing to hand infrastructure. The F2 age-at-failure data is the same measurement from the other direction and may already answer it.

**Work to schedule**

- [ ] Retry + backoff in `backend/DrawingScript/*` **and** `backend/utils/featureClassGdb.py`.
- [ ] **Status filter on the `update_layer_status` query** — highest value per line of code in the whole report. Blocks the corruption path on its own.
- [ ] Pagination in `update_layer_status` (2000-record cap).
- [ ] Retract `report.md` Section 5 and the 30-minute thesis before any external contact.

**Separate tickets**

- [ ] U1 — `chartrefrenceid` / `chartrefrence_id` misspellings.
- [ ] U2 — remove annotation test layers from the TEST service.
- [ ] U3 — credentials in version control.
- [ ] U4 — guard `cleanData.py` and `cleanChartData.py`.
- [ ] U5/U6 — preview-row garbage collection and orphaned `temp` rows.
- [ ] SQL built by f-string interpolation in `featureClassGdb.py`.
- [ ] `Advanced Editing` licensing errors; `holdQuery` 400 family.
- [ ] Report the broken `services` filter to Esri as a low-priority defect.
- [ ] Tidy the four TEST data store registrations; resolve `BRANCH=` vs `VERSION=`.

**Data available for re-analysis**

30-day filtered census (TEST 1,933 / custprev 1,632 events), job denominator (489/556 rows), unfiltered `7572` pulls, Phase 0 configuration responses, and both write audits. All pulls returned `hasMore: false`.
