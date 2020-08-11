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

  if (command === "avengers_assemble") {
    let count = 0;
      let memberRole = message.member.guild.roles.cache.find(
        (role) => role.name === "Member"
      );
      message.guild.members.cache.filter(m => !m.user.bot).forEach(member => {
        member.roles.add(memberRole);
        count += 1;
      }
        );
        message.reply(`Operation complete. Assigned the member role to ${count}`)
        

  }

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
          // Start await reactions here
          message.react("👍").then(() => message.react("👎"));
          const filter = (reaction, user) => {
            return (
              ["👍", "👎"].includes(reaction.emoji.name) &&
              user.id === message.author.id
            );
          };
          message.reply(
            `I have found ${full_name}, is that right? Please react to your original message with either 👍 for yes or 👎 for no.`
          );

          message
            .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
            .then((collected) => {
              const reaction = collected.first();

              if (reaction.emoji.name === "👍") {
                message.member
                  .setNickname(full_name)
                  .then((res) => {})
                  .catch((err) => console.log(err));
                message.reply("Great, I will adjust your nickname for you.");
                console.log(`Pilot rating is ${pilotRating}`);
                let newRoles = roleSelector(message, pilotRating);
                if (rating > 1)
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
                  let studentRole = message.member.guild.roles.cache.find(
                    (role) => role.name === "Student"
                  );
                  message.reply(`Welcome to VATSTAR. As you currently do not have any pilot ratings you have automatically been given the role of ${studentRole}`);
                }
              } else {
                message.reply('Okay we got that wrong, please check your vatsim ID number  and try again or contact staff for further assistance');
              }
            })
            .catch((collected) => {
              message.reply(
                "you reacted with neither a thumbs up, nor a thumbs down."
              );
            });
          // END reaction await

          if (!message.guild.me.hasPermission("MANAGE_NICKNAMES"))
            return message.channel.send(
              "I do not have permission to adjust nickname"
            );
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
  if ((rating & 16) === 16) {
    roles.push(roleSymbol.p5)
  }
   if ((rating & 8) === 8) {
    roles.push(roleSymbol.p4)
  } 
   if ((rating & 4) === 4) {
    roles.push(roleSymbol.p3);
  }
   if ((rating & 2) === 2) {
    roles.push(roleSymbol.p2);
  } 
  if ((rating & 1) === 1) {
    roles.push(roleSymbol.p1);
  } 
  
  return roles;
}

const findRoles = (message) => {
  let p1 = message.member.guild.roles.cache.find((role) => role.name === "P1");
  let p2 = message.member.guild.roles.cache.find((role) => role.name === "P2");
  let p3 = message.member.guild.roles.cache.find((role) => role.name === "P3");
  let p4 = message.member.guild.roles.cache.find((role) => role.name === "P4");
  let p5 = message.member.guild.roles.cache.find((role) => role.name === "P5");
  return { p1, p2, p3, p4, p5 };
};

client.login(token);
