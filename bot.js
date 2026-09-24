const mineflayer = require('mineflayer');
const http = require('http');

// 1. Create a minimal HTTP server for Render's port check
http.createServer((req, res) => {
    res.write("Bot is alive!");
    res.end();
}).listen(process.env.PORT || 3000, () => {
    console.log('[+] HTTP web server listening for Render port binding');
});

// 2. Your existing Mineflayer bot setup
const bot = mineflayer.createBot({
    host: 'Ray324.aternos.me',
    port: 15131,
    username: 'Wifies',
    auth: 'offline',
    version: false
});

bot.on('login', () => {
    console.log(`[+] Bot joined as ${bot.username}!`);
});

bot.on('spawn', () => {
    console.log('[+] Bot spawned in world! Starting anti-AFK activity...');

    // Anti-AFK loop: jumps, swings arm, and turns every 30 seconds
    setInterval(() => {
        if (!bot.entity) return;

        // Jump
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 400);

        // Swing hand
        bot.swingArm('right');

        // Look around
        const yaw = Math.random() * Math.PI * 2;
        const pitch = (Math.random() - 0.5) * Math.PI;
        bot.look(yaw, pitch, true);
    }, 30000);
});

bot.on('end', (reason) => {
    console.log(`[-] Disconnected: ${reason}. Retrying in 15 seconds...`);
    setTimeout(() => {
        process.exit(1);
    }, 15000);
});

bot.on('error', (err) => console.log('[!] Error:', err.message));
