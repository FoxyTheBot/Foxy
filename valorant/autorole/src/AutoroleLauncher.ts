import express from 'express';
import { logger } from '../../../common/utils/logger';
require('dotenv').config({ path: '../../.env' });

const app = express();
const port = process.env.VALORANT_AUTOROLE_PORT || 8080;


app.get("/", (req, res) => {
    res.send("Foxy VALORANT Autorole microservice is running!");
});

app.use("/", require('./utils/RouterManager'));

app.listen(port, () => {
    logger.info(`VALORANT Autorole microservice is running on port ${port}`);
});