import { Player } from "../../../structures/types/fight";

function updateFightScore(commandAuthor: Player, target: Player) {
    var userStats = {
        id: commandAuthor.id,
        username: commandAuthor.username,
        health: commandAuthor.health,
        isYourTurn: commandAuthor.isYourTurn || false
    }

    var targetStats = {
        id: target.id,
        username: target.username,
        health: target.health,
        isYourTurn: target.isYourTurn || false
    }

    return { userStats, targetStats }
}

export default updateFightScore;