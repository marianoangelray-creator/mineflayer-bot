const mineflayer = require('mineflayer');
const http = require('http');

// Web server for Render port binding
http.createServer((req, res) => {
    res.write("Bot is alive!");
    res.end();
}).listen(process.env.PORT || 3000, () => {
    console.log('[+] HTTP server running for Render port binding');
});

function createBot() {
    console.log('[*] Connecting to Aternos server via DynIP...');

    const bot = mineflayer.createBot({
        host: 'hyrax.aternos.host', // Your exact DynIP
        port: 15131,
        username: 'Wifies',
        auth: 'offline',
        version: '1.21.11' // Fixed to match your Aternos version
    });

    bot.on('login', () => {
        console.log(`[+] SUCCESS: Bot joined as ${bot.username}!`);
    });

    bot.on('spawn', () => {
        console.log('[+] Bot spawned in world! Anti-AFK activity running...');

        setInterval(() => {
            if (!bot.entity) return;

            // Anti-AFK actions
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 400);

            bot.swingArm('right');

            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5) * Math.PI;
            bot.look(yaw, pitch, true);
        }, 30000);
    });

    bot.on('end', (reason) => {
        console.log(`[-] Disconnected: ${reason}. Retrying in 15 seconds...`);
        setTimeout(createBot, 15000); 
    });

    bot.on('error', (err) => {
        console.log('[!] Connection Error:', err.message);
    });
}

createBot();
