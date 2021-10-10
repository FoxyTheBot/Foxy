const { SlashCommandBuilder } = require('@discordjs/builders');
const { bglist } = require('../../json/backgroundList.json');
const user = require('../../utils/DatabaseConnection');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("background")
        .setDescription("Compre outro background da Foxy :D")
        .addStringOption(option =>
            option.setName("code")
                .setDescription("Código do background")
                .setRequired(true)),

    async execute(client, interaction) {
        const userData = await user.findOne({ user: interaction.user.id });
        const code = interaction.options.getString("code");

        if (!userData) {
            interaction.reply({ content: "Parece que você não está no meu banco de dados, execute o comando novamente!", ephemeral: true });
            return new user({
                user: interaction.member.id,
                coins: 0,
                lastDaily: null,
                reps: 0,
                lastRep: null,
                backgrounds: ['default.png'],
                background: 'default.png',
                aboutme: null,
                marry: null,
                premium: false,
            }).save().catch(err => console.log(err));
        }

        const userCoins = userData.coins;


        const background = bglist.find((index) => index.id == code?.toLowerCase());
        if (!background) return interaction.reply({ content: "Eu não encontrei nenhum background", ephemeral: true });

        if (background.onlydevs && !client.config.owners.includes(interaction.user.id)) {
            interaction.reply({ content: "Desculpe, mas esse background só pode ser comprado por desenvolvedores.", ephemeral: true });
            return;
        }
        const bExampleExists = await fs.existsSync(`./src/assets/backgrounds/examples/${background.filename}`);

        var img;

        if (bExampleExists) {
            img = `./src/assets/backgrounds/examples/${background.filename}`;
        } else {
            img = `./src/assets/backgrounds/${background.filename}`;
        }
        const attachment = await new MessageAttachment(img, 'background.png');

        const bgInfo = new MessageEmbed()
            .setTitle(background.name)
            .setDescription(background.description)
            .setImage("attachment://background.png")
            .addField("💵 Preço", `${background.foxcoins} FoxCoins`, true)
            .setFooter(`Raridade: ${background.rarity}`);



        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("yes")
                    .setLabel("💵 Comprar")
                    .setStyle("SUCCESS"),
                new MessageButton()
                    .setCustomId("no")
                    .setLabel("❌ Cancelar")
                    .setStyle("DANGER")
            );

        interaction.reply({ embeds: [bgInfo], components: [row], files: [attachment] });

        const filter = i => i.customId === 'yes' || 'no' && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'yes') {
                if (userCoins < background.foxcoins) {
                    interaction.reply({ content: "Você não tem FoxCoins suficientes para comprar esse background!", ephemeral: true });
                    return;
                } else {
                    userData.coins = userCoins - background.foxcoins;
                    userData.background = background.filename;
                    userData.backgrounds.push(background.filename);
                    userData.save();
                    interaction.reply({ content: "Você comprou o background, ele foi definido automaticamente :D", ephemeral: true });
                }
            }

            if (i.customId === 'no') {
                interaction.reply({ content: "Compra cancelada", ephemeral: true });
            }

        });
    }
}