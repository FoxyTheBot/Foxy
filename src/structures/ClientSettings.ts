export interface FoxySettings {
    ownerId: string;
    clientId: string;
    prefix: string;
    token: string;
    mongouri: string;
    dblauth: string;

    // Webhooks
    guilds: string
}

export interface FoxyOptions {
    commands: string;
    events: string;
    locales: string;
    token: string;
}

export default function convertDate(date) {
    const dateToString = date.toString().substring(0, 10);
    return `<t:${dateToString}> (<t:${dateToString}:R>)`;
}