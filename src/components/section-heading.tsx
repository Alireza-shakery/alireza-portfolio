export function SectionHeading({
  label,
  title,
  accent,
  description,
}: {
  label: string;
  title: string;
  accent: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow section-label">{label}</p>
      <h2>
        {title} <span>{accent}</span>
      </h2>
      {description && <p className="section-intro">{description}</p>}
    </div>
  );
}
