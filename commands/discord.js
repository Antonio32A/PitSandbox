const Command = require("../commands/command");
const { fetchMinecraftUUID } = require("../features/utils");
const { getPlayer } = require("../features/database");

module.exports = class DiscordCommand extends Command {
    constructor() {
        super();
        this.name = "discord";
    }

    async run(author, args, raw) {
        const target = args[0] ? args[0] : author;

        try {
            const uuid = await fetchMinecraftUUID(target);
            const verified = await getPlayer({ uuid });

            if (!verified)
                return `▲ ${target} ➜ Discord not linked.`;

            let user = client.users.cache.get(verified.id);
            if (!user)
                user = { username: "unknown" };

            return `▲ ${target} ➜ ${user.username} (${verified.id})`;
        } catch {
            return "Invalid username.";
        }
    }
};
