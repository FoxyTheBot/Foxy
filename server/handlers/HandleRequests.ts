import express from 'express';
import { bglist } from '../../client/src/structures/json/backgroundList.json'
import { lylist, masks } from '../../client/src/structures/json/layoutList.json'
const router = express.Router();

router.get("/backgrounds/:id", (req, res): void => {
    const id = req.params.id;
    const background = bglist.find(bg => bg.id === id);
    if (background) {
        res.sendFile(background.filename, { root: "../assets/backgrounds" });
    } else {
        res.sendFile("404.png", { root: "../assets/" });
    }
    if (res.statusCode === 404) {
        console.warn("Background not found")
    }
});

router.get("/layouts/:id", (req, res) => {
    const id = req.params.id;
    const layout = lylist.find(ly => ly.id === id);
    if (layout) {
        res.sendFile(layout.filename, { root: "../assets/layouts" });
    } else {
        res.sendFile("default.png", { root: "../assets/layouts" });
    }
    if (res.statusCode === 404) {
        console.warn("Layout not found")
    }
});

router.get("/masks/:id", (req, res) => {
    const id = req.params.id;
    const mask = masks.find(msk => msk.id === id);
    if (mask) {
        res.sendFile(mask.filename, { root: "../assets/masks" });
    }
    if (res.statusCode === 404) {
        console.warn("Mask not found")
    }
});

router.get("/memes/laranjo.png", (req, res) => {
    res.sendFile("laranjo.jpeg", { root: "../assets" });
});

router.get("/memes/fodase.png", (req, res) => {
    res.sendFile("fodase.jpeg", { root: "../assets" });
});

router.get("/memes/notstonks.png", (req, res) => {
    res.sendFile("notstonks.png", { root: "../assets" });
});

router.get("/memes/stonks.png", (req, res) => {
    res.sendFile("stonks.png", { root: "../assets" });
});

router.get("/memes/windows.png", (req, res) => {
    res.sendFile("windows.png", { root: "../assets" });
});

router.get("/memes/comunismo.png", (req, res) => {
    res.sendFile("comunismo.png", { root: "../assets" });
});

router.get("/memes/windows.png", (req, res) => {
    res.sendFile("windows.png", { root: "../assets" })
});

router.get("/memes/namorada.png", (req, res) => {
    res.sendFile("namorada.png", { root: "../assets" })
});

router.get("/memes/perfeito.png", (req, res) => {
    res.sendFile("perfeito.png", { root: "../assets" })
})
module.exports = router;