const { pointsChannel, pointsMessage } = require("../../config.json");
const { waitForMessage } = require("./utils");
const { MessageEmbed } = require("discord.js");

const pointsRegex = place => new RegExp(`#${place} (?<username>\\w{3,16}) - (?<points>[\\d,.]+)`);

setInterval(async () => {
    bot.chat("/leaderboard");
    const promises = [];

    for (let place = 1; place < 3; place++)
        promises.push(waitForMessage(pointsRegex(place), 5000))

    let players;
    try {
        players = await Promise.all(promises);
        players = players.map(p => p.groups);
    } catch (e) { return }


    let leaderboard = "";
    for (let place = 1; place < 9; place++) {
        const player = players[place - 1];
        leaderboard += `${place}. \`${player.username}\` - **$${player.points}**\n`;
    }

    const channel = client.channels.cache.get(pointsChannel);
    const message = await channel.messages.fetch(pointsMessage);

    const embed = new MessageEmbed()
        .setColor("#3475ce")
        .setTitle("Points Leaderboard")
        .setFooter("Last updated at")
        .setTimestamp(Date.now())
        .setDescription(leaderboard)

    await message.edit(embed);
}, 10000);
