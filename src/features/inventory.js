const { waitForWindow, fetchMinecraftUUID, removeFormatting } = require("./utils");
const { updateInventory, getInventory, getPlayer } = require("./database");
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

// https://stackoverflow.com/a/13448477
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

const updateDatabase = async () => {
    for (let player of Object.values(bot.players).filter(player => !player.username.includes("[NPC]"))) {
        bot.chat("/invsee " + player.username);

        try {
            const window = await waitForWindow(1000);
            const items = window.slots;
            items.length = 36;
            const data = { uuid: player.uuid.replace(/-/g, ""), inventory: items, timestamp: Date.now() };
            await updateInventory({ uuid: player.uuid.replace(/-/, "") }, data);
        } catch (error) {
            console.error(`Failed to /invsee ${player.username}. \n${error}`);
        }
        await snooze(2000);
    }
};

(async () => {
    await snooze(10000);
    await updateDatabase();
})();
setInterval(updateDatabase, 150000);

class InventoryCommand extends Command {
	constructor(client) {
		super(client, {
			name: "inventory",
            memberName: "inventory",
			aliases: ["inv"],
			group: "default",
			description: "Shows somebody's inventory.",
            guildOnly: false,
            args: [
                {
                    key: "player",
                    prompt: "What is the username of the player?",
                    type: "string",
                },
                {
                    key: "slot",
                    prompt: "What slot of the inventory to preview, pass -1 to show the full inventory?",
                    type: "integer",
                    default: -1
                }
            ]
		});
	}

	async run(message, { player, slot }) {
		const owner = await getPlayer({ id: message.author.id });
		if (!owner?.donator)
		    return await message.reply("You most be a donator to use this command!");

		if (!player.match(/^\w{3,16}$/))
		    return await message.reply("Invalid username.");

		let uuid;
		try {
		    uuid = await fetchMinecraftUUID(player);
        } catch {
		    return await message.reply("Invalid username");
        }

        const data = await getInventory({ uuid }, { sort: { timestamp: -1 } });
		if (!data)
		    return await message.reply("I couldn't find any inventory data on that player.");

		if (slot === -1) {
		    const items = data.inventory
                .filter(i => i !== null)
                .map(i => {
                    const name = i?.nbt?.value?.display?.value?.Name?.value;
                    if (name)
                        return `${i.slot} | ${i.count}x ${removeFormatting(name)} (${i.name})`;
                    else
                        return `${i.slot} | ${i.count}x ${i.displayName} (${i.name})`;
                });

		    const embed = new MessageEmbed()
                .setColor("#00ff7e")
                .setTimestamp(data.timestamp)
                .setFooter("Last updated at ")
                .setTitle(`Inventory data for ${player}`)
                .setDescription(items.join("\n"));
		    return await message.reply(embed);
        } else {
            const items = data.inventory.filter(i => i !== null && i.slot === slot);
            if (items.length === 0)
                return message.reply("Invalid slot!");

            const i = items[0];
            let name = i?.nbt?.value?.display?.value?.Name?.value;
            if (name)
                name = `${i.count}x ${removeFormatting(name)} (${i.name})`;
            else
                name = `${i.count}x ${i.displayName} (${i.name})`;

            let lore = i?.nbt?.value?.display?.value?.Lore?.value?.value;
            if (!lore)
                lore = ["\u200B"];
            lore = lore.map(line  => removeFormatting(line));

            const embed = new MessageEmbed()
                .setColor("#00ff7e")
                .setTimestamp(data.timestamp)
                .setFooter("Last updated at ")
                .setTitle(name)
                .setDescription(lore.join("\n"));
		    return await message.reply(embed);
        }
    }

}

module.exports = { InventoryCommand };