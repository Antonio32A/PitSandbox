const { waitForWindow } = require("./utils");
const { updateInventory, getInventory } = require("./database");

// https://stackoverflow.com/a/13448477
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

setTimeout(async () => {
    await snooze(10000)
    for (let player of Object.values(bot.players)) {
        bot.chat("/invsee " + player.username);

        try {
            const window = await waitForWindow(1000);
            const items = window.slots;
            const data = { uuid: player.uuid.replace(/-/g, ""), inventory: items, lastUpdated: Date.now() };
            await updateInventory({ uuid: player.uuid.replace(/-/, "") }, data);
        } catch (error) {
            console.error(`Failed to /invsee ${player.username}. \n${error}`);
        }
        await snooze(2000);
    }
}, 300000);
