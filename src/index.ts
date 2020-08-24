require("dotenv").config();
import { Client, Message, Channel } from "discord.js";

import Discord = require("discord.js");
const client = new Discord.Client();
const axios = require("axios").default;

const { prefix, channelId } = require("./config.json");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

interface channelName extends Discord.DMChannel {
  name: string;
}

client.on("message", async (message: Message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  // @ts-expect-error
  if (message.channel.name === channelId) {
    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();
    let response = {};

    // if (command === "avengers_assemble") {
    //   let count = 0;
    //   let memberRole = message.member.guild.roles.cache.find(
    //     (role: { name: string; }) => role.name === "Member"
    //   );
    //   message.guild.members.cache
    //     .filter((m: { user: { bot: any; }; }) => !m.user.bot)
    //     .forEach((member: { roles: { add: (arg0: any) => void; }; }) => {
    //       member.roles.add(memberRole);
    //       count += 1;
    //     });
    //   message.channel.send(
    //     `Operation complete. Assigned the member role to ${count}`
    //   );
    // }

    if (message.content === "!ping") {
      message.channel.send("Pong!");
    } else if (command === "vatstar") {
      console.log(`User ${message.member} is paging us`);
      if (!args.length) {
        return message.reply(
          `Please respond in the format of "!vatstar 1234567" with your VATSIM ID`
        );
      }
      console.log(`Command name: ${command}\nArguments: ${args}`);
      try {
        const res = await axios
          .get(`https://api.vatsim.net/api/ratings/${args[0]}/`)
          .then((data: object) => {
            const response: any = data;
            const {
              id,
              rating,
              pilotrating: pilotRating,
              name_first,
              name_last,
            } = response.data;
            let full_name = name_first + " " + name_last;

            if (!message.guild.me.hasPermission("MANAGE_NICKNAMES"))
              return message.channel.send(
                "I do not have permission to adjust nickname"
              );

            // Start await reactions here
            // message.react("👍").then(() => message.react("👎"));
            // const filter = (reaction, user) => {
            //   return (
            //     ["👍", "👎"].includes(reaction.emoji.name) &&
            //     user.id === message.author.id
            //   );
            // };
            // message.reply(
            //   `I have found ${full_name}, is that right? Please react to your original message with either 👍 for yes or 👎 for no.`
            // );

            // message
            //   .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
            //   .then((collected) => {
            //     const reaction = collected.first();

            //     if (reaction.emoji.name === "👍") {
            let nameReply;
            if (message.member.displayName !== full_name) {
              nameReply = `Hello ${full_name}, I will adjust your nickname`;

              message.member
                .setNickname(full_name)
                .then((res: any) => {})
                .catch((err: any) => {
                  if (err.httpStatus === 403) {
                    message.reply(
                      "I do not have permission to adjust your nickname"
                    );
                  }
                  console.log(`Unable to adjust nickname for ${full_name}`);
                });
            }

            let newRoles = roleSelector(message, pilotRating, rating);
            const member = message.mentions.members.first();
            let rolesString = newRoles.roleNames.join(", ");
            let roleString: String;
            if (newRoles.roles.length === 0) {
              roleString =
                "You already have all the roles according to your VATSIM ratings";
            } else {
              message.member.roles.add(newRoles.roles).catch((error) => {
                if (error.httpStatus === 403) {
                  console.log(
                    `I do not have permission to adjust roles for ${message.member.user.tag}`
                  );
                } else {
                  console.log(error);
                }
              });

              roleString = `You have been assigned the following roles: ${rolesString}`;
            }
            const replyMessage = [nameReply, roleString]
              .filter(Boolean)
              .join(". ");
            message.reply(replyMessage);

            // } else {
            //   message.reply('Okay we got that wrong, please check your vatsim ID number  and try again or contact staff for further assistance');
            // }
            // })
            // .catch((collected) => {
            //   message.reply(
            //     "you reacted with neither a thumbs up, nor a thumbs down."
            //   );
            // });
            // END reaction await
          });
      } catch (error) {
        console.log(error);
        if (error.response.status === 404) {
          message.channel.send(`VATSIM ID "${args[0]}" not found`);
        } else {
          console.log(error);
          message.reply(
            "An unknown error has occurred please contact @Foestauf#4056"
          );
        }
      }
    }
  }
});

interface Roles {
  roles: Array<Discord.Role>;
  roleNames: Array<String>;
}

function roleSelector(
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

const findRoles = (message: any) => {
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

const checkForExistingRole = (message: Message, roleName: String): boolean => {
  if (
    message.member.roles.cache.find(
      (role: { name: string }) => role.name === roleName
    )
  ) {
    return true;

    console.log("Does not have role I should add it");
  } else return false;
};
client.login(process.env.TOKEN);
