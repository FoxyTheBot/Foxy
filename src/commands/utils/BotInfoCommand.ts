import Command from '../../structures/BaseCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

export default class BotInfoCommand extends Command {
    public client: any;
    constructor(client) {
        super(client, {
            name: 'botinfo',
            description: 'Veja informações sobre o bot',
            category: 'utils',
            dev: false,
            data: new SlashCommandBuilder()
                .setName('botinfo')
                .setDescription('[🛠 Utils] Veja informações sobre o bot')
        });
    }

    async execute(interaction) {
        const embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(":fox: Foxy")
            .setDescription("Olá, eu sou a Foxy! Eu sou um simples bot brasileiro de economia e entretenimento para o seu servidor!" +
                `Estou espalhando alegria em ${this.client.guilds.cache.size} servidores :heart:`)
            .addFields(
                { name: "<:AddMember:797181629826859029> Me adicione", value: "[Me adicione clicando aqui](https://discord.com/oauth2/authorize?client_id=737044809650274325&scope=bot+applications.commands&permissions=269872255)", inline: true },
                { name: "<:DiscordExplore:790934280611037196> Servidor de Suporte", value: "[Entre no meu servidor](https://discord.gg/W6XtYyqKkg)", inline: true },
                { name: "<:Twitter:797184287816286209> Meu Twitter", value: "[@Foxy](https://twitter.com/FoxyDiscordBot)", inline: true },
                { name: "<:GitHub:746399300728258710> Meu Github", value: "[Foxy](https://github.com/FoxyTheBot/Foxy)", inline: true },
                { name: '<:paypal:776965353904930826> Doe para mim', value: '[Doe para mim clicando aqui](https://www.paypal.com/donate/?hosted_button_id=J7Y747Q38UEKN)', inline: true },
            )
            .setThumbnail(this.client.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setImage("https://c.tenor.com/GaBV0ykyRLYAAAAC/kawaii-fnaf.gif")

        interaction.editReply({ embeds: [embed] });
    }
}