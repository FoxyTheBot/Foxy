export interface FoxyUser {
    _id: string,
    userCreationTimestamp: Date,
    isBanned: boolean,
    banDate: Date,
    banReason: string,
    userCakes: FoxyUserCakes,
    marryStatus: FoxyUserMarriage,
    userProfile: FoxyUserProfile,
    userPremium: FoxyUserPremium,
    userSettings: FoxyUserSettings,
    petInfo: FoxyPet,
    userTransactions: FoxyTransaction[],
    riotAccount: FoxyRiotAccount,
    premiumKeys: FoxyKey[],
    roulette: {
        availableSpins: number,
    },

    save: () => Promise<void>,
}

export interface FoxyUserCakes {
    balance: number,
    lastDaily: Date | null,
}

export interface FoxyUserMarriage {
    marriedWith: string | null,
    marriedDate: Date | null,
    cantMarry: boolean,
}

export interface FoxyUserProfile {
    decoration: string,
    decorationList: string[],
    background: string,
    backgroundList: string[],
    repCount: number,
    lastRep: Date,
    layout: string,
    aboutme: string,
}

export interface FoxyUserPremium {
    premium: boolean,
    premiumDate: Date,
    premiumType: string,
}

export interface FoxyUserSettings {
    language: string,
}

export interface FoxyPet {
    name: string,
    type: string,
    rarity: string,
    level: number,
    hungry: number,
    happy: number,
    health: number,
    lastHungry: Date,
    lastHappy: Date,
    isDead: boolean,
    isClean: boolean,
    food: string[],
}

export interface FoxyTransaction {
    to: string,
    from: string,
    quantity: number,
    date: Date,
    received: boolean,
    type: string,
}

export interface FoxyRiotAccount {
    isLinked: boolean,
    puuid: string,
    isPrivate: boolean,
    region: string,
}

export interface FoxyKey {
    key: string,
    used: boolean,
    expiresAt: Date,
    pType: number,
    guild: string,
}