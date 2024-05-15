import { ApplicationCommandOptionTypes } from "discordeno/types";
import { createCommand } from "../../../structures/createCommand";
import PetViewExecutor from "../PetViewExecutor";
import PetChangeNameExecutor from "../PetChangeNameExecutor";

const PetCommand = createCommand({
    name: "pet",
    description: "[Economy] Buy a pet and take care of it",
    descriptionLocalizations: {
        "pt-BR": "[Economia] Compre um pet e cuide dele"
    },
    category: "economy",
    options: [{
        name: "store",
        description: "[Economy] Buy a pet to take care of",
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "item-type",
            nameLocalizations: {
                "pt-BR": "tipo-do-item"
            },
            description: "[Economy] Choose the type of item you want to buy",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Escolha o tipo de item que deseja comprar"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true,
            choices: [{
                name: "Food",
                nameLocalizations: {
                    "pt-BR": "Comida"
                },
                value: "food"
            },
            {
                name: "Clothes",
                nameLocalizations: {
                    "pt-BR": "Roupas"
                },
                value: "clothes"
            },
            {
                name: "Scenery",
                nameLocalizations: {
                    "pt-BR": "Cenário"
                },
                value: "scenery"
            },
            {
                name: "Pet",
                nameLocalizations: {
                    "pt-BR": "Pet"
                },
                value: "pet"
            }]
        }]
    },
    {
        name: "view",
        nameLocalizations: {
            "pt-BR": "ver"
        },
        description: "[Economy] View your pet",
        descriptionLocalizations: {
            "pt-BR": "[Economia] Veja seu pet"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
    },
    {
        name: "actions",
        nameLocalizations: {
            "pt-BR": "ações"
        },
        description: "[Economy] Interact with your pet",
        descriptionLocalizations: {
            "pt-BR": "[Economia] Interaja com seu pet"
        },
        type: ApplicationCommandOptionTypes.SubCommandGroup,
        options: [{
            name: "feed",
            nameLocalizations: {
                "pt-BR": "alimentar"
            },
            description: "[Economy] Feed your pet",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Alimente seu pet"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
        },
        {
            name: "change_name",
            nameLocalizations: {
                "pt-BR": "mudar_nome"
            },
            description: "[Economy] Change your pet's name",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Mude o nome do seu pet"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "name",
                nameLocalizations: {
                    "pt-BR": "nome"
                },
                description: "[Economy] The new name of your pet",
                descriptionLocalizations: {
                    "pt-BR": "[Economia] O novo nome do seu pet"
                },
                type: ApplicationCommandOptionTypes.String,
                required: true
            }]
        },
        {
            name: "bath",
            nameLocalizations: {
                "pt-BR": "banho"
            },
            description: "[Economy] Give a bath to your pet",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Dê um banho no seu pet"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
        },
        {
            name: "play",
            nameLocalizations: {
                "pt-BR": "brincar"
            },
            description: "[Economy] Play with your pet",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Brinque com seu pet"
            },
            type: ApplicationCommandOptionTypes.SubCommand
        }]
    }],

    execute: async (context, endCommand, t) => {
        const subCommand = context.getSubCommand();

        switch (subCommand) {
            /* Store subcommand */

            case "store": {
                // TODO
                break;
            }


            /* Actions */
            case "feed": {
                // TODO
                break;
            }
            case "bath": {
                // TODO
                break;
            }
            case "play": {
                // TODO
                break;
            }

            case "change_name": {
                PetChangeNameExecutor(context, endCommand, t);
                break;
            }

            /* View subcommand */

            case "view": {
                PetViewExecutor(context, endCommand, t);
                break;
            }

        }
    }
});


export default PetCommand;