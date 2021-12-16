const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const ms = require("ms");

module.exports = class RepCommand extends Command {
    constructor(client) {
        super(client, {
            name: "rep",
            description: "Dê reputações para alguém",
            category: "social",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("rep")
                .setDescription("[👥 Social] Dê reputações para alguém")
                .addUserOption(option => option.setName("user").setDescription("Mencione um usuário").setRequired(true))
        });
    }

    async execute(interaction) {
        const user = await interaction.options.getUser("user");
        if (user === interaction.user) return interaction.reply(`${this.client.emotes.error} | Você não pode dar reputação para si mesmo!`);

        const userData = await this.client.database.getUser(user.id);
        const authorData = await this.client.database.getUser(interaction.user.id);

        const repCooldown = 3600000;

        if (repCooldown - (Date.now() - authorData.lastRep) > 0) {
            const currentCooldown = ms(repCooldown - (Date.now() - authorData.lastRep));
            return interaction.reply(`${this.client.emotes.error} | Você já deu reputação para alguém tente novamente em **${currentCooldown}**`)
        } else {
            userData.repCount++;
            authorData.lastRep = Date.now();
            await userData.save();
            await authorData.save();
            return interaction.reply(`${this.client.emotes.success} | Você deu reputação para ${user.username}!`);
        }
    }
}