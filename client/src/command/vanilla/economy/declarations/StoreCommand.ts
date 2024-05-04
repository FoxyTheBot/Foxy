import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { bglist } from "../../../../structures/json/backgroundList.json";
import { masks } from '../../../../structures/json/layoutList.json'
import MaskBuyExecutor from '../components/MaskBuyExecutor';
import BackgroundBuyExecutor from '../components/BackgroundBuyExecutor';
import StoreExecutor from "../StoreExecutor";

var choices = [];
const maskList = masks.map(data => Object({ name: data.name, nameLocalizations: data.nameLocalizations, value: data.id }));

for (var i = 0; i < bglist.length; i++) {
    if (bglist[i].cakes === 0) continue;
    if (!bglist[i].inactive) {
        choices.push({
            name: `💖 ${bglist[i].name} - ${bglist[i].cakes} Cakes`,
            value: bglist[i].id
        })
    }
}


const StoreCommand = createCommand({
    name: 'store',
    description: '[Economy] Buy items from the store',
    descriptionLocalizations: {
        'pt-BR': '[Economia] Compre itens da loja'
    },
    category: 'economy',
    options: [{
        name: "buy",
        nameLocalizations: {
            "pt-BR": "comprar"
        },
        description: "[Economy] Buy an item from the store",
        descriptionLocalizations: {
            "pt-BR": "[Economia] Compre um item da loja"
        },
        type: ApplicationCommandOptionTypes.SubCommandGroup,
        options: [{
            name: "backgrounds",
            nameLocalizations: {
                "pt-BR": "backgrounds"
            },
            description: "[Economy] Buy a background for your profile",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Compre um background para seu perfil"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "background",
                description: "Select the background you want to buy",
                descriptionLocalizations: {
                    "pt-BR": "Selecione o background que deseja comprar"
                },
                type: ApplicationCommandOptionTypes.String,
                required: true,
                choices: choices
            }]
        },
        {
            name: "avatar_decorations",
            nameLocalizations: {
                "pt-BR": "decorações_de_avatar"
            },
            description: "[Economy] Buy a avatar decoration for your avatar",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Compre uma decoração de avatar para seu perfil"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "avatar_decoration",
                nameLocalizations: {
                    "pt-BR": "decoração_de_avatar"
                },
                description: "Select the avatar decoration you want to buy",
                descriptionLocalizations: {
                    "pt-BR": "Selecione a decoração de avatar que deseja comprar"
                },
                type: ApplicationCommandOptionTypes.String,
                required: true,
                choices: maskList
            }]
        }]
    }],
    commandRelatedExecutions: [
        BackgroundBuyExecutor, // 0
        MaskBuyExecutor, // 1
    ],

    execute: async (context, endCommand, t) => {
        StoreExecutor(context, endCommand, t)
    }
});

export default StoreCommand;