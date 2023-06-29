import { Api } from '@top-gg/sdk';
import config from '../../config.json';

const api = new Api(config.dblauth);
const postInfo = async ({ guilds }) => {
        api.postStats({
            serverCount: guilds,
            shardCount: 1,
        })
}

export { postInfo };