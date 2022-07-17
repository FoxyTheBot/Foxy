import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, AttachmentBuilder, AutocompleteInteraction, CommandInteraction, ButtonStyle, InteractionType } from "discord.js";
import { bglist } from "../../structures/json/backgroundList.json";
import GenerateImage from "../../structures/GenerateImage";

export default class BackgroundCommand extends Command {
    constructor(client) {
        super(client, {
            name: "background",
            description: "Buy a new background",
            category: "economy",
            dev: false,
            data: new SlashCommandBuilder().setName("background")
                .setDescription("[Economy] Buy a new background")
                .addSubcommand(c => c.setName("buy")
                    .setDescription("[Economy] Buy a new background for your profile")
                    .addStringOption(o => o
                        .setName("background")
                        .setDescription("Select a background to buy")
                        .setRequired(true)
                        .setAutocomplete(true))
                )
                .addSubcommand(c => c.setName("set")
                    .setDescription("[Economy] Set a background")
                    .addStringOption(o => o
                        .setName("background")
                        .setDescription("Select a background to set")
                        .setRequired(true)
                        .setAutocomplete(true))
                )
                .addSubcommand(c => c
                    .setName("custom")
                    .setDescription("[Economy] set a custom background")
                    .addAttachmentOption(o => o.setName("image")
                        .setDescription("[Economy] Send your custom background").setRequired(true)
                    ))
        });
    }

    async execute(interaction, t): Promise<any> {

        const command = interaction.options.getSubcommand()
        const user = await this.client.database.getUser(interaction.user.id);

        if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
            if (command === "buy") interaction
                .respond(bglist.map(data => Object({ name: data.name, value: data.id })));

            else if (command === "set") interaction
                .respond(bglist
                    .filter(b => user.backgrounds.includes(b.id))
                    .map(b => Object({ name: b.name, value: b.id })));
        }

        if (interaction.type === InteractionType.ApplicationCommand) {
            switch (command) {
                case 'buy': {
                    const code: string = await interaction.options.getString("background"),
                        background = await bglist
                            .find((b) => b.id === code?.toLowerCase());

                    await interaction.deferReply({ ephemeral: true });

                    if (user.backgrounds.includes(code))
                        return interaction.editReply(t('commands:background.buy.alreadyOwned'));

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("yes")
                                .setLabel(t('commands:background.buy.purchase'))
                                .setStyle(ButtonStyle.Success)
                                .setEmoji("<:foxydaily:915736630495686696>")
                        );

                    const bgInfo = new EmbedBuilder()
                        .setTitle(background.name)
                        .setDescription(background.description)
                        .setColor("#5865F2")
                        .addFields(
                            { name: t('commands:background.buy.price'), value: `${background.foxcoins} FoxCoins`, inline: true }
                        )

                    interaction.editReply({ embeds: [bgInfo] });

                    const canvasGenerator = new GenerateImage(this.client, interaction.user, user, 1436, 884, true, code);
                    const attachment = new AttachmentBuilder(await canvasGenerator.renderProfile(t));

                    await interaction.followUp({
                        content: t("commands:background.buy.preview"),
                        files: [attachment],
                        ephemeral: true,
                        components: [row]
                    });

                    const collector = interaction.channel.createMessageComponentCollector({
                        filter: i => i.customId === 'yes' && i.user.id === interaction.user.id,
                        time: 15_000,
                        max: 1
                    });

                    collector.on('collect', async i => {
                        if (i.customId === 'yes') {
                            if (user.balance < background.foxcoins) {
                                interaction.followUp({ content: t('commands:background.buy.noMoney'), ephemeral: true });
                            } else {
                                user.balance -= background.foxcoins;
                                user.background = code;
                                user.backgrounds.push(code);
                                user.save();
                                interaction.followUp({
                                    content: t('commands:background.buy.success', {
                                        name: background.name,
                                        price: background.foxcoins.toString()
                                    }), ephemeral: true
                                });
                            }
                            i.deferUpdate();
                            collector.stop();
                        }
                    });
                    break;
                }

                case 'set': {
                    const code: string = interaction.options.getString("background"),
                        background = bglist.find((b) => b.id === code?.toLowerCase());

                    if (!background)
                        return interaction.reply(t('commands:background.buy.invalid'));

                    if (user.backgrounds.includes(code)) {
                        user.background = code;
                        user.save();
                        interaction.reply(t('commands:background.set.success', { name: background.name }));
                    }
                    else interaction.reply(t('commands:background.set.notOwned'));
                    break;
                }

                case 'custom': {
                    if (user.premiumType === "INFINITY_PRO" || user.premiumType === "INFINITY_TURBO" || user.premiumType === "VETERAN") {
                        await interaction.deferReply({ ephemeral: true });
                        const attach = interaction.options.getAttachment('image');

                        if (attach.size > 8388606)
                            return await interaction.editReply(t('commands:background.tooLarge'));

                        if (!['image/png', 'image/jpg', 'image/jpeg'].includes(attach.contentType))
                            return await interaction.editReply(t('commands:background.invalidFormat'));

                        const embed = new EmbedBuilder()
                            .setTitle(t('commands:background.custom.title'))
                            .setDescription(t('commands:background.custom.alert')),

                            row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('send')
                                        .setLabel(t('commands:background.custom.save'))
                                        .setStyle(ButtonStyle.Success)
                                )

                        await interaction.editReply({ embeds: [embed], components: [row] });

                        const collector = interaction.channel.createMessageComponentCollector({
                            filter: i => i.customId === 'send' && i.user.id === interaction.user.id,
                            time: 30000,
                            max: 1
                        });

                        collector.on('collect', async i => {
                            collector.stop();
                            await i.deferUpdate();
                            let id = (await this.client.channels.cache.get("997953006391795753")
                                .send({ files: [attach.attachment] })).id;
                            interaction.followUp(t('commands:background.custom.success'));
                            user.background = id;
                            user.save();
                        })
                    } else {
                        interaction.reply(t('commands:background.custom.noPremium'))
                    }
                    break;
                }
            }
        }
    }
}