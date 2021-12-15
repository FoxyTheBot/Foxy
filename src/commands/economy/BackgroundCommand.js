const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const fs = require("fs");
const { bglist } = require('../../structures/backgroundList.json');

module.exports = class BackgroundCommand extends Command {
    constructor(client) {
        super(client, {
            name: "background",
            description: "Adicione um background para o seu perfil",
            category: "economy",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("background")
                .setDescription("[💵 Economy] Adicione um background para o seu perfil")
                .addStringOption(option => option.setName("code").setDescription("Código do background").setRequired(false))
        })
    }

    async execute(interaction) {
        const codeString = await interaction.options.getString("code");
        const userData = await this.client.database.getUser(interaction.user.id);

        var bgDesc = "";
        const bgList = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle("Loja de Backgrounds")
            .setFooter("Use /background code: <código-do-background> | Caso queira ver a lista use /list")

        for (const bgHandle of bglist) {
            if (bgHandle.onlydevs) continue;
            bgDesc = bgDesc + `(${bgHandle.rarity}) **${bgHandle.name}** - ${bgHandle.foxcoins} FoxCoins - **Código:** ${bgHandle.id} \n`;
        }
        bgList.setDescription(bgDesc);
        if (!codeString) return interaction.reply({ embeds: [bgList] });

        const background = await bglist.find((index) => index.id === codeString?.toLowerCase());

        if (!background) return interaction.reply("Código inválido");

        const bg = await userData.backgrounds;
        if (bg.includes(codeString)) return interaction.reply("Você já tem esse background, bobinho");
        if (background.onlydevs && !this.client.config.owners.includes(interaction.user.id)) return interaction.reply("Desculpe, mas esse background só pode ser comprado por desenvolvedores.");

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("yes")
                    .setLabel("💵 Comprar")
                    .setStyle("SUCCESS")
            );

        const bgInfo = new MessageEmbed()
            .setTitle(background.name)
            .setDescription(background.description)
            .setColor("BLURPLE")
            .addField("💵 Preço", `${background.foxcoins} FoxCoins`, true)
            .setFooter(`Raridade: ${background.rarity}`);

        const attachment = await new MessageAttachment(`https://cdn.foxywebsite.ml/backgrounds/${codeString}`, 'background.png');

        bgInfo.setImage("attachment://background.png");

        interaction.reply({ embeds: [bgInfo], components: [row], files: [attachment] });

        const filter = i => i.customId === 'yes' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

        collector.on('collect', async i => {
            if (i.customId === 'yes') {
                if (userData.balance < background.foxcoins) {
                    interaction.followUp({ content: "Você não tem FoxCoins suficientes para comprar esse background!", ephemeral: true });
                    i.deferUpdate();
                    return;
                } else {
                    userData.balance -= background.foxcoins;
                    userData.background = codeString;
                    userData.backgrounds.push(codeString);
                    userData.save();
                    interaction.followUp({ content: "Você comprou o background, ele foi definido automaticamente :D", ephemeral: true });
                    i.deferUpdate();

                }
            }

            if (i.customId === 'no') {
                interaction.followUp({ content: "Compra cancelada", ephemeral: true });
                i.deferUpdate();
            }

        });
    }
}