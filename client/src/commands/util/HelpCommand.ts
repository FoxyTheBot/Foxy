import { bot } from '../../index';
import { createCommand } from '../../structures/commands/createCommand';
import { createEmbed } from '../../utils/discord/Embed';

const HelpCommand = createCommand({
    name: 'help',
    nameLocalizations: {
        "pt-BR": "ajuda"
    },
    description: '[Utils] Shows the help message',
    descriptionLocalizations: {
        "pt-BR": '[Utils] Mostra a mensagem de ajuda'
    },
    category: 'util',
    execute: async (context, endCommand, t) => {
        const embed = createEmbed({
            title: context.getEmojiById(bot.emotes.FOXY_HOWDY) + " " + t('commands:help.bot.title'),
            description: t('commands:help.bot.description', { user: context.author.username }),
            fields: [
                {
                    name: context.getEmojiById(bot.emotes.FOXY_WOW) + " " + t('commands:botinfo.fields.addme'),
                    value: `[${t('botinfo.fields.add')}](https://discord.com/oauth2/authorize?client_id=1006520438865801296&scope=bot+applications.commands&permissions=269872255)`,
                    inline: true
                },
                {
                    name: context.getEmojiById(bot.emotes.FOXY_CUPCAKE) + " " + t('commands:botinfo.fields.support'),
                    value: `[${t('botinfo.fields.server2')}](https://discord.gg/6mG2xDtuZD)`,
                    inline: true
                },
                {
                    name: context.getEmojiById(bot.emotes.TWITTER) + " " + t('commands:botinfo.fields.twitter'),
                    value: "[@Foxy](https://twitter.com/@FoxyDiscordBot)",
                    inline: true
                },
                {
                    name: context.getEmojiById(bot.emotes.GITHUB) + " " + t('commands:botinfo.fields.github'),
                    value: "[FoxyTheBot](https://github.com/FoxyTheBot)",
                    inline: true
                },
                {
                    name: context.getEmojiById(bot.emotes.FOXY_OK) + " " + t('commands:help.bot.fields.privacy'),
                    value: "https://foxybot.win/terms",
                    inline: true

                },
                {
                    name: context.getEmojiById(bot.emotes.FOXY_SUNGLASSES) + " " + t('commands:help.bot.fields.website'),
                    value: "https://foxybot.win",
                    inline: true
                }
            ],
            image: {
                url: "https://cdn.discordapp.com/attachments/1068525425963302936/1076841345211183154/Sem_titulo.png"
            }
        })

        context.sendReply({ embeds: [embed] });
        endCommand();
    }
});

export default HelpCommand;