import { bot } from "../../index";
import InviteBlockerModule from "../../utils/modules/InviteBlockerModule";

const setMessageUpdateEvent = (): void => {
    bot.events.messageUpdate = async (_, message) => {
        const InviteBlocker = new InviteBlockerModule(bot);
        InviteBlocker.checkUpdatedMessage(message);
    }
}

export { setMessageUpdateEvent }