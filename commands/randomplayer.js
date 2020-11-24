const Command = require("../commands/command");

module.exports = class RandomPlayerCommand extends Command {
    constructor() {
        super();
        this.name = "randomplayer";
        this.ownerOnly = true;
    }

    async run(author, args, raw) {
        bot.chat("&aP&bi&cc&dk&ei&fn&1g &2p&3l&4a&5y&6e&7r&8.&9.&0.");

        setTimeout(() => {
            const players = Object.values(bot.players);
            const winner = players[Math.floor(players.length * Math.random())];
            bot.chat(`&eThe &aw&bi&cn&dn&ee&fr &eis&8: &d${winner.username}!`);
            return "GG!";
        }, 3000);
    }
};
