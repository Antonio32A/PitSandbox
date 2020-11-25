const Command = require("../commands/command");
const { getEnchantmentsOfItem } = require("../features/utils");

module.exports = class PantsCommands extends Command {
    constructor() {
        super();
        this.name = "pants";
        this.aliases = ["pant", "armor"];
        this.ignoreWhitelisted = true;
    }

    async run(author, args, raw) {
        const target = args[0] ?? author;

        const player = Object.values(bot.players).filter(p => p.username === target)[0];
        if (!player?.entity)
            return `I cannot find ${target}. They're probably too far from spawn.`;

        const enchantments = getEnchantmentsOfItem(player.entity.equipment[2]);

        if (enchantments.length === 0)
            return `❤ ${player.username} ➜ Nothing!`;
        return `❤ ${player.username} ➜ ${enchantments.join(", ")}`;
    }
};
