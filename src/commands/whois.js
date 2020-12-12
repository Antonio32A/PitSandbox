const Command = require("./command");
const whois = require("../data/whois.json");

module.exports = class WhoIsCommand extends Command {
    constructor() {
        super();
        this.name = "whois";
        this.aliases = ["who"];
    }

    async run(author, args, raw) {
        const target = args[0];
        if (!target) return;

        const text = whois[target.toLowerCase()];
        if (!text)
            return "idk man";
        return text;
    }
};
