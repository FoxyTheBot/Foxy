export interface MatchHistory {
    data: MatchHistoryData[];
}

export interface MatchHistoryData {
    metadata: MatchMetadata;
    players: Player[];
    teams: Team[]
}

export interface Team {
    team_id: string
    rounds: {
        won: number,
        lost: number
    },
    won: boolean
}
export interface MatchMetadata {
    match_id: string
    map: {
        id: string
        name: string
    }
    started_at: string
    is_completed: boolean
    queue: {
        id: string,
        name: string
    }
    season: {
        id: string
        short: string
    }

    cluster: string
}

export interface Player {
    puuid: string
    name: string
    tag: string
    team_id: string
    agent: {
        id: string,
        name: string
    }
    stats: {
        score: number
        kills: number
        deaths: number
        assists: number
        headshots: number
        bodyshots: number
        legshots: number
        damage: {
            dealt: number
            received: number
        }
    }

    ability_casts: {
        grenade: number
        ability1: number
        ability2: number
        ultimate: number
    }
    
    tier: {
        name: string
    }

    economy: {
        spent: {
            overall: number
            average: number
        }

        loadout_value: {
            overall: number
            average: number
        }
    }
}