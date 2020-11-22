const Command = require("../commands/command");

module.exports = class RandomPlayerCommand extends Command {
    constructor() {
        super();
        this.name = "randomplayer";
        this.check = author => author === "Antonio32A" || author === "tam259";
    }

    async run(author, args, raw) {
        bot.chat("Picking player...");

        setTimeout(() => {
            const players = Object.values(bot.players);
            const winner = players[Math.floor(players.length * Math.random())];
            bot.chat(`The winner is: ${winner.username}!`);
            return "GG!";
        }, 3000);
    }
};
