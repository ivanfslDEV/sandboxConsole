import { test, expect, Page } from "@playwright/test";

/** -------------------------
 * Stable selectors (testids)
 * ------------------------- */
const TID = {
  signinEmail: "signin-email",
  signinPassword: "signin-password",
  signinSubmit: "signin-submit",

  keysLabelInput: "keys-label-input",
  keysCreateBtn: "keys-create-btn",
  keysTable: "keys-table",
  keysRevealModal: "keys-reveal-modal",
  keysRevealFull: "keys-reveal-full",
  keysRevealCopy: "keys-reveal-copy",
  keysRegenerateBtnPrefix: "keys-regenerate-btn-",
  keysRevokeBtnPrefix: "keys-revoke-btn-",

  usageChart: "usage-chart",
  usageTable: "usage-table",

  // Optional but recommended in your app:
  // Add data-testid="page-title" in PageHeader <h1>
  pageTitle: "page-title",
  // Add data-testid="layout-title" in AppLayout header title
  layoutTitle: "layout-title",
} as const;

/** -------------------------
 * Helpers
 * ------------------------- */
async function resetState(page: Page) {
  await page.context().clearCookies();
  await page.addInitScript(() => {
    // Force EN to avoid flaky text due to i18n (optional; remove if not desired)
    localStorage.setItem("i18nextLng", "en");
    // Clear other state
    sessionStorage.clear();
    // NOTE: don't clear localStorage after setting i18nextLng
  });
}

