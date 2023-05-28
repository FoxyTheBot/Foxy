import { setReadyEvent } from "./handlers/ready";
import { setInteractionCreateEvent } from "./handlers/interactionCreate";
import { setGuildCreateEvent } from "./handlers/guildCreate";
import { setGuildDeleteEvent } from "./handlers/guildDelete";
import { setMessageCreateEvent } from "./handlers/messageCreate";
import { setMessageUpdateEvent } from "./handlers/messageUpdate";
import { setGuildMemberAddEvent } from "./handlers/guildMemberAdd";
import { setGuildMemberRemove } from "./handlers/guildMemberRemove";

const setupEventsHandler = (): void => {
    setReadyEvent();
    setInteractionCreateEvent();
    setGuildCreateEvent();
    setGuildDeleteEvent();
    setMessageCreateEvent();
    setMessageUpdateEvent();
    setGuildMemberAddEvent();
    setGuildMemberRemove();
}

export { setupEventsHandler }