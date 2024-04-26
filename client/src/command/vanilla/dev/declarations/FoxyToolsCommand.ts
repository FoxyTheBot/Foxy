import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import FoxyToolsExecutor from "../FoxyToolsExecutor";

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
            },
            {
                name: "url",
                description: "A url que você quer",
                type: ApplicationCommandOptionTypes.String,
                required: false
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
        FoxyToolsExecutor(context, endCommand, t);
    }
});

export default FoxyToolsCommand;