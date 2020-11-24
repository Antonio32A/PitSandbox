const Command = require("../commands/command");
const { fetchMinecraftUUID, authorReply, waitForMessage } = require("../features/utils");
const { getPlayer } = require("../features/database");

module.exports = class VotekickCommand extends Command {
    constructor() {
        super();
        this.name = "votekick";
        this.aliases = ["begone", "voteban"];
        this.check = async author => {
            try {
                const uuid = await fetchMinecraftUUID(author);
                const player = await getPlayer({ uuid });

                if (!player?.donator) {
                    authorReply(author, "This command is only for bot donators (50K). !buydonator");
                    return false;
                }
                return true;
            } catch {
                authorReply(author, "Invalid username?");
                return false;
            }
        };
    }

    async run(author, args, raw) {
        // this is here as a joke, because why not :^)
        const target = args[0] ? args[0] : author;

        if (!target.match(/\w{3,16}/))
            return "Invalid username!";
        bot.chat(`/votekick ${target}`);

        try {
            const timeout = await waitForMessage(/\[Voteban] Wait (?<time>\d+)s before starting a new vote\./, 1000);
            return `On timeout, ${timeout[1]}s left!`;
        } catch {}
    }
};
