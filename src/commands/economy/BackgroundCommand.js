const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const { bglist } = require('../../structures/json/backgroundList.json');

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
                .addSubcommand(command => command.setName("buy").setDescription("[💵 Economy] Adicione um background para o seu perfil").addStringOption(option => option.setName("code").setDescription("Código do background")))
                .addSubcommand(command => command.setName("set").setDescription("[💵 Economy] Define um background que você já possui").addStringOption(option => option.setName("background").setDescription("Código do background")))
        });
    }

    async execute(interaction) {
        const command = interaction.options.getSubcommand();

        switch (command) {
            case "buy": {
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
                if (!codeString) return interaction.editReply({ embeds: [bgList] });

                const background = await bglist.find((index) => index.id === codeString?.toLowerCase());

                if (!background) return interaction.editReply("Código inválido");

                const bg = await userData.backgrounds;
                if (bg.includes(codeString)) return interaction.editReply("Você já tem esse background, bobinho");
                if (background.onlydevs && !this.client.config.owners.includes(interaction.user.id)) return interaction.editReply("Desculpe, mas esse background só pode ser comprado por desenvolvedores.");

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

                const attachment = await new MessageAttachment(`https://cdn.foxywebsite.xyz/backgrounds/${codeString}`, 'background.png');

                bgInfo.setImage("attachment://background.png");

                interaction.editReply({ embeds: [bgInfo], components: [row], files: [attachment] });

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
                });
                break;
            }

            case "set": {
                const string = interaction.options.getString("background");
                const userData = await this.client.database.getUser(interaction.user.id)

                if (!string) {
                    const bgs = userData.backgrounds;
                    const bgList = bgs.join('\n');
                    const embed = new MessageEmbed()
                        .setTitle('Lista de backgrounds')
                        .setDescription(bgList)
                        .setFooter("Coloque o nome do arquivo do seu background")

                    await interaction.editReply({ embeds: [embed] });
                } else {
                    const background = await bglist.find((index) => index.id === string?.toLowerCase());
                    if (!background) return await interaction.editReply("Background não encontrado");
                    const backgroundList = userData.backgrounds;
                    if (backgroundList.includes(string)) {
                        userData.background = string;
                        userData.save();
                        await interaction.editReply("Background alterado com sucesso");
                    } else {
                        await interaction.editReply("Você não tem esse background");
                    }
                }
            }
        }
    }
}