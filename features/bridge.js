const { replaceDiscordIds } = require("./utils");
const { getPlayer, logChatMessage } = require("./database");
const { channel, footer } = require("../config.json");
const Discord = require("discord.js");

const chatRegex = /^\[XXXV-120] (?<rank>\[\w+])? (?<author>\w{3,16}): (?<message>.+)$/;

const bridge = message => {
    message = message.toString();
    const match = chatRegex.exec(message);
    if (match) {
        const author = match.groups.author;
        const text = match.groups.message;
        const rank = match.groups.rank;
        const _channel = client.channels.cache.get(channel);
        logChatMessage(rank, author, text, message);

        const name = rank ? rank + " " + author : author;
        if (author === bot.username && text.match(/\w{3,16} > .+/)) return;
        if (!_channel) return;

        const embed = new Discord.MessageEmbed()
            .setColor("#00FF7E")
            .setAuthor(name, `https://minotar.net/helm/${author}.png`)
            .setDescription(text)
            .setFooter(footer);
        _channel.send(embed).catch(console.error);
    }
};

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.id !== channel) return;

    const verified = await getPlayer({ id: message.author.id });
    if (!verified) {
        try {
            await message.delete();
        } catch (e) {
            console.error(e);
        }
        return;
    }

    const text = replaceDiscordIds(message.content);
    if (text.includes("\n") || text.length > 70)
        return message.channel.send("That message is too big or has newlines in it!");

    bot.chat(`&9${verified.ign} &e> &f${text}`);
});

module.exports = { bridge }