import { BigString } from "discordeno/types";
import { User } from "../types/DiscordUser";
import axios, { AxiosInstance } from "axios";
import { FoxyImage, ValorantUser } from "../../foxy/parent/src/structures/types/APIResponses";
import { logger } from "./logger";
import { MatchesResponse } from "../../foxy/parent/src/structures/types/valorant/MatchInfo";
import { ApiResponse } from '../../foxy/parent/src/structures/types/valorant/PlayerData';
import { createRestManager } from "discordeno/rest";
import { createBotConstants } from "discordeno";
import { constants } from "./constants";
require('dotenv').config({ path: "../../.env" });
export class FoxyRestManager {
    public api: AxiosInstance;
    public valorantAPI: AxiosInstance;
    public valorantAutoRoleAPI: AxiosInstance;
    
    public rest = createRestManager({
        token: process.env.DISCORD_TOKEN,
        version: 10
    });
    public constants = createBotConstants();
    public foxyConstants = constants;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.SERVER_URL,
            headers: {
                "Authorization": process.env.FOXY_API_TOKEN
            }
        });

        this.valorantAutoRoleAPI = axios.create({
            baseURL: process.env.VALORANT_AUTOROLE_URL
        });

        this.valorantAPI = axios.create({
            baseURL: 'https://api.henrikdev.xyz',
            headers: {
                "Authorization": process.env.VALORANT_TOKEN
            }
        });
    }

    /* Requests to Discord API */

    async getUserDisplayName(userId: BigString) {
        const user = await this.rest.runMethod(this.rest, "GET", this.constants.routes.USER(userId));
        return user.global_name || user.username;
    }

    async getUser(userId: string): Promise<User> {
        return await this.rest.runMethod(this.rest, "GET", this.constants.routes.USER(userId));
    }

    async addRole(userId: string, roleId: string, guildId: string) {
        return await this.rest.runMethod(this.rest, "PUT", this.constants.routes.GUILD_MEMBER_ROLE(guildId, userId, roleId));
    }

    async removeRole(userId: string, roleId: string, guildId: string) {
        return await this.rest.runMethod(this.rest, "DELETE", this.constants.routes.GUILD_MEMBER_ROLE(guildId, userId, roleId));
    }

    async getUserAsMember(userId: string, guildId: string) {
        return await this.rest.runMethod(this.rest, "GET", this.constants.routes.GUILD_MEMBER(guildId, userId));
    }

    async sendMessageToAChannelAsJSON(channelId: string, content: string) {
        let jsonContent;

        try {
            jsonContent = JSON.parse(content);
        } catch (error) {
            console.warn("Failed to parse JSON, sending as string:", error);
            jsonContent = { content };
        }

        const filteredContent: any = {
            content: jsonContent.content || null,
            embeds: jsonContent.embeds || [],
            components: this.normalizeComponents(jsonContent.components || []),
        };

        try {
            return await this.rest.runMethod(
                this.rest,
                "POST",
                this.constants.routes.CHANNEL_MESSAGES(channelId),
                filteredContent
            );
        } catch (error) {
            console.error("Failed to send message:", error);
            throw new Error("Message sending failed: " + error);
        }
    }

    private normalizeComponents(components: any[]): any[] {
        return components.map(componentGroup => ({
            type: 1,
            components: componentGroup.components.map((component: any) => {
                if (component.type === 2 && component.style !== 5) {
                    console.warn(`Button '${component.label}' has incorrect style. Setting to 'style: 5' (link).`);
                    return { ...component, style: 5 };
                }
                return component;
            })
        }));
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

    async updateValorantRole(userId: string, guildId: string) {
        try {
            const request = await this.valorantAutoRoleAPI.get(this.foxyConstants.VALORANT_AUTOROLE_UPDATE(guildId, userId));
            return request.data.status;
        } catch (error) {
            logger.error('Error updating Valorant role:', error);
            return null;
        }
    }
}