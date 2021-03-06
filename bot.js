/* global process */

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const yt = require('ytdl-core');
const rdc = require('redis').createClient(process.env.REDIS_URL);

// var express = require('express')
// var app=express()
// var port = process.env.PORT || 8080
// app.use(express.static(__dirname+"/html"))
// app.get("/",function(req,res){
// 	res.render("index")
// })
// app.listen(port,function(){
// 	console.log("website online!")
// })

const prefix = '!';

client.on('ready', () => {
	client.user.setActivity('Yui-senpai w/ !help',{
		url:'https://yumichannel.github.io/discord',
		type: 'WATCHING'
	});
	client.guilds.get('201913926848479232').channels.get('486774457596116992').send('KouhaiBot is online!');
});

client.on("guildCreate",guild=>{
	let channel = guild.channels.find(c=>{
		return c.type==="text" && c.permissionsFor(guild.me).has("SEND_MESSAGES");
	})
	if(channel===null) return
	channel.send("Hello, KouhaiBot is here! <3")
	rdc.get("welcome",(err,reply)=>{
		let list = JSON.parse(reply.toString());
		list.push({
			id : guild.id,
			list: []
		})
		rdc.set("welcome",JSON.stringify(list),()=>{})
	});
	rdc.get("command",(err,reply)=>{
		let list = JSON.parse(reply.toString());
		list.push({
			id : guild.id,
			list: []
		})
		rdc.set("command",JSON.stringify(list),()=>{})
	});
})

client.on('guildMemberAdd',member=>{
	if(member.bot) return;
	let guild = member.guild;
	let channel = guild.channels.find(c=>{
		return c.type==="text" && c.permissionsFor(guild.me).has("SEND_MESSAGES");
	})
	if(channel===null) return;
	rdc.get("welcome",(err,reply)=>{
		let list = JSON.parse(reply.toString());
		let pos = list.findIndex(m=>m.id==guild.id)
		if(pos==-1) return
		let num = list[pos].list.length
		if(num<1){
			channel.send(`Have a great day, ${member} senpai`);
			return;	
		}else{
			num = Math.floor(Math.random()*num);
			let x = list[pos].list[num].replace("@user",`<@${member.id}>`);
			channel.send(x);
		}
			
	});
});

client.on('message', message => {
	if(message.author.bot) return;
	if(message.content.substring(0,1) !== prefix || message.channel.type==='dm') return;
	const cmd = message.content.substring(1).split(" ")[0];
	const args = message.content.substring(cmd.length+2);
	try{
		let cmdDir = "./commands/"+cmd+".js";
		let cmdFile = require(cmdDir);
		cmdFile.run(client,message,args);
	}catch(err){
		/*Read custom commands */
		rdc.get("custom",function(err,reply){
			let list = JSON.parse(reply.toString());
			let pos = list.findIndex(m=>m.id==message.guild.id)
			if(pos==-1) return
			let found = list[pos].list.find(m=> m.name==cmd);
			let em = new Discord.RichEmbed();
			if(found!==undefined){
				if(found.content.startsWith("https://") || found.content.startsWith("http://")){
					em.setImage(found.content);
					message.channel.send(em);
				}else{
					message.channel.send(found.content);
				}
				return;
			}
		});
	}	
});

client.on('message', message=>{
	if(message.content.substring(0,5)=== prefix+'chửi'){
		let chui = message.content.substring(6);
		if(chui===null) return;
		let Canvas = require('canvas');
		let img = new Canvas.Image;
		img.src = fs.readFileSync('src/hamlon.png');
		let canvas = Canvas.createCanvas(img.width,img.height);
		let ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, img.width, img.height);

		ctx.font = '30px arial';
		ctx.fillStyle = 'rgba(255,255,255,1)'
		let len = ctx.measureText(chui).width;
		ctx.fillText(chui, (img.width-len)/2 , 225);
		
		canvas.createPNGStream().pipe(
			fs.createWriteStream('src/hl.png').on("close",()=>{message.channel.send(new Discord.Attachment("src/hl.png"))})
		)
	}
});

// client.on('message', message=>{
// 	if(!message.content.startsWith(prefix)) return;
// 	if (!message.guild) return;
//   	if (message.content.substring(0,5) === prefix+'play') {
// 		var yturl = message.content.substring(6);
// 		if (message.member.voiceChannel) {
// 		message.member.voiceChannel.join()
// 			.then(connection => {
// 				console.log('I have successfully connected to the channel!');
// 				const dispatcher = connection.playStream(
// 					yt(yturl,{
// 						filter: 'audioonly',
// 						quality: 'highestaudio'
// 					})
// 				);
// 				dispatcher.on('end',()=>{message.member.voiceChannel.leave()});
// 			})
// 			.catch(console.log);
// 		} else {
// 		console.log('You need to join a voice channel first!');
// 		}
// 	  }
// 	if (message.content.substring(0,5) === prefix+'end') {
// 		message.member.voiceChannel.leave()
//   	}
// });

// client.on('message',message=>{
// 	let mt = message.mentions.members;
// 	if(mt===undefined || message.author.bot) return;
// 	rdc.get("busy",(err,res)=>{
// 		if(res===null) return
// 		list = JSON.parse(res.toString())
// 		mt.forEach(a => {
// 			let found = list.findIndex(m=>m.id===a.user.id)
// 			if(found!==-1 && list[found].status==='on'){
// 				message.channel.send(list[found].content);
// 			}
// 		});
// 	})
// })
client.on('message',message=>{
	let mt = message.mentions.members
	if(mt===undefined || message.author.bot) return
	if(mt.get(process.env.BOSS_ID)!==undefined){
		if(mt.get(process.env.BOSS_ID).presence.status=='offline' || mt.get(process.env.BOSS_ID).presence.status=='dnd')
		message.author.send('Yui-senpai is busy. DO NOT DISTURB')
	}
})

client.on("error",err=>{
	console.log(err)
})

client.login(process.env.BOT_TOKEN);