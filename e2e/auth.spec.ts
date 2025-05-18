import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in the login form
    await page.getByLabel('Correo electrónico').fill('test@example.com');
    await page.getByLabel('Contraseña').fill('testpassword123');

    // Click the login button
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    // Wait for navigation and verify we're on the dashboard
    await expect(page).toHaveURL('/');

    // Verify that we're logged in by checking for a dashboard element
    // Note: You might need to adjust this selector based on your actual dashboard layout
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in the login form with invalid credentials
    await page.getByLabel('Correo electrónico').fill('invalid@example.com');
    await page.getByLabel('Contraseña').fill('wrongpassword');

    // Click the login button
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    // Verify error message is shown
    await expect(page.getByText('Credenciales inválidas')).toBeVisible();

    // Verify we're still on the login page
    await expect(page).toHaveURL('/login');
  });
}); 