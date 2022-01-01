const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = class PizzariaCommand extends Command {
    constructor(client) {
        super(client, {
            name: "pizzaria",
            category: "economy",
            data: new SlashCommandBuilder()
                .setName("pizzaria")
                .setDescription("[👏 Roleplay] Crie, expanda e gerencie sua própria pizzaria como em fnaf 6")
                .addSubcommand(command => command.setName("create").setDescription("[👏 Roleplay] Crie sua própria pizzaria de Five Nights at Freddy's").addStringOption(
                    option => option.setName("name").setDescription("Nome da pizzaria que deseja criar").setRequired(true)).addStringOption(option => option.setName("description").setDescription("Descrição da pizzaria").setRequired(true)))
                .addSubcommand(command => command.setName("stats").setDescription("[👏 Roleplay] Verifique o status de sua pizzaria"))
        })
    }

    async execute(interaction) {
        const commands = interaction.options.getSubcommand();
        const name = interaction.options.getString("name");

        switch (commands) {
            case "create": {
                const desc = interaction.options.getString("description");
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel("Confirmar")
                            .setStyle("SUCCESS")
                            .setEmoji(this.client.emotes.success)
                            .setCustomId("confirm")
                    )
                const embed = new MessageEmbed()
                    .setTitle(`Confirme as seguintes informações`)
                    .setDescription(`**Nome da pizzaria** ${name} \n\n **Descrição** ${desc}`)
                await interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });
                const filter = i => i.customId === 'confirm' && i.user.id === interaction.user.id;
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

                collector.on("collect", async i => {
                    i.deferUpdate();
                    const data = await this.client.database.registerPizzaria(name, desc, interaction.user.id);
                    if (data === true) return interaction.followUp({ content: `Você só pode registrar uma pizzaria`, ephemeral: true });
                    if (data === false) return interaction.followUp({ content: `Já existe uma pizzaria com esse nome` });
                    await interaction.followUp({ content: `A Pizzaria **${name}** foi criada!`, ephemeral: true });
                })
                break;
            }
            case "stats": {
                const data = await this.client.simulator.getPizzariaInventory(interaction.user.id)
                const embed = new MessageEmbed()
                    .setTitle(`${data.name}`)
                    .setDescription(`${data.description}`)
                    .addFields(
                        { name: "Animatronics", value: `${data.animatronics.join(", ")}` || "Nenhum" },
                        { name: "Carteira", value: `${data.foxcoins}` }
                    )
                await interaction.editReply({ embeds: [embed] });
                break;
            }
        }
    }
}