import type { MarqueeBannerProps } from "./types";

export default function MarqueeBanner({ items }: MarqueeBannerProps) {
  const duplicatedItems = [...items, ...items];

  return (
    <div
      className="border-b border-[var(--border-color)] bg-[var(--violet)] py-4 text-[var(--foreground)]"
      style={{ overflow: "hidden", width: "100%" }}
    >
      <div
        className="flex gap-8 whitespace-nowrap font-mono text-3xl font-extrabold uppercase"
        style={{
          width: "max-content",
          animation: "scrollText 25s linear infinite",
          willChange: "transform",
        }}
      >
        {duplicatedItems.map((item, index) => (
          <span
            key={`${item.id}-${index}`}
            className="shrink-0"
            style={
              item.variant === "outline"
                ? {
                    color: "black",
                    WebkitTextStroke: "1px white",
                  }
                : undefined
            }
          >
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
