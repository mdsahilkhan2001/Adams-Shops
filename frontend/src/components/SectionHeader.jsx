const SectionHeader = ({ eyebrow, title, description }) => {
  return (
    <div className="flex flex-col gap-4">
      {eyebrow && <span className="section-subtitle">{eyebrow}</span>}
      <h2 className="section-title gold-underline">{title}</h2>
      {description && <p className="text-sand max-w-2xl">{description}</p>}
    </div>
  );
};

export default SectionHeader;
