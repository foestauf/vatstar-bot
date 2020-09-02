"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const Discord = require("discord.js");
const utils_1 = require("./utils");
const client = new Discord.Client();
const axios = require("axios").default;
const { prefix, channelId } = require("./config.json");
let lobbyChannel;
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    lobbyChannel = client.channels.cache.find((channel) => channel.name === "lobby");
});
client.on('guildMemberAdd', (member) => {
    utils_1.newUser(member);
});
client.on("message", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    if (message.channel.name === channelId) {
        const args = message.content.slice(prefix.length).trim().split(" ");
        const command = args.shift().toLowerCase();
        let response = {};
        if (message.content === "!ping") {
            console.log(utils_1.retrieveUser(message.member));
            message.channel.send("Pong!").then(msg => {
                msg.delete({ timeout: 20000 });
            });
        }
        else if (command === "vatstar") {
            console.log(`User ${message.member} is paging us`);
            if (!args.length) {
                message.delete({ timeout: 30000 });
                return message.reply(`Please respond in the format of "!vatstar 1234567" with your VATSIM ID`).then(msg => {
                    msg.delete({ timeout: 30000 });
                });
            }
            console.log(`Command name: ${command}\nArguments: ${args}`);
            try {
                const res = await axios
                    .get(`https://api.vatsim.net/api/ratings/${args[0]}/`)
                    .then((data) => {
                    const response = data;
                    const { id, rating, pilotrating: pilotRating, name_first, name_last, } = response.data;
                    let full_name = name_first + " " + name_last;
                    if (!message.guild.me.hasPermission("MANAGE_NICKNAMES"))
                        return message.channel.send("I do not have permission to adjust nicknames");
                    let nameReply;
                    if (message.member.displayName !== full_name) {
                        nameReply = `Hello ${full_name}, I will adjust your nickname`;
                        message.member
                            .setNickname(full_name)
                            .then((res) => { })
                            .catch((err) => {
                            if (err.httpStatus === 403) {
                                message.reply("I do not have permission to adjust your nickname")
                                    .then(msg => {
                                    msg.delete({ timeout: 20000 });
                                });
                            }
                            console.log(`Unable to adjust nickname for ${full_name}`);
                        });
                    }
                    let newRoles = roleSelector(message, pilotRating, rating);
                    const member = message.mentions.members.first();
                    let rolesString = newRoles.roleNames.join(", ");
                    let roleString;
                    if (newRoles.roles.length === 0) {
                        roleString =
                            "You already have all the roles according to your VATSIM ratings";
                    }
                    else {
                        message.member.roles.add(newRoles.roles).catch((error) => {
                            if (error.httpStatus === 403) {
                                console.log(`I do not have permission to adjust roles for ${message.member.user.tag}`);
                            }
                            else {
                                console.log(error);
                            }
                        });
                        roleString = `You have been assigned the following roles: ${rolesString}`;
                    }
                    const replyMessage = [nameReply, roleString]
                        .filter(Boolean)
                        .join(". ");
                    message.reply(replyMessage)
                        .then(async (msg) => {
                        if ((await utils_1.retrieveUser(message.member)).isNewUser) {
                            client.channels.cache.get(lobbyChannel.id).send(`Hey <@${message.member.id}>, welcome to VATSTAR Virtual Pilot Training :emoji1:  If you have any questions do not hesitate to ask :tada::hugging:.`);
                            utils_1.updateUser(message.member, "clearNewUser");
                        }
                        msg.delete({ timeout: 60000 });
                    });
                    message.delete({ timeout: 60000 });
                });
            }
            catch (error) {
                console.log(error);
                if (error.response.status === 404) {
                    message.delete({ timeout: 60000 }).catch((error) => console.log(error));
                    message.reply(`VATSIM ID "${args[0]}" not found. If you are certain you have typed your CID correctly this could mean that you have not completed the new member orientation course "P0" and therefore are unable to authenticate on the VATSIM network to include this discord server.`)
                        .then(msg => {
                        msg.delete({ timeout: 60000 });
                    });
                }
                else {
                    console.log(error);
                    message.reply("An unknown error has occurred please contact @Foestauf#4056").then(msg => {
                        msg.delete({ timeout: 30000 });
                    });
                }
            }
        }
    }
});
function roleSelector(message, pilotRating, rating) {
    let roles = [];
    let roleNames = [];
    const roleSymbol = findRoles(message);
    if (pilotRating === 0) {
        if (!checkForExistingRole(message, "P0")) {
            roles.push(roleSymbol.p0);
            roleNames.push(roleSymbol.p0.name);
        }
    }
    if (pilotRating === 1) {
        if (!checkForExistingRole(message, "P0")) {
            roles.push(roleSymbol.p0);
            roleNames.push(roleSymbol.p0.name);
        }
        if (!checkForExistingRole(message, "P1")) {
            roles.push(roleSymbol.p1);
            roleNames.push(roleSymbol.p1.name);
        }
    }
    if (pilotRating === 3) {
        if (!checkForExistingRole(message, "P0")) {
            roles.push(roleSymbol.p0);
            roleNames.push(roleSymbol.p0.name);
        }
        if (!checkForExistingRole(message, "P1")) {
            roles.push(roleSymbol.p1);
            roleNames.push(roleSymbol.p1.name);
        }
        if (!checkForExistingRole(message, "P2")) {
            roles.push(roleSymbol.p2);
            roleNames.push(roleSymbol.p2.name);
        }
    }
    if (pilotRating === 7) {
        if (!checkForExistingRole(message, "P0")) {
            roles.push(roleSymbol.p0);
            roleNames.push(roleSymbol.p0.name);
        }
        if (!checkForExistingRole(message, "P1")) {
            roles.push(roleSymbol.p1);
            roleNames.push(roleSymbol.p1.name);
        }
        if (!checkForExistingRole(message, "P2")) {
            roles.push(roleSymbol.p2);
            roleNames.push(roleSymbol.p2.name);
        }
        if (!checkForExistingRole(message, "P3")) {
            roles.push(roleSymbol.p3);
            roleNames.push(roleSymbol.p3.name);
        }
    }
    if (pilotRating === 15) {
        if (!checkForExistingRole(message, "P0")) {
            roles.push(roleSymbol.p0);
            roleNames.push(roleSymbol.p0.name);
        }
        if (!checkForExistingRole(message, "P1")) {
            roles.push(roleSymbol.p1);
            roleNames.push(roleSymbol.p1.name);
        }
        if (!checkForExistingRole(message, "P2")) {
            roles.push(roleSymbol.p2);
            roleNames.push(roleSymbol.p2.name);
        }
        if (!checkForExistingRole(message, "P3")) {
            roles.push(roleSymbol.p3);
            roleNames.push(roleSymbol.p3.name);
        }
        if (!checkForExistingRole(message, "P4")) {
            roles.push(roleSymbol.p4);
            roleNames.push(roleSymbol.p4.name);
        }
    }
    if (rating > 1) {
        if (!checkForExistingRole(message, "Controller")) {
            roles.push(roleSymbol.controller);
            roleNames.push(roleSymbol.controller.name);
        }
    }
    if (!checkForExistingRole(message, "Member")) {
        roles.push(roleSymbol.memberRole);
        roleNames.push(roleSymbol.memberRole.name);
    }
    return { roles, roleNames };
}
const findRoles = (message) => {
    let p0 = message.member.guild.roles.cache.find((role) => role.name === "P0");
    let p1 = message.member.guild.roles.cache.find((role) => role.name === "P1");
    let p2 = message.member.guild.roles.cache.find((role) => role.name === "P2");
    let p3 = message.member.guild.roles.cache.find((role) => role.name === "P3");
    let p4 = message.member.guild.roles.cache.find((role) => role.name === "P4");
    let controller = message.member.guild.roles.cache.find((role) => role.name === "Controller");
    let memberRole = message.member.guild.roles.cache.find((role) => role.name === "Member");
    return { p0, p1, p2, p3, p4, controller, memberRole };
};
const checkForExistingRole = (message, roleName) => {
    if (message.member.roles.cache.find((role) => role.name === roleName)) {
        return true;
        console.log("Does not have role I should add it");
    }
    else
        return false;
};
client.login(process.env.TOKEN);
//# sourceMappingURL=index.js.map