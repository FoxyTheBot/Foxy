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
                .setDescription("[🖼 Images] Afeta o vaixco? (Create a vasco meme)")
                .addUserOption(option => option.setName("user").setDescription("User you want to send to Vasco").setRequired(true))
        });
    }

    async execute(interaction, t) {
        const vasco = await Canvas.loadImage("https://foxywebsite.xyz/api/memes/vasco.jpg");
        const canvas = Canvas.createCanvas(vasco.width, vasco.height);
        const ctx = canvas.getContext("2d");
        
        const user = interaction.options.getUser("user");
        if(!user) return interaction.editReply(t('commands:global.noUser'));
        const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: "png", size: 512 }));

        ctx.drawImage(vasco,  0, 0, canvas.width, canvas.height);
        ctx.drawImage(avatar,  0, 0, 200, 200);

        ctx.font = "bold 30px sans-serif";
        if (user.username.length < 5) {
			ctx.fillText(user.username.slice(0, 6).replace(/ /g, ''), 130, 120);
		}
		else {
			ctx.fillText(user.username.slice(0, 8).replace(/ /g, ''), 110, 120);
		}

        interaction.editReply({ files: [new MessageAttachment(canvas.toBuffer(), "vasco.png")] });
    }
}