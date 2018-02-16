const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';
client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
	if(message.content.substring(0,1) === prefix){
		var cmd = message.content.substring(1,message.content.length).split(' ');
		var em = new Discord.RichEmbed();
		var canvas= document.getElementById('canvas');
		var ctx = canvas.getContext('2d')
		switch(cmd[0]){
			case 'hhh':
				em.setImage('https://i.imgur.com/ojjWsjK.jpg');
				message.channel.send(em);
				return;
			case 'pff':
				em.setImage('https://i.imgur.com/nacjQtW.jpg');
				message.channel.send(em);
				return;
			case 'roll':
				var opt = cmd[1].split('-');
				var num= opt.length;
				if(num>1){
					message.channel.send(opt[Math.floor(Math.random()*num)]);
				}
				return;
			/* case 'quote':
				var file = new File('quote.json');
				var obj= JSON.parse(file);
				var count=0;
				while(count!==obj.length){
					if(obj[count].name===cmd[1]){
						message.channel.send(obj[count].text);
						break;
					}
					count++;
				}
				return; */
			case 'suck':
				var pic = new Image();
				pic.onload=function(){
					ctx.drawImage(pic,0,0);
				}
				pic.src= 'https://i.imgur.com/ZZn9DUa.png';
			default:
				message.channel.send('Command not found');
		}	
	}
});
client.login(process.env.BOT_TOKEN);