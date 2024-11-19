import { BigString } from "discordeno/types";
import { User } from "../types/DiscordUser";
import axios, { AxiosInstance } from "axios";
import { FoxyImage } from "../../foxy/parent/src/structures/types/APIResponses";
import { logger } from "./logger";
import { createBotConstants, Guild, Member } from "discordeno";
import { REST } from "@discordjs/rest";
import { Routes } from 'discord-api-types/v10';
require('dotenv').config({ path: "../../.env" });

export class FoxyRestManager {
    public api: AxiosInstance;
    public artistry: AxiosInstance;

    public rest = new REST({ version: "10" })
        .setToken(process.env.DISCORD_TOKEN || "");

    public constants = createBotConstants();

    constructor() {
        this.api = axios.create({
            baseURL: process.env.SERVER_URL,
            headers: {
                "Authorization": process.env.FOXY_API_TOKEN
            }
        });

        this.artistry = axios.create({
            baseURL: process.env.ARTISTRY_API_URL,
            headers: {
                "Authorization": process.env.ARTISTRY_API_TOKEN
            }
        });
    }

    /* Requests to Discord API */

    async getUserDisplayName(userId: BigString) {
        try {
            const user = await this.rest.get(Routes.user(userId.toString())) as User;
            return user.global_name || user.username;
        } catch (error) {
            logger.error("Failed to retrieve user display name:", error);
            throw new Error("Failed to retrieve user display name.");
        }
    }

    async getUser(userId: string): Promise<User | null> {
        try {
            const user = await this.rest.get(Routes.user(userId));
            if (typeof user !== "object") return null;

            return user as User;
        } catch (error) {
            logger.error("Failed to retrieve user:", error);
            throw new Error("Failed to retrieve user.");
        }
    }

    async getGuild(guildId: string): Promise<Guild | null> { 
        try {
            const response = await this.rest.get(Routes.guild(guildId));
            if (typeof response !== "object") return null;

            return response as Guild;
        } catch (error) {
            logger.error("Failed to retrieve guild:", error);
            throw new Error("Failed to retrieve guild.");
        }
    }

    async getUserAsMember(userId: string, guildId: string): Promise<Member> {
        try {
            const response = await this.rest.get(Routes.guildMember(guildId, userId));
            if (typeof response !== "object") return null;
            
            return response as Member;
        } catch (error) {
            logger.error("Failed to retrieve user as member:", error);
            throw new Error("Failed to retrieve user as member.");
        }
    }

    async sendMessageToAChannelAsJSON(channelId: string, content: string) {
        let jsonContent;
        try {
            jsonContent = JSON.parse(content);
        } catch (error) {
            logger.warn("Failed to parse JSON, sending as string:", error);
            jsonContent = { content };
        }
        const filteredContent: any = {
            content: jsonContent.content || null,
            embeds: jsonContent.embeds || [],
            components: this.normalizeComponents(jsonContent.components || []),
        }

        try {
            const response = await this.rest.post(Routes.channelMessages(channelId), { 
                headers: {
                    "Content-Type": "application/json",
                },
                body: filteredContent,
             });
            return response;
        } catch (error) {
            logger.error("Failed to send message:", error);
            throw new Error("Message sending failed.");
        }
    }

    private normalizeComponents(components: any[]): any[] {
        return components.map(componentGroup => ({
            type: 1,
            components: componentGroup.components.map((component: any) => {
                if (component.type !== 2) {
                    logger.warn(`Component '${component.label}' is not a button. Removing.`);
                    return null;
                }
                if (component.type === 2 && component.style !== 5) {
                    logger.warn(`Button '${component.label}' has incorrect style. Setting to 'style: 5' (link).`);
                    return { ...component, style: 5 };
                }
                return component;
            })
        }));
    }

    /* Foxy API */

    async getImage(commandCategory: string, commandName: string): Promise<FoxyImage> {
        try {
            const response = await this.api.get(`${commandCategory}/${commandName}`);
            return response.data;
        } catch (error) {
            logger.error("Failed to retrieve image:", error);
            throw new Error("Failed to retrieve image.");
        }
    }

    async getArtistryImage(endpoint: string, payload: Record<string, any>): Promise<Buffer | any> {
        try {
            const response = await this.artistry.post(endpoint, payload, { responseType: "arraybuffer" });
            if (!Buffer.isBuffer(response.data)) return null;
            return response.data;
        } catch (error) {
            logger.error("Failed to retrieve artistry image:", error);
            throw new Error("Failed to retrieve artistry image.");
        }
    }
}