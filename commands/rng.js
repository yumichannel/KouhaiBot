const discord = require('discord.js')

exports.run=(client,message,args)=>{
    var x = args.split(' ')
    var arr
    var res =''
    switch(x[0]){
        case 's':
            try {
                arr = x[1].split('-')
                res = proc(arr[0],arr[1])
                message.channel.send(`Result: ${res}`)
            } catch (error) {
                console.log("rng error:\n"+error)
            }
            return
        case 'm':
            try {
                arr = x[2].split('-')
                while(x[1]!=0){
                    res+=proc(arr[0],arr[1])+" "
                    x[1]--
                }
                message.channel.send(res)
            } catch (error) {
                console.log("rng error:\n"+error)
            }
            return
        default:
    }

    function proc(a,b){
        a = parseInt(a)
        b = parseInt(b)
        return Math.floor(Math.random()*(b+1-a))+a
    }
}