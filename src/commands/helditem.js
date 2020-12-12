const Command = require("./command");
const { getEnchantmentsOfItem } = require("../features/utils");

module.exports = class HeldItemCommand extends Command {
    constructor() {
        super();
        this.name = "helditem";
        this.aliases = ["sword", "held", "item", "hand"];
        this.ignoreWhitelisted = true;
    }

    async run(author, args, raw) {
        const target = args[0] ?? author;

        const player = Object.values(bot.players).filter(p => p.username === target)[0];
        if (!player?.entity)
            return `I cannot find ${target}. They're probably too far from spawn.`;

        const enchantments = getEnchantmentsOfItem(player.entity.heldItem);

        if (enchantments.length === 0)
            return `⚔ ${player.username} ➜ Nothing!`;
        return `⚔ ${player.username} ➜ ${enchantments.join(", ")}`;
    }
};
