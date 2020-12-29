const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require("./json/config.json");
const Enmap = require('enmap')
const fs = require('fs');
const express = require('express');
const app = express();

app.get('/', function(req, res) {
    res.sendStatus(200);
});

client.commands = new Enmap();
const cmd = require('./json/resposta.json');
client.on("message", message => {
    if (message.author.bot) return false;


});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'stats') {
        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
        ];

        return Promise.all(promises)
            .then(results => {
                const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
                return message.channel.send(`Server count: ${totalGuilds}\nMember count: ${totalMembers}`);
            })
            .catch(console.error);
    }
});

client.on('message', Message => {
    if ( Message.channel.type == "dm" ||  Message.guild.id != "768267522670723094" ) return;

    if ( Message.content.toLowerCase().startsWith("f!notificar") || Message.content.toLowerCase().startsWith("f!notify") ) {
        if ( !Message.member.roles.cache.has("768275121290870814") ) Message.member.roles.add("768275121290870814"), Message.channel.send("Agora você vai receber todas as minhas novidades <:meow_blush:768292358458179595>")
        else Message.member.roles.remove("768275121290870814"), Message.channel.send("Agora você não vai mais receber minhas novidades <:sad_cat_thumbs_up:768291053765525525>")
    }
})

client.on('message', msg => {
    if (msg.author.bot) {
        return;
    }
    responseObject = cmd;
    if(responseObject[msg.content]){
        msg.channel.send(responseObject[msg.content]);
    }
});

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);

        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
    });
});
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`[EVENT] - Loaded Successfully ${eventName}`);
        client.on(eventName, event.bind(null, client));
    });
});
client.on("message", (Message) => {
    if ( Message.channel.id != "779760356889198613" ) return;
    if ( Message.content.startsWith(">") ) return;

    Message.react("❤")
})
client.on("message", (Message) => {
    if ( Message.channel.id != "784227380108722236" ) return;
    if ( Message.content.startsWith(">") ) return;

    Message.react("<:sad_cat_thumbs_up:768291053765525525>")
})
client.on("message", (Message) => {
    if ( Message.channel.id != "784229832740700160" ) return;
    if ( Message.content.startsWith(">") ) return;

    Message.react("<:meowbughunter:776249240463736834>")
    Message.react("🤔")
})
client.on("message", async message => {

    if (message.author.bot) return;
    if (message.channel.dm === "dm") return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (!message.content.startsWith(prefix)) return;
    let commandfile = client.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(client, message, args);
});
client.login(token);