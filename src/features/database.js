const getPlayer = (query, options) => bot.db.collection("players").findOne(query, options);

const updatePlayer = (query, data) => bot.db.collection("players").updateOne(query, { $set: data }, { upsert: true });

const logChatMessage = (rank, author, message, raw) =>
    bot.db.collection("chat").insertOne({ rank, author, message, raw, timestamp: Date.now() });

const logEvent = (username, level, type, extra) =>
    bot.db.collection("events").insertOne({ username, level, type, extra, timestamp: Date.now() });

module.exports = { getPlayer, updatePlayer, logChatMessage, logEvent };
