const fs = require("fs");
const canvaCord = require("canvaCord");
const discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    const levelFile = JSON.parse(fs.readFileSync("./Data/levels.json"));

    var idUser = message.author.id;

    
        var nextLevelXp = levelFile[idUser].level * 300;

        if (nextLevelXp == 0) nextLevelXp == 100;

        const rank = new canvaCord.Rank()
            .setAvatar(message.author.displayAvatarURL({ dynamic: false, format: "png" }))
            .setCurrentXP(levelFile[idUser].xp)
            .setLevel(levelFile[idUser].level)
            .setRequiredXP(nextLevelXp)
            .setProgressBar("#ffa500", "COLOR")
            .setUsername(message.author.username)
            .setDiscriminator(message.author.discriminator);

        rank.build().then(data => {
            const attachement = new discord.MessageAttachment(data, "RankCard.png");
            message.channel.send({files: [attachement]});
        });

}

module.exports.help = {
    name: "level",
    category: "info",
    description: "Check your level."
}