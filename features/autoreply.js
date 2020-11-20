const { waitForMessage } = require("./utils");

const votebanStartRegex = /^\[Voteban] \w{3,16} started a vote to ban \w{3,16}! \d+ votes are required\.$/;
const votebanRegex = /^\[Voteban] (\w{3,16}) got banned due to a voting!$/;
const anticheatBanRegex = /^ARES > A player has been removed from your game for cheating\.$/;
const combatLogRegex = /^(\w{3,16}) has logged out in combat!$/;
const joinRegex = /^WELCOME BACK! (\w{3,16}) just joined the server!$/;
const leaveRegex = /^OOF! (\w{3,16}) just left the server!$/;

const autoReply = message => {
    message = message.toString();

    if (message.match(votebanRegex)) {
        const username = message.match(votebanRegex)[1];
        bot.chat(`L ${username}.`);
    }

    if (message.match(votebanStartRegex))
        bot.chat("/vote yes");

    if (message.match(anticheatBanRegex)) {
        waitForMessage(/OOF! (\w{3,16}) just left the server!/, 1000)
            .then(response => bot.chat(`L ${response[1]}.`))
            .catch(console.error);
    }

    if (message.match(combatLogRegex)) {
        const username = message.match(combatLogRegex)[1];
        bot.chat(`yikes ${username}.`);
    }

    if (message.match(joinRegex)) {
        const username = message.match(joinRegex)[1];
        if (username === "Antonio32A")
            bot.chat("welcome back master");
        bot.chat(`/msg ${username} Boop!`);
    }

    if (message.match(leaveRegex)) {
        const username = message.match(leaveRegex)[1];
        if (username === "Antonio32A")
            bot.chat("goodbye master");
    }
};

module.exports = { autoReply };