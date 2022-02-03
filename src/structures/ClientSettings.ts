import { BitFieldResolvable, ClientOptions, IntentsString } from "discord.js";
import FoxyClient from '../FoxyClient';

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

export interface FoxyOptions extends ClientOptions {
    intents: BitFieldResolvable<IntentsString, number>;
    shards?: number | number[] | 'auto';
    shardCount?: number;
}