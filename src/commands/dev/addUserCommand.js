const user = require('../../structures/databaseConnection');

module.exports = {
    name: 'adduser',
    aliases: ['au'],
    onlyDevs: true,
    async run(client, message, args) {
        const id = args[0];

        if (!id) return message.reply('Insira uma ID');

        const userData = await user.findOne({ user: id });
        if (!userData) {
            new user({
                user: id,
                coins: 0,
                lastDaily: null,
                reps: 0,
                lastRep: null,
                backgrounds: ['default.png'],
                background: 'default.png',
                aboutme: null,
                marry: null,
                premium: false,
            }).save().catch(err => console.log(err));
            message.foxyReply("Usuário adicionado ao banco de dados!")
        } else {
            message.foxyReply('Usuário já existe!');
        }
    }
}