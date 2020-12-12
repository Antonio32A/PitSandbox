const fetch = require("node-fetch");

const waitForMessage = (criteria, timeout) =>
    new Promise((resolve, reject) => {
        setTimeout(reject, timeout);

        const onMessage = message => {
            const match = message.toString().match(criteria);
            if (match)
                return resolve(match);
            else
                bot.once("message", onMessage);
        };

        bot.once("message", onMessage);
    });

const waitForWindow = timeout =>
    new Promise((resolve, reject) => {
        setTimeout(reject, timeout);
        bot.once("windowOpen", resolve);
    });

const enchRegex = /(&9[\w :\-']+)/gm;

const enchFilter = ench => {
    if (parseInt(removeFormatting(ench))) return false;
    if (ench.match(/Tier I{1,3} \w+/)) return false;

    return ![
        "Unbreakable",
        "As strong as iron",
        "Slowness I",
        "Resistance II",
        "Resistance ",
        "III"
    ].includes(removeFormatting(ench));
};

const getItemLore = item => item?.nbt?.value?.display?.value?.Lore?.value?.value;

const removeFormatting = text => text.replace(/[§&][0-9a-fklmnor]/g, "");

const getEnchantmentsOfItem = item => {
    const enchs = [];
    if (!item) return enchs;

    const lore = getItemLore(item);
    if (!lore) return enchs;
    lore.forEach(line => enchs.push(line));

    const match = enchs.map(line => line.replace(/§/g, "&"))
        .join("\n")
        .match(enchRegex);
    if (!match) return enchs;

    return match.filter(enchFilter)
        .map(e => removeFormatting(e))
        .filter(e => e !== "");
};

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generateId = () => {
    let result = "";
    for (let _ = 0; _ < 8; _++)
        result += characters.charAt(Math.floor(Math.random() * characters.length));

    return result;
};

const fetchMinecraftUUID = username => new Promise((resolve, reject) =>
    fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`)
        .then(res => res.json())
        .then(body => resolve(body.id))
        .catch(reject)
);

const fetchMinecraftUsername = uuid => new Promise((resolve, reject) =>
    fetch(`https://api.mojang.com/user/profiles/${uuid}/names`)
        .then(res => res.json())
        .then(names => resolve(names[names.length - 1].name))
        .catch(reject)
);

const authorReply = (author, message) => {
    const toSend = `/msg ${author} ${message}`;
    if (toSend.length > 100) {
        console.log(toSend);
        return bot.chat(`/msg ${author} The response is too big, please report this to Antonio32A#1337.`);
    }
    bot.chat(toSend);
};

const chatReply = (author, message) => {
    const toSend = message;
    if (toSend.length > 100) {
        console.log(toSend);
        return bot.chat(`/msg ${author} The response is too big, please report this to Antonio32A#1337.`);
    }
    bot.chat(toSend);
};

const replaceDiscordIds = message => {
    let channels = message.match(/<#[0-9]{16,18}>/g);
    let mentions = message.match(/<@!?[0-9]{16,18}>/g);
    let emotes = message.match(/<a?:\w+:[0-9]{16,18}>/g);

    if (channels) {
        channels.forEach(fullChannel => {
            const id = fullChannel.match(/<#([0-9]{16,18})>/)[1];
            const channel = client.channels.cache.get(id);
            const name = channel ? channel.name : "unknown";
            message = message.replace(new RegExp(`<#${id}>`, "g"), "#" + name);
        });
    }

    if (mentions) {
        mentions.forEach(fullMention => {
            const id = fullMention.match(/<@!?([0-9]{16,18})>/)[1];
            const user = client.users.cache.get(id);
            const name = user ? user.username + "#" + user.discriminator : "unknown";
            message = message.replace(new RegExp(`<@!?${id}>`, "g"), "@" + name);
        });
    }

    if (emotes) {
        emotes.forEach(fullEmote => {
            const emoji = fullEmote.match(/<a?:(\w+):[0-9]{16,18}>/)[1];
            const id = fullEmote.match(/<a?:\w+:([0-9]{16,18})>/)[1];
            message = message.replace(new RegExp(`<a?:${emoji}:${id}>`, "g"), emoji);
        });
    }

    return message;
};

module.exports = {
    getEnchantmentsOfItem,
    removeFormatting,
    waitForMessage,
    generateId,
    fetchMinecraftUsername,
    fetchMinecraftUUID,
    authorReply,
    chatReply,
    replaceDiscordIds,
    waitForWindow
};