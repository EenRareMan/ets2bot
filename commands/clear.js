module.exports.run = async (client, message, args) => {

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("You cannot run this command.");

    if (!args[0]) return message.reply("Enter a number you want to remove");

    if (parseInt(args[0])) {

        var amount = parseInt(args[0]) + 1;

        message.channel.bulkDelete(amount).then(() => {

            if (parseInt(args[0]) == 1) {
                message.channel.send("I deleted 1 message.").then(mesg => {
                    setTimeout(() => {
                        mesg.delete();
                    }, 5000);
                });
            } else {
                message.channel.send(`I deleted ${parseInt(args[0])} messages.`).then(mesg => {
                    setTimeout(() => {
                        mesg.delete();
                    }, 3000);
                });
            }

        }).catch(err => {
            return message.reply("Give a number higher then 0.")
        });

    } else {
        return message.reply("Give a number.")
    }

}

module.exports.help = {
    name: "clear",
    category: "staff",
    description: "Clear messages."
}