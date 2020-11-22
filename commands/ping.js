const Command = require("../commands/command");

module.exports = class PingCommand extends Command {
    constructor() {
        super();
        this.name = "ping";
        this.ignoreWhitelisted = true;
    }

    async run(author, args, raw) {
        const target = args[0] ? args[0] : author;
        const player = bot.players[target];

        if (!player)
            return "That person is not online!";
        return `☕ ${target} ➜ ${player.ping}`;
    }
};
