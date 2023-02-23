import { bot } from '../../index';
import { createCommand } from '../../structures/commands/createCommand';
import { createEmbed } from '../../utils/discord/Embed';

const HelpCommand = createCommand({
    name: 'help',
    nameLocalizations: {
        "pt-BR": "ajuda"
    },
    description: '[🛠] Shows the help message',
    descriptionLocalizations: {
        "pt-BR": '[🛠] Mostra a mensagem de ajuda'
    },
    category: 'util',
    execute: async (context, endCommand, t) => {
        const embed = createEmbed({
            title: bot.emotes.FOXY_HOWDY + " " + t('commands:help.bot.title'),
            description: t('commands:help.bot.description', { user: context.author.username }),
            fields: [
                {
                    name: bot.emotes.FOXY_WOW + " " + t('commands:botinfo.fields.addme'),
                    value: `[${t('botinfo.fields.add')}](https://discord.com/oauth2/authorize?client_id=1006520438865801296&scope=bot+applications.commands&permissions=269872255)`,
                    inline: true
                },
                {
                    name: bot.emotes.FOXY_CUPCAKE + " " + t('commands:botinfo.fields.support'),
                    value: `[${t('botinfo.fields.server2')}](https://discord.gg/6mG2xDtuZD)`,
                    inline: true
                },
                {
                    name: bot.emotes.TWITTER + " " + t('commands:botinfo.fields.twitter'),
                    value: "[@Foxy](https://twitter.com/@FoxyDiscordBot)",
                    inline: true
                },
                {
                    name: bot.emotes.GITHUB + " " + t('commands:botinfo.fields.github'),
                    value: "[Foxy](https://github.com/FoxyTheBot)",
                    inline: true 
                },
                {
                    name: bot.emotes.FOXY_OK + " " + t('commands:help.bot.fields.privacy'),
                    value: `[${t('commands:botinfo.fields.privacy')}](https://foxybot.win/privacy)`,
                    inline: true

                },
                {
                    name: bot.emotes.FOXY_SUNGLASSES + " " + t('commands:help.bot.fields.website'),
                    value: "https://foxybot.win",
                    inline: true
                }
            ],
            image: {
                url: "https://images-ext-2.discordapp.net/external/7p5MYQCvBggYVvAJVuVyIUAySnE3iO1iu1m0LPTM_so/https/c.tenor.com/GaBV0ykyRLYAAAAC/kawaii-fnaf.gif"
            }
        })

        context.sendReply({ embeds: [embed] });
        endCommand();
    }
});

export default HelpCommand;