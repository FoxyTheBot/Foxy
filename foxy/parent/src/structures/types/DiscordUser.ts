import { User } from "discordeno/transformers";

export interface ExtendedUser extends User {
    asMention: string;
}