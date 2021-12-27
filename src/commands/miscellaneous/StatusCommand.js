const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const os = require("os");

module.exports = class StatusCommand extends Command {
    constructor(client) {
        super(client, {
            name: "status",
            category: "misc",
            data: new SlashCommandBuilder()
                .setName("status")
                .setDescription("[🎉 Misc] Mostra o status do bot")
        });
    }

    async execute(interaction) {
        const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("🦊 | Status da Foxy")
            .addFields(
                { name: "💻 | Modelo do processador", value: `\`\`\`${os.cpus().map(c => c.model)}\`\`\`` },
                { name: "💙 | Servidores", value: `\`\`\`${this.client.guilds.cache.size}\`\`\``, inline: true },
                { name: "💛 | Membros em cache", value: `\`\`\`${this.client.users.cache.size}\`\`\``, inline: true },
                { name: "✨ | Memória RAM", value: `\`\`\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`\`\``, inline: true },
                { name: "🛠 | CPU", value: `\`\`\`${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%\`\`\``, inline: true },
                { name: "💁‍♀️ | Versão do Node.js", value: `\`\`\`${process.version}\`\`\``, inline: true },
                { name: "🖥 | Arquitetura", value: `\`\`\`${process.arch}\`\`\``, inline: true },
                { name: "⛏ | Plataforma", value: `\`\`\`${process.platform}\`\`\``, inline: true },
                { name: "📊 | Ping", value: `\`\`\`${Math.round(this.client.ws.ping)}ms / Shard: [${Number(this.client.shard.ids) + 1}/${this.client.shard.count}]\`\`\``, inline: true },
            )

        interaction.reply({ embeds: [embed] });
    }
}