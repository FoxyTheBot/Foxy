import Canvas from 'canvas';

export default class GenerateImage {
    private client: any;
    private user: any;
    private data: any;
    private readonly width: number;
    private readonly height: number;

    constructor(client, user, data, width, height) {
        this.client = client;
        this.user = user;
        this.data = data;
        this.width = width;
        this.height = height;
    }

    async renderProfile(t): Promise<Buffer> {
        let userAboutme: string = this.data.aboutme;
        if (!userAboutme) userAboutme = `${t("commands:profile.noAboutme")}`;

        if (userAboutme.length > 85) {
            const aboutme = userAboutme.match(/.{1,85}/g);
            userAboutme = aboutme.join("\n");
        }

        const canvas = Canvas.createCanvas(this.width, this.height);
        const ctx = canvas.getContext("2d");
        const background = await Canvas.loadImage(`https://foxywebsite.xyz/api/backgrounds/${this.data.background}`);

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '70px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${this.user.username}`, canvas.width / 6.0, canvas.height / 9.5)

        ctx.font = '60px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Reps: ${this.data.repCount}`, canvas.width / 1.4, canvas.height / 10.5);

        ctx.font = '40px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`💵 FoxCoins: ${this.data.balance}`, canvas.width / 6.0, canvas.height / 4.3);

        if (this.data.marriedWith) {
            const discordProfile = await this.client.users.fetch(this.data.marriedWith);
            ctx.font = '30px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(t("commands:profile.marriedWith", { user: discordProfile.tag, date: this.data.marriedDate.toLocaleString(t.lng, { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }) }), canvas.width / 1.5, canvas.height / 6.3);
        }

        if (this.data.premium) {
            ctx.font = '30px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(t("commands:profile.premium", { date: this.data.premiumDate.toLocaleString(t.lng, { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }) }), canvas.width / 6.0, canvas.height / 6.0);
        }

        ctx.font = ('30px sans-serif');
        ctx.fillStyle = '#ffffff';
        ctx.fillText(userAboutme, canvas.width / 55.0, canvas.height / 1.2);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(this.user.displayAvatarURL({ format: 'png' }));
        ctx.drawImage(avatar, 25, 25, 200, 200);

        return canvas.toBuffer();
    }
}