import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

export default class MorseCommand extends Command {
    constructor(client) {
        super(client, {
            name: "morse",
            description: "Convert text to morse code",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("morse")
                .setDescription("[Utils] Convert text to morse code")
                .addStringOption(option => option.setName("text").setRequired(true).setDescription("The text to convert"))
        });
    }

    async execute(ctx, t): Promise<void> {
        const alpha = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
        const morse = '/,.-,-...,-.-.,-..,.,..-.,--.,....,..,.---,-.-,.-..,--,-.,---,.--.,--.-,.-.,...,-,..-,...-,.--,-..-,-.--,--..,.----,..---,...--,....-,.....,-....,--...,---..,----.,-----'.split(',');

        var text = ctx.options.getString('text').toUpperCase();

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


        const morseEmbed = new EmbedBuilder()
            .setDescription(`:point_right::radio: \n \`\`\`${text}\`\`\``);

        await ctx.reply({ embeds: [morseEmbed] });
    }
}