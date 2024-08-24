import { Api } from '@top-gg/sdk';

const api = new Api(process.env.DBL_TOKEN);
const postInfo = async ({ guilds }) => {
        api.postStats({
            serverCount: guilds,
            shardCount: 1,
        })
}

export { postInfo };