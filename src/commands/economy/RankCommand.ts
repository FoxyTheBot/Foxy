import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export default class RankCommand extends Command {
    constructor(client) {
        super(client, {
            name: "rank",
            description: "Get the FoxCoins rank",
            category: "economy",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("rank")
                .setDescription("[💰 Economy] Get the FoxCoins rank")
                .addNumberOption(option => option.setName("page").setDescription("Rank page").setRequired(false))
        });
    }

    async execute(interaction, t) {
        let data = await this.client.database.getAllUsers(),
            embed = new MessageEmbed();
        data = data.sort((a, b) => b.balance - a.balance);
        let position = parseInt(data.map(m => m._id).indexOf(interaction.user.id)) + 1,
            currentPage = Number(!interaction.options.getNumber('page') ? 0 : interaction.options.getNumber('page') - 1);

        if (currentPage < 0 || currentPage > 5) return interaction.editReply({ content: t('commands:rank.wrongPage'), ephemeral: true });

        embed.setTitle(`${this.client.emotes.daily} | FoxCoins Global Rank`)
            .setColor('BLURPLE')
            .setDescription(`${this.client.emotes.sunglass} | ${t('commands:rank.youAreIn')} ${`${position}º` || 'Sad™'} ${t('commands:rank.position')}`)
        for (let i in data) {
            i = i + (currentPage * 5);
            if ((Number(i) - currentPage * 5) > 4) break;
            let user = await (this.client.users.cache.has(data[i]._id) ? this.client.users.cache.get(data[i]._id) : this.client.users.fetch(data[i]._id));
            embed.addField(`${parseInt(data.map(m => m._id).indexOf(data[i]._id)) + 1}º - \`${user.tag}\``, `**${parseInt(data[i].balance)}** FoxCoins`);
        }
        interaction.editReply({ embeds: [embed] }).catch(() => { });
    }
}