import Command from "../../structures/command/BaseCommand";
import { lylist } from '../../structures/json/layoutList.json';
import { SlashCommandBuilder } from '@discordjs/builders';

export default class LayoutCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'layout',
            description: "Change your layout",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("layout")
                .setDescription("[Economy] Change your profile layout, it's free")
                .addSubcommand(command => command.setName("set").setDescription("Select your layout").addStringOption(opt => opt.setName("layout").setDescription("set your layout").setRequired(true).setAutocomplete(true)))
        });
    }

    async execute(interaction, t): Promise<void> {
        const command = interaction.options.getSubcommand();

        if (interaction.isAutocomplete()) {
            if (command == "set") {
                return await interaction.respond(await lylist.map(data => Object({ name: t(`commands:layouts.${data.id}`), value: data.id })));
            }
        }


        if (interaction.isCommand()) {
            const code: string = await interaction.options.getString("layout");

            const layouts = await lylist.map(data => data.id);
            if (!layouts.includes(code)) return await interaction.editReply(t('commands:layouts.notFound'));
            const data = await this.client.database.getUser(interaction.user.id);
            data.layout = code;
            await data.save();
            await interaction.reply(t('commands:layouts.changed'));
        }
    }
}