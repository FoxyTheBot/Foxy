import Canvas from "canvas";
import config from "../../../../config.json";
import { bot } from "../../..";

export default class RenderValorantProfile {
    public user: any;
    public readonly width: number;
    public readonly height: number;
    constructor(user) {
        this.user = user;
        this.width = 1920;
        this.height = 1080;
    }

    async render(data) {
        const canvas = Canvas.createCanvas(1920, 1080);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(`${config.serverURL}/valorant/background/main.jpg`);

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        const characterImage = await Canvas.loadImage(`${config.serverURL}/valorant/agents/${data.mostPlayedCharacter.toLowerCase()}.png`);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const xCharacter = 10;
        const yCharacter = 150;
        ctx.drawImage(characterImage, xCharacter, yCharacter, 587, 900);


        const text = `${data.userInfo.data.name}#${data.userInfo.data.tag}`;
        const x = canvas.width / 2;
        const y = 35;
        const highestElo = data.formattedHighestRank;

        ctx.font = '70px Anton';
        ctx.fillText(text, x, y);
        ctx.font = '60px Anton';
        ctx.fillText(highestElo, x, y + 100);
        const xRankImage = x + -260;
        const yRankImage = y + 115;

        const imageWidth = 64;
        const imageHeight = 64;

        const rank = getRank(data.patchedHighestRank) ?? { rank: 'UNRATED' };
        const rankImage = await Canvas.loadImage(`http://localhost:8080/assets/valorant/ranks/${rank.rank}.png`);

        ctx.drawImage(rankImage, xRankImage, yRankImage, imageWidth, imageHeight);

        function getRank(rank: string) {
            const rankMapping: { [key: string]: any } = {
                'Unrated': { rank: 'UNRATED' },
                'Iron 1': { rank: 'I1' },
                'Iron 2': { rank: 'I2' },
                'Iron 3': { rank: 'I3' },
                'Bronze 1': { rank: 'B1' },
                'Bronze 2': { rank: 'B2' },
                'Bronze 3': { rank: 'B3' },
                'Silver 1': { rank: 'S1' },
                'Silver 2': { rank: 'S2' },
                'Silver 3': { rank: 'S3' },
                'Gold 1': { rank: 'G1' },
                'Gold 2': { rank: 'G2' },
                'Gold 3': { rank: 'G3' },
                'Platinum 1': { rank: 'P1' },
                'Platinum 2': { rank: 'P2' },
                'Platinum 3': { rank: 'P3' },
                'Diamond 1': { rank: 'D1' },
                'Diamond 2': { rank: 'D2' },
                'Diamond 3': { rank: 'D3' },
                'Ascendant 1': { rank: 'A1' },
                'Ascendant 2': { rank: 'A2' },
                'Ascendant 3': { rank: 'A3' },
                'Immortal 1': { rank: 'IM1' },
                'Immortal 2': { rank: 'IM2' },
                'Immortal 3': { rank: 'IM3' },
                'Radiant': { rank: 'R' },
            };

            if (rank in rankMapping) {
                return rankMapping[rank];
            } else {
                return null;
            }
        }
        const characterText = bot.locale('commands:valorant.player.mostPlayedCharacter');
        const xCharacterText = xCharacter + characterImage.width / 2;
        const yCharacterText = yCharacter - 100;
        ctx.font = '45px Anton';
        ctx.fillText(characterText, xCharacterText, yCharacterText);

        ctx.font = '70px Anton';
        const killsText = 'Kills';
        ctx.fillStyle = '#f84354';
        const xKillsText = canvas.width - 130;
        const yKillsText = 30;
        ctx.fillText(killsText, xKillsText, yKillsText);

        ctx.font = '70px Anton';
        ctx.fillStyle = 'white';
        const killsValue = data.totalKills.toString();
        const xKillsValue = canvas.width - 130;
        const yKillsValue = 130;
        ctx.fillText(killsValue, xKillsValue, yKillsValue);

        ctx.font = '70px Anton';
        ctx.fillStyle = '#f84354';
        const deathsText = 'Deaths';
        const xDeathsText = canvas.width - 160;
        const yDeathsText = 230;
        ctx.fillText(deathsText, xDeathsText, yDeathsText);

        ctx.font = '70px Anton';
        ctx.fillStyle = 'white';
        const deathsValue = data.totalDeaths.toString();
        const xDeathsValue = canvas.width - 130;
        const yDeathsValue = 330;
        ctx.fillText(deathsValue, xDeathsValue, yDeathsValue);

        ctx.font = '70px Anton';
        const assistsText = 'Assists';
        ctx.fillStyle = '#f84354';
        const xAssistsText = canvas.width - 160;
        const yAssistsText = 430;
        ctx.fillText(assistsText, xAssistsText, yAssistsText);

        ctx.font = '70px Anton';
        const assistsValue = data.totalAssists.toString();
        ctx.fillStyle = 'white';
        const xAssistsValue = canvas.width - 130;
        const yAssistsValue = 530;
        ctx.fillText(assistsValue, xAssistsValue, yAssistsValue);

        ctx.font = '70px Anton';
        const matchesText = 'Partidas';
        ctx.fillStyle = '#f84354';
        const xMatchesText = canvas.width - 160;
        const yMatchesText = 630;
        ctx.fillText(matchesText, xMatchesText, yMatchesText);

        ctx.font = '70px Anton';
        const matchesValue = data.totalMatches.toString();
        ctx.fillStyle = 'white';
        const xMatchesValue = canvas.width - 130;
        const yMatchesValue = 730;
        ctx.fillText(matchesValue, xMatchesValue, yMatchesValue);

        ctx.font = '70px Anton';
        const currentEloText = bot.locale('commands:valorant.player.rank');
        ctx.fillStyle = '#f84354';
        const xCurrentEloText = canvas.width - 230;
        const yCurrentEloText = 830;
        ctx.fillText(currentEloText, xCurrentEloText, yCurrentEloText);

        ctx.font = '70px Anton';
        ctx.fillStyle = 'white';
        const currentEloValue = data.formattedRank;

        const xText = canvas.width + -50;
        const yCurrentEloValue = 930;

        ctx.textAlign = 'end';

        ctx.fillText(currentEloValue, xText, yCurrentEloValue);


        const maxShots = Math.max(data.headshots, data.bodyshots, data.legshots);

        let headURL = `${config.serverURL}/valorant/body-damage/headshots.png`;
        let torsoURL = `${config.serverURL}/valorant/body-damage/bodyshots.png`;
        let legsURL = `${config.serverURL}/valorant/body-damage/legshots.png`;

        if (maxShots === data.bodyshots) {
            torsoURL = `${config.serverURL}/valorant/body-damage/bodyshots2.png`;
        } else if (maxShots === data.legshots) {
            legsURL = `${config.serverURL}/valorant/body-damage/legshots2.png`;
        } else if (maxShots === data.headshots) {
            headURL = `${config.serverURL}/valorant/body-damage/headshots2.png`;
        }

        const head = await Canvas.loadImage(headURL);
        const torso = await Canvas.loadImage(torsoURL);
        const legs = await Canvas.loadImage(legsURL);

        const fullBodyCanvas = new Canvas.Canvas(1920, 1080);
        const fullBodyCtx = fullBodyCanvas.getContext('2d');

        const originalHeadWidth = head.width;
        const originalHeadHeight = head.height;
        const originalTorsoWidth = torso.width;
        const originalTorsoHeight = torso.height;
        const originalLegsWidth = legs.width;
        const originalLegsHeight = legs.height;

        const proportion = Math.min(
            fullBodyCanvas.width / originalHeadWidth,
            fullBodyCanvas.height / originalHeadHeight,
            fullBodyCanvas.width / originalTorsoWidth,
            fullBodyCanvas.height / originalTorsoHeight,
            fullBodyCanvas.width / originalLegsWidth,
            fullBodyCanvas.height / originalLegsHeight
        );

        const scale = 0.7;

        const adjustedHeadWidth = originalHeadWidth * proportion * scale;
        const adjustedHeadHeight = originalHeadHeight * proportion * scale;
        const adjustedTorsoWidth = originalTorsoWidth * proportion * scale;
        const adjustedTorsoHeight = originalTorsoHeight * proportion * scale;
        const adjustedLegsWidth = originalLegsWidth * proportion * scale;
        const adjustedLegsHeight = originalLegsHeight * proportion * scale;

        fullBodyCtx.drawImage(head, 0, 0, adjustedHeadWidth, adjustedHeadHeight);
        fullBodyCtx.drawImage(torso, 0, 0, adjustedTorsoWidth, adjustedTorsoHeight);
        fullBodyCtx.drawImage(legs, 0, 0, adjustedLegsWidth, adjustedLegsHeight);

        const xFullBody = (canvas.width - adjustedHeadWidth) / 2;
        const yFullBody = (canvas.height - adjustedHeadHeight) / 2 + 50;

        const headText = `- ${data.headshotsPercentage.toFixed(2)}%`;
        const torsoText = `- ${data.bodyshotsPercentage.toFixed(2)}%`;
        const legsText = `- ${data.legshotsPercentage.toFixed(2)}%`;

        fullBodyCtx.fillStyle = 'white';
        fullBodyCtx.textAlign = 'center';

        const xHeadText = xFullBody + adjustedHeadWidth / 2 + 250;
        const yHeadText = yFullBody + 35;

        const xTorsoText = xFullBody + adjustedTorsoWidth / 2 + 300;
        const yTorsoText = yFullBody + adjustedHeadHeight - 500;
        const xLegsText = xFullBody + adjustedLegsWidth / 2 + 250;
        const yLegsText = yFullBody + adjustedHeadHeight - 270;

        ctx.drawImage(fullBodyCanvas, xFullBody, yFullBody);

        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';

        ctx.fillText(headText, xHeadText, yHeadText);
        ctx.fillText(torsoText, xTorsoText, yTorsoText);
        ctx.fillText(legsText, xLegsText, yLegsText);

        const blob = new Blob([canvas.toBuffer()], { type: 'image/png' });

        return blob;
    }
}