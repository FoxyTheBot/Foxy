import { BigString } from "discordeno/types";
import { FoxyClient } from "../structures/types/FoxyClient";
import { User } from "../structures/types/DiscordUser";
import config from '../../config.json';
import axios, { AxiosInstance } from "axios";
import { FoxyImage, ValorantUser } from "../structures/types/APIResponses";
import { logger } from "./logger";

export class FoxyRestManager {
    public bot: FoxyClient;
    public api: AxiosInstance;
    public valorantAPI: AxiosInstance;

    constructor(bot) {
        this.bot = bot;
        this.api = axios.create({
            baseURL: config.serverURL,
            headers: {
                "Authorization": config.foxyAPIToken
            }
        });
        this.valorantAPI = axios.create({
            baseURL: 'https://api.henrikdev.xyz',
            headers: {
                "Authorization": config.valorantAPI
            }
        });
    }

    /* Requests to Discord API */

    async getUserDisplayName(userId: BigString) {
        const user = await this.bot.rest.runMethod(this.bot.rest, "GET", this.bot.constants.routes.USER(userId));
        return user.global_name || user.username;
    }

    async getUser(userId: string): Promise<User> {
        return await this.bot.rest.runMethod(this.bot.rest, "GET", this.bot.constants.routes.USER(userId));
    }


    /* Valorant API */

    async getValMatchHistoryByUUID(puuid: string, mode?: string, map?: string): Promise<MatchesResponse> {
        let url = `/valorant/v1/by-puuid/stored-matches/na/${puuid}?size=12`;
        if (mode) url += `&mode=${mode}`;
        if (map) url += `&map=${map}`;

        try {
            const response = await this.valorantAPI.get(url);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error.response?.data;
                if (error.response?.status === 404 && err?.errors?.[0]?.message === 'Route not found') {
                    return null;
                }
            }
            logger.error('Error fetching match history:', error);
            return null;
        }
    }

    async getAllValMatchHistoryByUUID(puuid: string, mode?: string, platform?: string): Promise<MatchesResponse> {
        let url = `/valorant/v1/by-puuid/stored-matches/na/${puuid}`;
        if (mode) url += `?mode=${mode}`;
        try {
            const response = await this.valorantAPI.get(url);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error.response?.data;
                if (error.response?.status === 404 && err?.errors?.[0]?.message === 'Route not found') {
                    return null;
                }
            }
            logger.error('Error fetching match history:', error);
            return null;
        }
    }

    async getValPlayerByUUID(puuid: string): Promise<ValorantUser> {
        try {
            const response = await this.valorantAPI.get(`valorant/v2/by-puuid/account/${puuid}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error.response?.data;
                if (error.response?.status === 404 && err?.errors?.[0]?.message === 'Route not found') {
                    return null;
                }
            }
            logger.error('Error fetching player data:', error);
            return null;
        }
    }

    async getMMR(puuid: string): Promise<ApiResponse> {
        try {
            const response = await this.valorantAPI.get(`/valorant/v2/by-puuid/mmr/na/${puuid}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error.response?.data;
                if (error.response?.status === 404 && err?.errors?.[0]?.message === 'Route not found') {
                    return null;
                }
            }
            logger.error('Error fetching MMR:', error);
            return null;
        }
    }

    async getValMatch(matchId: string) {
        try {
            const response = await this.valorantAPI.get(`valorant/v2/match/${matchId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error.response?.data;
                if (error.response?.status === 404 && err?.errors?.[0]?.message === 'Route not found') {
                    logger.error('Match not found:', matchId);
                    return null;
                }
            }
            logger.error('Error fetching match data:', error);
            return null;
        }
    }

    /* Foxy API */

    async getImage(commandCategory: string, commandName: string): Promise<FoxyImage> {
        return (await this.api.get(`${commandCategory}/${commandName}`)).data;
    }
}