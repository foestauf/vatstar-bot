import Discord = require("discord.js");

export const findRoles = (message: any) => {
    let p0: Discord.Role = message.member.guild.roles.cache.find(
        (role: { name: string }) => role.name === "P0"
    );
    let p1: Discord.Role = message.member.guild.roles.cache.find(
        (role: { name: string }) => role.name === "P1"
    );
    let p2: Discord.Role = message.member.guild.roles.cache.find(
        (role: { name: string }) => role.name === "P2"
    );
    let p3: Discord.Role = message.member.guild.roles.cache.find(
        (role: { name: string }) => role.name === "P3"
    );
    let p4: Discord.Role = message.member.guild.roles.cache.find(
        (role: { name: string }) => role.name === "P4"
    );
    let controller: Discord.Role = message.member.guild.roles.cache.find(
        (role: { name: string }) => role.name === "Controller"
    );
    let memberRole: Discord.Role = message.member.guild.roles.cache.find(
        (role: { name: string }) => role.name === "Member"
    );
    return { p0, p1, p2, p3, p4, controller, memberRole };
};
