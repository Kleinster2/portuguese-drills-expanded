// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://portuguese-drills-expanded.pages.dev';

test.describe('Navigation Bar', () => {
  test('nav bar appears on homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    await expect(nav.locator('text=PT Tutor')).toBeVisible();
  });

  test('nav bar only appears on dashboard', async ({ page }) => {
    // Nav should appear on dashboard
    await page.goto(BASE_URL);
    await expect(page.locator('nav')).toBeVisible({ timeout: 10000 });

    // Feature pages are standalone (no nav)
    const standalonePages = [
      '/diagnostic-test.html',
      '/simplifier.html',
      '/annotator.html',
      '/syllabus.html'
    ];

    for (const path of standalonePages) {
      await page.goto(BASE_URL + path);
      await expect(page.locator('nav')).not.toBeVisible();
    }
  });
});

test.describe('Dashboard', () => {
  test('feature cards are visible', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check dashboard cards section
    const cards = page.locator('section').filter({ hasText: 'Diagnostic Test' });
    await expect(cards.locator('text=Diagnostic Test')).toBeVisible();
    await expect(cards.locator('text=AI Drills')).toBeVisible();
    await expect(cards.locator('text=Text Simplifier')).toBeVisible();
    await expect(cards.locator('h3:text("Annotator")')).toBeVisible();
    await expect(cards.locator('h3:text("Curriculum")')).toBeVisible();
  });

  test('diagnostic card links to test page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('a:has-text("Diagnostic Test")');
    await expect(page).toHaveURL(/diagnostic-test/);
  });

  test('simplifier card links to simplifier page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('a:has-text("Text Simplifier")');
    await expect(page).toHaveURL(/simplifier/);
  });

  test('curriculum card links to syllabus page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('a:has-text("Curriculum")');
    await expect(page).toHaveURL(/syllabus/);
  });

  test('annotator card links to annotator page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('a:has-text("Annotator")');
    await expect(page).toHaveURL(/annotator/);
  });

  test('drills card scrolls to drills section', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('a:has-text("AI Drills")');
    await expect(page).toHaveURL(/#drills/);
  });
});

test.describe('Drills Section', () => {
  test('drills section has search and filters', async ({ page }) => {
    await page.goto(BASE_URL + '/#drills');

    await expect(page.locator('#search-input')).toBeVisible();
    await expect(page.locator('text=Topic:')).toBeVisible();
    await expect(page.locator('text=CEFR Level:')).toBeVisible();
  });

  test('drill cards are visible', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check for some drill cards
    await expect(page.locator('#drill-grid')).toBeVisible();
    await expect(page.locator('.drill-card').first()).toBeVisible();
  });
});

test.describe('Annotator Page', () => {
  test('annotator page loads with input and output areas', async ({ page }) => {
    await page.goto(BASE_URL + '/annotator.html');

    await expect(page.locator('h1')).toContainText('Pronunciation Annotator');
    await expect(page.locator('#input-text')).toBeVisible();
    await expect(page.locator('#output-text')).toBeVisible();
    await expect(page.locator('#annotate-btn')).toBeVisible();
  });

  test('example buttons load sample text', async ({ page }) => {
    await page.goto(BASE_URL + '/annotator.html');

    // Click first example button
    await page.click('button:has-text("Self-introduction")');

    // Check that input has text
    const input = page.locator('#input-text');
    await expect(input).not.toBeEmpty();
  });
});
