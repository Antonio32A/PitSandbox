const Command = require("./command");

module.exports = class TammyCommand extends Command {
    constructor() {
        super();
        this.name = "tammy";
    }

    async run(author, args, raw) {
        return "tammy wammy :D";
    }
};
