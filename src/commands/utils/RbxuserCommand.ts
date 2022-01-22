import Command from '../../structures/BaseCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import * as noblox from 'noblox.js';

export default class RbxuserCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roblox',
            description: 'View a Roblox user\'s profile',
            category: 'utils',
            dev: false,
            data: new SlashCommandBuilder()
                .setName('roblox')
                .setDescription('[🛠 Utils] View a Roblox user\'s profile')
                .addSubcommand(command => command.setName("user").setDescription("[🛠 Utils] Search a user on Roblox").addStringOption(option => option.setName("user").setRequired(true).setDescription("O nome do usuário")))
        });
    }

    async execute(interaction, t) {
        const string = interaction.options.getString("user");

        noblox.getIdFromUsername(string).then(async (id: any) => {
            if (id) {
                noblox.getPlayerInfo(parseInt(id)).then(async (info: any) => {
                    const date = new Date(info.joinDate);
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel(t('commands:roblox.button'))
                                .setStyle("LINK")
                                .setURL(`https://www.roblox.com/users/${id}/profile`)
                                .setEmoji("<:robloxlogo:804814541631914035>")
                        );

                    const embed = new MessageEmbed()
                        .setTitle(info.username)
                        .setThumbnail(`https://www.roblox.com/bust-thumbnail/image?userId=${id}&width=420&height=420&format=png`)
                        .addFields(
                            { name: "<:robloxlogo:804814541631914035> Username", value: `\`${info.username}\``, inline: true },
                            { name: ":computer: User ID", value: id.toString() || t('commands:roblox.undefined'), inline: true },
                            { name: `:blue_book: ${t('commands:roblox.aboutme')}`, value: info.blurb || t('commands:roblox.noAboutme'), inline: true },
                            { name: ":star: Status", value: info.status || t('commands:roblox.noStatus'), inline: true },
                            { name: `:calendar: ${t('commands:roblox.register')}`, value: date.toLocaleString(t.lng, { timeZone: 'America/Sao_Paulo' }) || t('commands:roblox.undefined'), inline: true }
                        )
                    await interaction.editReply({ embeds: [embed], components: [row] });
                });
            }
        }).catch(err => {
            interaction.editReply(t('commands:roblox.error'));
        })
    }
}