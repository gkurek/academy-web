import type { MissionDeclaration } from "@/content/types";

export interface MissionDeclarationsProps {
  items: MissionDeclaration[];
}

export function MissionDeclarations({ items }: MissionDeclarationsProps) {
  return (
    <ul className="mission-declarations list-none m-0 p-0">
      {items.map((item) => (
        <li key={item.highlight} className="mission-declarations-item">
          <div className="mission-declarations-bar" aria-hidden="true" />
          <p className="mission-declarations-highlight">{item.highlight}</p>
          <p className="mission-declarations-detail">{item.detail}</p>
        </li>
      ))}
    </ul>
  );
}
