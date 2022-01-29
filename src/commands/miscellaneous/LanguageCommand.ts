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

    async execute(interaction, t) {
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
                if(i.customId === "en") {
                    i.deferUpdate();
                    interaction.followUp(`:flag_us: **| Language changed to English**`);
                    userData.locale = "en-US";
                    userData.save();
                } else if(i.customId === "pt") {
                    i.deferUpdate();
                    interaction.followUp(`:flag_br: **| Linguagem alterada para Português do Brasil ou seja vamos assitir Roberto Carlos na Globo nesse fim de ano?**`);
                    userData.locale = "pt-BR";
                    userData.save();
                }
            });
    }
}