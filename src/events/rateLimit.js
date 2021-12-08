module.exports = class RateLimit {
    constructor(client) {
        this.client = client;
    }

    async run(info) {
        console.info(`\x1b[37m\x1b[43mWARN\x1b[0m: ${this.client.user.tag} levou ratelimit de ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout : 'Unknown timeout '}ms.`);
    }
}