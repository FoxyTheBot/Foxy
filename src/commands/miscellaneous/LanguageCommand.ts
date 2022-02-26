import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

export default class LanguageCommand extends Command {
    constructor(client) {
        super(client, {
            name: "language",
            description: "Change the bot's language",
            category: "misc",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("language")
                .setDescription("[🛠 Misc] Change the bot's language")
        });
    }

    async execute(interaction, t): Promise<void> {
        const userData = await this.client.database.getUserLocale(interaction.user.id);

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("English")
                    .setCustomId("en")
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setLabel("Português")
                    .setCustomId("pt")
                    .setStyle("PRIMARY"),
            )

        const embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(t('lang.title'))
            .setDescription(t('lang.default'))
            .addFields(
                { name: ":flag_br:", value: "Brazilian Portuguese", inline: true },
                { name: ":flag_us:", value: "English", inline: true }
            )

        interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector(filter, { time: 60000 });

        collector.on('collect', i => {
            if (i.customId === "en") {
                interaction.followUp(`:flag_us: **| Language changed to English**`);
                i.deferUpdate();
                userData.locale = "en-US";
                userData.save();
            } else if (i.customId === "pt") {
                interaction.followUp(`:flag_br: **| Linguagem alterada para Português do Brasil!**`);
                i.deferUpdate();
                userData.locale = "pt-BR";
                userData.save();
            }
        });
    }
}