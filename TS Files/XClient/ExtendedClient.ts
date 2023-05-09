import discord from "discord.js"

export type XRanks = "User" | "Admin" | "Lord"
export type XCommandType = "Slash" | "Text"

export interface XSlashCommand {
    Description:string,
    Rank:XRanks,
    Executable:(interaction:discord.CommandInteraction) => void
}

export interface XTextCommand {
    Description:string,
    Rank:XRanks,
    Executable:(interaction:discord.MessageInteraction) => void
}

var commands:{Text:{[key:string]:XTextCommand},Slash:{[key:string]:XSlashCommand}} = {
    Text: {},
    Slash: {}
}

var hasCommand = {
    Text: false,
    Slash: false
}

class XModule {
    private Client:discord.Client



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
        client.on("interactionCreate",(int) => {
            if (!int.isCommand() || !hasCommand.Slash || !this.CommandHandler.IsRunning()) {
                return
            }

            commands.Slash[int.commandName].Executable(int)
        })

        client.on("messageCreate",(mes) => {
            if (!hasCommand.Text || !this.CommandHandler.IsRunning()) {
                return
            }

            // commands.Slash[].Executable(int)
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

    AddCommand = (type:XCommandType,name:string,settings:XSlashCommand | XTextCommand) => {
        var currentCatagory = commands[type]
        name = name.toLowerCase()

        if (currentCatagory[name]) {
            console.log("Overwriting command: " + name)
        }
        
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
            delete commands.Slash[name]
        }

        if (commands.Text[name]) {
            delete commands.Text[name]
        }
    }

    HasPermission = (member:discord.GuildMember,access:XRanks) => {
        return (
            access == "User" ||
            access == "Admin" && member.permissions.has("Administrator") ||
            access == "Lord" && this.Lords.IsLord(member.id)
        )
    }
}

export default class xClient extends discord.Client {
    XTend = new XModule(this)
}