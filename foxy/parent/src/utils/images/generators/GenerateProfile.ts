import Canvas, { CanvasRenderingContext2D } from 'canvas';
import { bot } from "../../../FoxyLauncher";
import moment from 'moment';
import { getUserAvatar } from '../../discord/User';
import { lylist } from '../../../structures/json/layoutList.json';
import { ImageConstants } from '../utils/ImageConstants';

export default class CreateProfile {
    private readonly width: number = 1436;
    private readonly height: number = 884;
    private canvas: Canvas.Canvas;
    private context: CanvasRenderingContext2D;

    constructor() {
        this.canvas = Canvas.createCanvas(this.width, this.height);
        this.context = this.canvas.getContext("2d");
    }

    async create(locale, user, data, testMode?, code?, mask?) {
        let userAboutme = data.userProfile.aboutme || locale("commands:profile.noAboutme");
        
        if (data.isBanned) {
            userAboutme = bot.locale('commands:profile.banned', {
                user: await bot.rest.foxy.getUserDisplayName(user.id),
                reason: data.banReason,
                date: data.banDate.toLocaleString(global.t.lng, {
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
        const layoutData = lylist.find((l) => l.id === data.userProfile.layout);
        const isLayoutWhite = layoutData.darkText;

        const [layout, background] = await Promise.all([
            Canvas.loadImage(ImageConstants.PROFILE_LAYOUT(data.userProfile.layout)),
            Canvas.loadImage(ImageConstants.PROFILE_BACKGROUND(data.userProfile.background))
        ]);

        if (testMode && !mask) {
            userAboutme = locale("commands:profile.testMode");
        }

        const fontColor = isLayoutWhite ? "#000000" : "#ffffff";
        context.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
        context.drawImage(layout, 0, 0, this.canvas.width, this.canvas.height);

        context.strokeStyle = '#74037b';
        context.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        context.font = '70px Anton';
        context.fillStyle = fontColor;
        context.fillText(user.username, this.canvas.width / 5.8, this.canvas.height / 1.35);

        context.font = '43px Anton';
        context.fillText(`Cakes: ${data.userCakes.balance.toLocaleString("pt-BR")}\nReps: ${data.userProfile.repCount.toLocaleString("pt-BR")}`, this.canvas.width / 1.30, this.canvas.height / 1.4);

        if (data.marryStatus.marriedWith) {
            moment.locale(locale.lng);
            const partnerUser = bot.users.get(data.marryStatus.marriedWith) || await bot.helpers.getUser(data.marryStatus.marriedWith);
            const marriedCard = await Canvas.loadImage(ImageConstants.MARRIED_OVERLAY(data.userProfile.layout));
            context.drawImage(marriedCard, 0, 0, this.canvas.width, this.canvas.height);
            context.font = '50px Anton';
            context.fillText("Casado(a) com:", this.canvas.width / 1.40, this.canvas.height / 16);
            context.font = '35px Anton';
            context.fillText(partnerUser.username, this.canvas.width / 1.40, this.canvas.height / 9);
            context.fillText(`Desde ${data.marryStatus.marriedDate.toLocaleString(locale.lng)}`, this.canvas.width / 1.40, this.canvas.height / 6.5);
        }

        context.font = '27px Anton';
        context.fillText(userAboutme, this.canvas.width / 5.8, this.canvas.height / 1.26);
        context.save();

        context.beginPath();
        context.arc(125, 700, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        let getAvatar = getUserAvatar(user, { size: 2048 }).replace(".jpg", "");
        const avatar = await Canvas.loadImage(getAvatar);
        context.drawImage(avatar, 25, 600, 200, 200);
        context.restore();

        await this.insertBadges(data, user);

        if (data.userProfile.decoration && !mask) {
            const mask = await Canvas.loadImage(ImageConstants.PROFILE_DECORATION(data.userProfile.decoration));
            const currentMask = await bot.database.getDecoration(data.userProfile.decoration);
            const maskPosition = currentMask.isMask ? [this.canvas.width / 100.0, this.canvas.height / 1.45, 220, 210] : [this.canvas.width / 55.0, this.canvas.height / 1.69, 200, 200];
            context.drawImage(mask, ...maskPosition as [number, number, number, number]);
        }

        if (data.isBanned) {
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

    async insertBadges(data, user) {
        const defaultBadges = await bot.database.getBadges();
        const supportServer = bot.guilds.get(768267522670723094n);
        let member = supportServer.members.get(user.id);

        if (!member) {
            try {
                member = await bot.members.get(user.id)
                ?? await bot.helpers.getMember(supportServer.id, user.id);
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

        if (data.isBanned) {
            const bannedBadge = await Canvas.loadImage(ImageConstants.BANNED_BADGE);
            userBadges = [bannedBadge];
        } else {
            const additionalBadges = [
                { condition: data.marryStatus.marriedWith, id: "married" }
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
                userBadges.map(badge => Canvas.loadImage(ImageConstants.PROFILE_BADGES(badge.asset)))
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