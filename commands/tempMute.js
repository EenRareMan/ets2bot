const ms = require("ms");

const fs = require("fs");
const tempMute = JSON.parse(fs.readFileSync("./tempMutes.json", "UTF8"));

module.exports.run = async (client, message, args) => {

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("You cannot run this command.");

    if (!args[0]) return message.reply("You must provide a user.");

    var mutePerson = message.guild.members.cache.get(message.mentions.users.first().id || message.guild.members.get(args[0]).id);

    if (!mutePerson) return message.reply("Can't find the user.");

    if (mutePerson.permissions.has("KICK_MEMBERS")) return message.reply("You can't temp mute this person.");

    let muteRole = message.guild.roles.cache.get("1009075608938102837");

    if (!muteRole) return message.channel.send("Can't find the role muted.");

    var muteTime = args[1];

    if (!muteTime) return message.channel.send("Give a time. (hours/minutes/seconds)");

    if (mutePerson.roles.cache.some(role => role.name === "Muted")) {
        message.channel.send("The person is already muted.");
    } else {
        mutePerson.roles.add(muteRole.id);
        message.channel.send(`${mutePerson} is muted for ${muteTime}`);

        if (!tempMute[mutePerson]) tempMute[mutePerson] = {
            time: 0
        };

        let date = new Date();
        let dateMilli = date.getTime();
        let dateAdded = dateMilli + ms(muteTime);

        tempMute[mutePerson].time = dateAdded;

        fs.writeFile("./tempMutes.json", JSON.stringify(tempMute), (err) => {
            if (err) console.log(err);
        });

        // setTimeout(() => {

        //   mutePerson.roles.remove(muteRole.id);

        // }, ms(muteTime));

    }
}

module.exports.help = {
    name: "tempmute",
    category: "staff",
    description: "Mute a player for a time."
}