import { logger } from '../../common/utils/logger';
import WebSocketServerManager from './utils/WebSocketServerManager';
require('dotenv').config({ path: "../.env" });

new WebSocketServerManager(Number(process.env.WELCOMER_PORT));

process.on("unhandledRejection", (err) => {
    logger.error(`Unhandled rejection: ${err}`);
});

process.on("uncaughtException", (err) => {
    logger.error(`Uncaught exception: ${err}`);
});