import { Message } from "discord.js";
import { Roles } from "./types";
import { findRoles } from "./roleSymbols";
import Discord = require("discord.js");

export function roleSelector(
    message: Message,
    pilotRating: number,
    rating: number
): Roles {
    let roles: Array<Discord.Role> = [];
    let roleNames: Array<String> = [];
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


const checkForExistingRole = (message: Message, roleName: String): boolean => {
    if (
        message.member.roles.cache.find(
            (role: { name: string }) => role.name === roleName
        )
    ) {
        return true;
    } else return false;
};
