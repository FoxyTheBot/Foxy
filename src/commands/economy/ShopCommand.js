const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = class ShopCommand extends Command {
    constructor(client) {
        super(client, {
            name: "shop",
            category: "economy",
            data: new SlashCommandBuilder()
                .setName("shop")
                .setDescription("[💵 Economy] Compre alguma coisa para o seu inventário")
                .addSubcommand(command => command.setName("animatronic").setDescription("[💵 Economy] Compre animatronics para a sua pizzaria").addStringOption(option => option.setName("code").setDescription("Código do animatronic")))
        })
    }

    async execute(interaction) {
        const command = interaction.options.getSubcommand();
        const pizzariaData = await this.client.simulator.getDataById(interaction.user.id);
        const code = interaction.options.getString("code");

        switch (command) {
            case "animatronic": {
                const { animatronics } = require("../../structures/json/productsList.json");
                const productList = new MessageEmbed()
                    .setColor("BLURPLE")
                    .setTitle("Loja de itens")

                var pdDesc = "";
                for (const productHandle of animatronics) {
                    pdDesc = pdDesc + `**Nome:** ${productHandle.name} - **Preço:** ${productHandle.price} - **Risco** ${productHandle.danger}% \n`
                }
                productList.setDescription(pdDesc);

                if (!code) return interaction.editReply({ embeds: [productList] });

                const pdls = await animatronics.find((index) => index.name === code);

                if (!pdls) return interaction.editReply(`Código inválido`);

                const inventory = await pizzariaData.animatronics;
                if (inventory.includes(pdls.name)) return interaction.followUp({ content: "Você não pode comprar esse animatronic, você já tem! Irá assombrar sua pizzaria", ephemeral: true });

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("buy")
                            .setLabel("Comprar")
                            .setStyle("SUCCESS")
                    );

                const pdInfo = new MessageEmbed()
                    .setTitle(pdls.name)
                    .setColor("BLURPLE")
                    .addField("Preço", `${pdls.price} FoxCoins`)
                    .setImage(pdls.url)

                interaction.editReply({ embeds: [pdInfo], components: [row] });
                const filter = i => i.customId === 'buy' && i.user.id === interaction.user.id;
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

                collector.on("collect", async i => {
                    if (pizzariaData.foxcoins < pdls.price) {
                        interaction.followUp({ content: "Sua pizzaria não tem dinheiro o suficiente para isso, você pode transferir FoxCoins da sua conta para a sua pizzaria", ephemeral: true })
                        return i.deferUpdate();
                    } else {
                        i.deferUpdate();
                        pizzariaData.foxcoins -= pdls.price;
                        pizzariaData.animatronics.push(pdls.name);
                        pizzariaData.save();
                        await interaction.followUp({ content: "Animatronic comprado com sucesso! Tomare que ele não estrague sua pizzaria, não sabemos se existe um **~~W1ll14m 4f70n~~** lá :3", ephemeral: true })
                    }
                })
                break;
            }
        }
    }
}