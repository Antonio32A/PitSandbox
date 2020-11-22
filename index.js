const mineflayer = require("mineflayer");
const pathfinder = require("mineflayer-pathfinder").pathfinder;
// const mineflayerViewer = require("prismarine-viewer").mineflayer;
const tpsPlugin = require("mineflayer-tps")(mineflayer);
const Commando = require("discord.js-commando");
const MongoClient = require("mongodb").MongoClient;
const repl = require("repl");

const { email, password, plotly, token, joinNotify, mongoURI } = require("./config.json");
const messageRegex = /^\[(?<author>\w{3,16}) -> me] (?<message>.+)$/;
const allChatRegex = /^\[XXXV-120] (?<rank>\[\w+])? (?<author>\w{3,16}): !(?<message>.+)$/;
const joinRegex = /^WELCOME BACK! (?<ign>\w{3,16}) just joined the server!$/;
let db;

const options = {
    host: "51.68.203.77",
    port: 25565,
    version: "1.8.9",
    username: email,
    password: password,
    hideErrors: true
};

global.client = new Commando.Client({
    owner: "166630166825664512",
    commandPrefix: "-"
});

const { autoReply } = require("./features/autoreply");
const { commandHandler } = require("./features/commandHandler");
// const { onTime } = require("./features/tps");
const { bridge } = require("./features/bridge");
const { eventLog, luckyshotOnTime } = require("./features/eventLog");
const { VerifyCommand } = require("./features/verification");
const { WhoIsCommand } = require("./features/whois");
require("./features/baltop");

client.login(token);
client.registry
	.registerDefaultTypes()
    .registerGroups([
        ["default", "Default"]
    ]).registerDefaultGroups()
	.registerDefaultCommands({
        help: false,
        prefix: false,
        unknownCommand: false
    }).registerCommand(VerifyCommand)
    .registerCommand(WhoIsCommand);

const onMessage = message => {
    autoReply(message);
    bridge(message);
    eventLog(message);

    console.log(message.toAnsi());
    message = message.toString();
    const msgMatch = messageRegex.exec(message);
    const chatMatch = allChatRegex.exec(message);
    const joinMatch = joinRegex.exec(message);

    // todo: clean this up
    if (msgMatch) {
        const author = msgMatch.groups.author;
        const text = msgMatch.groups.message;
        const commandName = text.split(" ")[0];
        const commandArguments = text.split(" ");
        commandArguments.shift();
        commandHandler(author, message, commandName, commandArguments);
    }
    else if (chatMatch) {
        const author = chatMatch.groups.author;
        const text = chatMatch.groups.message;
        const commandName = text.split(" ")[0];
        const commandArguments = text.split(" ");
        commandArguments.shift();
        commandHandler(author, message, commandName, commandArguments);
    }

    if (joinMatch) {
        const username = joinMatch.groups.ign;
        const toNotify = joinNotify[username];
        if (!toNotify) return;

        try {
            const user = client.users.cache.get(toNotify);
            user.send(`**${username}** has logged in!`);
        } catch (e) {} // forbidden, or unknown user
    }
};

const onWindowOpen = window => {
    bot.clickWindow(5, 0, 0);
    bot.lastWindow = window;
};

const init = () => {
    console.log("logging in!");
    global.bot = mineflayer.createBot(options);
    bot.plotly = plotly;
    bot.db = db;

    bot.loadPlugin(tpsPlugin);
    bot.loadPlugin(pathfinder);

    bot.mcData = require("minecraft-data")(bot.version);
    bot.once("kicked", console.log);
    bot.once("end", () => setTimeout(init, 60000));
    bot.on("message", message => onMessage(message));
    bot.on("windowOpen", onWindowOpen);
    // bot.on("error", console.error);
    // bot.on("time", onTime);
    bot.on("time", luckyshotOnTime);

    // bot.on("spawn", () => mineflayerViewer(bot, { port: 3000 }));

    const r = repl.start("> ")
    r.context.bot = bot
    r.on("exit", bot.end);
};

MongoClient.connect(mongoURI, { useNewUrlParser: true })
    .then(dbClient => {
        db = dbClient.db("sandbox");
        init();
    });
