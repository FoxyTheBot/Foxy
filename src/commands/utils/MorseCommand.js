const Command = require('../../structures/Command');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = class MorseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'morse',
            description: 'Converte texto em morse.',
            category: 'utils',
            data: new SlashCommandBuilder()
                .setName('morse')
                .setDescription('Converte texto em morse.')
                .addStringOption(option => option.setName('texto').setDescription('Texto a ser convertido').setRequired(true))
        })
    }
    async execute(interaction) {
        const alpha = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
        const morse = '/,.-,-...,-.-.,-..,.,..-.,--.,....,..,.---,-.-,.-..,--,-.,---,.--.,--.-,.-.,...,-,..-,...-,.--,-..-,-.--,--..,.----,..---,...--,....-,.....,-....,--...,---..,----.,-----'.split(',');

        var text = interaction.options.getString('texto').toUpperCase();

        while (text.includes('Ä') || text.includes('Ö') || text.includes('Ü')) {
            text = text.replace('Ä', 'AE').replace('Ö', 'OE').replace('Ü', 'UE');
        }

        if (text.startsWith('.') || text.startsWith('-')) {
            text = text.split(' ');
            const { length } = text;
            for (let i = 0; i < length; i++) {
                text[i] = alpha[morse.indexOf(text[i])];
            }
            text = text.join('');
        } else {
            text = text.split('');
            const { length } = text;
            for (let i = 0; i < length; i++) {
                text[i] = morse[alpha.indexOf(text[i])];
            }
            text = text.join(' ');
        }

        const morseReader = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Tradutor de Código Morse')
            .setDescription(`:point_right::radio: Resultado foi: \n \`\`\`${text}\`\`\``);

        await interaction.reply({ embeds: [morseReader] });
    }
}