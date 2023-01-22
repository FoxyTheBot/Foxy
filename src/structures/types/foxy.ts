import { Bot, Collection } from 'discordeno';
import { Command } from './Command';

export interface FoxyClient extends Bot {
    ownerId: BigInt;
    clientId: BigInt;   
    commands: Collection<string, Command>;
} 