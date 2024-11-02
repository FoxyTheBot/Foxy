import { Api } from '@top-gg/sdk';

require('dotenv').config({ path: "../../.env" });
const api = new Api(process.env.DBL_TOKEN);
const postInfo = async ({ guilds }) => {
        api.postStats({
            serverCount: guilds,
            shardCount: 1,
        })
}

export { postInfo };