"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRoles = void 0;
exports.findRoles = (message) => {
    let p0 = message.member.guild.roles.cache.find((role) => role.name === "P0");
    let p1 = message.member.guild.roles.cache.find((role) => role.name === "P1");
    let p2 = message.member.guild.roles.cache.find((role) => role.name === "P2");
    let p3 = message.member.guild.roles.cache.find((role) => role.name === "P3");
    let p4 = message.member.guild.roles.cache.find((role) => role.name === "P4");
    let controller = message.member.guild.roles.cache.find((role) => role.name === "Controller");
    let memberRole = message.member.guild.roles.cache.find((role) => role.name === "Member");
    return { p0, p1, p2, p3, p4, controller, memberRole };
};
//# sourceMappingURL=findRoles.js.map