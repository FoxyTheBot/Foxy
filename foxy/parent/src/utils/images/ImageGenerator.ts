import CreateProfile from "./generators/GenerateProfile"

export default class ImageGenerator {
    private profileGenerator: CreateProfile

    constructor() {
        this.profileGenerator = new CreateProfile();
    }

    generateProfile(locale, user, data): Promise<Blob> {
        return this.profileGenerator.create(locale, user, data);
    }
}