import express, { Request, Response, NextFunction } from 'express';
import { logger } from '../../../common/utils/logger';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const port = process.env.VALORANT_AUTOROLE_PORT || 8080;


app.get("/", (req: Request, res: Response) => {
    res.send("Foxy VALORANT Autorole microservice is running!");
});

app.use("/", require("./utils/RouterManager"));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Erro: ${err.message}`);
    res.status(500).send("Internal server error");
});

const startServer = () => {
    app.listen(port, () => {
        logger.info(`VALORANT Autorole microservice is running on port ${port}`);
    });
};

startServer();
