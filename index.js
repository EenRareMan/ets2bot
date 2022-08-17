const { Client, Intents, Collection, DiscordAPIError, MessageEmbed } = require("discord.js");
const botConfig = require("./botConfig.json");
const fs = require("fs");
const { channel } = require("diagnostics_channel");

const tempMute = JSON.parse(fs.readFileSync("./tempMutes.json", "utf8"));
const swearWords = require("./Data/SwearWords.json");
const levelFile = require("./Data/levels.json");

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    client.commands.set(command.help.name, command);

    console.log(`De file ${command.help.name}.js is geladen`);

}

client.once("ready", () => {

    console.log(`${client.user.username} is online`);
    client.user.setActivity("Euro Truck Simulator 2", { type: "PLAYING" });

    const statusOptions = [
        "Euro Truck Simulator 2",
        "Trucksbook",
        "!help"
    ]

    let counter = 0;

    let time = 1 * 60 * 1000;
    // let time = 5 * 1000

    const updateStatus = () => {

        client.user.setPresence({

            status: "online",
            activities: [

                {
                    name: statusOptions[counter]
                }

            ]

        });

        if (++counter >= statusOptions.length) counter = 0;

        setTimeout(updateStatus, time);

    }
    updateStatus();

    const checkTempMute = async () => {

        // Omdat we over object propertys gaan moeten we dit anders doen dan een array.
        // We gaan hier over iedere key in het object gaan in het tempMutes.json bestand.
        for (const result of Object.keys(tempMute)) {
            // We halen het ID er uit.
            const idMember = result;
            // We halen de tijd op vanuit het hele bestand bij die key (ID) en dan de tijd.
            const time = tempMute[result].time;

            // Tijd van nu ophalen.
            let date = new Date();
            let dateMilli = date.getTime();
            // Tijd bij gebruiker omvormen naar leesbare tijd.
            let dateReset = new Date(time);

            // Als de tijd van het muten kleiner is als de tijd van nu en de tijd staat niet op 0
            // dan mag deze persoon verlost worden van het zwijgen.
            if (dateReset < dateMilli && time != 0) {

                try {
                    // We halen de server op.
                    let guild = await client.guilds.fetch("1009075608917135460");
                    // We gaan de persoon gegevens ophalen aan de hand van de idMember waar we de tekens < @ ! > weghalen.
                    const mutePerson = guild.members.cache.find(member => member.id === idMember.replace(/[<@!>]/g, ''));
                    // We halen de rol op.
                    let muteRole = guild.roles.cache.get('1009075608938102837');
                    // We kijken na als de rol bestaat.
                    if (!muteRole) return console.log("Can't find the role muted.");
                    // We verwijderen de rol van de persoon.
                    await (mutePerson.roles.remove(muteRole.id));
                    // We zetten de tijd op 0.
                    tempMute[mutePerson].time = 0;
                    // We slaan dit mee op in het document.
                    fs.writeFile("./tempMutes.json", JSON.stringify(tempMute), (err) => {
                        if (err) console.log(err);
                    });
                }
                catch (err) {
                    console.log(err + " Person could not be unmuted because this person is no longer on the server");
                }
            }
        }
        setTimeout(checkTempMute, 1000 * 60); // We zetten een timeout van 1 minuut.
    }
    checkTempMute(); // We starten de functie met de timeout.

});

client.on("guildMemberAdd", async (member) => {

    var role = member.guild.roles.cache.get("1009184767503253537");

    if (!role) return;

    member.roles.add(role);

    var welcomeChannel = member.guild.channels.cache.get("1009075609252659316");

    if (!welcomeChannel) return;

    welcomeChannel.send(`Welcome to the server, ${member}`);

    // Omdat we over object propertys gaan moeten we dit anders doen dan een array.
    for (const result of Object.keys(tempMute)) {
        // Voor meer uitleg zie vorig stuk.
        const idMember = result;
        const time = tempMute[result].time;

        // We kijken na als het de persoon is die op de server is gekomen.
        if (idMember.replace(/[<@!>]/g, '') == member.id) {

            let date = new Date();
            let dateMilli = date.getTime();
            let dateReset = new Date(time);

            let muteRole = member.guild.roles.cache.get('1009075608938102837');

            if (!muteRole) return message.channel.send("Can't find the role muted.");

            try {
                // Als de tijd van de mute nog groter is dan de tijd van nu moet die de rol terug krijgen.
                if (dateReset > dateMilli) {
                    await (member.roles.add(muteRole.id));
                } else if (time != 0) {
                    // Anders mag de rol weg maar omdat deze opnieuw aanmeld is deze al weg en gaan we enkel
                    // de tijd op nul zetten zodat we niet nog eens moeten opslaan.
                    let guild = await client.guilds.fetch("1009075608917135460");
                    const mutePerson = guild.members.cache.find(member => member.id === idMember.replace(/[<@!>]/g, ''));
                    tempMute[mutePerson].time = 0;

                    fs.writeFile("./tempMutes.json", JSON.stringify(tempMute), (err) => {
                        if (err) console.log(err);
                    });
                }
            } catch (err) {
                console.log(err + " Iets liep mis met de rollen toevoegen/verwijderen.");
            }
        }
    }

});

