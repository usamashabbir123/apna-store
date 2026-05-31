interface ValuesSectionProps {
  config?: Record<string, any>;
}

const defaultValues = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
      </svg>
    ),
    title: 'Curated Quality',
    text: 'Every piece is hand-selected for exceptional craftsmanship and fabric quality.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L5 5" /><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L19 19" />
      </svg>
    ),
    title: 'Local Craftsmanship',
    text: 'Supporting artisans across Pakistan with fair trade practices.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: 'Lahore Based',
    text: 'Proudly serving our community with fast local delivery and easy returns.',
  },
];

export default function ValuesSection({ config }: ValuesSectionProps) {
  const values = (config?.values as any[]) || defaultValues;

  return (
    <section className="py-16 lg:py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {values.map((v: any, idx: number) => (
            <div key={idx}>
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-muted-foreground">
                {defaultValues[idx]?.icon}
              </div>
              <h3 className="text-sm font-medium text-foreground mb-2">{v.title || defaultValues[idx]?.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{v.text || defaultValues[idx]?.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
