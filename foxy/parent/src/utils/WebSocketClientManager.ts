import WebSocket from 'ws';
import { logger } from '../../../../common/utils/logger';
import { WelcomerEvent } from '../../../../common/types/WelcomerEvent';
import { getAvatarURL, getGuildIconURL } from 'discordeno';
import { bot } from '../FoxyLauncher';
import { getUserAvatar } from './discord/User';

export default class WebSocketClientManager {
    public websocket: WebSocket;
    private reconnectInterval: number = 5000;
    private maxReconnectAttempts: number = 10;
    private reconnectAttempts: number = 0;

    constructor() {
        this.websocket = new WebSocket(process.env.WELCOMER_URL!);
        this.connect();
    }

    private connect() {
        this.websocket.on('open', () => {
            logger.info('Connected to websocket');
            this.reconnectAttempts = 0;
        });

        this.websocket.on('close', () => {
            logger.warn('WebSocket disconnected');
            this.tryReconnect();
        });

        this.websocket.on('error', (error) => {
            logger.error('WebSocket error:', error);
            this.websocket.close();
        });
    }

    private tryReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
                logger.info(`Reconnecting... (Attempt ${this.reconnectAttempts + 1})`);
                this.reconnectAttempts++;
                this.websocket = new WebSocket(process.env.WELCOMER_URL!);
                this.connect();
            }, this.reconnectInterval);
        } else {
            logger.error('Max reconnect attempts reached. Could not reconnect to WebSocket.');
        }
    }

    public send(data: WelcomerEvent) {
        const serializedData = this.serializeBigInt(data);
        
        const avatarUrl = getUserAvatar(data.data.user, { size: 2048, enableGif: true });
        const guildIconUrl = getGuildIconURL(bot, data.data.guild.id, data.data.guild.icon);

        serializedData.data.user.avatar = avatarUrl;
        serializedData.data.guild.icon = guildIconUrl;
    
        const jsonData = JSON.stringify(serializedData);
    
        if (this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(jsonData);
        } else {
            logger.warn('WebSocket is not open. Failed to send data:', jsonData);
        }
    }
    
    

    private serializeBigInt(data: any): any {
        if (typeof data === 'bigint') {
            return data.toString(); 
        } else if (Array.isArray(data)) {
            return data.map(item => this.serializeBigInt(item));
        } else if (data && typeof data === 'object') {
            return Object.fromEntries(
                Object.entries(data).map(([key, value]) => [key, this.serializeBigInt(value)])
            );
        }
        return data;
    }
}