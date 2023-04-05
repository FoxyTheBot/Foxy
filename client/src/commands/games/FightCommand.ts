import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { User } from "discordeno/transformers";
import { MessageFlags } from "../../utils/discord/Message";

const FightCommand = createCommand({
    name: "fight",
    nameLocalizations: {
        "pt-BR": "lutar"
    },
    description: "[Games] Fight with someone",
    descriptionLocalizations: {
        "pt-BR": "[Jogos] Lute com alguém"
    },
    category: "games",
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "The user you want to fight",
            descriptionLocalizations: {
                "pt-BR": "O usuário que você quer lutar"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],

    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>('user', 'users');

        if (user.id === context.author.id) {
            context.sendReply({
                content: t('commands:fight.self'),
                flags: MessageFlags.Ephemeral
            });
            return endCommand();
        }

        if (user.toggles.bot) {
            context.sendReply({
                content: t('commands:fight.bot'),
                flags: MessageFlags.Ephemeral
            });
            return endCommand();
        }

        
    }
});

export default FightCommand;