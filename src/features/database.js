const getPlayer = (query, options) => bot.db.collection("players").findOne(query, options);

const updatePlayer = (query, data) => bot.db.collection("players").updateOne(query, { $set: data }, { upsert: true });

const logChatMessage = (rank, author, message, raw) =>
    bot.db.collection("chat").insertOne({ rank, author, message, raw, timestamp: Date.now() });

const logEvent = (username, level, type, extra) =>
    bot.db.collection("events").insertOne({ username, level, type, extra, timestamp: Date.now() });

const getInventory = (query, options) => bot.db.collection("inventories").findOne(query, options);

const updateInventory = (query, data) =>
    bot.db.collection("inventories").updateOne(query, { $set: data }, { upsert: true });

module.exports = { getPlayer, updatePlayer, logChatMessage, logEvent, getInventory, updateInventory };
