import { bot } from "../../../../FoxyLauncher";

export function getRank(rank: string) {
    const rankMapping: { [key: string]: any } = {
        'Unrated': { rank: 'UNRATED', emoji: bot.emotes.UNRATED },
        'Iron 1': { rank: 'I1', emoji: bot.emotes.I1 },
        'Iron 2': { rank: 'I2', emoji: bot.emotes.I2 },
        'Iron 3': { rank: 'I3', emoji: bot.emotes.I3 },
        'Bronze 1': { rank: 'B1', emoji: bot.emotes.B1 },
        'Bronze 2': { rank: 'B2', emoji: bot.emotes.B2 },
        'Bronze 3': { rank: 'B3', emoji: bot.emotes.B3 },
        'Silver 1': { rank: 'S1', emoji: bot.emotes.S1 },
        'Silver 2': { rank: 'S2', emoji: bot.emotes.S2 },
        'Silver 3': { rank: 'S3', emoji: bot.emotes.S3 },
        'Gold 1': { rank: 'G1', emoji: bot.emotes.G1 },
        'Gold 2': { rank: 'G2', emoji: bot.emotes.G2 },
        'Gold 3': { rank: 'G3', emoji: bot.emotes.G3 },
        'Platinum 1': { rank: 'P1', emoji: bot.emotes.P1 },
        'Platinum 2': { rank: 'P2', emoji: bot.emotes.P2 },
        'Platinum 3': { rank: 'P3', emoji: bot.emotes.P3 },
        'Diamond 1': { rank: 'D1', emoji: bot.emotes.D1 },
        'Diamond 2': { rank: 'D2', emoji: bot.emotes.D2 },
        'Diamond 3': { rank: 'D3', emoji: bot.emotes.D3 },
        'Ascendant 1': { rank: 'A1', emoji: bot.emotes.A1 },
        'Ascendant 2': { rank: 'A2', emoji: bot.emotes.A2 },
        'Ascendant 3': { rank: 'A3', emoji: bot.emotes.A3 },
        'Immortal 1': { rank: 'IM1', emoji: bot.emotes.IM1 },
        'Immortal 2': { rank: 'IM2', emoji: bot.emotes.IM2 },
        'Immortal 3': { rank: 'IM3', emoji: bot.emotes.IM3 },
        'Radiant': { rank: 'R', emoji: bot.emotes.R },
    };

    if (rank in rankMapping) {
        return rankMapping[rank];
    } else {
        return null;
    }
}