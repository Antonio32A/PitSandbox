const { authorReply, fetchMinecraftUUID } = require("./utils");
const fs = require("fs");
const { getPlayer, updatePlayer } = require("./database");
const Movements = require("mineflayer-pathfinder").Movements;
const { GoalNear, GoalFollow } = require("mineflayer-pathfinder").goals;

let interval = null;
let commands = {};

fs.readdirSync("commands").forEach(file => {
    if (file !== "command.js") {
        file = file.replace(".js", "");
        let Command = require(`../commands/${file}`);
        Command = new Command();

        const names = [Command.getName(), ...Command.getAliases()];
        names.forEach(name => commands[name] = Command);
    }
});

const commandHandler = (author, raw, command, args) => {
    command = command.toLowerCase();
    if (Object.keys(commands).includes(command)) {
       commands[command].execute(author, args, raw).catch(console.error);
    }

    if (author !== "Antonio32A") return;
    const reply = authorReply;

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