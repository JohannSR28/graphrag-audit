export default function AmbientGlow() {
  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[-3] h-[40vh] w-[40vw] blur-[60px]"
      style={{
        background:
          "radial-gradient(circle, rgba(157, 78, 221, 0.18) 0%, transparent 70%)",
        animation: "driftGlow 25s ease-in-out infinite",
      }}
      aria-hidden
    />
  );
}
