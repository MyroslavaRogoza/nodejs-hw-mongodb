import fs from 'node:path';
import { TEMP_UPLOAD_DIR } from '../constants';

export const clearTempFolder = async () => {
    await fs.rm(TEMP_UPLOAD_DIR, { recursive: true, force: true });
};
