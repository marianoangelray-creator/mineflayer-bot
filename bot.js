const mineflayer = require('mineflayer');
const http = require('http');

// 1. Keep Render web service alive
http.createServer((req, res) => {
    res.write("Bot is alive!");
    res.end();
}).listen(process.env.PORT || 3000, () => {
    console.log('[+] HTTP server running for Render port binding');
});

function createBot() {
    console.log('[*] Connecting to Aternos server...');

    const bot = mineflayer.createBot({
        host: 'Ray324.aternos.me', 
        port: 15131,
        username: 'Wifies',
        auth: 'offline',
        version: '1.21.11' // Fixed to match your server version
    });

    bot.on('login', () => {
        console.log(`[+] SUCCESS: Bot joined as ${bot.username}!`);
    });

    bot.on('spawn', () => {
        console.log('[+] Bot spawned in world! Starting anti-AFK activity...');

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
        console.log(`[-] Disconnected: ${reason}. Retrying connection in 15 seconds...`);
        setTimeout(createBot, 15000); 
    });

    bot.on('error', (err) => {
        console.log('[!] Connection Error:', err.message);
    });
}

createBot();
