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
                .setDescription("[Economy] Buy a new background")
                .addSubcommand(command => command.setName("buy").setDescription("[Economy] Buy a new background for your profile").addStringOption(option => option.setName("background").setDescription("Select a background to buy").setRequired(true).setAutocomplete(true)))
                .addSubcommand(command => command.setName("set").setDescription("[Economy] Set a background").addStringOption(option => option.setName("background").setDescription("Select a background to set").setRequired(true).setAutocomplete(true)))
        });
    }

    async execute(interaction, t): Promise<void> {
        const command = interaction.options.getSubcommand();

        if (interaction.isAutocomplete()) {
            if (command == "buy") {
                return await interaction.respond(await bglist.map(data => Object({ name: data.name, value: data.id })));
            } else if (command == "set") {
                const userInfo = await this.client.database.getUser(interaction.user.id);
                const userBackground = await userInfo.backgrounds;
                const bgList = await bglist.filter(data => userBackground.includes(data.id));
                return await interaction.respond(await bgList.map(data => Object({ name: data.name, value: data.id })));
            }
        }

        if (interaction.isCommand()) {
            switch (command) {
                case 'buy': {
                    const code: string = await interaction.options.getString("background");
                    const userData = await this.client.database.getUser(interaction.user.id);
                    const background = await bglist.find((index) => index.id === code?.toLowerCase());
                    await interaction.deferReply({ ephemeral: true });
                    const bg = await userData.backgrounds;
                    if (bg.includes(code)) return await interaction.editReply(t('commands:background.buy.alreadyOwned'));

                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId("yes")
                                .setLabel(t('commands:background.buy.purchase'))
                                .setStyle("SUCCESS")
                                .setEmoji("<:foxydaily:915736630495686696>")
                        );

                    const bgInfo = new MessageEmbed()
                        .setTitle(background.name)
                        .setDescription(background.description)
                        .setColor("BLURPLE")
                        .addField(t('commands:background.buy.price'), `${background.foxcoins} FoxCoins`, true)

                    const canvasGenerator = new GenerateImage(this.client, interaction.user, userData, 1436, 884, true, code);
                    const attachment = new MessageAttachment(await canvasGenerator.renderProfile(t), "foxy_profile.png");

                    interaction.editReply({ embeds: [bgInfo], ephemeral: true });
                    await interaction.followUp({
                        content: t("commands:background.buy.preview"),
                        files: [attachment],
                        ephemeral: true,
                        components: [row]
                    });

                    const filter = i => i.customId === 'yes' && i.user.id === interaction.user.id;
                    const collector = interaction.channel.createMessageComponentCollector({
                        filter,
                        time: 15000,
                        max: 1
                    });

                    collector.on('collect', async i => {
                        if (i.customId === 'yes') {
                            if (userData.balance < background.foxcoins) {
                                interaction.followUp({ content: t('commands:background.buy.noMoney'), ephemeral: true });
                                i.deferUpdate();
                                collector.stop();
                            } else {
                                userData.balance -= background.foxcoins;
                                userData.background = code;
                                userData.backgrounds.push(code);
                                userData.save();
                                interaction.followUp({
                                    content: t('commands:background.buy.success', {
                                        name: background.name,
                                        price: background.foxcoins.toString()
                                    }), ephemeral: true
                                });
                                i.deferUpdate();
                                collector.stop();
                            }
                        }
                    });
                    break;
                }

                case 'set': {
                    const code: string = await interaction.options.getString("background");
                    const userData = await this.client.database.getUser(interaction.user.id);


                    const background = await bglist.find((index) => index.id === code?.toLowerCase());
                    if (!background) return interaction.reply(t('commands:background.buy.invalid'));
                    const backgrounds = await userData.backgrounds;

                    if (backgrounds.includes(code)) {
                        userData.background = code;
                        userData.save();
                        interaction.reply(t('commands:background.set.success', { name: background.name }));
                    } else {
                        interaction.reply(t('commands:background.set.notOwned'));
                    }

                }
            }
        }
    }
}