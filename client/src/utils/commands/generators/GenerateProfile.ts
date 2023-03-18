import Canvas from 'canvas';
import { bot } from "../../../index";
import moment from 'moment';
import { getUserAvatar } from '../../discord/User';

export default class CreateProfile {
    private user: any;
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
        let userAboutme: string = this.data.aboutme;
        if (!userAboutme) userAboutme = `${this.locale("commands:profile.noAboutme")}`;

        if (userAboutme.length > 84) {
            const aboutme = userAboutme.match(/.{1,84}/g);
            userAboutme = aboutme.join("\n");
        }
        let background;

        const canvas = Canvas.createCanvas(this.width, this.height);
        const context = canvas.getContext("2d");
        let layout = await Canvas.loadImage(`http://localhost:8080/layouts/${this.data.layout}`);
        background = await Canvas.loadImage(`http://localhost:8080/backgrounds/${this.data.background}`);

        if (this.testMode && !this.mask) {
            background = await Canvas.loadImage(`http://localhost:8080/backgrounds/${this.code}`);
            userAboutme = this.locale("commands:profile.testMode");
        }
        context.drawImage(background, 0, 0, canvas.width, canvas.height)
        context.drawImage(layout, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = '#74037b';
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = '70px sans-serif';
        context.fillStyle = '#ffffff';
        context.fillText(this.user.username, canvas.width / 5.8, canvas.height / 1.3)

        context.font = '60px sans-serif';
        context.fillStyle = '#ffffff';
        context.fillText(`${this.data.repCount} Reps`, canvas.width / 1.2, canvas.height / 10.5);

        context.font = '40px sans-serif';
        context.fillStyle = '#ffffff';
        context.fillText(`Cakes: \n${this.data.balance}`, canvas.width / 1.2, canvas.height / 1.4);

        if (this.data.marriedWith) {
            moment.locale(this.locale.lng)
            const discordProfile = await bot.helpers.getUser(this.data.marriedWith);
            context.font = ('30px sans-serif');
            context.fillStyle = '#ffffff';
            context.fillText(this.locale("commands:profile.marriedWith", {
                user: `${discordProfile.username}#${discordProfile.discriminator}`, relativeTime: moment(this.data.marriedDate, "YYYYMMDD").fromNow(), date: this.data.marriedDate.toLocaleString(this.locale.lng, { timeZone: "America/Sao_Paulo", year: 'numeric', month: 'numeric', day: 'numeric' })
            }), canvas.width / 50, canvas.height - 15 / 1);
        }

        context.font = ('30px sans-serif');
        context.fillStyle = '#ffffff';
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

        if (this.data.mask && !this.mask) {
            const mask = await Canvas.loadImage(`http://localhost:8080/masks/${this.data.mask}`);
            context.drawImage(mask, canvas.width / 55.0, canvas.height / 1.69, 200, 200)
        }

        if (this.testMode && this.mask) {
            const mask = await Canvas.loadImage(`http://localhost:8080/masks/${this.code}`);
            context.drawImage(mask, canvas.width / 55.0, canvas.height / 1.69, 200, 200)
        }

        const blob = new Blob([canvas.toBuffer()], { type: 'image/png' });
        return blob;
    }
}