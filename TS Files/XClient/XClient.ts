import discord from "discord.js"
import xMessages from "./XMessages"

export type XRanks = "User" | "Admin" | "Lord"
export type XCommandType = "Slash" | "Text"
export type XPrefix = string | "Default" | "None"

export interface XSlashCommand {
    Description:string,
    Rank:XRanks,
    Executable:(interaction:discord.CommandInteraction) => void
}

export interface XTextCommand {
    Description:string,
    Rank:XRanks,
    Executable:(message:discord.Message) => void
}

var commands:{Text:{[key:string]:XTextCommand},Slash:{[key:string]:XSlashCommand}} = {
    Text: {},
    Slash: {}
}

var hasCommand = {
    Text: false,
    Slash: false
}

var DEFAULT_PREFIX = "!"

class XModule {
    private Client:discord.Client
    Prefix:string = DEFAULT_PREFIX



    // Command handler states & tools
    CommandHandler = {
        handlerState: {
            paused: false,
            stopped: false
        },

        Start() {
            if (this.handlerState.stopped) {
                console.log("Handler has been stopped for good")
            }
    
            this.handlerState.paused = false
        },
    
        Stop() {
            this.handlerState.stopped = true
        },
    
        Pause() {
            this.handlerState.paused = true
        },
    
        BypassStart() {
            this.handlerState.paused = false
            this.handlerState.stopped = false
        },

        IsRunning() {
            return !this.handlerState.paused && !this.handlerState.stopped
        }
    }



    // Lords
    Lords:{ Lords: string[]; AddLord(lord: string): void; SetLords(lords: string[]): void; RemoveLord(lordID: string): void; ResetLord(): void; IsLord(lordID: string): boolean; } = {
        Lords: [],

        AddLord(lord:string) {
            this.Lords.push(lord)
        },

        SetLords(lords:string[]) {
            this.Lords = lords
        },

        RemoveLord(lordID:string) {
            var index = this.Lords.findIndex(v => v == lordID)

            if (index == -1) {
                return
            }

            this.Lords.splice(index,1)
        },

        ResetLord() {
            this.Lords = []
        },

        IsLord(lordID:string) {
            return this.Lords.findIndex(v => v == lordID) > -1
        }
    }



    constructor(client:discord.Client) {
        this.Client = client

        // Check for commands [Only works for slash commands]
        if ((client.application?.commands.cache.size || 0) > 0) {
            hasCommand.Slash = true
        }

        // Command handler
        client.on("interactionCreate",async (int) => {
            if (!int.isCommand() || !hasCommand.Slash || !this.CommandHandler.IsRunning()) {
                return
            }

            await int.deferReply()

            var command = commands.Slash[int.commandName]
            var member = int.member as discord.GuildMember

            if (member && !this.HasPermission(member,command.Rank)) {
                int.editReply({
                    embeds:[
                        this.CreateDefaultEmbed("PermissionError")
                    ]
                })
                return
            }

            command.Executable(int)
        })

        client.on("messageCreate",(mes) => {
            if (!hasCommand.Text || !this.CommandHandler.IsRunning()) {
                return
            }
            
            var content = mes.content
            var splitContent = content.substring(this.Prefix.length).split(" ")
            var command = commands.Text[splitContent[0]]
            var member = mes.member as discord.GuildMember
            
            if (mes.member?.user.bot || !content.startsWith(this.Prefix)) {
                return
            }

            if (!command) {
                mes.reply({
                    embeds:[
                        this.CreateDefaultEmbed("CommandError")
                    ]
                })
                return
            }

            if (member && !this.HasPermission(member,command.Rank)) {
                mes.reply({
                    embeds:[
                        this.CreateDefaultEmbed("PermissionError")
                    ]
                })
                return
            }

            command.Executable(mes)
        })
    }



    CreateEmbed = (Title:string,Description:string,Options?:{Color?:discord.ColorResolvable,Timestamp?:string | boolean, Fields?:discord.EmbedField[]}) => {
        var embed = new discord.EmbedBuilder({title:Title,description:Description})

        if (!Options) {
            return embed
        }

        for (const index in Options) {
            // @ts-expect-error
            embed["set" + index](Options[index])
        }

        return embed
    }

    CreateDefaultEmbed = (name:string) => {
        var message = xMessages.GetMessage(name) || xMessages.GetMessage("InvalidDefault") || {
            Name:"Null",
            Title:"Null",
            Description:"Null",
            Color:"Grey"
        }

        return this.CreateEmbed(message?.Title,message?.Description,{Color:message?.Color})
    }

    AddCommand = (type:XCommandType,name:string,settings:XSlashCommand | XTextCommand) => {
        var currentCatagory = commands[type]
        name = name.toLowerCase()

        if (currentCatagory[name]) {
            console.log("Overwriting command: " + name)
        }
        
        // @ts-ignore  Not sure how to handle this error
        currentCatagory[name] = {
            Description: settings.Description,
            Rank: settings.Rank,
            Executable: type == "Slash" && settings.Executable as XSlashCommand["Executable"] || settings.Executable as XTextCommand["Executable"]
        }
        
        // Create slash commands through builder
        var newCommand = new discord.SlashCommandBuilder()

        newCommand.setName(name.toLowerCase())
        newCommand.setDescription(settings.Description)

        // Register the presence of this command type
        hasCommand[type] = true
        
        // Publish / update command
        this.Client.application?.commands.create(newCommand)
    }

    RemoveCommand = (name:string, type?:XCommandType | "Both") => {
        type = type || "Both"

        if (type != "Both") {
            delete commands[type][name]
            return
        }

        if (commands.Slash[name]) {
            var exsisting = this.Client.application?.commands.cache.find(v => v.name == name)

            if (this.Client.application && exsisting) {
                this.Client.application.commands.delete(exsisting)
            }

            delete commands.Slash[name]
        }

        if (commands.Text[name]) {
            delete commands.Text[name]
        }
    }

    ClearExcessCommands = () => {
        return new Promise(async (res,rej) => {
            if (!this.Client.application) {
                return
            }

            (await this.Client.application.commands.fetch()).forEach((command,key,map) => {
                if (!commands.Slash[command.name]) {
                    this.Client.application?.commands.delete(command)
                }

                if (key == this.Client.application?.commands.cache.last()?.id) {
                    res(true)
                }
            })
        })
    }

    HasPermission = (member:discord.GuildMember,access:XRanks) => {
        return (
            access == "User" ||
            access == "Admin" && member.permissions.has("Administrator") ||
            access == "Lord" && this.Lords.IsLord(member.id)
        )
    }

    SetPrefix = (prefix:XPrefix) => {
        this.Prefix = prefix == "Default" && DEFAULT_PREFIX || prefix != "None" && prefix || ""
    }
}

export var XMessages = require("./XMessages")

export default class xClient extends discord.Client {
    XTend = new XModule(this)
}