const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = class RankCommand extends Command {
    constructor(client) {
        super(client, {
            name: "rank",
            description: "Rank global de FoxCoins",
            category: "economy",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("rank")
                .setDescription("[💵 Economy] Rank global de FoxCoins")
                .addNumberOption(option => option.setName("page").setDescription("Página do Rank").setRequired(false))

        });

    }
    async execute(interaction) {
        let data = await this.client.database.getAllUsers(),
            embed = new MessageEmbed();
        data = data.sort((a, b) => b.balance - a.balance);
        let position = parseInt(data.map(m => m._id).indexOf(interaction.user.id)) + 1,
            currentPage = parseInt(!interaction.options.getNumber('page') ? 0 : interaction.options.getNumber('page') - 1);

        if (currentPage < 0 || currentPage > 5) return interaction.editReply({ content: 'vai com calma seu otário, o rank só vai até o numero 5', ephemeral: true });

        embed.setTitle('FoxCoins Global Rank')
            .setColor('BLURPLE')
            .setDescription(`Você está na ${`${position}º` || 'Sad™'} posição no Rank global!`)
        for (let i in data) {
            i = Number(i) + (currentPage * 5);
            if ((Number(i) - currentPage * 5) > 4) break;
            let user = await (this.client.users.cache.has(data[i]._id) ? this.client.users.cache.get(data[i]._id) : this.client.users.fetch(data[i]._id));
            embed.addField(`\`${parseInt(data.map(m => m._id).indexOf(data[i]._id)) + 1}º -\` ${user.tag}`, `\`${parseInt(data[i].balance)}\` Foxcoins`);
        }
        interaction.editReply({ embeds: [embed] }).catch(() => { });
    }
}