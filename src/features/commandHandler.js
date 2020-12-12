const fs = require("fs").promises;

let commands = {};
fs.readdir("commands")
    .then(files =>
        files.forEach(file => {
            if (file !== "command.js") {
                file = file.replace(".js", "");
                let Command = require(`../commands/${file}`);
                Command = new Command();

                const names = [Command.getName(), ...Command.getAliases()];
                names.forEach(name => commands[name] = Command);
            }
        })
    );

const commandHandler = (author, raw, command, args) => {
    command = command.toLowerCase();
    if (Object.keys(commands).includes(command)) {
       commands[command].execute(author, args, raw).catch(console.error);
    }
};

module.exports = { commandHandler };