export interface FoxyCommands {
    config: Object,
}

export default class Command {
    public client: any;
    public config: Object;

    constructor(client, options) {
        this.client = client;

        this.config = {
            name: options.name || null,
            aliases: options.aliases || [],
            category: options.category || "utils",
            description: options.description || "undefined",
            userPermission: options.userPermission || [],
            clientPermission: options.clientPermission || [],
            dev: options.dev || false,
            data: options.data
        }
    }
}