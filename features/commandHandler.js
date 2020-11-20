const {
    waitForMessage,
    getEnchantmentsOfItem,
    chatReply,
    authorReply,
    fetchMinecraftUUID,
    removeFormatting
} = require("./utils");
const { getPlayer, updatePlayer } = require("./database");
const { updateGraph } = require("./tps");
const { getFlags } = require("./autoVotekick");
const { getData } = require("./verification");
const { commandWhitelist, commandBlacklist } = require("../config.json");
const Movements = require("mineflayer-pathfinder").Movements;
const { GoalNear, GoalFollow } = require("mineflayer-pathfinder").goals;
const whois = require("../data/whois.json");

let interval = null;

const commandHandler = (author, text, command, args, allChat) => {
    if (commandBlacklist.includes(author)) return;

    let reply;
    if (allChat)
        reply = chatReply;
    else
        reply = authorReply;

    if (command === "helditem") {
        const target = args[0] ? args[0] : author;
        if (commandWhitelist.includes(target))
            return reply(author, "That player is immune to that command!");

        const players = Object.values(bot.entities)
            .filter(e => e.type === "player")
            .filter(p => p.username === target);

        if (players.length === 0)
            return reply(author, `I cannot find ${target}.`);
        const player = players[0];
        const enchantments = getEnchantmentsOfItem(player.heldItem)

        if (enchantments.length === 0)
            return reply(author, `⚔ ${player.username} ➜ Nothing!`);
        reply(author, `⚔ ${player.username} ➜ ${enchantments.join(", ")}`);
    }

    if (command === "pants") {
        const target = args[0] ? args[0] : author;
        if (commandWhitelist.includes(target))
            return reply(author, "That player is immune to that command!");

        const players = Object.values(bot.entities)
            .filter(e => e.type === "player")
            .filter(p => p.username === target);

        if (players.length === 0)
            return reply(author, `I cannot find ${target}.`);
        const player = players[0];
        const enchantments = getEnchantmentsOfItem(player.equipment[2]);

        if (enchantments.length === 0)
            return reply(author, `❤ ${player.username} ➜ Nothing!`);
        reply(author, `❤ ${player.username} ➜ ${enchantments.join(", ")}`);
    }

    if (command === "tps") {
        bot.chat("/tps");
        waitForMessage(/TPS from last 1m, 5m, 15m: (?<tps>[\d.]+), [\d.]+, [\d.]+/, 3000)
            .then(response =>
                reply(author, `✯ Server TPS ➜ Client: ${bot.getTps()} | Server: ${response.groups.tps}`)
            ).catch(() => reply(author, `✯ Server TPS ➜ Client: ${bot.getTps()}`));
    }

    if (command === "show") {
        const target = author;
        if (commandWhitelist.includes(target))
            return reply(author, "That player is immune to that command!");

        const players = Object.values(bot.entities)
            .filter(e => e.type === "player")
            .filter(p => p.username === target);

        if (players.length === 0)
            return reply(author, `I cannot find ${target}.`);
        const player = players[0];
        const item = player.heldItem;
        let name = item?.nbt?.value?.display?.value?.Name?.value;

        if (!item)
            return reply(author, `${player.username} shows themselves their fist!`);
        if (!name)
            name = item.displayName;

        const count = item.count === 0 ? "" : ` ${item.count}x `;
        name = removeFormatting(name);
        authorReply(author, `${player.username} shows themselves ${count}[${name}] (${item.displayName})`);
    }

    if (command === "tammy")
        reply(author, "tammy wammy :D");

    if (command === "whois") {
        const target = args[0];
        if (!target) return;

        const text = whois[target.toLowerCase()];
        if (!text)
            return reply(author, "idk man");
        reply(author, text);
    }

    if (command === "discord") {
        const target = args[0] ? args[0] : author;
        fetchMinecraftUUID(target)
            .then(uuid =>
                getPlayer({ uuid }).then(verified => {
                    if (!verified)
                        return reply(author, `▲ ${target} ➜ Discord not linked.`);

                    let user = client.users.cache.get(verified.id);
                    if (!user)
                        user = { username: "unknown" };

                    reply(author, `▲ ${target} ➜ ${user.username} (${verified.id})`)
                })
            );
    }

    if (command === "messagecount") {
        getPlayer({ ign: author }).then(verified => {
            if (!verified)
                return reply(author, "You must be verified to use this command!");

            bot.db.collection("chat").find({ author }).count()
                .then(amount => reply(author, `You have sent ${amount} messages!`)).catch(console.error);
        }).catch(console.error);
    }

    if (command === "firstmessage") {
        const target = args[0] ? args[0] : author;
        getPlayer({ ign: author }).then(verified => {
            if (!verified)
                return reply(author, "You must be verified to use this command!");

            bot.db.collection("chat").findOne({ author: target }, { sort: { timestamp: 1 } })
                .then(message => {
                    if (message.length > 85)
                        return reply(author, "Sadly the first message was too long to be sent here.");
                    reply(author, "First message: " + message.message);
                }).catch(console.error);
        }).catch(console.error);
    }

    if (command === "lastmessage") {
        const target = args[0] ? args[0] : author;
        getPlayer({ign: author}).then(verified => {
            if (!verified)
                return reply(author, "You must be verified to use this command!");

            bot.db.collection("chat").findOne({author: target}, {sort: {timestamp: -1}})
                .then(message => {
                    if (message.length > 85)
                        return reply(author, "Sadly the last message was long big to be sent here.");
                    reply(author, "Last message: " + message.message);
                }).catch(console.error);
        }).catch(console.error);
    }

    if (author !== "Antonio32A") return;

    if (command === "come") {
        const pos = bot.players[author].entity.position;
        const defaultMove = new Movements(bot, bot.mcData);
        defaultMove.canDig = false;
        defaultMove.maxDropDown = 256;
        defaultMove.blocksToAvoid.add(bot.mcData.blocksByName.carpet.id);

        bot.pathfinder.setMovements(defaultMove);
        bot.pathfinder.setGoal(new GoalNear(pos.x, pos.y, pos.z, 1));
    }

    if (command === "follow") {
        const target = args[0] ? args[0] : author;
        const defaultMove = new Movements(bot, bot.mcData);
        defaultMove.canDig = false;
        defaultMove.maxDropDown = 256;
        defaultMove.blocksToAvoid.add(bot.mcData.blocksByName.carpet.id);

        bot.pathfinder.setMovements(defaultMove);
        bot.pathfinder.setGoal(new GoalFollow(bot.players[target].entity, 1), true);
    }

    if (command === "forward") {
        bot.setControlState("forward", true);
        setTimeout(() => bot.setControlState("forward", false), 1000);
    }
    if (command === "stop") {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
        bot.pathfinder.setGoal(null);
    }

    if (command === "fish") {
        bot.equip(bot.inventory.items().filter(i => i.name === "fishing_rod")[0], "hand", () => {
            interval = setInterval(() => bot.activateItem(), 132);
        });
    }

    if (command === "updategraph")
        updateGraph().catch(console.error);

    if (command === "flags") {
        const target = args[0] ? args[0] : author;
        const flags = getFlags()[target];
        if (!flags) return;

        reply(author, flags.toString());
    }

    if (command === "eval") {
        const toEvaluate = args.join(" ").replace(/ž/g, "."); // stupid anti link
        let response;

        try {
           response = eval(toEvaluate);
        } catch (error) {
            response = error;
        }

        if (response)
            reply(author, response.toString());
        else
            reply(author, "undefined");
    }

    if (command === "updateign") {
        const target = args[0] ? args[0] : author;
        fetchMinecraftUUID(target)
            .then(uuid => {
                getPlayer({ uuid })
                    .then(data => {
                        if (!data)
                            return reply(author, "User is not verified!");

                        data.ign = target;
                        updatePlayer({ uuid }, data)
                            .then(() => reply(author, "Done!"))
                            .catch(console.error);
                    }).catch(console.error);
            }).catch(console.error);
    }
};

module.exports = { commandHandler };