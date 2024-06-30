import fs from 'fs';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

export const clearTempFolder = async () => {
  try {
    await fs.promises.rm(TEMP_UPLOAD_DIR, { recursive: true, force: true });
    console.log('Directory removed successfully');
  } catch (err) {
    console.error('Error removing directory:', err);
  }
};
