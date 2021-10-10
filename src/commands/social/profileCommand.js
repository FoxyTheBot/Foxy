const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');
const user = require('../../utils/DatabaseConnection')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Veja seu perfil.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Veja o perfil de outra pessoa")),
    async execute(client, interaction) {

        const userMention = interaction.options.getUser("user") || interaction.user;
        const userData = await user.findOne({ user: userMention.id });

        if (!userData) {
            interaction.reply({ content: "Parece que você não está no meu banco de dados, execute o comando novamente!", ephemeral: true });
            return new user({
                user: userMention.id,
                coins: 0,
                lastDaily: null,
                reps: 0,
                lastRep: null,
                backgrounds: ['default.png'],
                background: 'default.png',
                aboutme: null,
                marry: null,
                premium: false,
            }).save().catch(err => console.log(err));
        }

        var aboutme = userData.aboutme;
        if(aboutme === null) aboutme = "Foxy é minha amiga (você pode alterar isso usando /aboutme)!";

        const canvas = Canvas.createCanvas(1436, 884);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(`./src/assets/backgrounds/${userData.background}`);

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '70px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${userMention.username}`, canvas.width / 6.0, canvas.height / 9.5);

        ctx.font = '40px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Reps: ${userData.reps} \nCarteira: ${userData.coins}`, canvas.width / 1.5, canvas.height / 7.0);

        ctx.font = ('30px sans-serif');
        ctx.fillStyle = '#ffffff';
        ctx.fillText(aboutme, canvas.width / 55.0, canvas.height / 1.2);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();


        const avatar = await Canvas.loadImage(userMention.displayAvatarURL({ format: 'png' }));
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'foxy_profile.png');

       await interaction.reply({ files: [attachment] });
    }
}