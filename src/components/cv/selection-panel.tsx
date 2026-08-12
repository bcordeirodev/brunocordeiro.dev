"use client";

import type { SiteContent } from "@/domain";
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

  const sectionGroup = ({
    id,
    group,
    items,
  }: {
    id: CvSectionId;
    group: ItemGroup;
    items: { key: string; label: string }[];
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
      </fieldset>
    );
  };

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
      {sectionGroup({
        id: "experiences",
        group: "experiences",
        items: content.experiences.map((e) => ({
          key: experienceKey(e),
          label: `${e.role} — ${e.company}`,
        })),
      })}
      {sectionGroup({
        id: "skills",
        group: "skills",
        items: content.skillCategories.flatMap((cat) =>
          cat.skills.map((s) => ({
            key: skillKey(cat.id, s.name),
            label: `${cat.title}: ${s.name}`,
          })),
        ),
      })}
      {sectionGroup({
        id: "certifications",
        group: "certifications",
        items: content.certifications.map((c) => ({ key: certificationKey(c), label: c.name })),
      })}
      {sectionGroup({
        id: "education",
        group: "education",
        items: content.education.map((e) => ({ key: educationKey(e), label: e.degree })),
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
