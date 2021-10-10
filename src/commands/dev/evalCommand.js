const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluate')
        .addStringOption(option =>
            option.name('code')
                .setDescription('Código para ser executado')
                .setRequired(true)),

    async execute(client, interaction) {
        const code = interaction.options.getString('code');

        const clean = (text) => {
            if (typeof (text) === 'string') { return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`); }
            return text;
        };

        try {
            const util = require('util');

            let evaled = eval(code);
            evaled = util.inspect(evaled, { depth: 1 });
            evaled = evaled.replace(new RegExp('Error', 'g'), undefined);


            if (evaled.length > 1800) evaled = `${evaled.slice(0, 1800)}...`;
            const success = new MessageEmbed()
                .setColor('RED')
                .setTitle('<:Developer:813832825442533396> Comando executado com sucesso!')
                .setDescription(`\ \ \`\`\`xl\n${clean(evaled)}\n\`\`\``);

            interaction.reply(success);

        } catch (err) {
            const errorMessage = err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack;
            const embed = new MessageEmbed();
            embed.setColor('RED');
            embed.setTitle(`${client.emotes.scared} Ocorreu um erro durante a execução!`);
            embed.setDescription(`Saída: \`\`\`js\n${errorMessage}\`\`\``);

            interaction.reply(errorMessage);
        }
    }
}