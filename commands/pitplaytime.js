const Command = require("../commands/command");
const fetch = require("node-fetch");

module.exports = class PitPlaytimeCommand extends Command {
    constructor() {
        super();
        this.name = "pitplaytime";
        this.verifiedOnly = true;
    }

    async run(author, args, raw) {
        const target = args[0] ?? author;
        if (!target.match(/\w{3,16}/))
            return "Invalid username.";

        try {
            const res = await fetch(`https://pitpanda.rocks/api/players/${target}`);
            const player = await res.json();
            const playtime = player.data.playtime / 60;
            return `☀ ${target} ➜ ${Math.floor(playtime)} hours (Hypixel Pit)`;
        } catch {
            return "Failed to load that player's playtime.";
        }
    }
};
