import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default class AttackCommand extends Command {
    constructor(client) {
        super(client, {
            name: "attack",
            description: "Attack someone",
            category: "actions",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("attack")
                .setDescription("[Roleplay] Attack someone")
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("User you want to attack"))
        });
    }

    async execute(ctx, t): Promise<void> {
        const user = await ctx.options.getUser('user');
        if (!user) return ctx.reply(t('commands:global.noUser'));

        const list = [
            'https://cdn.zerotwo.dev/PUNCH/38a3ab62-17f4-4682-873a-121e886d7bce.gif',
            'https://cdn.zerotwo.dev/PUNCH/84c082d0-24e7-491e-bcfc-be03ee46125c.gif',
            'https://cdn.zerotwo.dev/PUNCH/3a5b2598-a973-4e6f-a1d0-9b87a2c35a18.gif',
        ]

        const rand = list[Math.floor(Math.random() * list.length)];
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(t('commands:attack.button'))
                    .setEmoji("<:sword:928710998964174949>")
                    .setCustomId("attack")
                    .setStyle(ButtonStyle.Success)
            )

        const embed = new EmbedBuilder()
            .setDescription(t('commands:attack.attack', { user: ctx.user.username, target: user.username }))
            .setImage(rand)

        await ctx.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customid === "attack" && i.user.id === ctx.user.id && i.message.id === ctx.message.id;
        const collector = ctx.channel.createMessageComponentCollector(filter, { time: 10000 });

        collector.on('collect', async i => {
            if (i.customId === "attack") {
                if (ctx.getContext(i, 2, user)) {
                    const embed = new EmbedBuilder()
                        .setColor('#26ffb1')
                        .setDescription(t('commands:attack.attack', {
                            user: user.username,
                            target: ctx.user.username
                        }))
                        .setImage(rand)

                    await ctx.followUp({ embeds: [embed] });
                    i.deferUpdate();
                    return collector.stop();
                } else {
                    i.deferUpdate();
                }
            }
        });
    }
}