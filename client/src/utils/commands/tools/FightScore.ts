import { Player } from "../../../structures/types/fight";

function updateFightScore(commandAuthor: Player, target: Player) {
    var userStats = {
        id: commandAuthor.id,
        username: commandAuthor.username,
        health: commandAuthor.health,
        isYourTurn: commandAuthor.isYourTurn
    }

    var targetStats = {
        id: target.id,
        username: target.username,
        health: target.health,
        isYourTurn: target.isYourTurn
    }

    return { userStats, targetStats }
}

export default updateFightScore;