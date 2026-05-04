interface SectionLabelProps {
  text: string;
  className?: string;
}

export default function SectionLabel({ text, className = '' }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="w-8 h-px bg-gold" />
      <span className="label-sm text-gold">{text}</span>
    </div>
  );
}
