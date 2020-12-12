const { baltopChannel, baltopMessage } = require("../../config.json");
const { waitForMessage } = require("./utils");
const { MessageEmbed } = require("discord.js");

const baltopRegex = place => new RegExp(`${place}\\. (?<username>\\w{3,16}), \\$(?<money>[\\d,.]+)`);

setInterval(async () => {
    bot.chat("/baltop");
    const promises = [];

    for (let place = 1; place < 9; place++)
        promises.push(waitForMessage(baltopRegex(place), 5000))

    let players;
    try {
        players = await Promise.all(promises);
        players = players.map(p => p.groups);
    } catch (e) { return }


    let leaderboard = "";
    for (let place = 1; place < 9; place++) {
        const player = players[place - 1];
        leaderboard += `${place}. \`${player.username}\` - **$${player.money}**\n`;
    }

    const channel = client.channels.cache.get(baltopChannel);
    const message = await channel.messages.fetch(baltopMessage);

    const embed = new MessageEmbed()
        .setColor("00ff7e")
        .setTitle("Baltop")
        .setFooter("Last updated at")
        .setTimestamp(Date.now())
        .setDescription(leaderboard)

    await message.edit(embed);
}, 300000);
