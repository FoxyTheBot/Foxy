import Command from '../../structures/command/BaseCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } from 'discord.js';
import { masks } from '../../structures/json/layoutList.json';
import GenerateImage from "../../structures/GenerateImage";

export default class MaskCommand extends Command {
    constructor(client) {
        super(client, {
            name: "mask",
            description: "Change your profile mask",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("mask")
                .setDescription("[Economy] - Change your avatar mask")
                .addSubcommand(command => command.setName("set").setDescription("[Economy] set a avatar mask").addStringOption(option => option.setName("mask").setDescription("Select your mask").setAutocomplete(true).setRequired(true)))
                .addSubcommand(command => command.setName("buy").setDescription("[Economy] buy a new mask for your profile").addStringOption(option => option.setName("mask").setDescription("[Economy] - Select a mask you want to buy").setRequired(true).setAutocomplete(true)))
        });
    }

    async execute(interaction, t): Promise<void> {
        const command = interaction.options.getSubcommand();
        if (interaction.isAutocomplete()) {
            if (command == "buy") {
                return await interaction.respond(await masks.map(data => Object({ name: t(`commands:masks.${data.id}`), value: data.id })));
            } else if (command == "set") {
                const userInfo = await this.client.database.getUser(interaction.user.id);
                const userMask = await userInfo.masks;
                const bgList = await masks.filter(data => userMask.includes(data.id));
                return await interaction.respond(await bgList.map(data => Object({ name: t(`commands:masks.${data.id}`), value: data.id })));
            }
        }

        if (interaction.isCommand()) {
            switch (command) {
                case 'buy': {
                    const code: string = await interaction.options.getString("mask");
                    const userData = await this.client.database.getUser(interaction.user.id);
                    const mask = masks.find(index => index.id === code?.toLowerCase());
                    await interaction.deferReply({ ephemeral: true });
                    const msk = await userData.masks
                    if (msk.includes(code)) return await interaction.editReply(t('commands:masks.alreadyOwned'));

                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('yes')
                                .setLabel(t('commands:masks.buy.purchase'))
                                .setStyle("SUCCESS")
                                .setEmoji("<:foxydaily:915736630495686696>")
                        )

                    const mskInfo = new MessageEmbed()
                        .setDescription(mask.price.toString())

                    const canvasGenerator = new GenerateImage(this.client, interaction.user, userData, 1436, 884, true, code, true);
                    const attachment = new MessageAttachment(await canvasGenerator.renderProfile(t), "foxy_profile.png");


                    interaction.editReply({ embeds: [mskInfo], ephemeral: true });
                    await interaction.followUp({
                        content: t("commands:masks.buy.preview"),
                        files: [attachment],
                        ephemeral: true,
                        components: [row]
                    });

                    const filter = i => i.customId === 'yes' && i.user.id === interaction.user.id && i.message.id === interaction.message.id;
                    const collector = interaction.channel.createMessageComponentCollector({
                        filter,
                        time: 15000,
                        max: 1
                    });

                    collector.on('collect', async i => {
                        if (i.customId === 'yes') {
                            if (userData.premiumType === "INFINITY_PRO" || userData.premiumType === "VETERAN" || userData.premiumType === "INFINITY_TURBO") {
                                userData.mask = code;
                                userData.masks.push(code);
                                userData.save();
                                interaction.followUp(t('commands:masks.buy.premium'));
                                i.deferUpdate();
                                return collector.stop();
                            } else {
                                if (userData.balance < mask.price) {
                                    interaction.followUp({ content: t('commands:masks.buy.noMoney'), ephemeral: true });
                                    i.deferUpdate();
                                    return collector.stop();
                                } else {
                                    userData.balance -= mask.price;
                                    userData.mask = code;
                                    userData.masks.push(code);
                                    userData.save();
                                    interaction.followUp(t('commands:masks.buy.success'));
                                    i.deferUpdate();
                                    return collector.stop();
                                }
                            }
                        }
                    });
                    break;
                }

                case 'set': {
                    const code: string = await interaction.options.getString("mask");
                    const userData = await this.client.database.getUser(interaction.user.id);

                    const mask = await masks.find(index => index.id === code?.toLowerCase());
                    if (!mask) return interaction.reply(t('commands:masks.set.invalid'));
                    const maskData = await userData.masks

                    if (maskData.includes(code)) {
                        userData.mask = code;
                        userData.save();
                        interaction.reply(t('commands:masks.set.success'));
                    } else {
                        interaction.reply(t('commands:masks.set.notOwned'))
                    }
                    break;
                }
            }
        }
    }
}