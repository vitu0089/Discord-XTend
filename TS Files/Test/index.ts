import extended from "../XClient"
import discord from "discord.js"

const TOKEN = "NzgzMzEyNDYwMzE2MTQ3ODEy.GTNIr5.ZYUq4fCbUtPAXXyriI2v9ibsLHHCmeJ86h0wkI"
const CLIENT = new extended.XClient({"intents":["Guilds","MessageContent","GuildMessages","GuildMembers","GuildMessageTyping"]})
const SERVER_ID = "782886097008197662"
const CHANNEL_ID = "782886097008197665"

CLIENT.on("ready",async () => {
    
    CLIENT.XTend.AddCommand("Text","ping",{
        Description:"Pings the server",
        Rank:"User",
        Executable:(message) => {
            message.reply("Pong!")
        }
    } as extended.XSlashCommand)

    CLIENT.XTend.ClearExcessCommands()
})

CLIENT.login(TOKEN)