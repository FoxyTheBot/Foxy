export interface FoxySettings {
    ownerId: string;
    clientId: string;
    prefix: string;
    token: string;
    mongouri: string;
    dblauth: string;

    // Webhooks
    guilds: string,
    suggestions: string,
    issues: string,
}

export interface FoxyOptions {
    commands: string;
    events: string;
    locales: string;
    token: string;
}