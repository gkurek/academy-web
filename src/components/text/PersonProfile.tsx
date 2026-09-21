import Image from "next/image";

import { TextLink } from "@/components/core/TextLink";
import type { PersonProfileData } from "@/content/types";

export interface PersonProfileProps {
  profile: PersonProfileData;
}

export function PersonProfile({ profile }: PersonProfileProps) {
  const { name, role, portrait, bio, worksTitle, works, link } = profile;

  return (
    <div className="person-profile">
      <div className="person-profile-portrait">
        <Image
          src={portrait.src}
          alt={portrait.alt}
          width={portrait.width}
          height={portrait.height}
          className="person-profile-image"
          sizes="(max-width: 1023px) 70vw, 420px"
        />
      </div>
      <div className="person-profile-text">
        <p className="person-profile-name">{name}</p>
        <p className="person-profile-role">{role}</p>
        <div className="text-page-mdx">
          {bio.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
        {link ? (
          <p className="mt-space-5">
            <TextLink href={link.href}>{link.label}</TextLink>
          </p>
        ) : null}
      </div>
      <div className="person-profile-works">
        <p className="person-profile-works-title">{worksTitle}</p>
        <ul className="person-profile-works-list list-none m-0 p-0">
          {works.map((work) => (
            <li key={`${work.title}-${work.place}-${work.year}`} className="person-profile-work">
              <span className="person-profile-work-title">{work.title}</span>
              <span className="person-profile-work-meta">
                {work.place}
                <span className="person-profile-work-separator" aria-hidden="true">
                  {" · "}
                </span>
                <span className="person-profile-work-year">{work.year}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
