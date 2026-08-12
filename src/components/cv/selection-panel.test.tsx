import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getContent } from "@/content";
import { defaultSelection, experienceKey, skillKey } from "@/lib/cv/selection";
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

  it("agrupa as skills por categoria, colapsadas por padrão", () => {
    render(
      <SelectionPanel
        content={content}
        selection={defaultSelection(content)}
        onChange={vi.fn()}
        labels={testLabels}
      />,
    );
    const category = content.skillCategories[0]!;
    const header = screen.getByRole("button", { name: new RegExp(category.title) });
    expect(header).toHaveAttribute("aria-expanded", "false");
    expect(header).toHaveTextContent(`${category.skills.length}/${category.skills.length}`);
    expect(
      screen.queryByRole("checkbox", { name: category.skills[0]!.name }),
    ).not.toBeInTheDocument();
  });

  it("expande a categoria e revela suas skills", async () => {
    render(
      <SelectionPanel
        content={content}
        selection={defaultSelection(content)}
        onChange={vi.fn()}
        labels={testLabels}
      />,
    );
    const category = content.skillCategories[0]!;
    await userEvent.click(screen.getByRole("button", { name: new RegExp(category.title) }));
    expect(screen.getByRole("checkbox", { name: category.skills[0]!.name })).toBeInTheDocument();
  });

  it("checkbox da categoria alterna só as skills daquela categoria", async () => {
    const onChange = vi.fn();
    render(
      <SelectionPanel
        content={content}
        selection={defaultSelection(content)}
        onChange={onChange}
        labels={testLabels}
      />,
    );
    const [first, second] = content.skillCategories;
    await userEvent.click(screen.getByRole("checkbox", { name: first!.title }));
    const next = onChange.mock.calls[0]![0];
    for (const skill of first!.skills) {
      expect(next.skills[skillKey(first!.id, skill.name)]).toBe(false);
    }
    for (const skill of second!.skills) {
      expect(next.skills[skillKey(second!.id, skill.name)]).toBe(true);
    }
  });

  it("mostra a categoria como indeterminada quando só parte das skills está marcada", () => {
    const category = content.skillCategories[0]!;
    const selection = defaultSelection(content);
    selection.skills[skillKey(category.id, category.skills[0]!.name)] = false;
    render(
      <SelectionPanel
        content={content}
        selection={selection}
        onChange={vi.fn()}
        labels={testLabels}
      />,
    );
    const box = screen.getByRole("checkbox", { name: category.title }) as HTMLInputElement;
    expect(box.indeterminate).toBe(true);
    expect(box.checked).toBe(false);
  });
});
