import { bot } from "../../index";
import InviteBlockerModule from "../../utils/modules/InviteBlockerModule";

const setMessageUpdateEvent = (): void => {
    bot.events.messageUpdate = async (_, message) => {
        const inviteRegex = /discord(?:app\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/i;
        const InviteBlocker = new InviteBlockerModule(bot);

        if (inviteRegex.test(message.content)) {
            InviteBlocker.checkUpdatedMessage(message);
        }
    }
}

export { setMessageUpdateEvent }