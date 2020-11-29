const Command = require("./command");
const { getKillstreak } = require("../features/killstreak");

module.exports = class KillstreakCommand extends Command {
    constructor() {
        super();
        this.name = "killstreak";
        this.aliases = ["ks", "streak", "kills"];
        this.ignoreWhitelisted = true;
        this.donatorOnly = true;
    }

    async run(author, args, raw) {
        const target = args[0] ?? author;

        const killstreak = getKillstreak(target);
        return `☠ ${target} ➜ ${killstreak} killstreak`;
    }
};
