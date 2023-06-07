import { bot } from '../../index';
import { createCommand } from '../../structures/commands/createCommand';
import { createEmbed } from '../../utils/discord/Embed';
import { getUserAvatar } from '../../utils/discord/User';

const HelpCommand = createCommand({
    name: 'help',
    nameLocalizations: {
        "pt-BR": "ajuda"
    },
    description: '[Utils] Shows the help message',
    descriptionLocalizations: {
        "pt-BR": '[Utilitários] Mostra a mensagem de ajuda'
    },
    category: 'util',
    execute: async (context, endCommand, t) => {
        const embed = createEmbed({
            title: context.getEmojiById(bot.emotes.FOXY_HOWDY) + " " + "Foxy",
            color: 0xfe436a,
            description: t('commands:help.bot.description', { user: `<@!${context.author.id}>` }),
            fields: [
                {
                    name: context.getEmojiById(bot.emotes.FOXY_WOW) + " " + t('commands:help.bot.fields.addme'),
                    value: `[${t('help.bot.fields.add')}](https://discord.com/oauth2/authorize?client_id=1006520438865801296&scope=bot+applications.commands&permissions=269872255)`,

                },
                {
                    name: context.getEmojiById(bot.emotes.FOXY_CUPCAKE) + " " + t('commands:help.bot.fields.support'),
                    value: `https://foxybot.win/support`,

                },
                {
                    name: context.getEmojiById(bot.emotes.FOXY_PRAY) + " " + t('commands:help.bot.fields.crowdin'),
                    value: "https://foxybot.win/translate",

                },
                {
                    name: context.getEmojiById(bot.emotes.FOXY_SUNGLASSES) + " " + t('commands:help.bot.fields.website'),
                    value: "https://foxybot.win",

                },
                {
                    name: context.getEmojiById(bot.emotes.FOXY_WOW) + " " + t('commands:help.bot.fields.privacy'),
                    value: "https://foxybot.win/terms",
                }
            ],
            thumbnail: {
                url: `https://cdn.discordapp.com/attachments/1078322762550083736/1095835653444481145/FOXYY.png`
            },
            image: {
                url: "https://cdn.discordapp.com/attachments/1068525425963302936/1076841345211183154/Sem_titulo.png"
            },
            footer: {
                iconUrl: await getUserAvatar(bot.owner, { size: 2048 }),
                text: t('commands:help.bot.footer', { owner: `${bot.owner.username} - ${bot.owner.id}` })
            }
        })

        context.sendReply({ embeds: [embed] });
        endCommand();
    }
});

export default HelpCommand;