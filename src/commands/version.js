const v = require('../../package.json');
exports.run = async(client, message) => {
    message.channel.send(`<:Ping:790731201685356555> **| ${message.author} \n <:DiscordStaff:731947814246154240> **| Version:** ${v.version}`)
}