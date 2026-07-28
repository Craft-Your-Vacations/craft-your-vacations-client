import type { LucideIcon } from "lucide-react";

interface PillarCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
}

export default function PillarCard({ icon: Icon, title, body }: PillarCardProps) {
  return (
    <div className="glass ghost-border rounded-3xl p-8 flex flex-col gap-4 shadow-lg shadow-primary/20">
      <Icon className="w-7 h-7 text-primary-app" strokeWidth={1.5} />
      <h3 className="text-headline-md text-text">{title}</h3>
      <p className="text-body-sm text-text-muted leading-relaxed">{body}</p>
    </div>
  );
}
