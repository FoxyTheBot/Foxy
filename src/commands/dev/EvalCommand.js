const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = class EvalCommand extends Command {
    constructor(client) {
        super(client, {
            name: "eval",
            category: "dev",
            dev: true,
            data: new SlashCommandBuilder()
                .setName("eval")
                .setDescription("[🔑 Dev] Executa código JavaScript")
                .addStringOption(option => option.setName("code").setDescription("Código que será executado").setRequired(true))
        });
    }

    async execute(interaction) {
        const clean = (text) => {
            if (typeof (text) === 'string') { return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`); }
            return text;
          };

          try {
            const util = require('util');
            const code = interaction.options.getString("code");
            if(!code) return interaction.editReply("Executar nenhum código? WTF?! Como assim?");
            let evaled = eval(code);
            evaled = util.inspect(evaled, { depth: 1 });
            evaled = evaled.replace(new RegExp('Error', 'g'), undefined);
      
            if (evaled.length > 1800) evaled = `${evaled.slice(0, 1800)}...`;
            const success = new MessageEmbed()
              .setColor('RED')
              .setTitle('<:Developer:813832825442533396> Comando executado com sucesso!')
              .setDescription(`\ \ \`\`\`xl\n${clean(evaled)}\n\`\`\``);
      
            interaction.editReply({ embeds: [success] });
          } catch(err) {
            const errorMessage = err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack;
            const embed = new MessageEmbed();
            embed.setColor('RED');
            embed.setTitle(`${this.client.emotes.scared} Ocorreu um erro durante a execução!`);
            embed.setDescription(`Saída: \`\`\`js\n${errorMessage}\`\`\``);
      
            interaction.editReply({ embeds: [embed], ephemeral: true });
          }
    }
}