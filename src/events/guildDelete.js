
module.exports = async(client, message) => {
    const webhookClient = new Discord.WebhookClient("790040938637819954", "N4G0WLBL3i7tG9EFF4WyZfICklM4jUgUqnTAVNUXXnWjFcmAz-2aWI_YM5yJHNrw4Xdk");
    const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('Logs de entrada e saída')
        .setDescription(`<:sad_cat_thumbs_up:768291053765525525> Fui removida do servidor: ${guild.name} / ${guild.id}`)
        .setThumbnail('https://cdn.discordapp.com/attachments/791449801735667713/791449876827078686/3d938cdf28260ce4e51b7456f042a690.jpg')
    webhookClient.send( {
        username: `Logs`,
        avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
        embeds: [embed],
    });
}