import ws from 'ws';
import WelcomerManager from './WelcomerManager';
import { logger } from '../../../common/utils/logger';
import { WelcomerEvent } from '../../../common/types/WelcomerEvent';

export default class WebSocketServerManager {
    private wss: ws.Server;
    private welcomerManager: WelcomerManager;

    constructor(port: number) {
        this.welcomerManager = new WelcomerManager();
        this.wss = new ws.Server({ port });
        this.initialize();
    }

    private initialize() {
        this.wss.on('connection', (clientWs) => {
            logger.info('New client connected');
            this.setupClientHandlers(clientWs);

            clientWs.on('close', () => {
                logger.info('Client disconnected');
            });

            clientWs.on('error', (error) => {
                logger.error('WebSocket error:', error);
            });
        });

        logger.info(`Welcomer microservice is running on port ${process.env.WELCOMER_PORT}`);
    }

    private setupClientHandlers(clientWs: ws) {
        clientWs.on('message', (message) => this.handleMessage(message));
    }

    private handleMessage(message: ws.Data) {
        if (Buffer.isBuffer(message)) {
            message = message.toString();
        }

        let parsedMessage;
        try {
            parsedMessage = this.validateMessage(JSON.parse(message));
        } catch (error) {
            logger.error('Error parsing message:', error);
            return;
        }

        this.processMessage(parsedMessage);
    }

    private processMessage(parsedMessage: WelcomerEvent) {
        switch (parsedMessage.type) {
            case 'GUILD_MEMBER_ADD':
                this.welcomerManager.welcomeNewMember(
                    parsedMessage.data.guild,
                    parsedMessage.data.user
                );
                break;

            case 'GUILD_MEMBER_REMOVE':
                this.welcomerManager.byeMember(
                    parsedMessage.data.guild.id.toString(),
                    parsedMessage.data.user
                );
                break;

            default:
                logger.warn('Unknown message type:', parsedMessage.type);
        }
    }

    private validateMessage(parsedMessage: any): WelcomerEvent {
        if (typeof parsedMessage !== 'object' || !parsedMessage.type || !parsedMessage.data) {
            logger.error('Invalid message format:', parsedMessage);
            return null;
        }
    
        const { type, data } = parsedMessage;
    
        if (!['GUILD_MEMBER_ADD', 'GUILD_MEMBER_REMOVE'].includes(type)) {
            logger.error('Unsupported message type:', type);
            return null;
        }
    
        if (!data.guild || typeof data.guild.id !== 'string') {
            logger.error('Invalid data structure - guild:', data.guild);
        }
    
        if (!data.user || typeof data.user.id !== 'string') {
            logger.error('Invalid data structure - user:', data.user);
        }
    
        return parsedMessage as WelcomerEvent;
    }
    

}
