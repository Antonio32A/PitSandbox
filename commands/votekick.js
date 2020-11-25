const Command = require("./command");
const { waitForMessage } = require("../features/utils");
module.exports = class VotekickCommand extends Command {
    constructor() {
        super();
        this.name = "votekick";
        this.aliases = ["begone", "voteban"];
        this.donatorOnly = true;
    }

    async run(author, args, raw) {
        // this is here as a joke, because why not :^)
        const target = args[0] ?? author;

        if (!target.match(/\w{3,16}/))
            return "Invalid username!";
        bot.chat(`/votekick ${target}`);

        try {
            const timeout = await waitForMessage(/\[Voteban] Wait (?<time>\d+)s before starting a new vote\./, 1000);
            return `On timeout, ${timeout[1]}s left!`;
        } catch {}
    }
};
