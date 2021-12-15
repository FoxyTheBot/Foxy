const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = class SetPremiumCommand extends Command {
    constructor(client) {
        super(client, {
            name: "premium",
            category: "dev",
            dev: true,
            data: new SlashCommandBuilder()
                .setName("premium")
                .setDescription("[🔑 Dev] Verifica o premium de um usuário")
                .addSubcommand(command => command.setName("add").setDescription("Adiciona premium em um usuário").addUserOption(option => option.setName("user").setDescription("A ID ou menção").setRequired(true)))
                .addSubcommand(command => command.setName("remove").setDescription("Remove o premium de um usuário").addUserOption(option => option.setName("user").setDescription("A ID ou menção").setRequired(true)))
                .addSubcommand(command => command.setName("check").setDescription("Verifica o estado premium de um usuário").addUserOption(option => option.setName("user").setDescription("A ID ou menção").setRequired(true)))
        })
    }

    async execute(interaction) {
        const command = interaction.options.getSubcommand()
        const user = interaction.options.getUser("user");
        const userData = await this.client.database.getUser(user.id);

        switch (command) {
            case "add": {
                userData.premium = true;
                userData.premiumDate = new Date();
                userData.save();
                await interaction.reply(`${this.client.emotes.success} **|** ${user.tag} agora possui premium!`);
                break;
            }

            case "remove": {
                userData.premium = false;
                userData.premiumDate = null;
                userData.save();
                await interaction.reply(`${this.client.emotes.error} **|** Agora ${user.tag} não possui mais premium!`);
            }

            case "check": {
                const embed = new MessageEmbed()
                    .setTitle(`Estado do premium de ${user.tag}`)
                    .addFields(
                        { name: "É premium?", value: userData.premium.toString(), inline: true },
                        { name: `Tempo de premium`, value: userData.premiumDate.toString() || "Não possui data", inline: true }
                    )
                await interaction.reply({ embeds: [embed] });
            }
        }
    }
}