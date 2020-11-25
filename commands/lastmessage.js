const Command = require("../commands/command");

module.exports = class LastMessageCommand extends Command {
    constructor() {
        super();
        this.name = "lastmessage";
        this.aliases = ["lastmsg"];
        this.verifiedOnly = true;
    }

    async run(author, args, raw) {
        const target = args[0] ?? author;
        const message = await bot.db.collection("chat").findOne({ author: target }, { sort: { timestamp: -1 } })

        if (!message)
            return "I couldn't find that person in my database!";
        if (message.length > 85)
            return "Sadly the last message was long big to be sent here.";

        return "Last message: " + message.message;
    }
};
