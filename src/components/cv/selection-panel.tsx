"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { SiteContent, SkillCategory } from "@/domain";
import type { CvLabels } from "@/lib/cv/labels";
import {
  certificationKey,
  educationKey,
  experienceKey,
  skillKey,
  type CvSectionId,
  type CvSelection,
} from "@/lib/cv/selection";

type ItemGroup = keyof Omit<CvSelection, "sections">;

function Checkbox({
  label,
  checked,
  disabled,
  onToggle,
  bold,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
  bold?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-2 text-sm ${bold ? "font-medium" : "text-muted"} ${disabled ? "opacity-50" : ""}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
        className="accent-accent"
        aria-label={label}
      />
      {label}
    </label>
  );
}

/**
 * Uma categoria de skills como grupo colapsável. São ~90 skills no total:
 * numa lista plana o painel vira uma parede de checkboxes, então cada
 * categoria abre sob demanda e o cabeçalho resume o estado (n/m + tri-state).
 */
function SkillCategoryGroup({
  category,
  selection,
  disabled,
  onToggleCategory,
  onToggleSkill,
}: {
  category: SkillCategory;
  selection: Record<string, boolean>;
  disabled: boolean;
  onToggleCategory: (next: boolean) => void;
  onToggleSkill: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const keys = category.skills.map((skill) => skillKey(category.id, skill.name));
  const selected = keys.filter((key) => selection[key]).length;
  const allChecked = selected === keys.length;

  return (
    <div className="rounded-lg border border-border/50">
      <div className={`flex items-center gap-2 px-3 py-2 ${disabled ? "opacity-50" : ""}`}>
        <input
          type="checkbox"
          checked={allChecked}
          disabled={disabled}
          onChange={() => onToggleCategory(!allChecked)}
          // `indeterminate` não existe como atributo HTML — só como propriedade
          // do nó, daí o ref em vez de uma prop declarativa.
          ref={(node) => {
            if (node) node.indeterminate = selected > 0 && !allChecked;
          }}
          className="accent-accent"
          aria-label={category.title}
        />
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex flex-1 items-center justify-between gap-2 text-left text-sm font-medium"
        >
          {category.title}
          <span className="flex items-center gap-2 font-mono text-xs text-muted">
            {selected}/{keys.length}
            <ChevronDown
              className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </span>
        </button>
      </div>
      {open ? (
        <div className="flex flex-col gap-1 border-t border-border/50 px-3 py-2 pl-9">
          {category.skills.map((skill, index) => (
            <Checkbox
              key={keys[index]}
              label={skill.name}
              checked={selection[keys[index]!] ?? false}
              disabled={disabled}
              onToggle={() => onToggleSkill(keys[index]!)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SelectionPanel({
  content,
  selection,
  onChange,
  labels,
}: {
  content: SiteContent;
  selection: CvSelection;
  onChange: (next: CvSelection) => void;
  labels: CvLabels;
}) {
  const toggleSection = (id: CvSectionId) =>
    onChange({
      ...selection,
      sections: { ...selection.sections, [id]: !selection.sections[id] },
    });

  const toggleItem = (group: ItemGroup, key: string) =>
    onChange({
      ...selection,
      [group]: { ...selection[group], [key]: !selection[group][key] },
    });

  const setAll = (group: ItemGroup, value: boolean) =>
    onChange({
      ...selection,
      [group]: Object.fromEntries(Object.keys(selection[group]).map((k) => [k, value])),
    });

  const setCategory = (category: SkillCategory, value: boolean) =>
    onChange({
      ...selection,
      skills: {
        ...selection.skills,
        ...Object.fromEntries(
          category.skills.map((skill) => [skillKey(category.id, skill.name), value]),
        ),
      },
    });

  const section = ({
    id,
    group,
    body,
  }: {
    id: CvSectionId;
    group: ItemGroup;
    body: (enabled: boolean) => ReactNode;
  }) => {
    const enabled = selection.sections[id];
    const allChecked = Object.values(selection[group]).every(Boolean);
    return (
      <fieldset key={id} className="flex flex-col gap-2" aria-label={labels.sections[id]}>
        <div className="flex items-center justify-between">
          <Checkbox
            bold
            label={labels.sections[id]}
            checked={enabled}
            onToggle={() => toggleSection(id)}
          />
          <button
            type="button"
            disabled={!enabled}
            onClick={() => setAll(group, !allChecked)}
            className="text-xs text-accent underline-offset-4 hover:underline disabled:opacity-50"
          >
            {allChecked ? labels.clearAll : labels.selectAll}
          </button>
        </div>
        {body(enabled)}
      </fieldset>
    );
  };

  const itemList = (
    group: ItemGroup,
    items: { key: string; label: string }[],
    enabled: boolean,
  ) => (
    <div className="flex flex-col gap-1 pl-6">
      {items.map((item) => (
        <Checkbox
          key={item.key}
          label={item.label}
          checked={selection[group][item.key] ?? false}
          disabled={!enabled}
          onToggle={() => toggleItem(group, item.key)}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {(["summary", "metrics"] as const).map((id) => (
        <Checkbox
          key={id}
          bold
          label={labels.sections[id]}
          checked={selection.sections[id]}
          onToggle={() => toggleSection(id)}
        />
      ))}
      {section({
        id: "experiences",
        group: "experiences",
        body: (enabled) =>
          itemList(
            "experiences",
            content.experiences.map((e) => ({
              key: experienceKey(e),
              label: `${e.role} — ${e.company}`,
            })),
            enabled,
          ),
      })}
      {section({
        id: "skills",
        group: "skills",
        body: (enabled) => (
          <div className="flex flex-col gap-2">
            {content.skillCategories.map((category) => (
              <SkillCategoryGroup
                key={category.id}
                category={category}
                selection={selection.skills}
                disabled={!enabled}
                onToggleCategory={(next) => setCategory(category, next)}
                onToggleSkill={(key) => toggleItem("skills", key)}
              />
            ))}
          </div>
        ),
      })}
      {section({
        id: "certifications",
        group: "certifications",
        body: (enabled) =>
          itemList(
            "certifications",
            content.certifications.map((c) => ({ key: certificationKey(c), label: c.name })),
            enabled,
          ),
      })}
      {section({
        id: "education",
        group: "education",
        body: (enabled) =>
          itemList(
            "education",
            content.education.map((e) => ({ key: educationKey(e), label: e.degree })),
            enabled,
          ),
      })}
      <Checkbox
        bold
        label={labels.sections.caseStudy}
        checked={selection.sections.caseStudy}
        onToggle={() => toggleSection("caseStudy")}
      />
    </div>
  );
}
