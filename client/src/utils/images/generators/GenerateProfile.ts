import Canvas from 'canvas';
import { bot } from "../../../index";
import moment from 'moment';
import { getUserAvatar } from '../../discord/User';
import { serverURL } from '../../../../config.json';
import { lylist, masks } from '../../../structures/json/layoutList.json';
import { User } from 'discordeno/transformers';

let font = "#ffffff";
export default class CreateProfile {
    private user: User;
    private data: any;
    private readonly width: number;
    private readonly height: number;
    private readonly testMode: boolean;
    private readonly code: string;
    private readonly mask: boolean;
    private readonly locale: any

    constructor(locale, user, data, testMode?, code?, mask?) {
        this.user = user;
        this.data = data;
        this.width = 1436;
        this.height = 884;
        this.testMode = testMode;
        this.code = code;
        this.mask = mask;
        this.locale = locale

    }

    async create() {
        let userAboutme: string = this.data.userProfile.aboutme;
        if (!userAboutme) userAboutme = `${this.locale("commands:profile.noAboutme")}`;

        if (userAboutme.length > 84) {
            const aboutme = userAboutme.match(/.{1,59}/g);
            userAboutme = aboutme.join("\n");
        }
        let background;

        const canvas = Canvas.createCanvas(this.width, this.height);
        const context = canvas.getContext("2d");
        const isLayoutWhite = lylist.find((l) => l.id === this.data.userProfile.layout).darkText;
        let layout = await Canvas.loadImage(`${serverURL}/layouts/${this.data.userProfile.layout}`);
        background = await Canvas.loadImage(`${serverURL}/backgrounds/${this.data.userProfile.background}`);

        if (this.testMode && !this.mask) {
            background = await Canvas.loadImage(`${serverURL}/backgrounds/${this.code}`);
            userAboutme = this.locale("commands:profile.testMode");
        }
        if (isLayoutWhite) font = "#000000"; else font = "#ffffff";
        context.drawImage(background, 0, 0, canvas.width, canvas.height)
        context.drawImage(layout, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = '#74037b';
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = '70px sans-serif';
        context.fillStyle = font;
        context.fillText(await bot.foxyRest.getUserDisplayName(this.user.id), canvas.width / 5.8, canvas.height / 1.3)

        context.font = '40px sans-serif';
        context.fillStyle = font;
        context.fillText(`Cakes: \n${this.data.userCakes.balance}\nReps: ${this.data.userProfile.repCount}`, canvas.width / 1.2, canvas.height / 1.4);

        if (this.data.marryStatus.marriedWith) {
            moment.locale(this.locale.lng)
            const partnerDisplayName = await bot.foxyRest.getUserDisplayName(this.data.marryStatus.marriedWith);
            context.font = ('30px sans-serif');
            context.fillStyle = font;
            context.fillText(this.locale("commands:profile.marriedWith", {
                user: `${partnerDisplayName}`, relativeTime: moment(this.data.marryStatus.marriedDate, "YYYYMMDD").fromNow(), date: this.data.marryStatus.marriedDate.toLocaleString(this.locale.lng, { timeZone: "America/Sao_Paulo", year: 'numeric', month: 'numeric', day: 'numeric' })
            }), canvas.width / 50, canvas.height - 15 / 1);
        }

        context.font = ('30px sans-serif');
        context.fillStyle = font;
        context.fillText(userAboutme, canvas.width / 6.1, canvas.height / 1.2);
        context.save();

        context.beginPath();
        context.arc(125, 700, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        let getAvatar = getUserAvatar(this.user, { size: 2048 });
        if (getAvatar.includes(".jpg")) {
            getAvatar = getAvatar.replace(".jpg", "");
        }
        const avatar = await Canvas.loadImage(getAvatar);
        context.drawImage(avatar, 25, 600, 200, 200);
        context.restore();

        if (this.data.userProfile.decoration && !this.mask) {
            const mask = await Canvas.loadImage(`${serverURL}/masks/${this.data.userProfile.decoration}`);
            const allMasks = masks.find((m) => m.id === this.data.userProfile.decoration);

            if (allMasks.type === "face-mask") {
                context.drawImage(mask, canvas.width / 100.0, canvas.height / 1.45, 220, 210);
            } else {
                context.drawImage(mask, canvas.width / 55.0, canvas.height / 1.69, 200, 200)
            }
        }

        if (this.testMode && this.mask) {
            const mask = await Canvas.loadImage(`${serverURL}/masks/${this.code}`);
            context.drawImage(mask, canvas.width / 55.0, canvas.height / 1.69, 200, 200)
        }

        const blob = new Blob([canvas.toBuffer()], { type: 'image/png' });
        return blob;
    }
}