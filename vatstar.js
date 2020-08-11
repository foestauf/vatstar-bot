const Discord = require("discord.js");
const client = new Discord.Client();

const axios = require("axios").default;

const { prefix, token } = require("./config.json");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
  let response = {};

  if (message.content === "!ping") {
    message.reply("Pong!");
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
        .then((data) => {
          response = data;
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
          message.reply(
            `Hello ${full_name}, I will adjust your nickname for you.`
          );
          let nameWithCheck = full_name + " " + "✅";
          message.member
            .setNickname(nameWithCheck)
            .then((res) => {})
            .catch((err) => console.log(err));
          console.log(`Pilot rating is ${pilotRating}`);
          let newRoles = roleSelector(message, pilotRating);
          if (rating > 0)
            newRoles.push(
              message.member.guild.roles.cache.find(
                (role) => role.name === "Controllers"
              )
            );
          const member = message.mentions.members.first();
          message.member.roles.add(newRoles);
          let rolesString = newRoles.join();
          if (rolesString.length > 0) {
            message.reply(
              `You have been assigned the following roles : ${rolesString}`
            );
          } else {
            message.reply(`You currently have a pilot rating of 0`);
          }
        });
    } catch (error) {
      console.log(error);
      if (error.response.status === 404) {
        message.reply(`VATSIM ID "${args[0]}" not found`);
      }
    }
  }
});

function roleString(roles) {
  console.log("roles list is" + roles);
  console.log(roles.length);
  if (roles.length === 0) return false;
  else {
    return true;
  }
}

function roleSelector(message, rating) {
  let roles = [];
  console.log(`Rating in selector is :${rating}`);
  const roleSymbol = findRoles(message);
  switch (rating) {
    case 0:
      break;
    case 1:
      roles = [roleSymbol.p1];
      break;
    case 2:
      roles = [roleSymbol.p1, roleSymbol.p2];
      break;
    case 3:
      roles = [roleSymbol.p1, roleSymbol.p2, roleSymbol.p3];
      break;
    case 4:
      roles = [roleSymbol.p1, roleSymbol.p2, roleSymbol.p3, roleSymbol.p4];
      break;
    default:
      roles = [];
      break;
  }
  return roles;
}

const findRoles = (message) => {
  let p1 = message.member.guild.roles.cache.find((role) => role.name === "P1");
  let p2 = message.member.guild.roles.cache.find((role) => role.name === "P2");
  let p3 = message.member.guild.roles.cache.find((role) => role.name === "P3");
  let p4 = message.member.guild.roles.cache.find((role) => role.name === "P4");
  return { p1, p2, p3, p4 };
};

client.login(token);
