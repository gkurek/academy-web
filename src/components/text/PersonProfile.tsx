import Image from "next/image";

import { TextLink } from "@/components/core/TextLink";
import type { PersonProfileData } from "@/content/types";
import { Prose } from "@/components/core/Prose";

export interface PersonProfileProps {
  profile: PersonProfileData;
}

export function PersonProfile({ profile }: PersonProfileProps) {
  const { name, role, portrait, bio, link } = profile;

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
        <Prose variant="text">
          {bio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Prose>
        {link ? (
          <p className="mt-space-5">
            <TextLink href={link.href}>{link.label}</TextLink>
          </p>
        ) : null}
      </div>
    </div>
  );
}
