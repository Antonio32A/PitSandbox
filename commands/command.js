const { commandBlacklist, commandWhitelist } = require("../config.json");
const { authorReply } = require("../features/utils");
const { getPlayer } = require("../features/database");

module.exports = class Command {
    constructor() {
        this.name;
        this.aliases = [];
        this.verifiedOnly = false;
        this.ownerOnly = false;
        this.bypassBlacklist = false;
        this.ignoreWhitelisted = false;
    }

    getAliases() {
        return this.aliases
    }

    getName() {
        return this.name
    }

    async run(author, args, raw) {}

    async canRun(author, args, raw) {
        if (
            this.ignoreWhitelisted
            && args[0]
            && commandWhitelist.includes(args[0])
        ) {
            authorReply(author, "That person is immune to that command!");
            return false;
        }

        if (commandBlacklist.includes(author) && !this.bypassBlacklist)
            return false;

        if (this.verifiedOnly) {
            const verified = await getPlayer({ ign: author });
            if (!verified) {
                authorReply(author, "You must be verified to use this command!");
                return false;
            }
        }

        if (this.ownerOnly) {
            if (author !== "Antonio32A")
                return false;
        }
        return true;
    }

    async execute(author, args, raw) {
        const canExecute = await this.canRun(author, args, raw);
        if (canExecute) {
            try {
                const response = await this.run(author, args, raw);
                if (response)
                    authorReply(author, response);
            } catch (error) {
                // todo: better error handler
                console.error(error);
            }
        } else
            console.log(`${author} no perms bad lol.`);
    }
};