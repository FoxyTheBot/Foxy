import { BigString } from "discordeno/types";
import { FoxyClient } from "../structures/types/foxy";
import { User } from "../structures/types/user";
import fetch from "node-fetch";
import config from '../../config.json';

export class FoxyRestManager {
    public bot: FoxyClient;
    constructor(bot) {
        this.bot = bot;
    }

    async sendDirectMessage(userId: BigString, data: Object) {
        const DMChannel = await this.bot.rest.runMethod(this.bot.rest, "POST", this.bot.constants.routes.USER_DM(), {
            recipient_id: userId
        });

        this.bot.helpers.sendMessage(DMChannel.id, data);
    }

    async getUserDisplayName(userId: BigString) {
        const user = await this.bot.rest.runMethod(this.bot.rest, "GET", this.bot.constants.routes.USER(userId));
        return user.global_name || user.username;
    }

    async getBotGuilds(): Promise<Array<Object>> {
        return await this.bot.rest.runMethod(this.bot.rest, "GET", this.bot.constants.routes.USER_GUILDS());
    }

    async getUser(userId: string): Promise<User> {
        return await this.bot.rest.runMethod(this.bot.rest, "GET", this.bot.constants.routes.USER(userId));
    }

    /* Valorant API */

    async getValPlayer(username: string, tag: string) {
        return fetch(`https://api.henrikdev.xyz/valorant/v1/account/${username}/${tag}`, {
            headers: {
                "Authentication": config.valorantAPI
            }
        }).then(res => res.json());
    }

    async getValMatchHistory(username: string, tag: string, mode: string, map: string) {
        const userInfo = await this.getValPlayer(username, tag).then(res => res.data);
        if (!userInfo) return null;
        const puuid = await userInfo.puuid;
        let url = `https://api.henrikdev.xyz/valorant/v1/by-puuid/lifetime/matches/br/${puuid}?size=12`;

        if (mode) url += `&mode=${mode}`;

        if (map) url += `&map=${map}`;

        return fetch(url, {
            headers: {
                "Authentication": config.valorantAPI
            }
        }).then(res => res.json());
    }

    async getMMR(puuid: string) {
        return fetch(`https://api.henrikdev.xyz/valorant/v2/by-puuid/mmr/na/${puuid}`, {
            headers: {
                "Authentication": config.valorantAPI
            }
        }).then(res => res.json());
    }

    async getValMatch(matchId: string) {
        return fetch(`https://api.henrikdev.xyz/valorant/v2/match/${matchId}`, {
            headers: {
                "Authentication": config.valorantAPI
            }
        }).then(res => res.json()); 
    }
}