// User structure from Discord: https://discord.com/developers/docs/resources/user#user-object-user-structure

export interface User {
    id: string,
    username: string,
    discriminator: string,
    global_name: string,
    avatar: string,
    bot: boolean,
    system: boolean,
    mfa_enabled: boolean,
    banner?: string,
    accent_color?: number,
    locale?: string,
    verified?: boolean,
    email?: string,
    flags?: number,
    clan: string | null,
    premium_type?: number,
    public_flags?: number,
}