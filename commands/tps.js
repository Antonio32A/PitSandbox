const Command = require("../commands/command");
const { waitForMessage } = require("../features/utils");

module.exports = class TpsCommand extends Command {
    constructor() {
        super();
        this.name = "tps";
        this.aliases = ["lag", "performance"];
    }

    async run(author, args, raw) {
        bot.chat("/tps");

        try {
            const response =
                await waitForMessage(/TPS from last 1m, 5m, 15m: (?<tps>[\d.]+), [\d.]+, [\d.]+/, 3000);
            return `✯ Server TPS ➜ Client: ${bot.getTps()} | Server: ${response.groups.tps}`;
        } catch {
            return `✯ Server TPS ➜ Client: ${bot.getTps()}`;
        }
    }
};
