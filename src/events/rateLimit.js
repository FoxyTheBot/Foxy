<<<<<<< HEAD
module.exports = async (client, info) => {
  console.warn(`\x1b[37m\x1b[43mWARN\x1b[0m: Fudeu deu ratelimit de ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout : 'Unknown timeout '}`);
};
=======
module.exports = class RateLimit {
    constructor(client) {
        this.client = client;
    }

    async run(info) {
        console.info(`\x1b[37m\x1b[43mWARN\x1b[0m: ${this.client.user.tag} levou ratelimit de ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout : 'Unknown timeout '}ms.`);
    }
}
>>>>>>> 83482c1112c64f03e74695a4414bc15d904cfc26
