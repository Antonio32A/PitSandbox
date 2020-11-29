const regex = /^STREAK! of (?<kills>\d+) kills by \[120] (?<username>\w{3,16})$/;
let killstreaks = {};

const onMessageKillstreak = message => {
    const match = regex.exec(message);
    if (match) {
        killstreaks[match.groups.username] = match.groups.kills;
    }
};

const getKillstreak = username => killstreaks[username] ?? 0;

module.exports = { getKillstreak, onMessageKillstreak };