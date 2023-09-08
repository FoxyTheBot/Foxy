import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createActionRow, createButton, createCustomId } from "../../../discord/Component";
import { MessageFlags } from "../../../discord/Message";
import { ButtonStyles } from "discordeno/types";

const NavigatorExecutor = async (context: ComponentInteractionContext) => {
    const [page, transactions] = context.sentData;
    const maxPerPage = 10;
    
    switch (page) {
        case 'previous': {
                        
        }
    }
};

export default NavigatorExecutor;