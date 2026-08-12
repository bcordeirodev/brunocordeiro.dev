// Shared by Hero and Contact — same GitHub/LinkedIn links, same styling.
// Kept as one component so a future tweak (icon, tracking, hover style)
// only has to happen once instead of being replicated by hand in both places.
export function SocialLinks({ github, linkedin }: { github: string; linkedin: string }) {
  return (
    <>
      <a
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-sm text-accent underline-offset-4 hover:underline"
      >
        GitHub
      </a>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-sm text-accent underline-offset-4 hover:underline"
      >
        LinkedIn
      </a>
    </>
  );
}
