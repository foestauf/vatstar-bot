"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const axios = require("axios").default;
const { prefix, channelId } = require("./config.json");
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on("message", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    if (message.channel.name === channelId) {
        const args = message.content.slice(prefix.length).trim().split(" ");
        const command = args.shift().toLowerCase();
        let response = {};
        if (message.content === "!ping") {
            message.channel.send("Pong!");
        }
        else if (command === "vatstar") {
            console.log(`User ${message.member} is paging us`);
            if (!args.length) {
                return message.reply(`Please respond in the format of "!vatstar 1234567" with your VATSIM ID`);
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
                        return message.channel.send("I do not have permission to adjust nickname");
                    let nameReply;
                    if (message.member.displayName !== full_name) {
                        nameReply = `Hello ${full_name}, I will adjust your nickname`;
                        message.member
                            .setNickname(full_name)
                            .then((res) => { })
                            .catch((err) => console.log(err));
                    }
                    let newRoles = roleSelector(message, pilotRating, rating);
                    const member = message.mentions.members.first();
                    message.member.roles.add(newRoles.roles);
                    let rolesString = newRoles.roleNames.join(", ");
                    const roleString = `You have been assigned the following roles : ${rolesString}`;
                    const replyMessage = [nameReply, roleString]
                        .filter(Boolean)
                        .join(". ");
                    message.reply(replyMessage);
                });
            }
            catch (error) {
                if (error.response.status === 404) {
                    message.channel.send(`VATSIM ID "${args[0]}" not found`);
                }
                else {
                    console.log(error);
                }
            }
        }
    }
});
function roleString(roles) {
    if (roles.length === 0)
        return false;
    else {
        return true;
    }
}
function roleSelector(message, pilotRating, rating) {
    let roles = [];
    let roleNames = [];
    const roleSymbol = findRoles(message);
    if (pilotRating === 0) {
        roles.push(roleSymbol.p0);
        roleNames.push(roleSymbol.p0.name);
    }
    if (pilotRating === 1) {
        roles.push(roleSymbol.p0);
        roles.push(roleSymbol.p1);
        roleNames.push(roleSymbol.p0.name);
        roleNames.push(roleSymbol.p1.name);
    }
    if (pilotRating === 3) {
        roles.push(roleSymbol.p0);
        roles.push(roleSymbol.p1);
        roles.push(roleSymbol.p2);
        roleNames.push(roleSymbol.p0.name);
        roleNames.push(roleSymbol.p1.name);
        roleNames.push(roleSymbol.p2.name);
    }
    if (pilotRating === 7) {
        roles.push(roleSymbol.p0);
        roles.push(roleSymbol.p1);
        roles.push(roleSymbol.p2);
        roles.push(roleSymbol.p3);
        roleNames.push(roleSymbol.p0.name);
        roleNames.push(roleSymbol.p1.name);
        roleNames.push(roleSymbol.p2.name);
        roleNames.push(roleSymbol.p3.name);
    }
    if (pilotRating === 15) {
        roles.push(roleSymbol.p0);
        roles.push(roleSymbol.p1);
        roles.push(roleSymbol.p2);
        roles.push(roleSymbol.p3);
        roles.push(roleSymbol.p4);
        roleNames.push(roleSymbol.p0.name);
        roleNames.push(roleSymbol.p1.name);
        roleNames.push(roleSymbol.p2.name);
        roleNames.push(roleSymbol.p3.name);
        roleNames.push(roleSymbol.p4.name);
    }
    if (rating > 1) {
        roles.push(roleSymbol.controller);
        roleNames.push(roleSymbol.controller.name);
    }
    roles.push(roleSymbol.memberRole);
    roleNames.push(roleSymbol.memberRole.name);
    return { roles, roleNames };
}
const findRoles = (message) => {
    let p0 = message.member.guild.roles.cache.find((role) => role.name === "P0");
    let p1 = message.member.guild.roles.cache.find((role) => role.name === "P1");
    let p2 = message.member.guild.roles.cache.find((role) => role.name === "P2");
    let p3 = message.member.guild.roles.cache.find((role) => role.name === "P3");
    let p4 = message.member.guild.roles.cache.find((role) => role.name === "P4");
    let controller = message.member.guild.roles.cache.find((role) => role.name === "Controllers");
    let memberRole = message.member.guild.roles.cache.find((role) => role.name === "Member");
    return { p0, p1, p2, p3, p4, controller, memberRole };
};
client.login(process.env.TOKEN);
//# sourceMappingURL=index.js.map