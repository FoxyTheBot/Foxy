const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Convide o bot para o seu servidor!'),

    execute(client, interaction) {
        interaction.reply('https://discord.com/oauth2/authorize?client_id=737044809650274325&scope=bot+applications.commands&permissions=269872255');
    }
}