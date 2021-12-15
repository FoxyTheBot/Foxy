const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class PptCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ppt",
            category: "entertainment",
            data: new SlashCommandBuilder()
            .setName("ppt")
            .setDescription("[✨ Entertainment] Pedra papel tesoooooooowoura!")
            .addStringOption(option => option.setName("text").setDescription("Insira pedra papel ou tesoura").setRequired(true))
        })
    }

    async execute(interaction) {
        const string = interaction.options.getString("text");
        const acceptedReplies = ['pedra', 'papel', 'tesoura'];

        const random = Math.floor((Math.random() * acceptedReplies.length));
        const result = acceptedReplies[random];

        if(!acceptedReplies.includes(string)) return interaction.reply(`Apenas estas respostas são aceitas: \`${acceptedReplies.join(', ')}\``);
        if (result === string) return interaction.reply('Ei, dessa vez deu empate');

        switch (string) {
            case 'pedra': {
              if (result === 'papel') return interaction.reply(`${result}! Ganhei :3`);
              return interaction.reply('Yayyy você venceu!');
            }
            case 'papel': {
              if (result === 'tesoura') return interaction.reply(`${result}! Ganhei :3`);
              return interaction.reply('Yeeey você venceu!');
            }
            case 'tesoura': {
              if (result === 'pedra') return interaction.reply(`${result}! Ganhei OwO >:3`);
              return interaction.reply('OwO você venceu! ^^');
            }
        }
        }
}