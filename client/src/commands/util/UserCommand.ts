import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { createActionRow, createButton } from "../../utils/discord/Component";
import { getUserAvatar } from '../../utils/discord/User';
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { User } from "discordeno/transformers";
import { bot } from "../../index";

const UserCommand = createCommand({
    name: "user",
    description: "See informations about an user",
    descriptionLocalizations: {
        "pt-BR": "Veja as informações sobre um usuário"
    },
    category: 'util',
    options: [
        {
            name: "avatar",
            description: "[Utils] See the user avatar",
            descriptionLocalizations: {
                "pt-BR": "[Utils] Veja o avatar de algum usuário"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "user",
                    nameLocalizations: {
                        "pt-BR": "usuário"
                    },
                    description: "The user you want to see the avatar",
                    descriptionLocalizations: {
                        "pt-BR": "O usuário que você deseja ver o avatar"
                    },
                    type: ApplicationCommandOptionTypes.User,
                    required: false
                }
            ]
        }
    ],
    execute: async (context, endCommand, t) => {
        const subcommand = context.getSubCommand();
        const user = context.getOption<User>('user', 'users') ?? context.author;

        switch (subcommand) {
            case "avatar": {
                const embed = createEmbed({
                    title: t('commands:user.avatar.title', { user: user.username }),
                    image: {
                        url: getUserAvatar(user, { size: 2048, enableGif: true })
                    }
                });

                if (user === context.author) {
                    embed.footer = {
                        text: t('commands:user.avatar.footer')
                    }
                }
                context.sendReply({
                    embeds: [embed],
                    components: [createActionRow([createButton({
                        label: t("commands:user.avatar.click"),
                        style: ButtonStyles.Link,
                        url: getUserAvatar(user, { size: 2048, enableGif: true }),
                        emoji: {
                            id: bot.emotes.FOXY_WOW
                        }
                    })])]
                })
                endCommand();
                break;
            }
        }
    }
});

export default UserCommand;