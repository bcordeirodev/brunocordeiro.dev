import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getContent } from "@/content";
import { defaultSelection, experienceKey } from "@/lib/cv/selection";
import { testLabels } from "./test-labels";
import { SelectionPanel } from "./selection-panel";

const content = getContent("pt");

describe("SelectionPanel", () => {
  it("desmarca uma experiência individual", async () => {
    const onChange = vi.fn();
    render(
      <SelectionPanel
        content={content}
        selection={defaultSelection(content)}
        onChange={onChange}
        labels={testLabels}
      />,
    );
    const first = content.experiences[0]!;
    await userEvent.click(
      screen.getByRole("checkbox", { name: `${first.role} — ${first.company}` }),
    );
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0].experiences[experienceKey(first)]).toBe(false);
  });

  it("desliga uma seção inteira", async () => {
    const onChange = vi.fn();
    render(
      <SelectionPanel
        content={content}
        selection={defaultSelection(content)}
        onChange={onChange}
        labels={testLabels}
      />,
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "Certificações" }));
    expect(onChange.mock.calls[0]![0].sections.certifications).toBe(false);
  });

  it("'desmarcar todas' zera os itens da seção", async () => {
    const onChange = vi.fn();
    render(
      <SelectionPanel
        content={content}
        selection={defaultSelection(content)}
        onChange={onChange}
        labels={testLabels}
      />,
    );
    const section = screen.getByRole("group", { name: "Experiências" });
    await userEvent.click(within(section).getByRole("button", { name: "desmarcar todas" }));
    const next = onChange.mock.calls[0]![0];
    expect(Object.values(next.experiences).every((v) => v === false)).toBe(true);
  });
});
