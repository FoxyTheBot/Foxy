import Canvas, { CanvasRenderingContext2D } from 'canvas';
import { bot } from "../../../FoxyLauncher";
import { getUserAvatar } from '../../discord/User';
import { ImageConstants } from '../utils/ImageConstants';
import { FoxyUser } from '../../../../../../common/utils/database/types/user';
import { User } from 'discordeno/transformers';
import { Layout } from '../../../../../../common/utils/database/DatabaseConnection';

export default class CreateProfile {
    private readonly width: number = 1436;
    private readonly height: number = 884;
    private canvas: Canvas.Canvas;
    private context: CanvasRenderingContext2D;

    constructor() {
        this.canvas = Canvas.createCanvas(this.width, this.height);
        this.context = this.canvas.getContext("2d");
    }

    async create(locale, user: User, data: FoxyUser) {
        const layoutInfo = await bot.database.getLayout(data.userProfile.layout);
        const userAboutMe = this.formatAboutMe(data.userProfile.aboutme || locale("commands:profile.noAboutme"), layoutInfo);

        const [layout, background, marriedCard] = await Promise.all([
            Canvas.loadImage(ImageConstants.PROFILE_LAYOUT(data.userProfile.layout)),
            Canvas.loadImage(ImageConstants.PROFILE_BACKGROUND(data.userProfile.background)),
            data.marryStatus.marriedWith ? Canvas.loadImage(ImageConstants.MARRIED_OVERLAY(data.userProfile.layout)) : null
        ]);

        this.drawBackgroundAndLayout(background, layout);
        this.drawUserDetails(user, data, userAboutMe, layoutInfo, marriedCard, locale);
        await this.drawBadges(data, user, layoutInfo);
        await this.drawDecoration(data, layoutInfo);

        return new Blob([this.canvas.toBuffer()], { type: 'image/png' });
    }

    private formatAboutMe(aboutMe: string, layoutInfo: any) {
        const limit = layoutInfo.profileSettings.aboutme.limit;
        const breakLength = layoutInfo.profileSettings.aboutme.breakLength;
        if (aboutMe.length > limit) {
            return aboutMe.match(new RegExp(`.{1,${breakLength}}`, 'g')).join("\n");
        }
        return aboutMe;
    }

    private drawBackgroundAndLayout(background: Canvas.Image, layout: Canvas.Image) {
        this.context.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(layout, 0, 0, this.canvas.width, this.canvas.height);
        this.context.strokeStyle = '#74037b';
        this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private async drawUserDetails(user: User,
        data: FoxyUser,
        userAboutMe: string,
        layoutInfo: any,
        marriedCard: Canvas.Image | null,
        locale: any
    ) {
        const fontColor = layoutInfo.darkText ? "#000000" : "#ffffff";

        this.drawText(user.username, layoutInfo.profileSettings.fontSize.username,
            layoutInfo.profileSettings.defaultFont,
            fontColor,
            layoutInfo.profileSettings.positions.usernamePosition
        );

        this.drawText(`Cakes: ${data.userCakes.balance.toLocaleString("pt-BR")}`,
            layoutInfo.profileSettings.fontSize.cakes,
            layoutInfo.profileSettings.defaultFont,
            fontColor, layoutInfo.profileSettings.positions.cakesPosition
        );

        if (marriedCard) {
            this.context.drawImage(marriedCard, 0, 0, this.canvas.width, this.canvas.height);
            this.drawText(`Casado(a) com:`,
                layoutInfo.profileSettings.fontSize.married,
                layoutInfo.profileSettings.defaultFont,
                fontColor,
                layoutInfo.profileSettings.positions.marriedPosition
            );

            const partnerUser = bot.users.get(
                BigInt(data.marryStatus.marriedWith)) || await bot.helpers.getUser(data.marryStatus.marriedWith);
            this.drawText(partnerUser.username,
                layoutInfo.profileSettings.fontSize.marriedSince,
                layoutInfo.profileSettings.defaultFont,
                fontColor,
                layoutInfo.profileSettings.positions.marriedUsernamePosition
            );

            this.drawText(`Desde ${data.marryStatus.marriedDate.toLocaleString(locale.lng)}`,
                layoutInfo.profileSettings.fontSize.marriedSince,
                layoutInfo.profileSettings.defaultFont,
                fontColor,
                layoutInfo.profileSettings.positions.marriedSincePosition
            );
        }

        this.drawText(userAboutMe,
            layoutInfo.profileSettings.fontSize.aboutme,
            layoutInfo.profileSettings.defaultFont,
            fontColor,
            layoutInfo.profileSettings.positions.aboutmePosition
        );

        this.drawUserAvatar(user, layoutInfo);
    }

    private drawText(text: string, fontSize: number, fontFamily: string, color: string, position: { x: number, y: number }) {
        this.context.font = `${fontSize}px ${fontFamily}`;
        this.context.fillStyle = color;
        this.context.fillText(text, this.canvas.width / position.x, this.canvas.height / position.y);
    }

    private async drawUserAvatar(user: User, layoutInfo: any) {
        const avatarUrl = getUserAvatar(user, { size: 2048 });
        const avatar = await Canvas.loadImage(avatarUrl);
        this.context.save();
        this.context.beginPath();
        this.context.arc(125, 700, 100, 0, Math.PI * 2, true);
        this.context.closePath();
        this.context.clip();
        this.context.drawImage(avatar,
            layoutInfo.profileSettings.positions.avatarPosition.x,
            layoutInfo.profileSettings.positions.avatarPosition.y,
            200,
            200
        );
        this.context.restore();
    }

    private async drawBadges(data: FoxyUser, user: User, layoutInfo: Layout) {
        const defaultBadges = await bot.database.getBadges();
        const supportServer = bot.guilds.get(768267522670723094n);

        let member = supportServer.members.get(user.id)
            ?? await bot.members.get(user.id)
            ?? await bot.helpers.getMember(supportServer.id, user.id);

        const userBadges = this.getUserBadges(member, defaultBadges, data);
        if (!userBadges.length) return;

        let x = layoutInfo.profileSettings.positions.badgesPosition.x;
        let y = layoutInfo.profileSettings.positions.badgesPosition.y;

        for (const badge of userBadges) {
            const badgeImage = await Canvas.loadImage(ImageConstants.PROFILE_BADGES(badge.asset));
            this.context.drawImage(badgeImage, x, y, 50, 50);
            x += 60;
            if (x > 1300) {
                x = 0;
                y += 50;
            }
        }
    }

    private getUserBadges(member: any, defaultBadges: any[], data: FoxyUser) {
        const roleBadges = member?.roles.map(r => r.toString()).filter(r => defaultBadges.some(b => b.id === r)) || [];
        const userBadges = roleBadges.map(id => defaultBadges.find(b => b.id === id)).filter(b => b) || [];

        if (data.marryStatus.marriedWith) {
            const marriedBadge = defaultBadges.find(b => b.id === "married");
            if (marriedBadge) userBadges.push(marriedBadge);
        }

        return userBadges.sort((a, b) => b.priority - a.priority);
    }

    private async drawDecoration(data: FoxyUser, layoutInfo: Layout) {
        if (data.userProfile.decoration) {
            const decorationImage = await Canvas.loadImage(ImageConstants.PROFILE_DECORATION(data.userProfile.decoration));
            this.context.drawImage(decorationImage,
                this.canvas.width / layoutInfo.profileSettings.positions.decorationPosition.x,
                this.canvas.height / layoutInfo.profileSettings.positions.decorationPosition.y,
                200,
                200);
        }
    }
}