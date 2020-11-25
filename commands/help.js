const Command = require("./command");

module.exports = class HelpCommand extends Command {
    constructor() {
        super();
        this.name = "help";
        this.aliases = ["source", "botinfo"]
    }

    async run() {
        bot.chat("/show"); // the bot will be holding an item redirecting people to the github
        return "Click the link to open the bot's help and project source code.";
    }
};
