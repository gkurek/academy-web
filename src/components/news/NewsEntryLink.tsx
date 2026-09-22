"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { pinNewsListYear } from "@/components/news/pinNewsListYear";

export interface NewsEntryLinkProps {
  href: string;
  year: string;
  className?: string;
  children: ReactNode;
}

export function NewsEntryLink({ href, year, className, children }: NewsEntryLinkProps) {
  return (
    <Link href={href} className={className} onClick={() => pinNewsListYear(year)}>
      {children}
    </Link>
  );
}
