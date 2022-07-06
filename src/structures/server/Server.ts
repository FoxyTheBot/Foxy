import express, { Application } from 'express'

export class App {
    port: number;
    constructor(port) {
        this.port = port;
    }

    startServer() {
        const app: Application = express();

        app.use('/', require('./routes/FileControl'));
        app.listen(8080, () => {
            console.info("[SERVER] - Server is running")
        });
    }
}