const Command = require("./command");
const { removeFormatting } = require("../features/utils");
const fetch = require("node-fetch");

module.exports = class PitPrestigeCommand extends Command {
    constructor() {
        super();
        this.name = "pitprestige";
        this.aliases = ["pitpres", "pitlevel", "pitlvl"];
        this.verifiedOnly = true;
    }

    async run(author, args, raw) {
        const target = args[0] ?? author;
        if (!target.match(/\w{3,16}/))
            return "Invalid username.";

        try {
            const res = await fetch(`https://pitpanda.rocks/api/players/${target}`);
            const player = await res.json();
            const prestige = player.data.formattedLevel;
            return `✦ ${target} ➜ ${removeFormatting(prestige)} ${player.data.name}`;
        } catch {
            return "Failed to load that player's playtime.";
        }
    }
};
