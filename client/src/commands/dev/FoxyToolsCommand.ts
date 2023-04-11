import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { bot } from '../../index';
import { User } from "discordeno/transformers";
import { createEmbed } from "../../utils/discord/Embed";
import config from '../../../config.json';

const FoxyToolsCommand = createCommand({
    name: "foxytools",
    description: "Alguns utilitários para o desenvolvedor",
    category: "dev",
    devsOnly: true,
    options: [
        {
            name: "add_cakes",
            description: "Adiciona Cakes para algum usuário",
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "user",
                    description: "O usuário que você quer adicionar as cakes",
                    type: ApplicationCommandOptionTypes.User,
                    required: true
                },
                {
                    name: "quantity",
                    description: "A quantidade de Cakes que você quer adicionar",
                    type: ApplicationCommandOptionTypes.Number,
                    required: true
                }
            ]
        },
        {
            name: "remove_cakes",
            description: "Remove Cakes para algum usuário",
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "user",
                    description: "O usuário que você quer remover as cakes",
                    type: ApplicationCommandOptionTypes.User,
                    required: true
                },
                {
                    name: "quantity",
                    description: "A quantidade de Cakes que você quer remover",
                    type: ApplicationCommandOptionTypes.Number,
                    required: true
                }
            ]
        },
        {
            name: "change_activity",
            description: "Edita a atividade da Foxy",
            type: ApplicationCommandOptionTypes.SubCommand, 
            options: [{
                name: "type",
                description: "O tipo de atividade que você quer",
                type: ApplicationCommandOptionTypes.Number,
                required: true,
                choices: [
                    {
                        name: "Playing",
                        value: 0
                    },
                    {
                        name: "Streaming",
                        value: 1
                    },
                    {
                        name: "Listening",
                        value: 2
                    },
                    {
                        name: "Watching",
                        value: 3
                    },
                    {
                        name: "Competing",
                        value: 5
                    }
                ]
            },
            {
                name: "status",
                description: "O status que você quer",
                type: ApplicationCommandOptionTypes.String, 
                required: true,
                choices: [
                    {
                        name: "Online",
                        value: "online"
                    },
                    {
                        name: "Idle",
                        value: "idle"
                    },
                    {
                        name: "Do not disturb",
                        value: "dnd"
                    },
                    {
                        name: "Invisible",
                        value: "invisible"
                    }
                ]
            },
        {
            name: "activity",
            description: "A atividade que você quer",
            type: ApplicationCommandOptionTypes.String,
            required: true
        }]
        },
        {
            name: "foxyban",
            "description": "Bane alguém de usar a Foxy",
            type: ApplicationCommandOptionTypes.SubCommandGroup,
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
            ]
        }
    ],
    execute: async (context, endCommand, t) => {
        const command = context.getSubCommand();
        const user = context.getOption<User>('user', 'users');

        if (context.author.id !== BigInt(config.ownerId) && command !== "check") {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, "Você não tem permissão para usar esse comando!"),
                flags: 64
            });
            return endCommand();
        }

        switch (command) {
            case "add_cakes": {
                const userData = await bot.database.getUser(user.id);
                const quantity = context.getOption<Number>('quantity', false);

                if (userData.isBanned) {
                    context.sendReply({ content: "O usuário está banido!", flags: 64 });
                    return endCommand();
                }

                userData.balance += Number(quantity);
                userData.save();
                context.sendReply({ content: `Prontinho! Foi adicionado ${quantity} cakes para ${user.username}` })
                endCommand();
                break;
            }

            case "remove_coins": {
                const quantity = context.getOption<Number>('quantity', false);
                const userData = await bot.database.getUser(user.id);

                if (userData.isBanned) {
                    context.sendReply({ content: "O usuário está banido!", flags: 64 });
                    return endCommand();
                }

                userData.balance -= Number(quantity);
                userData.save();
                context.sendReply({ content: `Foram removidos ${quantity} Cakes de ${user.username}` })

                endCommand();
                break;
            }

            case "change_activity": {
                const type = context.getOption<number>('type', false);
                const activity = context.getOption<string>('activity', false);
                const status = context.getOption<any>('status', false);

                bot.helpers.editBotStatus({ status: status , activities: [{
                    name: activity,
                    type: type,
                    createdAt: Date.now()
                }] });

                context.sendReply({ content: "Prontinho! Atividade alterada com sucesso!", flags: 64 });
                break;
            }

            case "add": {
                const userData = await bot.database.getUser(user.id);
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
                const userData = await bot.database.getUser(user.id);
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
                const userData = await bot.database.getUser(user.id);
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

export default FoxyToolsCommand;