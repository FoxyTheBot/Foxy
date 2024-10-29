import { BigString } from "discordeno/types";
import { User } from "../types/DiscordUser";
import axios, { AxiosInstance } from "axios";
import { FoxyImage } from "../../foxy/parent/src/structures/types/APIResponses";
import { logger } from "./logger";
import { createRestManager } from "discordeno/rest";
import { createBotConstants } from "discordeno";
require('dotenv').config({ path: "../../.env" });
export class FoxyRestManager {
    public api: AxiosInstance;
    public artistry: AxiosInstance;

    public rest = createRestManager({
        token: process.env.DISCORD_TOKEN,
        version: 10
    });
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
        return (await this.api.get(`${commandCategory}/${commandName}`));
    }

    async getArtistryImage(
        endpoint: string,
        payload: Record<string, any>,
    ): Promise<Buffer | any> {
        const response = await this.artistry.post(endpoint, payload, { responseType: "arraybuffer" });
        return response.data;
    }

}