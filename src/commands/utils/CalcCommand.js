const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const math = require("mathjs");
const { MessageEmbed } = require("discord.js");

module.exports = class CalcCommand extends Command {
    constructor(client) {
        super(client, {
            name: "calc",
            description: "Calcula uma expressão matemática.",
            category: "utils",
            data: new SlashCommandBuilder()
                .setName("calc")
                .setDescription("Calcula uma expressão matemática.")
                .addStringOption(option => option.setName("expression").setDescription("Expressão matemática").setRequired(true))
        })
    }

    async execute(interaction) {
        const expression = interaction.options.getString("expression");
        var resp;

        const calcHelp = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Calculadora")
            .setDescription("Faça cálculos matemáticos direto do Discord :3 \n\n **Como usar** `/calc expression: 1+1`");

        try {
            resp = math.evaluate(expression);
        } catch (e) {
            return interaction.reply({ embeds: [calcHelp] });
        }
        const error = new MessageEmbed()
            .setColor('0079d8')
            .setTitle(':(')
            .setDescription('\n\n Your PC ran a problem and need to restart. We\'re just collecting some error info, and then we\'ll restart for you.')
            .setImage('https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Bsodwindows10.png/1200px-Bsodwindows10.png ');
        if (expression == 'NaN') return interaction.reply({ embeds: [error] });
        
        const embed = new MessageEmbed()
            .setColor(0x808080)
            .setTitle('Calculadora')
            .addField('Questão', `\`\`\`css\n${expression}\`\`\``)
            .addField('Resposta', `\`\`\`css\n${resp}\`\`\``);
        await interaction.reply({ embeds: [embed] });
    }
}