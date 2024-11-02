interface ImageLinks {
    small: string;
    large: string;
    triangle_down: string;
    triangle_up: string;
}

interface CurrentData {
    currenttier: number;
    currenttierpatched: string;
    images: ImageLinks;
    ranking_in_tier: number;
    mmr_change_to_last_game: number;
    elo: number;
    old: boolean;
}

interface HighestRank {
    old: boolean;
    tier: number;
    patched_tier: string;
    season: string;
}

interface ActRankWins {
    patched_tier: string;
    tier: number;
}

interface SeasonData {
    error: boolean;
    wins: number;
    number_of_games: number;
    final_rank: number;
    final_rank_patched: string;
    act_rank_wins: ActRankWins[];
    old: boolean;
}

interface BySeason {
    [key: string]: SeasonData;
}

interface PlayerData {
    name: string;
    tag: string;
    current_data: CurrentData;
    highest_rank: HighestRank;
    by_season: BySeason;
}

export interface ApiResponse {
    status: number;
    data: PlayerData;
}
