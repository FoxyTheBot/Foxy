module.exports = class PizzariaSimulator {
    constructor(client) {
        this.client = client;
    }

    async deletePizzaria(userId) {
        const data = await getData(userId);
        if(!data) return null;
        data.remove().catch(err => console.error(err));
        return true;
    }

    async getPizzariaInventory(userId) {
        const data = await this.client.database.getPizzariaInfoById(userId);
        return data;
    }
}