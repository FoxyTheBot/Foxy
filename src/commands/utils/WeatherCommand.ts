import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import * as weather from "weather-js";

export default class WeatherCommand extends Command {
    constructor(client) {
        super(client, {
            name: "weather",
            description: "Get weather information",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("weather")
                .setDescription("[🛠 Utils] Get weather information")
                .addStringOption(option => option.setName("region").setRequired(true).setDescription("The region to get the weather"))
        });
    }

    async execute(interaction, t) {
        const region = interaction.options.getString("region");
        weather.find({ search: region, degreeType: 'C' }, async (err, result) => {
            if (err) return interaction.reply(t('commands:weather.error'));

            if (!result) return interaction.reply(t('commands:weather.notFound'));

            const weatherEmbed = new MessageEmbed()
                .setDescription(`**${result.current.skytext}**`)
                .setThumbnail('https://i.pinimg.com/originals/77/0b/80/770b805d5c99c7931366c2e84e88f251.png')
                .addField(t('commands:weather.timezone'), `UTC${result.location.timezone}`, true)
                .addField(t('commands:weather.type'), 'Celsius', true)
                .addField(t('commands:weather.temp'), `${result.current.temperature}°`, true)
                .addField(t('commands:weather.wind'), result.current.winddisplay, true)
                .addField(t('commands:weather.feelslike'), `${result.current.feelslike}°`, true)
                .addField(t('commands:weather.humidity'), `${result.current.humidity}%`, true);

            await interaction.editReply({ embeds: [weatherEmbed] });
        });
    }
}