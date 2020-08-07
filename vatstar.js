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
      return message.channel.send(
        `You didn't provide any arguments, ${message.author}`
      );
    }
    message.channel.send(`Command name: ${command}\nArguments: ${args}`);
    try {
      const res = await axios
        .get(`https://api.vatsim.net/api/ratings/${args[0]}/`)
        .then((data) => {
          response = data;
          console.log(`Our data is ${response.data.id}`);
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
          message.channel.send(
            `I have found your real name is ${full_name}\nI will adjust your nickname for you`
          );
          message.member
            .setNickname(full_name)
            .then((res) => {})
            .catch((err) => console.log(err));
          console.log(`Pilot rating is ${pilotRating}`);
          let newRoles = roleSelector(message, pilotRating);
          console.log(newRoles);
          const member = message.mentions.members.first();
          message.channel.send(`Hi ${member}`);
          message.member.roles.add(newRoles);
        });
    } catch (error) {
      console.log(error);
    }
  }
});

function roleSelector(message, rating) {
  let roles = [];
  console.log(`Rating in selector is :${rating}`);
  const roleSymbol = findRoles(message);
  console.log(`Role symbol is :${roleSymbol.p1}`);
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
  console.log(`Roles is equal to ${roles}`);
  return roles;
}

const findRoles = (message) => {
  let p1 = message.member.guild.roles.cache.find((role) => role.name === "P1");
  let p2 = message.member.guild.roles.cache.find((role) => role.name === "P2");
  let p3 = message.member.guild.roles.cache.find((role) => role.name === "P3");
  let p4 = message.member.guild.roles.cache.find((role) => role.name === "P4");
  console.log(`P1: ${p1} P2: ${p2} P3: ${p3} P4: ${p4}`);
  return { p1, p2, p3, p4 };
};

client.login(token);
