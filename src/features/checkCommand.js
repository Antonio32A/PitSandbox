const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { getPlayer } = require("./database");
const fetch = require("node-fetch");
const { owners } = require("../../config.json");

const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

const createPaste = async text => {
    const req = await fetch("https://h.antonio32a.com/documents", { method: "POST", body: text });
    const json = await req.json();
    return `https://h.antonio32a.com/${json.key}`;
};

class CheckCommand extends Command {
	constructor(client) {
		super(client, {
			name: "check",
            memberName: "check",
			aliases: ["c"],
			group: "default",
			description: "Shows information about a player.",
            guildOnly: false,
            args: [
                {
                    key: "name",
                    prompt: "What is the username of the player?",
                    type: "string",
                }
            ]
		});
	}

	async run(message, { name }) {
	    if (!owners.includes(message.author.id))
	        return message.reply("bald.");

	    await message.reply("Loading...");
        const player = await getPlayer({ ign: name });
        const events = await bot.db.collection("events").find({ username: name }, { sort: { timestamp: -1 } }).toArray();
        const messages = await bot.db.collection("chat").find({ author: name }, { sort: { timestamp: -1 } }).toArray();

        const firstLogin = new Date(parseInt(events.find(e => e.type === "login").timestamp));
        const lastLogin = new Date(parseInt(
            events.map(events.pop, [...events])
                .find(e => e.type === "login")
                .timestamp
        ));

        const anticheatBans = events.filter(e => e.type === "anticheatban").length;
        const alerts = events.filter(e => e.type === "alert");
        const alertLogs = await createPaste(alerts.map(a =>
            `${a.timestamp} | ${a.username} failed ${a.extra.name} ${a.extra.id} [V${a.extra.amount}] ${a.extra.ping}`
        ).join("\n"));

        const embed = new MessageEmbed()
            .setDescription(
                `**Username**: ${player?.ign ?? "Not linked"}\n`
                + `**UUID**: ${player?.uuid ?? "Not linked"}\n`
                + `**Discord**: ${player?.id ?? "Not linked"}\n`
                + `**First Login**: ${firstLogin}\n`
                + `**Last Login**: ${lastLogin}\n`
                + `**Anticheat Bans**: ${anticheatBans}\n`
                + `**Message Count**: ${messages.length}\n`
                + `**Alerts**: ${alerts.length}\n`
                + `**Average Ping**: ${Math.floor(average(alerts.map(alert => alert.extra.ping)))}\n`
                + `**Last Alert**: ${alerts[0].extra.name} ${alerts[0].extra.id}\n`
                + `**Last Alert Amount**: ${alerts[0].extra.amount}\n`
                + `**Last Alert Date**: ${new Date(parseInt(alerts[0].timestamp))}\n`
                + `**Alert Logs**: ${alertLogs}`
            ).setColor("#ff4e4e")
            .setAuthor(`${name}`, `https://minotar.net/helm/${name}.png`);

        await message.reply(embed);
    }
}

module.exports = { CheckCommand };