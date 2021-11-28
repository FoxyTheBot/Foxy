module.exports = class Command {
    constructor(client, options) {
      this.client = client
  
      this.config = {
        name: options.name || null,
        aliases: options.aliases || [],
        category: options.category || "utils",
        description: options.description || "indefinido",
        userPermission: options.userPermission || [],
        clientPermission: options.clientPermission || [],
        dev: options.dev || false,
        data: options.data
      }
    }
  }