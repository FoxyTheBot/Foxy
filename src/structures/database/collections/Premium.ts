import { Schema } from 'mongoose';

const Premium = new Schema({
    _id: { type: String },
    key: { type: String, index: { unique: true } }
}, { versionKey: false, id: false });

export default Premium;