async function postLoginAnchorWait(page: Page) {
  // Wait for a reliable “app is mounted” signal
  await Promise.any([
    page
      .getByTestId(TID.layoutTitle)
      .waitFor({ state: "visible", timeout: 5000 }),
    page
      .getByTestId(TID.pageTitle)
      .waitFor({ state: "visible", timeout: 5000 }),
    page.waitForURL(/\/($|#|\?)/, { timeout: 5000 }),
  ]).catch(() => {}); // keep soft — not all apps have both testids
}

async function signIn(
  page: Page,
  email = "demo@example.com",
  password = "password123"
) {
  await page.goto("/signin");
  await page.getByTestId(TID.signinEmail).fill(email);
  await page.getByTestId(TID.signinPassword).fill(password);
  await page.getByTestId(TID.signinSubmit).click();
  await postLoginAnchorWait(page);
  // Ensure we are not stuck on /signin
  await expect(page).not.toHaveURL(/\/signin/);
}

async function navigateToApiKeys(page: Page) {
  // Try client-side nav by link text (supports localized UIs)
  const linkNames = [/API Keys/i, /Chaves/i, /Clés/i, /Claves/i];
  for (const re of linkNames) {
    const link = page.getByRole("link", { name: re }).first();
    if ((await link.count()) && (await link.isVisible())) {
      await link.click();
      const ok = await page
        .getByTestId(TID.keysLabelInput)
        .waitFor({ state: "visible", timeout: 3000 })
        .then(() => true)
        .catch(() => false);
      if (ok) return;
    }
  }

  // FIX: fallback must navigate directly (no recursion)
  await page.goto("/api-keys");
  await page
    .getByTestId(TID.keysLabelInput)
    .waitFor({ state: "visible", timeout: 5000 });
}

async function createKey(page: Page, label?: string) {
  await navigateToApiKeys(page);
  const name = label ?? `E2E Key ${Date.now()}`;
  await page.getByTestId(TID.keysLabelInput).fill(name);
  await page.getByTestId(TID.keysCreateBtn).click();

  // Reveal modal shows only once
  const modal = page.getByTestId(TID.keysRevealModal);
  await expect(modal).toBeVisible();

  const fullKeyLocator = page.getByTestId(TID.keysRevealFull);
  const fullKey = (await fullKeyLocator.textContent())?.trim() || "";
  expect(fullKey).toMatch(/^sk_live_[a-f0-9]+$/);

  // Close modal (try header close icon; fallback to footer button)
  const modalRoot = page.locator(".ant-modal:visible").first();
  const closeIcon = modalRoot.locator(".ant-modal-close");
  if (await closeIcon.count()) {
    await closeIcon.click();
  } else {
    await modalRoot.locator(".ant-modal-footer button").first().click();
  }

  // Verify row exists in table
  const table = page.getByTestId(TID.keysTable);
  await expect(table.getByText(name)).toBeVisible();

  return { label: name, fullKey };
}

async function regenerateFirstKey(page: Page) {
  const regenBtn = page
    .locator(`[data-testid^="${TID.keysRegenerateBtnPrefix}"]`)
    .first();
  await expect(regenBtn).toBeVisible();
  await regenBtn.click();

  const modal = page.locator(".ant-modal:visible");
  await expect(
    modal.getByText(/New API key|Nova chave|Nueva clave/i)
  ).toBeVisible();

  // Close success modal
  const modalCloseIcon = modal.locator(".ant-modal-close");
  if (await modalCloseIcon.count()) await modalCloseIcon.click();
  else await modal.locator(".ant-modal-footer button").first().click();
}

async function revokeFirstKey(page: Page) {
  const revokeBtn = page
    .locator(`[data-testid^="${TID.keysRevokeBtnPrefix}"]`)
    .first();
  await expect(revokeBtn).toBeVisible();
  await revokeBtn.click();

  // Prefer a dedicated confirm testid if you add one
  const confirmByTestId = page.locator('[data-testid^="keys-revoke-confirm-"]');
  if (await confirmByTestId.count()) {
    await confirmByTestId.first().click();
    return;
  }

  // Fallback: visible Popconfirm confirm button
  const pop = page.locator(".ant-popover:visible, .ant-popconfirm:visible");
  await expect(pop).toBeVisible();
  await pop.getByRole("button", { name: /Revoke|Revogar|OK|Yes|Sim/i }).click();
}

/** -------------------------
 * Test Hooks
 * ------------------------- */
test.beforeEach(async ({ page }) => {
  await resetState(page);
});

/** -------------------------
 * Tests
 * ------------------------- */

test("Sign in reaches app shell", async ({ page }) => {
  await signIn(page);
  // Prefer stable hooks if present:
  const hadTitle =
    (await page
      .getByTestId(TID.layoutTitle)
      .isVisible()
      .catch(() => false)) ||
    (await page
      .getByTestId(TID.pageTitle)
      .isVisible()
      .catch(() => false));
  if (!hadTitle) {
    // Fallback: any known page heading (i18n-safe)
    await expect(
      page.locator("h1, h2").filter({
        hasText: /Dashboard|API Keys|Usage|Docs|Settings|Painel|Documentação/i,
      })
    ).toBeVisible();
  }
});

test("Create API key: reveal once then listed in table", async ({ page }) => {
  await signIn(page);
  const { label } = await createKey(page);

  const row = page
    .getByTestId(TID.keysTable)
    .getByRole("row")
    .filter({ hasText: label });
  await expect(row).toBeVisible();

  // Masked format check (prefix + bullets + last 4)
  const maskedOk = await row
    .getByText(/sk_live_.+•{4,}.*[a-z0-9]{4}$/i)
    .isVisible()
    .catch(() => false);
  if (!maskedOk) {
    await expect(row.getByText(/sk_live_.*•/)).toBeVisible();
  }
});

test("Regenerate OR revoke a key (whichever control is present)", async ({
  page,
}) => {
  await signIn(page);
  await createKey(page);

  await navigateToApiKeys(page);
  const hasRegenerate = await page
    .locator(`[data-testid^="${TID.keysRegenerateBtnPrefix}"]`)
    .first()
    .isVisible()
    .catch(() => false);

  if (hasRegenerate) {
    await regenerateFirstKey(page);
    await expect(page.getByTestId(TID.keysTable)).toBeVisible();
  } else {
    await revokeFirstKey(page);
    await expect(
      page.getByText(/REVOKED|REVOGADO|REVOGADA|REVOKE/i)
    ).toBeVisible();
  }
});

test("Usage chart renders with data and table has rows", async ({ page }) => {
  await signIn(page);
  await page.goto("/usage");

  // Recharts renders an <svg>
  const chartWrap = page.getByTestId(TID.usageChart);
  await expect(chartWrap.locator("svg")).toBeVisible();

  // Table shows at least one date-like row (YYYY-MM-DD)
  const table = page.getByTestId(TID.usageTable);
  await expect(table.getByText(/\d{4}-\d{2}-\d{2}/)).toBeVisible();
});

/** -------------------------
 * Optional: smoke flow (CI friendly)
 * ------------------------- */
test("Smoke: sign in → create key → regenerate/revoke → usage chart", async ({
  page,
}) => {
  await signIn(page);
  await test.step("Create key", async () => {
    await createKey(page);
  });
  await test.step("Regenerate or revoke", async () => {
    await navigateToApiKeys(page);
    const hasRegenerate = await page
      .locator(`[data-testid^="${TID.keysRegenerateBtnPrefix}"]`)
      .first()
      .isVisible()
      .catch(() => false);
    if (hasRegenerate) await regenerateFirstKey(page);
    else await revokeFirstKey(page);
  });
  await test.step("Usage chart", async () => {
    await page.goto("/usage");
    await expect(page.getByTestId(TID.usageChart).locator("svg")).toBeVisible();
  });
});
