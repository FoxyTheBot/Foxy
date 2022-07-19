import Command from "../../structures/command/BaseCommand";
import { lylist } from '../../structures/json/layoutList.json';
import { SlashCommandBuilder } from '@discordjs/builders';
import { InteractionType } from "discord.js";

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

    async execute(ctx, t, interaction): Promise<void> {
        const command = ctx.options.getSubcommand();

        if (ctx.type === InteractionType.ApplicationCommandAutocomplete) {
            if (command == "set") {
                return await interaction.respond(await lylist.map(data => Object({ name: t(`commands:layouts.${data.id}`), value: data.id })));
            }
        }


        if (ctx.type === InteractionType.ApplicationCommand) {
            const code: string = await ctx.options.getString("layout");

            const layouts = await lylist.map(data => data.id);
            if (!layouts.includes(code)) return await ctx.reply(t('commands:layouts.notFound'));
            const data = await this.client.database.getUser(ctx.user.id);
            data.layout = code;
            await data.save();
            await ctx.reply(t('commands:layouts.changed'));
        }
    }
}