import Command from '../../structures/command/BaseCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';

export default class BotInfoCommand extends Command {
    public client: any;
    constructor(client) {
        super(client, {
            name: 'botinfo',
            description: 'Show the Foxy\'s info',
            category: 'utils',
            dev: false,
            data: new SlashCommandBuilder()
                .setName('botinfo')
                .setDescription('[Utils] Show the Foxy\'s info')
        });
    }

    async execute(ctx, t): Promise<void> {
        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle(t('botinfo.title'))
            .setDescription(t('botinfo.description', { client: this.client, guilds: this.client.guilds.cache.size.toString() }))
            .addFields(
                { name: t('botinfo.fields.addme'), value: `[${t('botinfo.fields.add')}](https://discord.com/oauth2/authorize?client_id=737044809650274325&scope=bot+applications.commands&permissions=269872255)`, inline: true },
                { name: t('botinfo.fields.support'), value: `[${t('botinfo.fields.server2')}](https://discord.gg/W6XtYyqKkg)`, inline: true },
                { name: t('botinfo.fields.twitter'), value: "[@Foxy](https://twitter.com/FoxyDiscordBot)", inline: true },
                { name: t('botinfo.fields.github'), value: "[Foxy](https://github.com/FoxyTheBot/Foxy)", inline: true },
                { name: t('botinfo.fields.donate'), value: `[${t('botinfo.fields.donate2')}](https://ko-fi.com/wing4merbr)`, inline: true },
            )
            .setThumbnail(this.client.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setImage("https://c.tenor.com/GaBV0ykyRLYAAAAC/kawaii-fnaf.gif")

        ctx.reply({ embeds: [embed] });
    }
}