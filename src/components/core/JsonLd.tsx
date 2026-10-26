import type { JsonLdNode } from "@/lib/structured-data/site";
import { plainText } from "@/lib/typography";

export interface JsonLdProps {
  /** One schema.org node or several; each becomes its own script. */
  data: JsonLdNode | JsonLdNode[];
}

/** Content strings carry typographic nbsp — plain spaces in structured data. */
function serialize(node: JsonLdNode): string {
  return JSON.stringify(node, (_key, value: unknown) => (typeof value === "string" ? plainText(value) : value))
    .replaceAll("<", "\\u003c");
}

/** The single emitter of `<script type="application/ld+json">` (plan 10/k9, 9c). */
export function JsonLd({ data }: JsonLdProps) {
  const nodes = Array.isArray(data) ? data : [data];

  return nodes.map((node, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(node) }}
    />
  ));
}
