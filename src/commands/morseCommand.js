const Discord = require("discord.js");

module.exports = { 
	name: "morse",
	aliases: ['morse'],
	cooldown: 3,
guildOnly: false,
	async execute(client, message, args) {
	
 
    let alpha = " ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(""),
				morse = "/,.-,-...,-.-.,-..,.,..-.,--.,....,..,.---,-.-,.-..,--,-.,---,.--.,--.-,.-.,...,-,..-,...-,.--,-..-,-.--,--..,.----,..---,...--,....-,.....,-....,--...,---..,----.,-----".split(","),
				text = args.join(" ").toUpperCase();
	               if (!text) return message.channel.send('Insira um texto ou um código para ser decodificado ou codificado') // but you can change the answer :)
	
			while (text.includes("Ä") || text.includes("Ö") || text.includes("Ü")) {
				text = text.replace("Ä","AE").replace("Ö","OE").replace("Ü","UE");
			}
			if (text.startsWith(".") || text.startsWith("-")) {
				text = text.split(" ");
				let length = text.length;
				for (i = 0; i < length; i++) {
					text[i] = alpha[morse.indexOf(text[i])];
				}
				text = text.join("");
			} else {
				text = text.split("");
				let length = text.length;
				for (i = 0; i < length; i++) {
					text [i] = morse[alpha.indexOf(text[i])];
				}
				text = text.join(" ");
			}
			let morsereader = new Discord.MessageEmbed()
			.setColor('BLUE')
			.setTitle('Tradutor de Código Morse')
			.setDescription(":point_right::radio: Resultado foi: \n ```"+text+"```")
			await message.channel.send(morsereader)
		}
		
			}