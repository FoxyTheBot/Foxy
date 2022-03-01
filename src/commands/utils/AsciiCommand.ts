import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import figlet from "figlet";

export default class AsciiCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ascii",
            description: "Transform your text in ASCII art",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("ascii")
                .setDescription("[🛠 Utils] Transform your text in ASCII art")
                .addStringOption(option => option.setName("text").setRequired(true).setDescription("The text to be converted"))
        });
    }

    async execute(interaction, t): Promise<void> {
        const string = interaction.options.getString("text");
        figlet.text(string, async (err, data) => {
            if (err) console.log(err)
            await interaction.editReply(`\`\`\`${data}\`\`\``);
        })
    }
}