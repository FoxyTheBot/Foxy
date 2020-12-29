
module.exports = async(client, message) => {
    const webhookClient = new Discord.WebhookClient("790040938637819954", "N4G0WLBL3i7tG9EFF4WyZfICklM4jUgUqnTAVNUXXnWjFcmAz-2aWI_YM5yJHNrw4Xdk");
    const embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle('Logs de entrada e saída')
        .setDescription(`<:MeowPuffyMelt:776252845493977088> Fui adicionada no servidor: ${guild.name} / ${guild.id}`)
        .setThumbnail('https://cdn.discordapp.com/attachments/776930851753426945/777176123221082142/Foxy.png')
    webhookClient.send( {
        username: `Logs`,
        avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
        embeds: [embed],
    });
}
