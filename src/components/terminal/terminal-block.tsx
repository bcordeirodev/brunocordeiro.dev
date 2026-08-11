export function TerminalBlock({
  title,
  lines,
}: {
  title: string;
  lines: string[];
  animated?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#0a0e14]">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-xs text-muted">{title}</span>
      </div>
      <div className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
        {lines.map((line, i) => (
          <div
            key={i}
            data-testid="terminal-line"
            className={line.startsWith("✔") ? "text-accent" : "text-foreground/90"}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
