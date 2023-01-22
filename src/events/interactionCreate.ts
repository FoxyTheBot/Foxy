import { InteractionTypes } from "discordeno/types";
module.exports = async (client, interaction) => {
    if (!interaction.data) return;

    switch (interaction.type) {
        case InteractionTypes.ApplicationCommand:
            client.commands.get(interaction.data.name!)?.execute(client, interaction);
            break;
    }
}