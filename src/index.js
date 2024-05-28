import initMongoConnection from './db/initMongoConnection.js';
import { setupServer } from './server';

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};
bootstrap();
