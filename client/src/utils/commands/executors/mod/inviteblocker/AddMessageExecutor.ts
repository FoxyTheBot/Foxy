import { TextStyles } from "discordeno/types";
import ComponentInteractionContext from "../../../../../structures/commands/ComponentInteractionContext";
import { createActionRow, createCustomId, createTextInput } from "../../../../discord/Component";
import { bot } from "../../../../..";

const AddMessageExecutor = async (context: ComponentInteractionContext) => {
    const message = createTextInput({
        customId: "TEXT",
        required: true,
        style: TextStyles.Short,
        minLength: 1,
        label: bot.locale("commands:inviteBlocker.config.modal.addMessage")
    });

    context.respondWithModal({
        customId: createCustomId(4, context.author.id, context.commandId, 'MODAL'),
        title: bot.locale("commands:inviteBlocker.config.modal.title"),
        components: [createActionRow([message])]
    });
}

export default AddMessageExecutor;