const { waitForMessage, getEnchantmentsOfItem } = require("./utils");
const { logEvent } = require("./database");
const { eventLogChannel } = require("../config");
const { MessageEmbed } = require("discord.js");

const votebanRegex = /^\[Voteban] (\w{3,16}) got banned due to a voting!$/;
const anticheatBanRegex = /^ARES > A player has been removed from your game for cheating\.$/;
const combatLogRegex = /^(\w{3,16}) has logged out in combat!$/;
const streakRegex = /^STREAK! of (?<amount>\d+) kills by \[120] (?<username>\w{3,16})$/;
const joinRegex = /^WELCOME BACK! (\w{3,16}) just joined the server!$/;
const leaveRegex = /^OOF! (\w{3,16}) just left the server!$/;
let lastSent = Date.now();

const luckyshotOnTime = () => {
    Object.values(bot.players).forEach(player => {
        if (!player.entity) return;

        const enchantments = getEnchantmentsOfItem(player.entity.heldItem);
        if (enchantments.includes("Lucky Shot III") && (((Date.now() - lastSent) / 1000) > 10)) {
            bot.chat(`${player.username} is using Lucky Shot!`);
            logEvent(player.username, 3, "luckyshot");
            lastSent = Date.now();
        }
    });
};

const eventLog = message => {
    message = message.toString();

    if (message.match(votebanRegex)) {
        const username = message.match(votebanRegex)[1];
        logAction(username, "votebanned.");
        logEvent(username, 2, "voteban");
    }

    if (message.match(anticheatBanRegex)) {
        waitForMessage(/OOF! (\w{3,16}) just left the server!/, 1000)
            .then(response => {
                logAction(response[1], "banned by the anticheat.");
                logEvent(response[1], 1, "anticheatban");
            }).catch(console.error);
    }

    if (message.match(combatLogRegex)) {
        const username = message.match(combatLogRegex)[1];
        logAction(username, "combat logged.");
        logEvent(username, 3, "combatlog");
    }

    const streakMatch = streakRegex.exec(message);
    if (streakMatch) {
        logAction(streakMatch.groups.username, `streak of ${streakMatch.groups.amount}.`);
        logEvent(streakMatch.groups.username, 4, "streak", { amount: streakMatch.groups.amount });
    }

    if (message.match(joinRegex)) {
        const username = message.match(joinRegex)[1];
        logAction(username, "logged in.");
        logEvent(username, 5, "login");
    }

    if (message.match(leaveRegex)) {
        const username = message.match(leaveRegex)[1];
        logAction(username, "logged out.");
        logEvent(username, 5, "logout");
    }
};

const logAction = (username, action) => {
    const channel = client.channels.cache.get(eventLogChannel);
    const embed = new MessageEmbed()
        .setColor("#FF63E4")
        .setAuthor(`${username} ${action}`, `https://minotar.net/helm/${username}.png`);
    channel.send(embed).catch(console.error);
};

module.exports = { eventLog, luckyshotOnTime };