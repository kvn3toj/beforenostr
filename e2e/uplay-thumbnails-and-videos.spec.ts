import { test, expect } from '@playwright/test';

const EMAIL = 'user@gamifier.com';
const PASSWORD = '123456';

test('UPlay muestra thumbnails y videos reales de YouTube', async ({ page }) => {
  // Login real
  await page.goto('/login');
  await page.fill('[data-testid="login-email-input"] input', EMAIL);
  await page.fill('[data-testid="login-password-input"] input', PASSWORD);
  await page.click('[data-testid="login-submit-button"]');
  await page.waitForURL('**/', { timeout: 15000 });

  // Ir a UPlay
  await page.goto('/uplay');
  await page.waitForSelector('[data-testid="uplay-video-thumbnail"]');
  const thumbnails = await page.$$('[data-testid="uplay-video-thumbnail"]');
  let foundYoutubeThumbnail = false;
  for (const thumb of thumbnails) {
    const src = await thumb.getAttribute('src');
    if (src && src.includes('img.youtube.com')) {
      foundYoutubeThumbnail = true;
      break;
    }
  }
  expect(foundYoutubeThumbnail).toBeTruthy();
  await thumbnails[0].click();
  await page.waitForSelector('iframe[src*="youtube.com"]', { timeout: 10000 });
  const iframe = await page.$('iframe[src*="youtube.com"]');
  expect(iframe).not.toBeNull();
});
