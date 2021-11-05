module.exports = {
    name: 'adduser',
    aliases: ['au'],
    onlyDevs: true,
    async run(client, message, args) {
        if (!id) return message.reply('Insira uma ID');

        const userData = client.users.fetch(args[0])

        if (!userData) message.reply("Você só pode adicionar usuarios que eu conheço no meu DB");

        const userDocument = await client.db.getDocument(userData.id);
        if (!userDocument) {
            new user({
                _id: userData.id,
                userCreationTimestamp: Date.now(),
                premium: false,
                isBanned: false,
                banData: null,
                aboutme: null,
                balance: 0,
                lastDaily: null,
                marriedWith: null,
                repCount: 0,
                lastRep: null,
                background: "default.png",
                backgrounds: ["default.png"]
            }).save().catch(err => console.log(err));
            message.reply("Usuário adicionado ao banco de dados!")
        } else {
            message.reply('Usuário já existe!');
        }
    }
}