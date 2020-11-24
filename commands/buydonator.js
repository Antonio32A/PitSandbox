const Command = require("../commands/command");
const { fetchMinecraftUUID, authorReply, waitForMessage } = require("../features/utils");
const { getPlayer, updatePlayer } = require("../features/database");

module.exports = class BuyDonatorCommand extends Command {
    constructor() {
        super();
        this.name = "buydonator";
        this.aliases = ["buydono"];
        this.check = async author => {
            try {
                const uuid = await fetchMinecraftUUID(author);
                const player = await getPlayer({ uuid });

                if (player?.donator) {
                    authorReply(author, "You already have donator!");
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
        const uuid = await fetchMinecraftUUID(author);
        const player = await getPlayer({ uuid });
        authorReply(author, "Starting donator payment process, [/pay g1thub 50000] if you wish to buy it.");

        try {
            const msg = await waitForMessage(`^\\$([\\d,.]+) has been received from ${author}\\.$`, 30000);
            console.log(msg);
            const amount = msg[1].replace(/,/g, "");
            console.log(parseFloat(amount));
            if (parseFloat(amount) < 50000)
                return "That amount of money is less than 50K!";

            player.donator = true;
            await updatePlayer({ uuid }, player);
            return "Done!";
        } catch {
            return "You didn't send the payment!";
        }
    }
};
