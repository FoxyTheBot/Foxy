import express, { Application } from 'express';

const app: Application = express();
app.use('/', require('./handlers/HandleRequests'));
app.listen(8080, () => console.info(`[SERVER] - Server started on port ${8080}`));