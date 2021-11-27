const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");

module.exports = class ProfileCommand extends Command {
    constructor(client) {
        super(client, {
            name: "profile",
            description: "Veja seu perfil",
            dev: false,
            data: new SlashCommandBuilder()
            .setName("profile")
            .setDescription("Veja seu perfil")
            .addUserOption(option => option.setName("user").setRequired(false).setDescription("Veja perfil de outra pessoa"))
        })
    }

    async execute(interaction) {
        const user = interaction.options.getUser("user") || interaction.user;
        const userData = await this.client.database.getDocument(user.id);
        var userAboutme = await userData.aboutme;

        await interaction.deferReply();

        if(!userAboutme) userAboutme = "Foxy é minha amiga (você pode alterar isso usando /aboutme)!";
    
        if(userAboutme.length > 85) {
            const aboutme = userAboutme.match(/.{1,95}/g);
            userAboutme = aboutme.join("\n");
        }
        
        const canvas = Canvas.createCanvas(1436, 884);
        const ctx = canvas.getContext("2d");
        const background = await Canvas.loadImage(`./src/assets/backgrounds/${userData.background}`);

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    
        ctx.font = '70px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${user.username}`, canvas.width / 6.0, canvas.height / 9.5);

        ctx.font = '40px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Reps: ${userData.repCount} \nCarteira: ${userData.balance}`, canvas.width / 1.5, canvas.height / 7.0);

    if (userData.marriedWith !== null) {
        const discordProfile = await this.client.users.fetch(userData.marriedWith);
        ctx.font = '30px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`💍 Casado com: ${discordProfile.tag}`, canvas.width / 6.0, canvas.height / 6.0);
      }

      if(userData.premium) {
        ctx.font = '30px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`🔑 Premium`, canvas.width / 6.0, canvas.height / 4.5);
      }
      
      ctx.font = ('30px sans-serif');
      ctx.fillStyle = '#ffffff';
      ctx.fillText(userAboutme, canvas.width / 55.0, canvas.height / 1.2);
  
      ctx.beginPath();
      ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
  
      const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'png' }));
      ctx.drawImage(avatar, 25, 25, 200, 200);

      const attachment = new MessageAttachment(canvas.toBuffer(), 'foxy_profile.png');

      await interaction.editReply({ files: [attachment] });

    }
}