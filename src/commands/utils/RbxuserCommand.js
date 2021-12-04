const Command = require("../../structures/Command.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const noblox = require("noblox.js");

module.exports = class RbxuserCommand extends Command {
    constructor(client) {
        super(client, {
            name: "roblox",
            description: "Search for a user on Roblox",
            category: "utils",
            data: new SlashCommandBuilder()
                .setName("roblox")
                .setDescription("Procure algumas coisas no Roblox")
                .addSubcommand(command => command.setName("user").setDescription("Procure um usuário no Roblox").addStringOption(option => option.setName("user").setRequired(true).setDescription("O nome do usuário")))
        })
    }

    async execute(interaction) {
        const string = interaction.options.getString("user");

        noblox.getIdFromUsername(string).then(id => {
            if (id) {
                noblox.getPlayerInfo(parseInt(id)).then(async info => {
                    const date = new Date(info.joinDate);
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel("Ver perfil")
                                .setStyle("LINK")
                                .setURL(`https://www.roblox.com/users/${id}/profile`)
                                .setEmoji("<:robloxlogo:804814541631914035>")
                        );

                    const embed = new MessageEmbed()
                        .setTitle(info.username)
                        .setColor('e2231a')
                        .setThumbnail(`https://www.roblox.com/bust-thumbnail/image?userId=${id}&width=420&height=420&format=png`)
                        .addFields(
                            { name: "<:robloxlogo:804814541631914035> Username", value: `\`${info.username}\``, inline: true },
                            { name: ":computer: User ID", value: id.toString() || "Sem solução", inline: true },
                            { name: ":blue_book: Sobre mim", value: info.blurb || 'Sobre mim não definido', inline: true },
                            { name: ":star: Status", value: info.status || 'Status não definido', inline: true },
                            { name: ':calendar: Data de registro', value: date.toString() || 'Sem solução', inline: true }
                        )
                    interaction.reply({ embeds: [embed], components: [row] });
                })
            }
        }).catch(err => {
            interaction.reply("<:robloxlogo:804814541631914035> | Eu não consegui encontrar esse usuário, talvez ele não existe :/");
        })
    }
}