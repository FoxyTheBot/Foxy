import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { inspect } from "util";

export default class EvalCommand extends Command {
    constructor(client) {
        super(client, {
            name: "eval",
            description: "Evaluate code",
            category: "dev",
            dev: true,
            data: new SlashCommandBuilder()
                .setName("eval")
                .setDescription("[🦊 Dev] Evaluate code")
                .addStringOption(option => option.setName("code").setRequired(true).setDescription("Code to evaluate"))
        });
    }

    async execute(interaction): Promise<void> {
        let client = this.client,
            code = interaction.options.getString("code"),
            evaled, hasError = false,
            embed = new MessageEmbed();

        if (!code) return interaction.editReply("Executar nenhum código? WTF?! Como assim?");

        try {
            evaled = await eval(code.includes('await') ? `async function foxyExec() { ${code} }; foxyExec()` : code);

            embed.setColor('GREEN')
                .setTitle('<a:2303_Rainbow_Weeb:728688748736544898> Comando executado com sucesso!')
                .setDescription(`\ \ \`\`\`js\n${String(inspect(evaled, { depth: 1 })).slice(0, 2000)}\n\`\`\``);
        } catch (err) {
            embed.setColor('RED')
                .setTitle(`${this.client.emotes.scared} Ocorreu um erro durante a execução!`)
                .setDescription(`Saída: \`\`\`js\n${String(err).slice(0, 2000)}\`\`\``);
            hasError = true
        } finally {
            interaction.editReply({ embeds: [embed], ephemeral: hasError });
        }
    }
}