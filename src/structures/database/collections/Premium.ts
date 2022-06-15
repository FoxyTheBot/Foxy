import { Schema } from 'mongoose';

const Premium = new Schema({
    _id: { type: String, index: { unique: true } },
    key: { type: String, index: { unique: true } }
});

export default Premium;