import type { LectureListItem } from "@/content/lectures";

export interface LectureListProps {
  items: LectureListItem[];
}

export function LectureList({ items }: LectureListProps) {
  return (
    <div className="grid gap-hairline-gap bg-line-gold">
      {items.map((item) => (
        <article
          key={item.dateIso}
          className="grid grid-cols-1 md:grid-cols-lecture-row items-start gap-x-lecture-row-gap gap-y-space-2 md:gap-y-0 px-lecture-row-x py-lecture-row-y bg-surface-tile"
        >
          <time
            dateTime={item.dateIso}
            className="font-serif text-size-lecture-date text-accent-text md:pt-lecture-date-offset"
          >
            {item.date}
          </time>
          <div className="flex flex-col gap-lecture-talk-gap">
            {item.talks.map((talk, index) => (
              <div key={`${item.dateIso}-${index}`}>
                <h3 className="font-serif text-size-role-list-title-m md:text-size-role-list-title leading-heading text-text-list-title mb-lecture-title-mb">
                  {talk.title}
                </h3>
                {talk.lecturer ? (
                  <p className="text-size-ui text-text-tertiary">{talk.lecturer}</p>
                ) : null}
              </div>
            ))}
            {item.note ? (
              <p className="text-size-ui text-text-tertiary">{item.note}</p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
