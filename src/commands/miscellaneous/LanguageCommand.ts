import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageSelectMenu } from "discord.js";

export default class LanguageCommand extends Command {
    constructor(client) {
        super(client, {
            name: "language",
            description: "Change the bot's language",
            category: "misc",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("language")
                .setDescription("[Misc] Change the bot's language")
        });
    }

    async execute(interaction, t): Promise<void> {
        const userData = await this.client.database.getUserByID(interaction.user.id);

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder("Select your default language")
                    .addOptions([
                        {
                            label: "English",
                            value: "en",
                            emoji: "🇺🇸"
                        },
                        {
                            label: "Português do Brasil",
                            value: "pt",
                            emoji: "🇧🇷"
                        }
                    ])
            )

        const embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(t('lang.title'))
            .setDescription(`${t('lang.default')} \n\n :flag_br: Português do Brasil\n :flag_us: English`)

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        const filter = (user) => user.id === interaction.user.id && interaction.customId === 'select';
        const collector = interaction.channel.createMessageComponentCollector(filter, { time: 15000, max: 1 });

        collector.on('collect', i => {
            const selectMenuValue = i.values[0];
            if (!selectMenuValue) return collector.stop();
            if (selectMenuValue === "en") {
                interaction.followUp(`:flag_us: **| Language changed to English**`);
                i.deferUpdate();
                userData.language = "en-US";
                userData.save();
                return collector.stop();
            } else if (selectMenuValue === "pt") {
                interaction.followUp(`:flag_br: **| Linguagem alterada para Português do Brasil!**`);
                i.deferUpdate();
                userData.language = "pt-BR";
                userData.save();
                return collector.stop();
            }
        });
    }
}