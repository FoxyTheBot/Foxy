import Canvas, { CanvasRenderingContext2D } from 'canvas';
import { bot } from "../../../FoxyLauncher";
import moment from 'moment';
import { getUserAvatar } from '../../discord/User';
import { serverURL } from '../../../../config.json';
import { lylist } from '../../../structures/json/layoutList.json';
import { User } from 'discordeno/transformers';

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
        let userAboutme = this.data.userProfile.aboutme || this.locale("commands:profile.noAboutme");
        
        if (this.data.isBanned) {
            userAboutme = bot.locale('commands:profile.banned', {
                user: await bot.rest.foxy.getUserDisplayName(this.user.id),
                reason: this.data.banReason,
                date: this.data.banDate.toLocaleString(global.t.lng, {
                    timeZone: "America/Sao_Paulo",
                    hour: '2-digit',
                    minute: '2-digit',
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                })
            });
        }

        if (userAboutme.length > 84) {
            userAboutme = userAboutme.match(/.{1,65}/g).join("\n");
        }

        const context = this.canvas.getContext("2d");
        const layoutData = lylist.find((l) => l.id === this.data.userProfile.layout);
        const isLayoutWhite = layoutData.darkText;

        const [layout, background] = await Promise.all([
            Canvas.loadImage(`${serverURL}/layouts/${this.data.userProfile.layout}`),
            Canvas.loadImage(`${serverURL}/backgrounds/${this.testMode && !this.mask ? this.code : this.data.userProfile.background}`)
        ]);

        if (this.testMode && !this.mask) {
            userAboutme = this.locale("commands:profile.testMode");
        }

        const fontColor = isLayoutWhite ? "#000000" : "#ffffff";
        context.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
        context.drawImage(layout, 0, 0, this.canvas.width, this.canvas.height);

        context.strokeStyle = '#74037b';
        context.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        context.font = '70px Anton';
        context.fillStyle = fontColor;
        context.fillText(this.user.username, this.canvas.width / 5.8, this.canvas.height / 1.35);

        context.font = '43px Anton';
        context.fillText(`Cakes: ${this.data.userCakes.balance.toLocaleString("pt-BR")}\nReps: ${this.data.userProfile.repCount.toLocaleString("pt-BR")}`, this.canvas.width / 1.30, this.canvas.height / 1.4);

        if (this.data.marryStatus.marriedWith) {
            moment.locale(this.locale.lng);
            const partnerUser = bot.users.get(this.data.marryStatus.marriedWith) || await bot.helpers.getUser(this.data.marryStatus.marriedWith);
            const marriedCard = await Canvas.loadImage(`${serverURL}/assets/layouts/${this.data.userProfile.layout}-married.png`);
            context.drawImage(marriedCard, 0, 0, this.canvas.width, this.canvas.height);
            context.font = '50px Anton';
            context.fillText("Casado(a) com:", this.canvas.width / 1.40, this.canvas.height / 16);
            context.font = '35px Anton';
            context.fillText(partnerUser.username, this.canvas.width / 1.40, this.canvas.height / 9);
            context.fillText(`Desde ${this.data.marryStatus.marriedDate.toLocaleString(this.locale.lng)}`, this.canvas.width / 1.40, this.canvas.height / 6.5);
        }

        context.font = '27px Anton';
        context.fillText(userAboutme, this.canvas.width / 5.8, this.canvas.height / 1.26);
        context.save();

        context.beginPath();
        context.arc(125, 700, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        let getAvatar = getUserAvatar(this.user, { size: 2048 }).replace(".jpg", "");
        const avatar = await Canvas.loadImage(getAvatar);
        context.drawImage(avatar, 25, 600, 200, 200);
        context.restore();

        await this.insertBadges();

        if (this.data.userProfile.decoration && !this.mask) {
            const mask = await Canvas.loadImage(`${serverURL}/masks/${this.data.userProfile.decoration}`);
            const currentMask = await bot.database.getDecoration(this.data.userProfile.decoration);
            const maskPosition = currentMask.isMask ? [this.canvas.width / 100.0, this.canvas.height / 1.45, 220, 210] : [this.canvas.width / 55.0, this.canvas.height / 1.69, 200, 200];
            context.drawImage(mask, ...maskPosition as [number, number, number, number]);
        }

        if (this.testMode && this.mask) {
            const mask = await Canvas.loadImage(`${serverURL}/masks/${this.code}`);
            context.drawImage(mask, this.canvas.width / 55.0, this.canvas.height / 1.69, 200, 200);
        }
        if (this.data.isBanned) {
            this.applyBlackAndWhiteFilter();
        }

        const blob = new Blob([this.canvas.toBuffer()], { type: 'image/png' });
        return blob;
    }

    applyBlackAndWhiteFilter() {
        const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const grayscale = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
            data[i] = data[i + 1] = data[i + 2] = grayscale;
        }

        this.context.putImageData(imageData, 0, 0);
    }

    async insertBadges() {
        const defaultBadges = await bot.database.getBadges();
        const supportServer = bot.guilds.get(768267522670723094n);
        let member = supportServer.members.get(this.user.id);

        if (!member) {
            try {
                member = await bot.members.get(this.user.id)
                ?? await bot.helpers.getMember(supportServer.id, this.user.id);
            } catch (error: any) {
                if (error.message.includes("Unknown Member")) {
                    member = null;
                } else {
                    throw error;
                }
            }
        }

        let userBadges = [];
        const roleBadges = member?.roles
            .map(r => r.toString())
            .filter(r => defaultBadges.some(b => b.id === r)) ?? null;

        if (member) {
            userBadges = defaultBadges.filter(b => roleBadges.includes(b.id));
        }

        if (this.data.isBanned) {
            const bannedBadge = await Canvas.loadImage(`${serverURL}/assets/badges/banned.png`);
            userBadges = [bannedBadge];
        } else {
            const additionalBadges = [
                { condition: this.data.marryStatus.marriedWith, id: "married" },
                { condition: this.data.riotAccount.isLinked, id: "valorant" }
            ];

            additionalBadges.forEach(({ condition, id }) => {
                if (condition) {
                    const badge = defaultBadges.find(b => b.id === id);
                    if (badge) userBadges.push(badge);
                }
            });

            if (!userBadges.length) return null;

            userBadges.sort((a, b) => b.priority - a.priority);
            userBadges = await Promise.all(
                userBadges.map(badge => Canvas.loadImage(`${serverURL}/assets/badges/${badge.asset}`))
            );
        }

        let x = 0;
        let y = 0;

        userBadges.forEach(badge => {
            this.context.drawImage(badge, x + 10, y + 830, 50, 50);
            x += 60;
            if (x > 1300) {
                x = 0;
                y += 50;
            }
        });
    }
}