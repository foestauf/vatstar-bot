const Discord = require('discord.js');
const client = new Discord.Client();

const axios= require('axios').default

const { prefix, token } = require('./config.json')

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    let response = {};

    if (message.content === '!ping') {
        message.reply('Pong!');
    }
    else if (command === 'vatstar') {
        console.log(`User ${message.member} is paging us`)
        if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}`)
        }
        message.channel.send(`Command name: ${command}\nArguments: ${args}`);
        try {
        const res = await axios.get(`https://api.vatsim.net/api/ratings/${args[0]}/`)
        .then(data => {
            response = data;
            console.log(`Our data is ${response.data.id}`)
            const { id, rating, pilotrating, name_first, name_last } = response.data;
            let full_name = name_first + ' ' + name_last
            if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.channel.send('I do not have permission to adjust nickname');
            message.channel.send(`I have found your real name is ${full_name}\nI will adjust your nickname for you`)
            message.member.setNickname(full_name)
            .then(res => {
                console.log(res);
            }).catch((err) => console.log(err))
                })
    } catch (error) {
        console.log(error);
    }
}
});



client.login(token);