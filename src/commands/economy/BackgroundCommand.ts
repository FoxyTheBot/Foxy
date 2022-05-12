import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } from "discord.js";
import { bglist } from "../../structures/json/backgroundList.json";
import GenerateImage from "../../structures/GenerateImage";

export default class BackgroundCommand extends Command {
    constructor(client) {
        super(client, {
            name: "background",
            description: "Buy a new background",
            category: "economy",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("background")
                .setDescription("[💰 Economy] Buy a new background")
                .addSubcommand(command => command.setName("buy").setDescription("[💵 Economy] Buy a new background for your profile").addStringOption(option => option.setName("code").setDescription("Background code")))
                .addSubcommand(command => command.setName("set").setDescription("[💵 Economy] Set a background").addStringOption(option => option.setName("background").setDescription("Background code")))
        });
    }

    async execute(interaction, t): Promise<void> {
        const command = interaction.options.getSubcommand();

        switch (command) {
            case 'buy': {
                const code: string = await interaction.options.getString("code");
                const userData = await this.client.database.getUser(interaction.user.id);

                var bgDesc = "";
                const bgList = new MessageEmbed()
                    .setColor("BLURPLE")
                    .setTitle(t('commands:background.buy.title'))

                for (const bg of bglist) {
                    bgDesc = bgDesc + `(${bg.rarity}) **${bg.name}** - ${bg.description}`;
                }
                bgList.setDescription(bgDesc);
                if (!code) return interaction.editReply({ embeds: [bgList] });

                const background = await bglist.find((index) => index.id === code?.toLowerCase());

                if (!background) return interaction.editReply(t('commands:background.buy.invalid'));

                const bg = await userData.backgrounds;
                if (bg.includes(code)) return interaction.editReply(t('commands:background.buy.alreadyOwned'));
                if (background.onlydevs && !this.client.config.owners.includes(interaction.user.id)) return interaction.editReply(t('commands:background.buy.onlyDevs'));

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("yes")
                            .setLabel(t('commands:background.buy.purchase'))
                            .setStyle("SUCCESS")
                    );

                const bgInfo = new MessageEmbed()
                    .setTitle(background.name)
                    .setDescription(background.description)
                    .setColor("BLURPLE")
                    .addField(t('commands:background.buy.price'), `${background.foxcoins} FoxCoins`, true)

                const canvasGenerator = new GenerateImage(this.client, interaction.user, userData, 1436, 884, true, code);
                const attachment = new MessageAttachment(await canvasGenerator.renderProfile(t), "foxy_profile.png");

                interaction.editReply({ embeds: [bgInfo], components: [row] });
                interaction.followUp({ content: t("commands:background.buy.preview"), files: [attachment], ephemeral: true });

                const filter = i => i.customId === 'yes' && i.user.id === interaction.user.id;
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

                collector.on('collect', async i => {
                    if (i.customId === 'yes') {
                        if (userData.balance < background.foxcoins) {
                            interaction.followUp({ content: t('commands:background.buy.noMoney'), ephemeral: true });
                            i.deferUpdate();
                            return collector.stop();
                        } else {
                            userData.balance -= background.foxcoins;
                            userData.background = code;
                            userData.backgrounds.push(code);
                            userData.save();
                            interaction.followUp({ content: t('commands:background.buy.success', { name: background.name, price: background.foxcoins }), ephemeral: true });
                            i.deferUpdate();
                            return collector.stop();
                        }
                    }
                });
                break;
            }

            case 'set': {
                const code: string = await interaction.options.getString("background");
                const userData = await this.client.database.getUser(interaction.user.id);

                if (!code) {
                    const bgs = await userData.backgrounds;
                    const bgList = bgs.join(", ");
                    const embed = new MessageEmbed()
                        .setTitle(t('commands:background.set.title'))
                        .setDescription(t('commands:background.set.description', { bgList }))

                    await interaction.editReply({ embeds: [embed] });
                } else {
                    const background = await bglist.find((index) => index.id === code?.toLowerCase());
                    if (!background) return interaction.editReply(t('commands:background.buy.invalid'));
                    const backgrounds = await userData.backgrounds;

                    if (backgrounds.include(code)) {
                        userData.background = code;
                        userData.save();
                        interaction.editReply(t('commands:background.set.success', { name: background.name }));
                    } else {
                        interaction.editReply(t('commands:background.set.notOwned'));
                    }

                }
            }
        }
    }
}