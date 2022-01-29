import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export default class InviteCommand extends Command {
    constructor(client) {
        super(client, {
            name: "invite",
            description: "Invite the bot to your server",
            category: "misc",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("invite")
                .setDescription("[🛠 Misc] Invite the bot to your server")
        });
    }

    async execute(interaction, t) {
        const embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setDescription(t('commands:invite.description'))

        await interaction.editReply({ embeds: [embed] });
    }
}