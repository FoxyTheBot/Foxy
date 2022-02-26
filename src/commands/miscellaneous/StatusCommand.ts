import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import os from "os";

export default class StatusCommand extends Command {
    constructor(client) {
        super(client, {
            name: "status",
            description: "Get the bot's status",
            category: "misc",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("status")
                .setDescription("[🛠 Misc] Get the bot's status")
        });
    }

    async execute(interaction, t): Promise<void> {
        const embed = new MessageEmbed()
            .setTitle("🦊 | Foxy Status")
            .addFields(
                { name: `💻 | ${t('commands:status.model')}`, value: `\`\`\`${os.cpus().map(c => c.model)[0]}\`\`\`` },
                { name: `💙 | ${t('commands:status.guilds')}`, value: `\`\`\`${this.client.guilds.cache.size}\`\`\``, inline: true },
                { name: `💛 | ${t('commands:status.users')}`, value: `\`\`\`${this.client.users.cache.size}\`\`\``, inline: true },
                { name: `✨ | ${t('commands:status.ram')}`, value: `\`\`\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`\`\``, inline: true },
                { name: `🛠 | ${t('commands:status.cpuUsage')}`, value: `\`\`\`${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%\`\`\``, inline: true },
                { name: `💁‍♀️ | ${t('commands:status.node')}`, value: `\`\`\`${process.version}\`\`\``, inline: true },
                { name: `🖥 | ${t('commands:status.arch')}`, value: `\`\`\`${process.arch}\`\`\``, inline: true },
                { name: `⛏ | ${t('commands:status.platform')}`, value: `\`\`\`${process.platform}\`\`\``, inline: true },
                { name: `📊 | Ping`, value: `\`\`\`${Math.round(this.client.ws.ping)}ms / Shard: [${Number(this.client.shard.ids) + 1}/${this.client.shard.count}]\`\`\``, inline: true },
            )

        interaction.editReply({ embeds: [embed] });
    }
}