import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { bot } from "../../index";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { User } from "discordeno/transformers";
import config from "../../../config.json";

const FoxyBanCommand = createCommand({
    name: "foxyban",
    description: "Bane um usuário de usar a Foxy",
    category: "util",
    devsOnly: true,
    options: [
        {
            name: "add",
            description: "Adiciona um usuário na lista de banidos",
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "user",
                    description: "Usuário a ser banido",
                    type: ApplicationCommandOptionTypes.User,
                    required: true
                },
                {
                    name: "reason",
                    description: "Motivo do banimento",
                    type: ApplicationCommandOptionTypes.String,
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "Remove um usuário da lista de banidos",
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "user",
                    description: "Usuário a ser desbanido",
                    type: ApplicationCommandOptionTypes.User,
                    required: true
                }
            ]
        },
        {
            name: "check",
            description: "Verifica se um usuário está banido",
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "user",
                    description: "Usuário a ser verificado",
                    type: ApplicationCommandOptionTypes.User,
                    required: true
                }
            ]
        }
    ],
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>("user", "users");
        const userData = await bot.database.getUser(user.id);
        const commands = await context.getSubCommand();
        if (context.author.id !== BigInt(config.ownerId)) {
            context.sendReply({
                content: context.makeReply(bot.emotes.error, "Você não tem permissão para usar esse comando!"),
                flags: 64
            });
            return endCommand();
        }
        switch (commands) {
            case "add": {
                if (userData.isBanned) {
                    context.sendReply({
                        content: `${user.username} já está banido!`
                    });
                    return endCommand();
                }
                const reason = context.getOption<string>("reason", false)
                userData.isBanned = true;
                userData.banReason = reason;
                userData.banData = Date.now();
                userData.save().catch(err => console.log(err));

                context.sendReply({
                    content: `Usuário ${user.username} banido com sucesso!`,
                    flags: 64
                });
                return endCommand();
            }

            case "remove": {
                if (!userData.isBanned) {
                    context.sendReply({
                        content: `${user.username} não está banido!`,
                        flags: 64
                    });
                    return endCommand();
                }

                userData.isBanned = false;
                userData.banReason = null;
                userData.banData = null;
                userData.save().catch(err => console.log(err));

                context.sendReply({
                    content: `Usuário ${user.username} desbanido com sucesso!`,
                    flags: 64
                });
                return endCommand();
            }

            case "check": {
                const embed = createEmbed({
                    title: "Informações sobre o banimento",
                    fields: [
                        {
                            name: "Usuário",
                            value: `${user.username}#${user.discriminator}`,
                            inline: true
                        },
                        {
                            name: "Está banido?",
                            value: userData.isBanned ? "Sim" : "Não",
                        },
                        {
                            name: "Motivo do banimento",
                            value: userData.banReason ? userData.banReason : "Não definido",
                        },
                        {
                            name: "Data do banimento",
                            value: userData.banData ? new Date(userData.banData).toLocaleString() : "Não definido",
                        }
                    ]
                });

                context.sendReply({
                    embeds: [embed],
                    flags: 64
                });

                return endCommand();
            }
        }
    }
});

export default FoxyBanCommand;