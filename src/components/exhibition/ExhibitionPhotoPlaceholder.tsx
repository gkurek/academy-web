export interface ExhibitionPhotoPlaceholderProps {
  label: string;
  className?: string;
}

export function ExhibitionPhotoPlaceholder({ label, className }: ExhibitionPhotoPlaceholderProps) {
  const classes = ["exhibition-media-placeholder", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <p className="exhibition-media-placeholder-text">{label}</p>
    </div>
  );
}
