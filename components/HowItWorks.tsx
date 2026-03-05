import type { HowItWorksProps } from "./types";

function StepBox({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative border-r border-[var(--border-color)] px-8 py-12 last:border-r-0 max-md:border-b max-md:border-r-0">
      <div
        className="absolute right-4 top-4 font-mono text-4xl font-extrabold"
        style={{
          color: "transparent",
          WebkitTextStroke: "1px rgba(255, 255, 255, 0.1)",
        }}
      >
        {number}
      </div>
      <h3 className="mb-4 text-2xl uppercase text-[var(--violet)]">{title}</h3>
      <p className="text-[0.95rem] text-[var(--muted)]">{description}</p>
    </div>
  );
}

export default function HowItWorks({ steps }: HowItWorksProps) {
  return (
    <section className="grid border-b border-[var(--border-color)] max-md:grid-cols-1 md:grid-cols-3">
      {steps.map((step) => (
        <StepBox
          key={step.id}
          number={step.number}
          title={step.title}
          description={step.description}
        />
      ))}
    </section>
  );
}
