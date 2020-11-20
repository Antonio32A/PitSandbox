const { waitForMessage, getEnchantmentsOfItem } = require("./utils");

const flags = {};

const autoVotekick = () => {

};

const autoVotekickOnEat = entity => {
   flags[entity.username] = flags[entity.username] === undefined ? 5 : flags[entity.username] + 5;
};

const getFlags = () => flags;

module.exports = { autoVotekick, autoVotekickOnEat, getFlags };
