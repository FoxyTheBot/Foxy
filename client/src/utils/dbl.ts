import { Api } from '@top-gg/sdk';
import config from '../../config.json';

const api = new Api(config.dblauth);
const postInfo = async () => {
    api.postStats({
        serverCount: 100, // It can't get the server count from Discord API, so I'm just putting a rounded server count
        shardCount: 1,
    })
}

const getStats = async () => {
    const stats = await api.getStats(config.clientId);
    return stats;   
}
var voterList: any = [
    {
        username: String,
        id: String,
        quantity: Number
    }
]

const getVotes = async () => {
    const voters = await api.getVotes();
    for (let i = 0; i < voters.length; i++) {
        const element = voters[i];
        if (voterList.find(x => x.id === element.id)) {
            voterList.find(x => x.id === element.id).quantity += 1;
        } else {
            voterList.push({
                username: element.username,
                id: element.id,
                quantity: 1
            })
        }
    }
    return voterList;
}

export { postInfo, getStats, getVotes };