import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function AdminPageHeader({ title, subtitle, action }: Props) {
  return (
    <div className={`mb-6 ${action ? "flex flex-col md:flex-row md:items-center md:justify-between gap-3" : ""}`}>
      <div>
        <h1 className="text-display-sm text-text">{title}</h1>
        {subtitle && <p className="text-body-md text-text-muted mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
