/* global process */

const Discord = require('discord.js');
const request = require('request');
const client = new Discord.Client();
const fs = require('fs');
var rdc = require('redis').createClient(process.env.REDIS_URL);

const prefix = '!';

client.on('ready', () => {
	client.user.setActivity('Yui-senpai with love');
	console.log('bot is ready');
});

client.on('message', message => {
	if(message.author.bot) return;
	if(message.content.substring(0,1) !== prefix || message.channel.type==='dm') return;
	const cmd = message.content.substring(1).split(" ")[0];
	const args = message.content.substring(cmd.length+2);
	try{
		let cmdDir = "./commands/"+cmd+".js";
		let cmdFile = require(cmdDir);
		cmdFile.run(Discord,rdc,client,message,args);
	}catch(err){
		/*Read custom commands */
		console.log(err);
		rdc.get("cmd"+guild.id,function(err,reply){
			if(reply===null) return;
			let custom = JSON.parse(reply.toString());
			let found = custom.find(m=> m.name===cmd);
			if(found!==undefined){
				if(found.content.startsWith("https://") || found.content.startsWith("http://")){
					em.setImage(found.content);
				}else{
					em.setDescription(found.content);
				}
				channel.send(em);
				return;
			}
		});
	}	
});

client.login(process.env.BOT_TOKEN);