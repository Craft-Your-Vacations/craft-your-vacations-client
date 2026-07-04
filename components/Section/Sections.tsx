export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-18 border-t border-outline">
      <div className="mx-auto max-w-(--container-max-w) px-6 md:px-10">
        <p className="text-label-md text-text-subtle mb-8">{title}</p>
        {children}
      </div>
    </section>
  );
}

export default Section;
