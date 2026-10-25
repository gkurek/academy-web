import type { ComponentPropsWithoutRef } from "react";

import { TextLink } from "@/components/core/TextLink";
import { nbspChildren } from "@/lib/typography";

/** MDX `a` for offer pages (LY5) — TextLink style; http(s) opens as external. */
export function MdxLink({ href, children }: ComponentPropsWithoutRef<"a">) {
  if (!href) {
    return <>{children}</>;
  }

  return (
    <TextLink
      href={href}
      external={/^https?:\/\//.test(href)}
      // A phone number split across lines reads as two numbers.
      className={href.startsWith("tel:") ? "whitespace-nowrap" : undefined}
    >
      {nbspChildren(children)}
    </TextLink>
  );
}
