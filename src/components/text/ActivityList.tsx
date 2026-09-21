import type { ActivityItem } from "@/content/types";

export interface ActivityListProps {
  items: ActivityItem[];
}

export function ActivityList({ items }: ActivityListProps) {
  return (
    <ul className="activity-list list-none m-0 p-0">
      {items.map((item) => (
        <li key={item.name} className="activity-list-item">
          <p className="activity-list-name">{item.name}</p>
          <p className="activity-list-note">{item.note}</p>
        </li>
      ))}
    </ul>
  );
}
