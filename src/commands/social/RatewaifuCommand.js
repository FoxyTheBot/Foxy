const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class RatewaifuCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ratewaifu",
            category: "social",
            data: new SlashCommandBuilder()
                .setName("ratewaifu")
                .setDescription("[👥 Social] Avalie uma waifu")
                .addUserOption(option => option.setName("user").setDescription("Mencione alguém").setRequired(true))
        });
    }

    async execute(interaction) {
        const user = interaction.options.getUser("user");

        if (user == this.client.user.id) return interaction.editReply(`${this.client.emotes.heart} **|** Eu dou nota **∞** para <@737044809650274325> sim eu sou muito linda 😘`);

        const list = [
            '**1** para essa waifu. Eu não gostei <:hmmpepe:791151120021061662> ',
            '**5** para essa waifu. <:hmmpepe:791151120021061662>',
            '**7** para essa waifu. Achei ela bonitinha <:MeowPuffyMelt:776252845493977088> ',
            '**4** para essa waifu. Bonitinha',
            '**3** para essa waifu. Bonitinha, mas acho que pode melhorar *na minha opinião*',
            '**5** para essa waifu.',
            '**8** para essa waifu.',
            '**10** para essa waifu. Essa waifu é perfeita! Eu não trocaria ela por nada se fosse você! <:meow_blush:768292358458179595>',
        ];

        const rand = list[Math.floor(Math.random() * list.length)];

        await interaction.editReply(`Sobre ${user}... Eu dou nota ${rand}`);
    }
}