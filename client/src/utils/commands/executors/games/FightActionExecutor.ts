import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";

const FightActionExecutor = async (context: ComponentInteractionContext) => {
    const [targetId, targetUsername, action] = context.sentData;

    // TO DO: Add fight button actions
    
    switch (action) {
        case "attack": {
            break;
        }

        case "act": {
            break;
        }

        case "item": {
            break;
        }

        case "mercy": {
            break;
        }
    }
}

export default FightActionExecutor;