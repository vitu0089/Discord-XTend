import extended, {XMySQL as SQL} from "../XClient"
import discord from "discord.js"

const TOKEN = "NzgzMzEyNDYwMzE2MTQ3ODEy.GcDe_D.lZikNMSM85hVvOvL0jpEVGc_WLWQ4oxtq2-e5A"
const CLIENT = new extended.XClient({"intents":["Guilds","MessageContent","GuildMessages","GuildMembers","GuildMessageTyping"]})
const SERVER_ID = "782886097008197662"
const CHANNEL_ID = "782886097008197665"

CLIENT.on("ready",async () => {
    SQL.ConfigureSQL({
        host: "66.11.118.47",
        port: 3306,
        user: "u1208_uTH3ao5YAw",
        password: "gdTofCHV!zT1i^5sq3xhip@W"
    })

    CLIENT.XTend.ClearExcessCommands()
})

CLIENT.login(TOKEN)