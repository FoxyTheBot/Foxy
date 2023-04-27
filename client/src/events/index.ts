import { setReadyEvent } from "./handlers/ready";
import { setInteractionCreateEvent } from "./handlers/interactionCreate";
import { setGuildCreateEvent } from "./handlers/guildCreate";
import { setGuildDeleteEvent } from "./handlers/guildDelete";

const setupEventsHandler = (): void => {
    setReadyEvent();
    setInteractionCreateEvent();
    setGuildCreateEvent();
    setGuildDeleteEvent();
}

export { setupEventsHandler }   