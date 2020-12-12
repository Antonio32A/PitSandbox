const { joinMessages } = require("../../config.json");

const votebanStartRegex = /^\[Voteban] \w{3,16} started a vote to ban \w{3,16}! \d+ votes are required\.$/;
const votebanRegex = /^\[Voteban] (\w{3,16}) got banned due to a voting!$/;
const anticheatBanRegex = /^ARES > (\w{3,16}) has been removed from your game for cheating\.$/;
const combatLogRegex = /^(\w{3,16}) has logged out in combat!$/;
const joinRegex = /^WELCOME BACK! (\w{3,16}) just joined the server!$/;
const leaveRegex = /^OOF! (\w{3,16}) just left the server!$/;

const autoReply = message => {
    message = message.toString();

    if (message.match(votebanRegex)) {
        const username = message.match(votebanRegex)[1];
        bot.chat(`&4L &c${username}.`);
    }

    if (message.match(votebanStartRegex))
        bot.chat("/vote yes");

    if (message.match(anticheatBanRegex)) {
        bot.chat(`&4L &c${message.match(anticheatBanRegex)[1]}.`);
    }

    if (message.match(combatLogRegex)) {
        const username = message.match(combatLogRegex)[1];
        bot.chat(`&cyikes ${username}.`);
    }

    if (message.match(joinRegex)) {
        const username = message.match(joinRegex)[1];
        const msg = joinMessages[username];

        if (msg)
            bot.chat(msg);
        bot.chat(`/msg ${username} Boop!`);
    }

    if (message.match(leaveRegex)) {
        const username = message.match(leaveRegex)[1];
        if (username === "Antonio32A")
            bot.chat("&9goodbye master");
    }
};

module.exports = { autoReply };