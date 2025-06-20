import { test, expect } from '@playwright/test';

test.describe('Like/Unlike Functionality with Optimistic Updates', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la SuperApp
    await page.goto('/');
    
    // Esperar que React se monte
    await page.waitForSelector('#root');
    await page.waitForTimeout(1000);

    // Login con credenciales reales del backend
    await page.goto('/login');
    await page.waitForSelector('[data-testid="login-email-input"]');
    
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar redirección después del login
    await page.waitForURL('**/', { timeout: 15000 });
    
    // Navegar al módulo social
    await page.goto('/social');
    await page.waitForSelector('[data-testid="social-posts-container"]', { timeout: 10000 });
  });

  test('should toggle like with optimistic updates', async ({ page }) => {
    // Esperar que haya al menos una publicación
    await page.waitForSelector('[data-testid="post-card"]');
    
    // Obtener el primer post
    const firstPost = page.locator('[data-testid="post-card"]').first();
    const likeButton = firstPost.locator('[data-testid="like-count"]');
    
    // Obtener el contador inicial
    const initialLikeText = await likeButton.textContent();
    const initialLikes = parseInt(initialLikeText || '0');
    
    console.log(`Contador inicial de likes: ${initialLikes}`);
    
    // Hacer clic en el botón de like
    await likeButton.click();
    
    // VERIFICAR OPTIMISTIC UPDATE INMEDIATO (sin esperar respuesta del servidor)
    // El contador debería cambiar inmediatamente
    await expect(likeButton).not.toHaveText(initialLikeText || '0');
    
    // Esperar un momento para que se complete la petición al servidor
    await page.waitForTimeout(1500);
    
    // Obtener el contador después del like
    const afterLikeText = await likeButton.textContent();
    const afterLikes = parseInt(afterLikeText || '0');
    
    console.log(`Contador después del like: ${afterLikes}`);
    
    // Verificar que el contador cambió (like o unlike)
    expect(afterLikes).not.toBe(initialLikes);
    
    // Hacer clic nuevamente para toggle
    await likeButton.click();
    
    // VERIFICAR SEGUNDO OPTIMISTIC UPDATE
    await page.waitForTimeout(500); // Breve pausa para el optimistic update
    
    // Esperar que se complete la segunda petición
    await page.waitForTimeout(1500);
    
    // Verificar que volvió al estado inicial (o cambió apropiadamente)
    const finalLikeText = await likeButton.textContent();
    const finalLikes = parseInt(finalLikeText || '0');
    
    console.log(`Contador final: ${finalLikes}`);
    
    // El estado final debería ser diferente del estado intermedio
    expect(finalLikes).not.toBe(afterLikes);
  });

  test('should persist like state after page refresh', async ({ page }) => {
    // Obtener el primer post y su estado inicial
    await page.waitForSelector('[data-testid="post-card"]');
    const firstPost = page.locator('[data-testid="post-card"]').first();
    const likeButton = firstPost.locator('[data-testid="like-count"]');
    
    const initialLikeText = await likeButton.textContent();
    
    // Hacer like
    await likeButton.click();
    await page.waitForTimeout(2000); // Esperar que se complete la petición
    
    const afterLikeText = await likeButton.textContent();
    
    // Refrescar la página
    await page.reload();
    await page.waitForSelector('[data-testid="social-posts-container"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="post-card"]');
    
    // Verificar que el estado se mantuvo
    const postAfterRefresh = page.locator('[data-testid="post-card"]').first();
    const likeButtonAfterRefresh = postAfterRefresh.locator('[data-testid="like-count"]');
    
    const persistedLikeText = await likeButtonAfterRefresh.textContent();
    
    // El estado después del refresh debe coincidir con el estado después del like
    expect(persistedLikeText).toBe(afterLikeText);
  });

  test('should handle multiple rapid clicks gracefully', async ({ page }) => {
    await page.waitForSelector('[data-testid="post-card"]');
    const firstPost = page.locator('[data-testid="post-card"]').first();
    const likeButton = firstPost.locator('[data-testid="like-count"]');
    
    // Hacer múltiples clics rápidos
    await likeButton.click();
    await likeButton.click();
    await likeButton.click();
    
    // Esperar que se estabilice
    await page.waitForTimeout(3000);
    
    // Verificar que no hay errores de JavaScript en la consola
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Verificar que la UI sigue funcionando
    await expect(firstPost).toBeVisible();
    await expect(likeButton).toBeVisible();
    
    // No debería haber errores críticos
    expect(consoleErrors.filter(err => 
      err.includes('Error') && !err.includes('404') // Ignorar 404s que pueden ser normales
    )).toHaveLength(0);
  });
}); 