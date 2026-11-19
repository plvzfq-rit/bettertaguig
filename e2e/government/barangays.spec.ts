import { test, expect } from '../test-config';
import { assertKapwaTokens } from '../utils/kapwa';

test.describe('Barangays Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to barangays index before each test
    await page.goto('/government/barangays');
    // The page loads lazily; wait for the cards before counting them
    await expect(
      page.locator('a[aria-label^="View profile of Barangay"]').first()
    ).toBeVisible();
  });

  test('barangays index page uses Kapwa semantic tokens', async ({ page }) => {
    await assertKapwaTokens(page);
  });

  test('barangays index displays all barangay cards', async ({ page }) => {
    // Check that barangay cards are displayed
    const cards = page.locator('a[aria-label^="View profile of Barangay"]');
    const count = await cards.count();

    // Should have multiple barangays (Taguig has 38)
    expect(count).toBeGreaterThan(10);

    // Check first card has proper structure
    const firstCard = cards.first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard).toHaveAttribute(
      'aria-label',
      /View profile of Barangay/
    );
  });

  test('barangays search functionality works', async ({ page }) => {
    // Get initial count of all cards
    const allCards = page.locator('a[aria-label^="View profile of Barangay"]');
    const initialCount = await allCards.count();

    // Search for a specific barangay
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('Bambang');

    // Wait for filtering to apply
    await page.waitForTimeout(300);

    // Should have fewer results
    const filteredCards = page.locator(
      'a[aria-label^="View profile of Barangay"]'
    );
    const filteredCount = await filteredCards.count();
    expect(filteredCount).toBeLessThan(initialCount);
    expect(filteredCount).toBeGreaterThan(0);

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(300);

    // Should show all cards again
    const resetCards = page.locator(
      'a[aria-label^="View profile of Barangay"]'
    );
    const resetCount = await resetCards.count();
    expect(resetCount).toBe(initialCount);
  });

  test('barangay detail page uses semantic tokens', async ({ page }) => {
    // Navigate to first barangay
    const firstCard = page
      .locator('a[aria-label^="View profile of Barangay"]')
      .first();
    await firstCard.click();

    // Wait for navigation
    await page.waitForURL(/\/government\/barangays\/.+/);

    // Check barangay header is visible
    const header = page.locator('header[role="banner"]');
    await expect(header).toBeVisible();

    await assertKapwaTokens(page);
  });

  test('barangay detail page displays officials section', async ({ page }) => {
    // Navigate to first barangay
    const firstCard = page
      .locator('a[aria-label^="View profile of Barangay"]')
      .first();
    await firstCard.click();

    // Wait for navigation
    await page.waitForURL(/\/government\/barangays\/.+/);

    // Check officials heading
    const officialsHeading = page
      .locator('h2')
      .filter({ hasText: 'Barangay Officials' });
    await expect(officialsHeading).toBeVisible();

    // Check for official cards
    const officialCards = page.locator('[role="group"]');
    await expect(officialCards.first()).toBeVisible();

    // Check for Punong Barangay section
    const punongSection = page
      .locator('p:not(.sr-only)')
      .filter({ hasText: 'Chief Executive' });
    await expect(punongSection).toBeVisible();
  });

  test('barangay detail page has breadcrumbs', async ({ page }) => {
    // Navigate to first barangay
    const firstCard = page
      .locator('a[aria-label^="View profile of Barangay"]')
      .first();
    await firstCard.click();

    // Wait for navigation
    await page.waitForURL(/\/government\/barangays\/.+/);

    // Check breadcrumb navigation
    const breadcrumb = page.locator('nav[aria-label="breadcrumb"]');
    await expect(breadcrumb).toBeVisible();

    // Check breadcrumb links
    await expect(breadcrumb.locator('a[href="/"]')).toBeVisible();
    await expect(
      breadcrumb.locator('a[href="/government/barangays"]')
    ).toBeVisible();
  });

  test('barangay detail page has accessible skip link', async ({ page }) => {
    // Navigate to first barangay
    const firstCard = page
      .locator('a[aria-label^="View profile of Barangay"]')
      .first();
    await firstCard.click();

    // Wait for navigation
    await page.waitForURL(/\/government\/barangays\/.+/);

    // Check for skip link (should be hidden until focused)
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveAttribute('class', /sr-only/);
  });

  test('barangay card hover states work correctly', async ({ page }) => {
    const firstCard = page
      .locator('a[aria-label^="View profile of Barangay"]')
      .first();

    // Check card has hover class
    await expect(firstCard).toHaveClass(/group/);

    // Check for arrow icon that shows on hover
    const arrowIcon = firstCard.locator('svg').last();
    await expect(arrowIcon).toBeVisible();

    // Verify card has proper aria-label
    await expect(firstCard).toHaveAttribute(
      'aria-label',
      /View profile of Barangay/
    );
  });

  test('barangay detail page displays contact information', async ({
    page,
  }) => {
    // Navigate to first barangay
    const firstCard = page
      .locator('a[aria-label^="View profile of Barangay"]')
      .first();
    await firstCard.click();

    // Wait for navigation
    await page.waitForURL(/\/government\/barangays\/.+/);

    // Check for contact section in header
    const header = page.locator('header[role="banner"]');

    // Check for phone icon/link
    const phoneLink = header.locator('a[href^="tel:"]').first();
    const hasPhone = (await phoneLink.count()) > 0;

    // Some barangays may not have phone numbers, that's okay
    if (hasPhone) {
      await expect(phoneLink).toBeVisible();
      await expect(phoneLink).toHaveAttribute('href', /tel:/);
    }
  });

  test('sidebar navigation works on detail pages', async ({ page }) => {
    // Navigate to first barangay
    const firstCard = page
      .locator('a[aria-label^="View profile of Barangay"]')
      .first();
    await firstCard.click();

    // Wait for navigation
    await page.waitForURL(/\/government\/barangays\/.+/);

    // Detail pages start with the sidebar collapsed; the expand button reopens it
    await page.getByTitle('Expand Menu').click();
    await expect(page.locator('aside').first()).toBeVisible();

    // On mobile, sidebar should have mobile menu button
    const mobileMenuButton = page.getByRole('button', {
      name: 'Menu',
      exact: true,
    });
    const hasMobileMenu = (await mobileMenuButton.count()) > 0;

    if (hasMobileMenu) {
      await expect(mobileMenuButton).toBeVisible();
    }
  });

  test('barangays index page visual snapshot @visual', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await expect(page).toHaveScreenshot('barangays-index.png', {
      maxDiffPixels: 150,
    });
  });

  test('barangays index page hero section visual snapshot @visual', async ({
    page,
  }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Take snapshot of hero section
    const heroSection = page.locator('main').first();
    await expect(heroSection).toHaveScreenshot('barangays-hero.png', {
      maxDiffPixels: 100,
    });
  });

  test('barangay detail page visual snapshot @visual', async ({ page }) => {
    // Navigate to first barangay
    const firstCard = page
      .locator('a[aria-label^="View profile of Barangay"]')
      .first();
    await firstCard.click();

    // Wait for navigation and load
    await page.waitForURL(/\/government\/barangays\/.+/);
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await expect(page).toHaveScreenshot('barangay-detail.png', {
      maxDiffPixels: 150,
    });
  });
});
