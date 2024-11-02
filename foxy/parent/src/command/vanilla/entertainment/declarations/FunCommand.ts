import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from "discordeno/types";
import { createCommand } from "../../../structures/createCommand";
import UnleashedCommandExecutor from "../../../structures/UnleashedCommandExecutor";
import StonksExecutor from "../memes/StonksExecutor";
import NotStonksExecutor from "../memes/NotStonksExecutor";
import LaranjoExecutor from "../memes/LaranjoExecutor";
import GostoExecutor from "../memes/GostoExecutor";
import GirlfriendExecutor from "../memes/GirlfriendExecutor";
import ErrorExecutor from "../memes/ErrorExecutor";
import ModaExecutor from "../memes/ModaExecutor";
import EminemExecutor from "../memes/8MileExecutor";

const FunCommand = createCommand({
    name: "fun",
    category: "fun",
    description: "[Memes] Create amazing memes, be it image or video",
    descriptionLocalizations: {
        "pt-BR": "[Memes] Crie memes incríveis, sejam eles imagem ou vídeo"
    },

    options: [{
        name: "eminem",
        description: "Generates an vídeo with a scene from the movie 8 Mile",
        descriptionLocalizations: {
            "pt-BR": "Gera um vídeo com uma cena do filme 8 Mile e um áudio customizado"
        },
        type: ApplicationCommandOptionTypes.SubCommandGroup,
        options: [{
            name: "8mile",
            description: "[Video] Generates an vídeo with a scene from the movie 8 Mile",
            descriptionLocalizations: {
                "pt-BR": "[Video] Gera um vídeo com uma cena do filme 8 Mile e um áudio customizado"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "video_or_audio",
                description: "Video or Audio to be used in the video",
                descriptionLocalizations: {
                    "pt-BR": "Vídeo ou Áudio a ser usado no vídeo"
                },
                type: ApplicationCommandOptionTypes.Attachment,
                required: true
            }]
        }]
    },
    {
        name: "antes_que_vire_moda",
        description: "[Image] Brazilian meme: 'Before it becomes a trend, I'm warning you that I'm a fan of:'",
        descriptionLocalizations: {
            "pt-BR": "[Imagem] Montagem do meme 'Antes que vire moda, já vou avisando que sou fã de:'"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "image",
            description: "Image to be used in the meme",
            descriptionLocalizations: {
                "pt-BR": "Imagem a ser usada no meme"
            },
            type: ApplicationCommandOptionTypes.Attachment,
            required: true
        }]
    },
    {
        name: "windowserror",
        description: "[Image] Generates a Windows error message",
        descriptionLocalizations: {
            "pt-BR": "[Imagem] Gera uma mensagem de erro do Windows"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "text",
            description: "Message to be displayed in the error",
            descriptionLocalizations: {
                "pt-BR": "Mensagem a ser exibida no erro"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }]
    },
    {
        name: "girlfriend",
        description: "[Image] Who is your girlfriend?",
        descriptionLocalizations: {
            "pt-BR": "[Imagem] Quem é sua namorada?"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "user",
            description: "User to be used in the meme",
            descriptionLocalizations: {
                "pt-BR": "Usuário a ser usado no meme"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }]
    },
    {
        name: "gosto",
        description: "[Image] Show a Brazilian meme called 'Não, não somos iguais'",
        descriptionLocalizations: {
            "pt-BR": "[Imagem] Mostre um meme brasileiro chamado 'Não, não somos iguais'"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "asset1",
            description: "First asset to be used in the meme",
            descriptionLocalizations: {
                "pt-BR": "Primeiro asset a ser usado no meme"
            },
            type: ApplicationCommandOptionTypes.Attachment,
            required: true
        },
        {
            name: "asset2",
            description: "Second asset to be used in the meme",
            descriptionLocalizations: {
                "pt-BR": "Segundo asset a ser usado no meme"
            },
            type: ApplicationCommandOptionTypes.Attachment,
            required: true
        },
        {
            name: "text",
            description: "Text to be displayed in the meme",
            descriptionLocalizations: {
                "pt-BR": "Texto a ser exibido no meme"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }]
    },
    {
        name: "laranjo",
        description: "[Image] Create a Brazilian meme called 'Laranjo'",
        descriptionLocalizations: {
            "pt-BR": "[Imagem] Crie um meme brasileiro chamado 'Laranjo'"
        },

        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "text",
            description: "Text to be displayed in the meme",
            descriptionLocalizations: {
                "pt-BR": "Texto a ser exibido no meme"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }]
    },
    {
        name: "not_stonks",
        description: "[Image] Create a meme called 'Not Stonks'",
        descriptionLocalizations: {
            "pt-BR": "[Imagem] Crie um meme chamado 'Not Stonks'"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "text",
            description: "Text to be displayed in the meme",
            descriptionLocalizations: {
                "pt-BR": "Texto a ser exibido no meme"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }]
    },
    {
        name: "stonks",
        description: "[Image] Create a meme called 'Stonks'",
        descriptionLocalizations: {
            "pt-BR": "[Imagem] Crie um meme chamado 'Stonks'"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "text",
            description: "Text to be displayed in the meme",
            descriptionLocalizations: {
                "pt-BR": "Texto a ser exibido no meme"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }]
    }],
    type: ApplicationCommandTypes.ChatInput,

    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
        switch (context.getSubCommand()) {
            case "8mile":
                new EminemExecutor().execute(context, endCommand, t);
                break;
            case "antes_que_vire_moda":
                new ModaExecutor().execute(context, endCommand, t);
                break;
            case "windowserror":
                new ErrorExecutor().execute(context, endCommand, t);
                break;
            case "girlfriend":
                new GirlfriendExecutor().execute(context, endCommand, t);
                break;
            case "gosto":
                new GostoExecutor().execute(context, endCommand, t);
                break;
            case "laranjo":
                new LaranjoExecutor().execute(context, endCommand, t);
                break;
            case "not_stonks":
                new NotStonksExecutor().execute(context, endCommand, t);
                break;
            case "stonks":
                new StonksExecutor().execute(context, endCommand, t);
                break;
        }
    }
});

export default FunCommand;