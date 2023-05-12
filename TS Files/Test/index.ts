import * as extendedClient from "../XClient"
import discord from "discord.js"

const TOKEN = "NzgzMzEyNDYwMzE2MTQ3ODEy.G7LgcQ.DDi1meNhVbO5x_jGcRKgxlheDme4bxBk-BvMWw"
const CLIENT = new extendedClient.default({"intents":["Guilds","MessageContent","GuildMessages","GuildMembers","GuildMessageTyping"]})
const SERVER_ID = "782886097008197662"
const CHANNEL_ID = "782886097008197665"

CLIENT.on("ready",async () => {
    console.log("Ready...")

    CLIENT.XTend.AddCommand("Text","ping",{
        Description:"Pings the server",
        Rank:"User",
        Executable:(message) => {
            message.reply("Pong!")
        }
    } as extendedClient.XTextCommand)

    CLIENT.XTend.ClearExcessCommands()
})

CLIENT.XTend.Lords.SetLords([
    //"109715580327591936"
])

CLIENT.login(TOKEN)