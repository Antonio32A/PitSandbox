const Command = require("./command");
const { waitForWindow } = require("../features/utils");

module.exports = class Sharpness3CountCommand extends Command {
    constructor() {
        super();
        this.name = "sharpness3count";
        this.aliases = ["sharp3count", "s3c", "s3count"];
        this.ignoreWhitelisted = true;
        this.donatorOnly = true;
    }

    async run(author, args, raw) {
        const target = args[0] ?? author;

        const player = Object.values(bot.players).filter(p => p.username === target)[0];
        if (!player)
            return `That player is not online!`;
        bot.chat("/invsee " + player.username);

        try {
            const window = await waitForWindow(1000);
            const items = window.slots;
            const count = items.filter(i => i?.nbt?.value?.ench?.value?.value[0]?.lvl?.value === 3).length;
            return `☣ ${target} ➜ ${count}x Sharpness 3`;
        } catch {
            return "Failed to /invsee user.";
        }
    }
};
