import { logger } from "../../../../../../common/utils/logger";
import express, { Application } from "express";
import { FoxyClient } from "../../../structures/types/FoxyClient";

export default class FoxyStatusServer {
    private server: Application;
    private client: FoxyClient;

    constructor(client: FoxyClient) {
        this.client = client;
        this.server = express();
        logger.info("[UTILS] FoxyStatusServer initialized");
    }

    public start() {
        this.server.use(express.json());
        this.server.listen(process.env.FOXY_STATUS_PORT, () => {
            logger.info(`[STATUS] Foxy Status Server is running on port ${process.env.FOXY_STATUS_PORT}`);
        });

        this.server.post("/status/update", async (req, res) => {
            const { name, type, status, url } = req.body;

            this.client.helpers.editBotStatus({
                activities: [{
                    name: name,
                    type: type,
                    url: url,
                    createdAt: Date.now()
                }],
                status: status
            })
            return res.status(200).json({ success: true });
        });
    }
}