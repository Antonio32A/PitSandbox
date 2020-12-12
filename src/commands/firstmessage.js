const Command = require("./command");

module.exports = class FirstMessageCommand extends Command {
    constructor() {
        super();
        this.name = "firstmessage";
        this.aliases = ["firstmsg"];
        this.verifiedOnly = true;
    }

    async run(author, args, raw) {
        const target = args[0] ?? author;
        const message = await bot.db.collection("chat").findOne({ author: target }, { sort: { timestamp: 1 } });

        if (!message)
            return "I couldn't find that person in my database!";
        if (message.length > 85)
            return "Sadly the first message was too long to be sent here.";

        return "First message: " + message.message;
    }
};
