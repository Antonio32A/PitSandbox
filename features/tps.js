const config = require("../config.json")
const fs = require("fs").promises;
const plotly = require("plotly")(config.plotly.username, config.plotly.apiKey);

const options = { filename: "graph", fileopt: "overwrite" };
let counter = 0;

const onTime = () => {
    if (counter !== 0 && counter % 300 === 0) {
        getData().then(data => {
            data.x.push(new Date());
            data.y.push(bot.getTps());
            // plotly.plot(data, options, err => err ? console.error(err) : null);
            counter = 0;
            updateData(data).catch(console.error);
        }).catch(console.error);
    }
    counter++;
};

const getData = () => new Promise(((resolve, reject) => {
    fs.readFile("./data/graph.json")
        .then(body => JSON.parse(body))
        .then(resolve)
        .catch(reject);
}));

const updateGraph = async () => {
    try {
        const data = await getData();
        plotly.plot(data, options, err => err ? console.error(err) : null);
    } catch (e) {
        console.error(e);
    }
};

const updateData = data => fs.writeFile("./data/graph.json", JSON.stringify(data, null, 4));

module.exports = { onTime, updateGraph };