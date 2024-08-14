import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { FoxyClient } from "../../../structures/types/foxy";
import { colors } from "../../../utils/colors";
import { getRank } from "./utils/getRank";
import { createEmbed } from "../../../utils/discord/Embed";
import { UserOverview } from "../../../structures/types/responses";
import { createActionRow, createCustomId, createSelectMenu } from "../../../utils/discord/Component";

export default class ValorantMatchesExecutor {
    constructor(
        private bot: FoxyClient,
        private context: UnleashedCommandExecutor,
        private endCommand: () => void,
        private t: (key: string, args?: any) => string
    ) { }

    async execute() {
        const userData = await this.bot.database.getUser(this.context.author.id);
        this.context.sendDefer(userData.riotAccount.isPrivate);
        this.createResponse(userData);
    }

    private async getUserInfo(userData): Promise<UserOverview | null> {
        if (!userData) return null;

        const puuid = userData.riotAccount.puuid;
        const user = await this.bot.rest.foxy.getValPlayerByUUID(puuid);
        if (!user) return null;

        const mmrInfo = await this.bot.rest.foxy.getMMR(puuid);
        const rank = getRank(mmrInfo.data.current_data.currenttierpatched ?? "Unrated");
        const formattedRank = rank
            ? `${this.context.getEmojiById(rank.emoji)} ${this.t(`commands:valorant.player.ranks.${rank.rank}`)}`
            : `${this.context.getEmojiById(this.bot.emotes.UNRATED)} ${this.t('commands:valorant.player.ranks.UNRATED')}`;

        const matches = await this.bot.rest.foxy.getValMatchHistoryByUUID(
            puuid,
            this.context.getOption<string>('mode', false),
            this.context.getOption<string>('map', false)
        );

        return {
            // @ts-ignore - This is a valid response
            user: user,
            mmr: mmrInfo.data,
            patchedRank: formattedRank,
            matches: matches.data
        };
    }

    private async createResponse(userData) {
        const userInfo = await this.getUserInfo(userData);
        if (!userInfo) {
            return this.sendErrorResponse(
                this.t('commands:valorant.cannotGetInfo'),
                this.t('commands:valorant.cannotGetInfoDescription')
            );
        }

        try {
            const embed = createEmbed({
                color: this.bot.colors.VALORANT,
                thumbnail: { url: userInfo.user.data.card.small },
                title: `${this.context.getEmojiById(this.bot.emotes.VALORANT_LOGO)} ${this.t('commands:valorant.match.title', {
                    username: userInfo.user.data.name,
                    tag: userInfo.user.data.tag
                })} - ${userInfo.patchedRank}`,
                fields: this.createMatchFields(userInfo),
                footer: { text: this.t('commands:valorant.match.footer') }
            });

            const row = this.createActionRow(userInfo);

            await this.context.sendReply({
                embeds: [embed],
                components: [row]
            }).finally(() => this.endCommand());
        } catch (e) {
            console.error(e);
            this.sendErrorResponse(this.t('commands:valorant.match.notFound'));
        }
    }

    private createMatchFields(userInfo: UserOverview) {
        return userInfo.matches.map(match => {
            const { metadata, teams } = match;
            const currentPlayer = match.players.find(player => player.puuid === userInfo.user.data.puuid);
            const result = this.getMatchResult(teams, currentPlayer.team_id);

            return {
                name: `${metadata.map.name} | ${this.bot.locale(`commands:valorant.match.modes.${metadata.queue.name.toLowerCase()}`)} | ${teams[0].rounds.won ?? 0} - ${teams[1].rounds.won ?? 0} | ${result}`,
                value: `${this.t('commands:valorant.match.character')}: ${this.context.getEmojiById(this.bot.emotes[currentPlayer.agent.name.toUpperCase()] ?? this.bot.emotes.FOXY_SHRUG)} \n` +
                    `K/D/A: ${currentPlayer.stats.kills}/${currentPlayer.stats.deaths}/${currentPlayer.stats.assists} \n` +
                    `Score: ${currentPlayer.stats.score} \n`,
                inline: true
            };
        });
    }

    private getMatchResult(teams: any, playerTeam: string) {
        console.log(teams)
        const teamHasWon = teams[0].won ? "Red" : "Blue" || "Draw";

        if (teamHasWon === "Draw") {
            return `${this.context.getEmojiById(this.bot.emotes.FOXY_RAGE)} ${this.t('commands:valorant.match.draw')}`;
        }

        return playerTeam === teamHasWon
            ? `${this.context.getEmojiById(this.bot.emotes.FOXY_YAY)} ${this.t('commands:valorant.match.win')}`
            : `${this.context.getEmojiById(this.bot.emotes.FOXY_CRY)} ${this.t('commands:valorant.match.loss')}`;
    }

    private createActionRow(userInfo: UserOverview) {
        const options = userInfo.matches.length
            ? userInfo.matches.map(match => {
                const currentPlayer = match.players.find(player => player.puuid === userInfo.user.data.puuid);
                return {
                    label: `${match.metadata.map.name} - ${this.bot.locale(`commands:valorant.match.modes.${match.metadata.queue.name.toLowerCase()}`)}`,
                    value: match.metadata.match_id,
                    description: `${match.players.find(player => player.puuid === userInfo.user.data.puuid).agent.name} | K/D/A: ${currentPlayer.stats.kills}/${currentPlayer.stats.deaths}/${currentPlayer.stats.assists}`,
                    emoji: { id: this.bot.emotes[currentPlayer.agent.name.toUpperCase()] ?? this.bot.emotes.FOXY_SHRUG }
                }
            })
            : [{
                label: this.t('commands:valorant.match.noMatches'),
                value: 'noMatches',
                description: this.t('commands:valorant.match.noMatchesDescription')
            }];

        return createActionRow([createSelectMenu({
            customId: createCustomId(0, this.context.author.id, this.context.commandId, userInfo.user.data.puuid),
            placeholder: this.t(userInfo.matches.length ? 'commands:valorant.match.placeholder' : 'commands:valorant.match.noMatches'),
            disabled: !userInfo.matches.length,
            options
        })]);
    }

    private sendErrorResponse(title: string, description?: string) {
        return this.context.sendReply({
            embeds: [{
                color: colors.RED,
                title: this.context.makeReply(this.bot.emotes.VALORANT_LOGO, title),
                description
            }]
        }).finally(() => this.endCommand());
    }
}