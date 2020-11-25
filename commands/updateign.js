const Command = require("../commands/command");
const { fetchMinecraftUUID } = require("../features/utils");
const { getPlayer, updatePlayer } = require("../features/database");

module.exports = class UpdateIGNCommand extends Command {
    constructor() {
        super();
        this.name = "updateign";
        this.ownerOnly = true;
    }

    async run(author, args, raw) {
        const target = args[0] ?? author;
        try {
            const uuid = await fetchMinecraftUUID(target);
            const data = await getPlayer({ uuid });

            if (!data)
                return "User is not verified!";

            data.ign = target;
            await updatePlayer({ uuid }, data);
            return "Done!";
        } catch (error) {
            console.error(error);
            return "Something went wrong, check the console.";
        }
    }
};
