const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class FateCommand extends Command {
    constructor(client) {
        super(client, {
            name: "fate",
            category: "entertainment",
            data: new SlashCommandBuilder()
                .setName("fate")
                .setDescription("[✨ Entertainment] Veja o que a pessoa é sua em outro universo")
                .addUserOption(option => option.setName("user").setDescription("Mencione alguém").setRequired(true))
        });
    }

    async execute(interaction) {
        const user = interaction.options.getUser("user");

        const list = [
            'namorados <3',
            'amigos :)',
            'casados <3',
            'inimigos >:3',
            'irmãos :3',
            'primos :3'
        ];

        const rand = list[Math.floor(Math.random() * list.length)];
        await interaction.reply(`Em outro universo paralelo ${interaction.user} e ${user} são **${rand}**`)
    }
}