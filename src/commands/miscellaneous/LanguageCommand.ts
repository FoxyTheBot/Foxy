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
                .setDescription("[🛠 Misc] Change the bot's language")
        });
    }

    async execute(interaction, t): Promise<void> {
        const userData = await this.client.database.getUserLocale(interaction.user.id);

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder("Select your default language")
                    .addOptions([
                        {
                            label: "English",
                            value: "en",
                            emoji: "🇬🇧"
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
            .setDescription(t('lang.default'))
            .addFields(
                { name: ":flag_br:", value: "Português do Brasil", inline: true },
                { name: ":flag_gb:", value: "English", inline: true }
            )

        interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });

        const filter = (choice, user) => user.id === interaction.user.id && interaction.customId === 'select';
        const collector = interaction.channel.createMessageComponentCollector(filter, { time: 60000 });

        collector.on('collect', i => {
            const selectMenuValue = i.values[0];
            if (selectMenuValue === "en") {
                interaction.followUp(`:flag_us: **| Language changed to English**`);
                i.deferUpdate();
                userData.locale = "en-US";
                userData.save();
            } else if (selectMenuValue === "pt") {
                interaction.followUp(`:flag_br: **| Linguagem alterada para Português do Brasil!**`);
                i.deferUpdate();
                userData.locale = "pt-BR";
                userData.save();
            }
        });
    }
}