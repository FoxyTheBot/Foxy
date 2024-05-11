    import mongoose from 'mongoose';

    /* User related schemas */
    const keySchema = new mongoose.Schema({
        key: String,
        used: Boolean,
        expiresAt: Date,
        pType: Number,
        guild: String,
    }, { versionKey: false, id: false });
    const transactionSchema = new mongoose.Schema({
        to: String,
        from: String,
        quantity: Number,
        date: Date,
        received: Boolean,
        type: String
    }, {
        versionKey: false, id: false
    });
    const petSchema = new mongoose.Schema({
        name: String,
        type: String,
        rarity: String,
        level: Number,
        hungry: Number,
        happy: Number,
        health: Number,
        lastHungry: Date,
        lastHappy: Date,
        isDead: Boolean,
        isClean: Boolean,
        food: Array
    }, { versionKey: false, id: false });

    const userSchema = new mongoose.Schema({
        _id: String,
        userCreationTimestamp: Date,
        isBanned: Boolean,
        banDate: Date,
        banReason: String,
        userCakes: {
            balance: Number,
            lastDaily: Date,
        },
        marryStatus: {
            marriedWith: String,
            marriedDate: Date,
            cantMarry: Boolean,
        },
        userProfile: {
            decoration: String,
            decorationList: Array,
            background: String,
            backgroundList: Array,
            repCount: Number,
            lastRep: Date,
            layout: String,
            aboutme: String,
        },
        userPremium: {
            premium: Boolean,
            premiumDate: Date,
            premiumType: String,
        },
        userSettings: {
            language: String
        },
        petInfo: petSchema,
        userTransactions: [transactionSchema],
        riotAccount: {
            isLinked: Boolean,
            puuid: String,
            isPrivate: Boolean,
            region: String
        },
        premiumKeys: [keySchema]
    }, { versionKey: false, id: false });

    const riotAccountSchema = new mongoose.Schema({
        puuid: String,
        authCode: String,
    });

    /* End of user related schemas */

    /* Guild related schemas */
    const keySchemaForGuilds = new mongoose.Schema({
        key: String,
        used: Boolean,
        expiresAt: Date,
        pType: Number,
        guild: String,
        owner: String,
    }, {
        versionKey: false, id: false
    });

    const guildSchema = new mongoose.Schema({
        _id: String,
        GuildJoinLeaveModule: {
            isEnabled: Boolean,
            joinMessage: String,
            alertWhenUserLeaves: Boolean,
            leaveMessage: String,
            joinChannel: String,
            leaveChannel: String,
        },
        valAutoRoleModule: {
            isEnabled: Boolean,
            unratedRole: String,
            ironRole: String,
            bronzeRole: String,
            silverRole: String,
            goldRole: String,
            platinumRole: String,
            diamondRole: String,
            ascendantRole: String,
            immortalRole: String,
            radiantRole: String,
        },
        premiumKeys: [keySchemaForGuilds]
    }, { versionKey: false, id: false });

    /* End of guild related schemas */

    /* Bot related schemas */

    const commandsSchema = new mongoose.Schema({
        commandName: String,
        commandUsageCount: Number,
        description: String,
        isInactive: Boolean,
        subcommands: Array,
        usage: Array
    }, { versionKey: false, id: false });

    const backgroundSchema = new mongoose.Schema({
        id: String,
        name: String,
        cakes: Number,
        filename: String,
        description: String,
        author: String,
        inactive: Boolean,
    }, { versionKey: false, id: false } );

    const avatarDecorationSchema = new mongoose.Schema({
        id: String,
        name: String,
        cakes: Number,
        filename: String,
        description: String,
        inactive: Boolean,
        author: String,
        isMask: Boolean,
    }, { versionKey: false, id: false });

    export const Schemas = {
        userSchema,
        guildSchema,
        commandsSchema,
        backgroundSchema,
        riotAccountSchema,
        keySchema,
        avatarDecorationSchema
    };

    /* End of bot related schemas */