export interface FoxyImage {
    url: string;
}

/* Valorant User */

export interface ValorantUser {
    status: number;
    data: {
        puuid: string;
        region: string;
        account_level: number;
        name: string;
        tag: string;
        card: {
            small: string;
            wide: string;
            large: string;
            id: string;
        },
        last_update: number;
    }
}