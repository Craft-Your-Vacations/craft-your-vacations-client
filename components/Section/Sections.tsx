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
        {/* Callers that headline their own content pass title="" — don't leave
            an empty heading in the document for a screen reader to announce. */}
        {title && (
          <h2 className="text-label-md text-text-subtle mb-8">{title}</h2>
        )}
        {children}
      </div>
    </section>
  );
}

export default Section;
