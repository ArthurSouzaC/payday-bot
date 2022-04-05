import express from 'express';
const router = new express.Router();

router.get('/invite-bot', (req, res) => {
    res.redirect('https://discord.com/api/oauth2/authorize?client_id=960937534798585946&permissions=2048&scope=bot');
});

export default router;