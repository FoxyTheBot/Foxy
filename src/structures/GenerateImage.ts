import { TextChannel } from "discord.js";
import Canvas from 'canvas';
import FoxyClient from '../FoxyClient';
import moment from 'moment';

export default class GenerateImage {
    private client: FoxyClient;
    private user: any;
    private data: any;
    private readonly width: number;
    private readonly height: number;
    private readonly testMode: boolean;
    private readonly code: string;
    private readonly mask: boolean;

    constructor(client, user, data, width, height, testMode?, code?, mask?) {
        this.client = client;
        this.user = user;
        this.data = data;
        this.width = width;
        this.height = height;
        this.testMode = testMode;
        this.code = code;
        this.mask = mask;
    }

    async renderProfile(t): Promise<Buffer> {
        let userAboutme: string = this.data.aboutme;
        if (!userAboutme) userAboutme = `${t("commands:profile.noAboutme")}`;

        if (userAboutme.length > 84) {
            const aboutme = userAboutme.match(/.{1,84}/g);
            userAboutme = aboutme.join("\n");
        }
        let background;

        if (!isNaN(Number(this.data.background))) {
            background = (await (this.client.channels.cache.get('997953006391795753') as TextChannel)
                .messages.fetch(this.data.background)).attachments.first().attachment
        }
        else background = `http://localhost:8080/backgrounds/${this.data.background}`

        const canvas = Canvas.createCanvas(this.width, this.height);
        const ctx = canvas.getContext("2d");
        let layout = await Canvas.loadImage(`http://localhost:8080/layouts/${this.data.layout}`);
        background = await Canvas.loadImage(background);

        if (this.testMode && !this.mask) {
            background = await Canvas.loadImage(`http://localhost:8080/backgrounds/${this.code}`);
            userAboutme = t("commands:profile.testMode");
        }
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
        ctx.drawImage(layout, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        var badge = "";
        if (this.data.premium) {
            switch (this.data.premiumType) {
                case "INFINITY_ESSENTIALS": {
                    badge = " "
                    break;
                }

                case "INFINITY_PRO": {
                    badge = "💎"
                    break;
                }

                case "INFINITY_TURBO": {
                    badge = "🔥"
                    break;
                }

                case "VETERAN": {
                    badge = "🪐"
                    break;
                }
            }
        }

        ctx.font = '70px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${this.user.username} ${badge}`, canvas.width / 5.8, canvas.height / 1.3)

        ctx.font = '60px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${this.data.repCount} Reps`, canvas.width / 1.2, canvas.height / 10.5);

        ctx.font = '40px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`FoxCoins: \n${this.data.balance}`, canvas.width / 1.2, canvas.height / 1.4);

        if (this.data.marriedWith) {
            moment.locale(t.lng)
            const discordProfile = await this.client.users.fetch(this.data.marriedWith);
            ctx.font = ('30px sans-serif');
            ctx.fillStyle = '#ffffff';
            ctx.fillText(t("commands:profile.marriedWith", {
                user: discordProfile.tag, relativeTime: moment(this.data.marriedDate, "YYYYMMDD").fromNow(), date: this.data.marriedDate.toLocaleString(t.lng, { timeZone: "America/Sao_Paulo", year: 'numeric', month: 'numeric', day: 'numeric' })
            }), canvas.width / 50, canvas.height - 15 / 1);
        }

        ctx.font = ('30px sans-serif');
        ctx.fillStyle = '#ffffff';
        ctx.fillText(userAboutme, canvas.width / 6.1, canvas.height / 1.2);
        ctx.save();

        ctx.beginPath();
        ctx.arc(125, 700, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(this.user.avatarURL().replace('.webp', '.png'));
        ctx.drawImage(avatar, 25, 600, 200, 200);
        ctx.restore();

        if (this.data.mask && !this.mask) {
            const mask = await Canvas.loadImage(`http://localhost:8080/masks/${this.data.mask}`);
            ctx.drawImage(mask, canvas.width / 55.0, canvas.height / 1.69, 200, 200)
        }

        if (this.testMode && this.mask) {
            const mask = await Canvas.loadImage(`http://localhost:8080/masks/${this.code}`);
            ctx.drawImage(mask, canvas.width / 55.0, canvas.height / 1.69, 200, 200)
        }
        return canvas.toBuffer();
    }
}