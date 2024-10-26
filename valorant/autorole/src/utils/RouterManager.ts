import express from 'express';
import ValAutoRoleModule from './AutoroleManager';

const router = express.Router();
const autoroleManager = new ValAutoRoleModule();

router.get("/guilds/:guildId/user/:userId", async (req, res) => {
    const { guildId, userId } = req.params;
    const updateRoleResult = await autoroleManager.updateRole(userId, guildId);
    res.json({ status: updateRoleResult });
});

module.exports = router;