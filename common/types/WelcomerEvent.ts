import { Guild, User } from "discordeno/";

export interface WelcomerEvent {
    type: string;
    data: {
        guild: Guild;
        user: User;
    };
}