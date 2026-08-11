// Série real extraída do git dos repositórios do Link Charts (backend + frontend),
// commits por mês, mar/2025–ago/2026. Meses sem commit contam 0 — a cadência real
// inclui pausas. Soma: 1.754 commits. Regenerar com:
//   git log --format=%ad --date=format:%Y-%m | sort | uniq -c  (nos dois repos)
export const linkchartsActivity = {
  months: [
    "2025-03",
    "2025-04",
    "2025-05",
    "2025-06",
    "2025-07",
    "2025-08",
    "2025-09",
    "2025-10",
    "2025-11",
    "2025-12",
    "2026-01",
    "2026-02",
    "2026-03",
    "2026-04",
    "2026-05",
    "2026-06",
    "2026-07",
    "2026-08",
  ],
  values: [3, 0, 0, 0, 0, 79, 106, 0, 9, 0, 0, 0, 0, 38, 733, 226, 379, 181],
};
