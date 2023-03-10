import { Api } from '@top-gg/sdk';
import config from '../../config.json';

const api = new Api(config.dblauth);
const postInfo = async () => {
    api.postStats({
        serverCount: 100, // It can't get the server count from Discord API, so I'm just putting a rounded server count
        shardCount: 1,
    })
}

export { postInfo };