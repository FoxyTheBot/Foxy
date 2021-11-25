const { SlashCommandBuilder } = require("@discordjs/builders");
const Command = require("../../structures/Command");

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            description: "Veja a latência da Foxy",
            dev: false,
            data: new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Veja a latência da Foxy")
        });
    }

    async execute(interaction) {
        interaction.reply(`:ping_pong: **| Pong!** \n:watch: **| Gateway:** \`${Date.now() - interaction.createdTimestamp}ms\`\n:zap: **| API Ping:** \`${Math.round(this.client.ws.ping)}ms\``)
    }
}