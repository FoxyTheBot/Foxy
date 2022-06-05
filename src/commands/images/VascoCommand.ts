import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import * as Canvas from "canvas";
import { MessageAttachment } from "discord.js";

export default class VascoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "vasco",
            description: "BRMEMES Create a Vasco meme",
            category: "images",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("vasco")
                .setDescription("[Imagess] Afeta o vaixco? (Meme creator)")
                .addUserOption(option => option.setName("user").setDescription("User you want to send to Vasco").setRequired(true))
        });
    }

    async execute(interaction, t) {
        const vasco = await Canvas.loadImage("https://cdn.discordapp.com/attachments/944770979060650014/947296868977762314/44e07dcf1a217dca8e8ec73a41dab0143f66f286e153524cd9340d1ca4bd746d_1.png");
        const canvas = Canvas.createCanvas(vasco.width, vasco.height);
        const ctx = canvas.getContext("2d");

        const user = interaction.options.getUser("user");
        if (!user) return interaction.reply(t('commands:global.noUser'));
        const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: "png", size: 512 }))

        ctx.drawImage(vasco, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(avatar, 50, 75, 200, 200);

        ctx.font = "bold 30px sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText(user.username, 270, 200);

        interaction.reply({ files: [new MessageAttachment(canvas.toBuffer(), "vasco.png")] });
        if (user === this.client.user) {
            interaction.followUp({ content: 'Isso afeta o Vasco?', files: [new MessageAttachment('https://cdn.discordapp.com/attachments/948014291863359520/948231838118334474/y2mate.com_-_HINO_DO_VASCO_DA_GAMA.mp3', 'vasco.mp3')], ephemeral: true });
        }
    }
}