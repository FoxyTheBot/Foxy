import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export default class PremiumCommand extends Command {
    constructor(client) {
        super(client, {
            name: "premium",
            description: "Set user as premium",
            category: "dev",
            dev: true,
            data: new SlashCommandBuilder()
                .setName("premium")
                .setDescription("[🦊 Dev] Set user as premium")
                .addSubcommand(command => command.setName("add").setDescription("Adiciona premium em um usuário").addUserOption(option => option.setName("user").setDescription("A ID ou menção").setRequired(true)))
                .addSubcommand(command => command.setName("remove").setDescription("Remove o premium de um usuário").addUserOption(option => option.setName("user").setDescription("A ID ou menção").setRequired(true)))
                .addSubcommand(command => command.setName("check").setDescription("Verifica o estado premium de um usuário").addUserOption(option => option.setName("user").setDescription("A ID ou menção").setRequired(true)))
        });
    }

    async execute(interaction, t) {
        const command = interaction.options.getSubcommand()
        const user = interaction.options.getUser("user");
        const userData = await this.client.database.getUser(user.id);

        if(!userData) return interaction.editReply({ content: "Não encontrei esse usuário", ephemeral: true });
        switch (command) {
            case "add": {
                userData.premium = true;
                userData.premiumDate = new Date();
                userData.save();
                await interaction.editReply(`${this.client.emotes.success} **|** ${user.tag} agora possui premium!`);
                break;
            }

            case "remove": {
                userData.premium = false;
                userData.premiumDate = null;
                userData.save();
                await interaction.editReply(`${this.client.emotes.error} **|** Agora ${user.tag} não possui mais premium!`);
            }

            case "check": {
                const embed = new MessageEmbed()
                    .setTitle(`Estado do premium de ${user.tag}`)
                    .addFields(
                        { name: "É premium?", value: userData.premium.toString(), inline: true },
                        { name: `Tempo de premium`, value: userData.premiumDate.toString() || "Não possui data", inline: true }
                    )
                await interaction.editReply({ embeds: [embed] });
            }
        }
    }
}