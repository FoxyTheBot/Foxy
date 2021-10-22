const mongoose = require('mongoose');
const { uri } = require('../../config.json');

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) return console.log('[ERROR] - Ocorreu um erro no cliente do mongodb! verifique se a sua URI est� correta!', stderr);
});

const userSchema = new mongoose.Schema({
    user: String,
    coins: Number,
    lastDaily: String,
    reps: Number,
    lastRep: String,
    backgrounds: Array,
    background: String,
    aboutme: String,
    marry: String,
    premium: Boolean,
});

module.exports = mongoose.model('user', userSchema);