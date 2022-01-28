const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const weather = require("weather-js");

module.exports = class WeatherCommand extends Command {
    constructor(client) {
        super(client, {
            name: "weather",
            description: "Mostra o clima de uma cidade.",
            category: "utils",
            data: new SlashCommandBuilder()
                .setName("weather")
                .setDescription("[🛠 Utils] Mostra o clima de uma cidade.")
                .addStringOption(option => option.setName("cidade").setRequired(true).setDescription("Cidade para consultar o clima."))
        });
    }

    async execute(interaction) {
        const city = interaction.options.getString("cidade");
        weather.find({ search: city, degreeType: 'C' }, async (error, result) => {
            if (error) return interaction.editReply("Não foi possível encontrar a cidade.");

            if (result === undefined || result.length === 0) return interaction.editReply('Localização inválida!');

            const { current } = result[0];
            const { location } = result[0];

            const weatherinfo = new MessageEmbed()
                .setDescription(`**${current.skytext}**`)
                .setAuthor(`Previsão do tempo para: ${current.observationpoint}`)
                .setThumbnail('https://i.pinimg.com/originals/77/0b/80/770b805d5c99c7931366c2e84e88f251.png')
                .setColor(0x111111)
                .addField('Fuso horário', `UTC${location.timezone}`, true)
                .addField('Tipo:', 'Celsius', true)
                .addField('Temperatura', `${current.temperature}°`, true)
                .addField('Vento', current.winddisplay, true)
                .addField('Sensação', `${current.feelslike}°`, true)
                .addField('Umidade', `${current.humidity}%`, true);

            await interaction.editReply({ embeds: [weatherinfo] });
        })
    }
}