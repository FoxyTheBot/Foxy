import { Attachment, User } from "discordeno/transformers";
import UnleashedCommandExecutor from "../../command/structures/UnleashedCommandExecutor";
import CreateProfile from "./generators/GenerateProfile"
import GostoMemeGenerator from "./generators/GostoImageGenerator";
import WindowsErrorImageGenerator from "./generators/WindowsErrorImageGenerator";
import GirlfriendImageGenerator from "./generators/GirlfriendImageGenerator";
import LaranjoImageGenerator from "./generators/LaranjoImageGenerator";
import NotStonksImageGenerator from "./generators/NotStonksImageGenerator";
import StonksImageGenerator from "./generators/StonksImageGenerator";

export default class ImageGenerator {
    private profileGenerator: CreateProfile
    private gostoImageGenerator: GostoMemeGenerator
    private windowsErrorImageGenerator: WindowsErrorImageGenerator
    private girlfriendImageGenerator: GirlfriendImageGenerator
    private laranjoImageGenerator: LaranjoImageGenerator
    private notStonksImageGenerator: NotStonksImageGenerator
    private stonksImageGenerator: StonksImageGenerator

    constructor() {
        this.profileGenerator = new CreateProfile();
        this.gostoImageGenerator = new GostoMemeGenerator();
        this.windowsErrorImageGenerator = new WindowsErrorImageGenerator();
        this.girlfriendImageGenerator = new GirlfriendImageGenerator();
        this.laranjoImageGenerator = new LaranjoImageGenerator();
        this.notStonksImageGenerator = new NotStonksImageGenerator();
        this.stonksImageGenerator = new StonksImageGenerator();
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
}