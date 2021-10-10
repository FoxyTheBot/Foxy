const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Mostra a latência e tempo de resposta da Foxy'),

    async execute(client, interaction) {
        interaction.reply({
            content: `:ping_pong: **| Pong!** \n:watch: **| Gateway:** \`${Date.now() - interaction.createdTimestamp}ms\`\n:zap: **| API Ping:** \`${Math.round(
                client.ws.ping,
            )}ms\` \n<:info:718944993741373511> **| Shard:** \`${Number(client.shard.ids) + 1}/${client.shard.count}\``
        });
    }
}