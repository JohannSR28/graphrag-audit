import type { FAQProps } from "./types";

function FAQItemComponent({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="border-b border-r border-[var(--border-color)] p-8">
      <h4 className="mb-4 font-mono text-lg">{question}</h4>
      <p className="text-sm text-[var(--muted-dark)]">{answer}</p>
    </div>
  );
}

export default function FAQ({ title, items }: FAQProps) {
  return (
    <section className="px-8 py-16">
      <h2 className="mb-12 text-4xl uppercase">{title}</h2>
      <div className="grid border-l border-t border-[var(--border-color)] max-md:grid-cols-1 md:grid-cols-2">
        {items.map((item) => (
          <FAQItemComponent
            key={item.id}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </section>
  );
}
