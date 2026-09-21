import type { MilestoneItem } from "@/content/types";

export interface MilestoneRowProps {
  items: MilestoneItem[];
}

export function MilestoneRow({ items }: MilestoneRowProps) {
  return (
    <ul className="milestone-row list-none m-0 p-0">
      {items.map((item) => (
        <li key={item.value} className="milestone-row-item">
          <div className="milestone-row-bar" aria-hidden="true" />
          <p className="milestone-row-value">{item.value}</p>
          <p className="milestone-row-label">{item.label}</p>
        </li>
      ))}
    </ul>
  );
}
