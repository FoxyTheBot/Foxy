import FoxyClient from "../../FoxyClient";

export default class InteractionManager {
    public client: FoxyClient;

    constructor(client) {
        this.client = client;
    }

    public async checkUser(interaction: any, i, type, user?) {
        switch (type) {
            case 1: { // Use in interactions where the author of the command has to press the button
                if (interaction.user.id === i.user.id) {
                    return true;
                } else if (interaction.user.id !== i.user.id) {
                    return null;
                }
            }

            case 2: { // Use in interactions where the mentioned user has to press the button
                if (interaction.user.id !== user.id) {
                    if (interaction.user.id === i.user.id || i.user.id !== user.id) {
                        return null;
                    } else if (interaction.user.id !== i.user.id) {
                        return true;
                    }
                } else {
                    return true;
                }
            }

            default: {
                throw Error("You must select between 1 or 2!")
            }
        }
    }
}