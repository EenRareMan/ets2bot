const botConfig = require("../botConfig.json");

module.exports.run = async (client, message, args) => {

    try {

        var prefix = botConfig.prefix;

        var response = "**Bot Commands**\r\n\n";
        var general = "**__General__**\r\n";
        var info = "\n**__Information__**\r\n";
        var staff = "\n**__Staff Commands__**\r\n"

        client.commands.forEach(command => {

            switch (command.help.category) {

                case "general":
                    general += `${prefix}${command.help.name} - ${command.help.description}\r\n`;
                    break;

                case "info":
                    info += `${prefix}${command.help.name} - ${command.help.description}\r\n`;
                    break;

                case "staff":
                    staff += `${prefix}${command.help.name} - ${command.help.description}\r\n`;
                    break;

            }

        });

        response += general + info + staff;

        message.author.send(response).then(() => {
            return message.reply("Check your private messages.")
        }).catch(() => {
            return message.reply("Your private messages are off.")
        });

    } catch (error) {
        message.reply("There was a problem executing the command.");
    }

}

module.exports.help = {
    name: "help",
    category: "info",
    description: "Sends you a message with all the commands."
}