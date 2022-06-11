import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import NekosLife from "nekos.life";

export default class PatCommand extends Command {
    constructor(client) {
        super(client, {
            name: "pat",
            description: "Pats someone",
            category: "actions",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("pat")
                .setDescription("[Roleplay] Pat someone")
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("User you want to pat"))
        });
    }

    async execute(interaction, t): Promise<void> {
        const neko = new NekosLife();

        const user = interaction.options.getUser("user");
        if (!user) return interaction.reply(t('commands:global.noUser'));

        const gif = await neko.sfw.pat();
        const gif2 = await neko.sfw.pat();

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel(t('commands:pat.button'))
                    .setCustomId("pat")
                    .setStyle("PRIMARY")
                    .setEmoji("<:heheheheh:985197497968373810>")
            )

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(t('commands:pat.success', { user: user.username, author: interaction.user.username }))
            .setImage(gif.url)

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId == "pat" && i.user.id == user.id;
        const collector = interaction.channel.createMessageComponentCollector(filter, { time: 5000, max: 1 });

        collector.on("collect", async i => {
            if (i.customId == "pat") {
                const embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription(t('commands:pat.success', { user: interaction.user.username, author: user.username }))
                    .setImage(gif2.url)
                await i.followUp({ embeds: [embed] });
                i.deferUpdate();
                return collector.stop();
            }
        })
    }
}