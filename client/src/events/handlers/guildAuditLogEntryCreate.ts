import { bot } from "../../";

const setGuildAuditLogEntryCreateEvent = () => {
    bot.events.auditLogEntryCreate = async (_, entry) => {
        /* Supress errors relationed with this event */
        
        return true;
    }
};

export { setGuildAuditLogEntryCreateEvent };