client.on("messageCreate", async message => {

    if (message.author.bot) return;

    var prefix = botConfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    if (!message.content.startsWith(prefix)) {

        RandomXP(message);

        var msg = message.content.toLowerCase();

        for (let index = 0; index < swearWords.length; index++) {
            const swearWord = swearWords[index];

            if (msg.includes(swearWord.toLowerCase())) {

                message.delete();
                return await message.channel.send("You can't swear").then(msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 3000);
                });

            }

        }

    } else {
        const commandData = client.commands.get(command.slice(prefix.length));

        if (!commandData) return;

        var arguments = messageArray.slice(1);

        try {

            await commandData.run(client, message, arguments);

        } catch (error) {
            console.log(error);
            await message.reply("There was a problem executing the command.");
        }

    }
});

function RandomXP(message) {

    var randomXP = Math.floor(Math.random() * 15) + 1;

    // console.log(randomXP);

    var idUser = message.author.id;

    if (!levelFile[idUser]) {

        levelFile[idUser] = {
            xp: 0,
            level: 0
        }

    }

    levelFile[idUser].xp += randomXP;

    var levelUser = levelFile[idUser].level;
    var xpUser = levelFile[idUser].xp;
    var nextLevelXp = levelUser * 300;

    if (nextLevelXp == 0) nextLevelXp = 100;

    if (xpUser >= nextLevelXp) {

        levelFile[idUser].level += 1;

        fs.writeFile("./Data/levels.json", JSON.stringify(levelFile),
            err => {
                if (err) return console.log("Er ging iets fout")
            });

        if (levelFile[idUser].level == 5) {
            var role5 = message.guild.roles.cache.find(r => r.name === "Beginner (LVL 5)");

            var member = message.member;
            member.roles.add(role5);

            var embedLevel5 = new MessageEmbed()
                .setDescription("***New Rank & Level Higher***")
                .setColor("#00ff00")
                .addFields(
                    { name: "New Rank:", value: "Beginner (LVL 5)" },
                    { name: "New Level:", value: levelFile[idUser].level.toString() }
                )
            message.channel.send({ embeds: [embedLevel5] });

        } else {
            var embedLevel = new MessageEmbed()
                .setDescription("***Level Higher***")
                .setColor("#00ff00")
                .addFields(
                    { name: "New Level:", value: levelFile[idUser].level.toString() }
                );
            message.channel.send({ embeds: [embedLevel] });
        };



        if (levelFile[idUser].level == 10) {
            var role10 = message.guild.roles.cache.find(r => r.name === "Intermediate (LVL 10)");

            var member = message.member;
            member.roles.add(role10);

            var embedLevel10 = new MessageEmbed()
                .setDescription("***New Rank & Level Higher***")
                .setColor("#00ff00")
                .addFields(
                    { name: "New Rank:", value: "Intermediate (LVL 10)" },
                    { name: "New Level:", value: levelFile[idUser].level.toString() }
                )
            message.channel.send({ embeds: [embedLevel10] });

        };

        if (levelFile[idUser].level == 15) {
            var role15 = message.guild.roles.cache.find(r => r.name === "Advanced (LVL 15)");

            var member = message.member;
            member.roles.add(role15);

            var embedLevel15 = new MessageEmbed()
                .setDescription("***New Rank & Level Higher***")
                .setColor("#00ff00")
                .addFields(
                    { name: "New Rank:", value: "Advanced (LVL 15)" },
                    { name: "New Level:", value: levelFile[idUser].level.toString() }
                )
            message.channel.send({ embeds: [embedLevel15] });

        };

        if (levelFile[idUser].level == 25) {
            var role25 = message.guild.roles.cache.find(r => r.name === "Expert (LVL 25)");

            var member = message.member;
            member.roles.add(role25);

            var embedLevel15 = new MessageEmbed()
                .setDescription("***New Rank & Level Higher***")
                .setColor("#00ff00")
                .addFields(
                    { name: "New Rank:", value: "Expert (LVL 25)" },
                    { name: "New Level:", value: levelFile[idUser].level.toString() }
                )
            message.channel.send({ embeds: [embedLevel25] });

        };

        if (levelFile[idUser].level == 50) {
            var role50 = message.guild.roles.cache.find(r => r.name === "Elite (LVL 50)");

            var member = message.member;
            member.roles.add(role50);

            var embedLevel50 = new MessageEmbed()
                .setDescription("***New Rank & Level Higher***")
                .setColor("#00ff00")
                .addFields(
                    { name: "New Rank:", value: "Elite (LVL 50)" },
                    { name: "New Level:", value: levelFile[idUser].level.toString() }
                )
            message.channel.send({ embeds: [embedLevel50] });

        };

        if (levelFile[idUser].level == 100) {
            var role100 = message.guild.roles.cache.find(r => r.name === "Godly (LVL 100)");

            var member = message.member;
            member.roles.add(role100);

            var embedLevel100 = new MessageEmbed()
                .setDescription("***New Rank & Level Higher***")
                .setColor("#00ff00")
                .addFields(
                    { name: "New Rank:", value: "Godly (LVL 100)" },
                    { name: "New Level:", value: levelFile[idUser].level.toString() }
                )
            message.channel.send({ embeds: [embedLevel100] });

        };

    }

}


client.login(process.env.token);