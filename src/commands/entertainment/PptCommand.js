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
        });
    }

    async execute(interaction) {
        const string = interaction.options.getString("text");
        const acceptedReplies = ['pedra', 'papel', 'tesoura'];

        const random = Math.floor((Math.random() * acceptedReplies.length));
        const result = acceptedReplies[random];

        if(!acceptedReplies.includes(string)) return interaction.editReply(`Apenas estas respostas são aceitas: \`${acceptedReplies.join(', ')}\``);
        if (result === string) return interaction.editReply('Ei, dessa vez deu empate');

        switch (string) {
            case 'pedra': {
              if (result === 'papel') return interaction.editReply(`${result}! Ganhei :3`);
              return interaction.editReply('Yayyy você venceu!');
            }
            case 'papel': {
              if (result === 'tesoura') return interaction.editReply(`${result}! Ganhei :3`);
              return interaction.editReply('Yeeey você venceu!');
            }
            case 'tesoura': {
              if (result === 'pedra') return interaction.editReply(`${result}! Ganhei OwO >:3`);
              return interaction.editReply('OwO você venceu! ^^');
            }
        }
        }
}