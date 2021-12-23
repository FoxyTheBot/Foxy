const Command = require('../../structures/Command');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = class DblCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dbl',
            description: "Link para meu perfil na Discord Bot List",
            category: 'utils',
            data: new SlashCommandBuilder()
                .setName('upvote')
                .setDescription('[🛠 Utils] Link para meu perfil na Discord Bot List')
        });
    }

    async execute(interaction) {
        const embed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle('Discord Bot List')
        .setDescription('<a:happy_shuffle:768500897483325493> Me ajude a crescer e me ajude a ser um bot melhor votando em mim no <:discordbotlist:778011345542578238> Discord Bot List! <:catblush:768292358458179595>\nCada voto ajuda a me divulgar para outras pessoas na Discord Bot List <:catblush:768292358458179595>\n\n Que tal você se juntar a todas as outras pessoas que votaram e que me ajudaram a crescer [clicando aqui](https://top.gg/bot/737044809650274325)? :heart:');
        await interaction.reply({ embeds: [embed] });
    }
}