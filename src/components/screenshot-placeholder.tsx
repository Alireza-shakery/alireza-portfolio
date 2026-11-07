import { ImageIcon } from 'lucide-react';

export function ScreenshotPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="screenshot-placeholder">
      <ImageIcon size={30} strokeWidth={1.2} aria-hidden="true" />
      <p>{title}</p>
      <span>{description}</span>
    </div>
  );
}
