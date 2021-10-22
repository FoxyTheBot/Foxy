const user = require('../utils/DatabaseConnection');

module.exports = async (client, interaction) => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);

    function FoxyHandler() {
        if (command.onlyDevs && !client.config.owners.includes(interaction.member.id)) {
            return interaction.reply({ content: "Esse comando é só para meu desenvolvedor, bobinho", ephemeral: true });
        }

        try {
            command.execute(client, interaction);
        } catch (err) {
            return interaction.reply({ content: `Ocorreu um erro ao executar esse comando! Erro: ${err}`, ephemeral: true });
        }
    }

    try {
        user.findOne({ user: interaction.member.id }, (err, data) => {
            if (err) return console.error(`Algo deu errado! ${err}`);
            if (data) return FoxyHandler();

            new user({
                user: interaction.member.id,
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
        });
        return FoxyHandler();
    } catch (error) {
        console.log(error);
    }
}
