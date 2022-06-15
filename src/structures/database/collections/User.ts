import { Schema } from 'mongoose';

const User = new Schema({
    _id: { type: String, index: { unique: true } },
    userCreationTimestamp: { type: Date, default: Date.now() },
    premium: { type: Boolean, default: false },
    premiumDate: { type: Date, default: null },
    premiumType: { type: String, default: null },
    isBanned: { type: Boolean, default: false },
    banData: { type: Date, default: null },
    banReason: { type: String, default: null },
    aboutme: { type: String, default: null },
    balance: { type: Number, default: 0 },
    lastDaily: { type: Date, default: null },
    marriedWith: { type: String, default: null },
    marriedDate: { type: Date, default: null },
    repCount: { type: Number, default: 0 },
    lastRep: { type: Date, default: null },
    background: { type: String, default: "default" },
    backgrounds: { type: Array, default: ["default"] },
    language: { type: String, default: "pt-BR" },
});

export default User