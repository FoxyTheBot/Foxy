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
    execute: async (ctx, endCommand, t) => {
        const user = ctx.getOption<User>("user", "users");
        const userData = await bot.database.getUser(user.id);
        const commands = await ctx.getSubCommand();
        if (ctx.author.id !== BigInt(config.ownerId)) {
            ctx.foxyReply({
                content: ctx.makeReply(bot.emotes.error, "Você não tem permissão para usar esse comando!"),
                flags: 64
            });
            return endCommand();
        }
        switch (commands) {
            case "add": {
                if (userData.isBanned) {
                    ctx.foxyReply({
                        content: `${user.username} já está banido!`
                    });
                    return endCommand();
                }
                const reason = ctx.getOption<string>("reason", false)
                userData.isBanned = true;
                userData.banReason = reason;
                userData.banData = Date.now();
                userData.save().catch(err => console.log(err));

                ctx.foxyReply({
                    content: `Usuário ${user.username} banido com sucesso!`
                });
                return endCommand();
            }

            case "remove": {
                if (!userData.isBanned) {
                    ctx.foxyReply({
                        content: `${user.username} não está banido!`
                    });
                    return endCommand();
                }

                userData.isBanned = false;
                userData.banReason = null;
                userData.banData = null;
                userData.save().catch(err => console.log(err));

                ctx.foxyReply({
                    content: `Usuário ${user.username} desbanido com sucesso!`
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

                ctx.foxyReply({
                    embeds: [embed]
                });

                return endCommand();
            }
        }
    }
});

export default FoxyBanCommand;