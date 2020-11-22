const Command = require("../commands/command");

module.exports = class MessageCountCommand extends Command {
    constructor() {
        super();
        this.name = "messagecount";
        this.aliases = ["msgcount"];
        this.verifiedOnly = true;
    }

    async run(author, args, raw) {
        const amount = await bot.db.collection("chat").find({ author }).count();
        return `You have sent ${amount} messages!`;
    }
};
