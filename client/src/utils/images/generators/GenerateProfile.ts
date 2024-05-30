import Canvas, { CanvasRenderingContext2D } from 'canvas';
import { bot } from "../../../FoxyLauncher";
import moment from 'moment';
import { getUserAvatar } from '../../discord/User';
import { serverURL } from '../../../../config.json';
import { lylist } from '../../../structures/json/layoutList.json';
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
    private readonly locale: any;
    private canvas: Canvas.Canvas;
    private context: CanvasRenderingContext2D;

    constructor(locale, user, data, testMode?, code?, mask?) {
        this.user = user;
        this.data = data;
        this.width = 1436;
        this.height = 884;
        this.testMode = testMode;
        this.code = code;
        this.mask = mask;
        this.locale = locale
        this.canvas = Canvas.createCanvas(this.width, this.height);
        this.context = this.canvas.getContext("2d");
    }

    async create() {
        let userAboutme: string = this.data.userProfile.aboutme;
        if (!userAboutme) userAboutme = `${this.locale("commands:profile.noAboutme")}`;

        if (userAboutme.length > 84) {
            const aboutme = userAboutme.match(/.{1,65}/g);
            userAboutme = aboutme.join("\n");
        }
        let background;

        const context = this.canvas.getContext("2d");
        const isLayoutWhite = lylist.find((l) => l.id === this.data.userProfile.layout).darkText;
        let layout = await Canvas.loadImage(`${serverURL}/layouts/${this.data.userProfile.layout}`);
        background = await Canvas.loadImage(`${serverURL}/backgrounds/${this.data.userProfile.background}`);

        if (this.testMode && !this.mask) {
            background = await Canvas.loadImage(`${serverURL}/backgrounds/${this.code}`);
            userAboutme = this.locale("commands:profile.testMode");
        }
        if (isLayoutWhite) font = "#000000"; else font = "#ffffff";
        context.drawImage(background, 0, 0, this.canvas.width, this.canvas.height)
        context.drawImage(layout, 0, 0, this.canvas.width, this.canvas.height);

        context.strokeStyle = '#74037b';
        context.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        context.font = '70px Anton';
        context.fillStyle = font;
        context.fillText(this.user.username, this.canvas.width / 5.8, this.canvas.height / 1.35)

        context.font = '43px Anton';
        context.fillStyle = font;
        context.fillText(`Cakes: ${this.data.userCakes.balance.toLocaleString("pt-BR")}`
            + `\nReps: ${this.data.userProfile.repCount.toLocaleString("pt-BR")}`,
            this.canvas.width / 1.30, this.canvas.height / 1.4);

        if (this.data.marryStatus.marriedWith) {
            moment.locale(this.locale.lng)
            const partnerUser = bot.users.get(this.data.marryStatus.marriedWith)
                ?? await bot.helpers.getUser(this.data.marryStatus.marriedWith);
            context.font = ('50px Anton');
            const marriedCard = await Canvas.loadImage(`${serverURL}/assets/layouts/blue-married.png`);
            context.drawImage(marriedCard, 0, 0, this.canvas.width, this.canvas.height);
            context.fillStyle = font;
            context.fillText("Casado(a) com:", this.canvas.width / 1.40, this.canvas.height / 16);
            context.font = "35px Anton";
            context.fillText(partnerUser.username, this.canvas.width / 1.40, this.canvas.height / 9);
            context.fillText("Desde " + this.data.marryStatus.marriedDate.toLocaleString(this.locale.lng), this.canvas.width / 1.40, this.canvas.height / 6.5);
        }

        context.font = ('27px Anton');
        context.fillStyle = font;
        context.fillText(userAboutme, this.canvas.width / 5.8, this.canvas.height / 1.26);
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

        await this.insertBadges();
        if (this.data.userProfile.decoration && !this.mask) {
            const mask = await Canvas.loadImage(`${serverURL}/masks/${this.data.userProfile.decoration}`);
            const allMasks = (await bot.database.getAllDecorations()).find((m) => m.id === this.data.userProfile.decoration);

            if (allMasks.type === "face-mask") {
                context.drawImage(mask, this.canvas.width / 100.0, this.canvas.height / 1.45, 220, 210);
            } else {
                context.drawImage(mask, this.canvas.width / 55.0, this.canvas.height / 1.69, 200, 200)
            }
        }

        if (this.testMode && this.mask) {
            const mask = await Canvas.loadImage(`${serverURL}/masks/${this.code}`);
            context.drawImage(mask, this.canvas.width / 55.0, this.canvas.height / 1.69, 200, 200)
        }

        const blob = new Blob([this.canvas.toBuffer()], { type: 'image/png' });
        return blob;
    }

    async insertBadges() {
        const defaultBadges = await bot.database.getBadges();
        const supportServer = bot.guilds.get(768267522670723094n);
        
        let member = supportServer.members.get(this.user.id);
        if (!member) {
            member = await bot.helpers.getMember(supportServer.id, this.user.id);
        }
    
        const roles = member.roles;
    
        const roleBadges = roles
            .map(r => r.toString())
            .filter(r => defaultBadges.some(b => b.id === r));
    
        const userBadges = defaultBadges.filter(b => roleBadges.includes(b.id));
    
        if (this.data.marryStatus.marriedWith) {
            const marriedBadge = defaultBadges.find(b => b.id === "married");
            if (marriedBadge) {
                userBadges.push(marriedBadge);
            }
        }
    
        const badgeImages = await Promise.all(
            userBadges.map(badge => Canvas.loadImage(`${serverURL}/assets/badges/${badge.asset}`))
        );
    
        let x = 0;
        let y = 0;
    
        badgeImages.forEach(badge => {
            this.context.drawImage(badge, x + 10, y + 830, 50, 50);
            x += 60;
            if (x > 1300) {
                x = 0;
                y += 50;
            }
        });
    }    
}