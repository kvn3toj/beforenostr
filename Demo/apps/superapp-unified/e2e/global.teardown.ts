import { test as teardown } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

teardown('cleanup auth files', async ({}) => {
  console.log('🧹 Cleaning up authentication files...');
  
  const authFile = path.join(__dirname, '../playwright/.auth/admin.json');
  
  if (fs.existsSync(authFile)) {
    fs.unlinkSync(authFile);
    console.log('✅ Authentication file cleaned up');
  }
}); 