import { defineConfig, devices } from "@playwright/test";

// Port 3000 is unavailable on local dev machines (occupied by an unrelated,
// long-running Docker container for another project, Link Charts). Port 3001
// mirrors the workaround already documented for local dev in Task 4's report.
// CI has no such container, so it uses the framework default, 3000. `PORT`
// stays available as an explicit override for machines where 3001 is also
// taken by something else local (e.g. another dev tool).
const PORT = process.env.PORT ? Number(process.env.PORT) : process.env.CI ? 3000 : 3001;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  // contextOptions.reducedMotion: "reduce" makes Reveal's whileInView fade-in
  // render fully opaque immediately (it renders a plain div under
  // prefers-reduced-motion), so axe scans see final, settled styles instead
  // of a mid-transition or below-the-fold opacity:0 frame.
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    contextOptions: { reducedMotion: "reduce" },
  },
  webServer: {
    command: `pnpm build && pnpm exec next start -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    {
      name: "mobile-320",
      // devices["iPhone SE"] defaults to WebKit; force Chromium (the only
      // browser installed for this suite) while keeping its mobile/touch
      // emulation characteristics.
      use: {
        ...devices["iPhone SE"],
        browserName: "chromium",
        viewport: { width: 320, height: 568 },
      },
    },
    { name: "tablet-768", use: { viewport: { width: 768, height: 1024 } } },
    { name: "desktop-1280", use: { viewport: { width: 1280, height: 800 } } },
  ],
});
