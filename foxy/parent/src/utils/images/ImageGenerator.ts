import { Attachment, User } from "discordeno/transformers";
import UnleashedCommandExecutor from "../../command/structures/UnleashedCommandExecutor";
import CreateProfile from "./generators/GenerateProfile"
import GostoMemeGenerator from "./generators/GostoImageGenerator";
import WindowsErrorImageGenerator from "./generators/WindowsErrorImageGenerator";
import GirlfriendImageGenerator from "./generators/GirlfriendImageGenerator";
import LaranjoImageGenerator from "./generators/LaranjoImageGenerator";
import NotStonksImageGenerator from "./generators/NotStonksImageGenerator";
import StonksImageGenerator from "./generators/StonksImageGenerator";
import ModaImageGenerator from "./generators/ModaImageGenerator";
import EminemVideoGenerator from "./generators/8MileVideoGenerator";
import { Readable } from "stream";

export default class ImageGenerator {
    private profileGenerator: CreateProfile
    private gostoImageGenerator: GostoMemeGenerator
    private windowsErrorImageGenerator: WindowsErrorImageGenerator
    private girlfriendImageGenerator: GirlfriendImageGenerator
    private laranjoImageGenerator: LaranjoImageGenerator
    private notStonksImageGenerator: NotStonksImageGenerator
    private stonksImageGenerator: StonksImageGenerator
    private modaImageGenerator: ModaImageGenerator
    private Eminem8MileVideoGenerator: EminemVideoGenerator

    constructor() {
        this.profileGenerator = new CreateProfile();
        this.gostoImageGenerator = new GostoMemeGenerator();
        this.windowsErrorImageGenerator = new WindowsErrorImageGenerator();
        this.girlfriendImageGenerator = new GirlfriendImageGenerator();
        this.laranjoImageGenerator = new LaranjoImageGenerator();
        this.notStonksImageGenerator = new NotStonksImageGenerator();
        this.stonksImageGenerator = new StonksImageGenerator();
        this.modaImageGenerator = new ModaImageGenerator();
        this.Eminem8MileVideoGenerator = new EminemVideoGenerator();
    }

    generateProfile(locale, user, data, testMode?, code?, mask?): Promise<Blob> {
        return this.profileGenerator.create(locale, user, data, testMode, code, mask);
    }

    generateGostoMeme(context: UnleashedCommandExecutor, image1: Attachment, image2: Attachment, text: string): Promise<Blob> {
        return this.gostoImageGenerator.generateImage(context, image1, image2, text);
    }

    generateWindowsErrorImage(errorText: string): Promise<Blob> {
        return this.windowsErrorImageGenerator.generateImage(errorText);
    }

    generateGirlfriendImage(user: User): Promise<Blob> {
        return this.girlfriendImageGenerator.generateImage(user);
    }

    generateLaranjoImage(text: string): Promise<Blob> {
        return this.laranjoImageGenerator.generateImage(text);
    }

    generateNotStonksImage(text: string): Promise<Blob> {
        return this.notStonksImageGenerator.generateImage(text);
    }

    generateStonksImage(text: string): Promise<Blob> {
        return this.stonksImageGenerator.generateImage(text);
    }

    generateModaImage(image: Attachment): Promise<Blob> {
        return this.modaImageGenerator.generateImage(image);
    }

    generate8MileVideo(audio: Attachment) {
        return this.Eminem8MileVideoGenerator.generateVideo(audio);
    }

    streamToBuffer(stream: Readable): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            stream.on("data", chunk => chunks.push(chunk));
            stream.on("end", () => resolve(Buffer.concat(chunks)));
            stream.on("error", reject);
        });
    }
}