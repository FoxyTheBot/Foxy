export interface Badge {
    id: string;
    name: string;
    asset: string;
    description: string;
    exclusive: boolean;
    priority: number;
    isFromGuild: string;
}

export interface Background {
    id: string,
    name: string,
    cakes: number,
    filename: string,
    description: string,
    author: string,
    inactive: boolean,
}

export interface Decoration {
    id: string,
    name: string,
    cakes: number,
    filename: string,
    description: string,
    inactive: boolean,
    author: string,
    isMask: boolean,
}