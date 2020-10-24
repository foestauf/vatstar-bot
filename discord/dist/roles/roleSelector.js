"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleSelector = void 0;
const findRoles_1 = require("./findRoles");
const checkForExistingRole = (message, roleName) => {
    if (message.member.roles.cache.find((role) => role.name === roleName)) {
        return true;
    }
    return false;
};
function roleSelector(message, pilotRating, rating) {
    const roles = [];
    const roleNames = [];
    const roleSymbol = findRoles_1.findRoles(message);
    if (pilotRating === 0) {
        if (!checkForExistingRole(message, 'P0')) {
            roles.push(roleSymbol.p0);
            roleNames.push(roleSymbol.p0.name);
        }
    }
    if (pilotRating === 1) {
        if (!checkForExistingRole(message, 'P0')) {
            roles.push(roleSymbol.p0);
            roleNames.push(roleSymbol.p0.name);
        }
        if (!checkForExistingRole(message, 'P1')) {
            roles.push(roleSymbol.p1);
            roleNames.push(roleSymbol.p1.name);
        }
    }
    if (pilotRating === 3) {
        if (!checkForExistingRole(message, 'P0')) {
            roles.push(roleSymbol.p0);
            roleNames.push(roleSymbol.p0.name);
        }
        if (!checkForExistingRole(message, 'P1')) {
            roles.push(roleSymbol.p1);
            roleNames.push(roleSymbol.p1.name);
        }
        if (!checkForExistingRole(message, 'P2')) {
            roles.push(roleSymbol.p2);
            roleNames.push(roleSymbol.p2.name);
        }
    }
    if (pilotRating === 7) {
        if (!checkForExistingRole(message, 'P0')) {
            roles.push(roleSymbol.p0);
            roleNames.push(roleSymbol.p0.name);
        }
        if (!checkForExistingRole(message, 'P1')) {
            roles.push(roleSymbol.p1);
            roleNames.push(roleSymbol.p1.name);
        }
        if (!checkForExistingRole(message, 'P2')) {
            roles.push(roleSymbol.p2);
            roleNames.push(roleSymbol.p2.name);
        }
        if (!checkForExistingRole(message, 'P3')) {
            roles.push(roleSymbol.p3);
            roleNames.push(roleSymbol.p3.name);
        }
    }
    if (pilotRating === 15) {
        if (!checkForExistingRole(message, 'P0')) {
            roles.push(roleSymbol.p0);
            roleNames.push(roleSymbol.p0.name);
        }
        if (!checkForExistingRole(message, 'P1')) {
            roles.push(roleSymbol.p1);
            roleNames.push(roleSymbol.p1.name);
        }
        if (!checkForExistingRole(message, 'P2')) {
            roles.push(roleSymbol.p2);
            roleNames.push(roleSymbol.p2.name);
        }
        if (!checkForExistingRole(message, 'P3')) {
            roles.push(roleSymbol.p3);
            roleNames.push(roleSymbol.p3.name);
        }
        if (!checkForExistingRole(message, 'P4')) {
            roles.push(roleSymbol.p4);
            roleNames.push(roleSymbol.p4.name);
        }
    }
    if (rating > 1) {
        if (!checkForExistingRole(message, 'Controller')) {
            roles.push(roleSymbol.controller);
            roleNames.push(roleSymbol.controller.name);
        }
    }
    if (!checkForExistingRole(message, 'Member')) {
        roles.push(roleSymbol.memberRole);
        roleNames.push(roleSymbol.memberRole.name);
    }
    return { roles, roleNames };
}
exports.roleSelector = roleSelector;
//# sourceMappingURL=roleSelector.js.map