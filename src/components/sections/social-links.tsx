// Hoje só o Contact usa este componente. O hero renderiza seu próprio link do
// LinkedIn porque a linha de ações mistura estilos de botão e de link — não
// dá pra compartilhar o mesmo par GitHub/LinkedIn sem quebrar esse layout.
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
