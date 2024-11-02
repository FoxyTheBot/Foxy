export const ImageConstants = {
    /* ---- [Memes] ---- */
    GOSTO_IMAGE: `${process.env.SERVER_URL}/assets/commands/memes/naosomosiguais.png`,
    GIRLFRIEND_IMAGE: `${process.env.SERVER_URL}/assets/commands/memes/namorada.png`,
    WINDOWS_ERROR_IMAGE: `${process.env.SERVER_URL}/assets/commands/memes/windows.png`,
    LARANJO_IMAGE: `${process.env.SERVER_URL}/assets/commands/memes/laranjo.png`,
    NOT_STONKS_IMAGE: `${process.env.SERVER_URL}/assets/commands/memes/notstonks.png`,
    STONKS_IMAGE: `${process.env.SERVER_URL}/assets/commands/memes/stonks.png`,
    MODA_IMAGE: `${process.env.SERVER_URL}/assets/commands/memes/moda.png`,
    EMINEM_VIDEO: `${process.env.SERVER_URL}/assets/commands/memes/8mile.mp4`,

    /* ---- [Profile Images] ---- */
    PROFILE_BACKGROUND(backgroundId: string) {
        return `${process.env.SERVER_URL}/backgrounds/${backgroundId}`;
    },
    PROFILE_LAYOUT(layoutId: string) {
        return `${process.env.SERVER_URL}/layouts/${layoutId}`;
    },
    PROFILE_DECORATION(maskId: string) {
        return `${process.env.SERVER_URL}/masks/${maskId}`;
    },
    MARRIED_OVERLAY(layoutId: string) {
        return `${process.env.SERVER_URL}/assets/layouts/${layoutId}-married.png`;
    },
    PROFILE_BADGES(badgeId: string) {
        return `${process.env.SERVER_URL}/assets/badges/${badgeId}`;
    },

    BANNED_BADGE: `${process.env.SERVER_URL}/assets/badges/banned.png`,
};