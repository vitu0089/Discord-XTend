"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
var commands = {
    Text: {},
    Slash: {}
};
var hasCommand = {
    Text: false,
    Slash: false
};
class XModule {
    constructor(client) {
        var _a;
        // Command handler states & tools
        this.CommandHandler = {
            handlerState: {
                paused: false,
                stopped: false
            },
            Start() {
                if (this.handlerState.stopped) {
                    console.log("Handler has been stopped for good");
                }
                this.handlerState.paused = false;
            },
            Stop() {
                this.handlerState.stopped = true;
            },
            Pause() {
                this.handlerState.paused = true;
            },
            BypassStart() {
                this.handlerState.paused = false;
                this.handlerState.stopped = false;
            },
            IsRunning() {
                return !this.handlerState.paused && !this.handlerState.stopped;
            }
        };
        // Lords
        this.Lords = {
            Lords: [],
            AddLord(lord) {
                this.Lords.push(lord);
            },
            SetLords(lords) {
                this.Lords = lords;
            },
            RemoveLord(lordID) {
                var index = this.Lords.findIndex(v => v == lordID);
                if (index == -1) {
                    return;
                }
                this.Lords.splice(index, 1);
            },
            ResetLord() {
                this.Lords = [];
            },
            IsLord(lordID) {
                return this.Lords.findIndex(v => v == lordID) > -1;
            }
        };
        this.CreateEmbed = (Title, Description, Options) => {
            var embed = new discord_js_1.default.EmbedBuilder({ title: Title, description: Description });
            if (!Options) {
                return embed;
            }
            for (const index in Options) {
                // @ts-expect-error
                embed["set" + index](Options[index]);
            }
            return embed;
        };
        this.AddCommand = (type, name, settings) => {
            var _a;
            var currentCatagory = commands[type];
            name = name.toLowerCase();
            if (currentCatagory[name]) {
                console.log("Overwriting command: " + name);
            }
            currentCatagory[name] = {
                Description: settings.Description,
                Rank: settings.Rank,
                Executable: type == "Slash" && settings.Executable || settings.Executable
            };
            // Create slash commands through builder
            var newCommand = new discord_js_1.default.SlashCommandBuilder();
            newCommand.setName(name.toLowerCase());
            newCommand.setDescription(settings.Description);
            // Register the presence of this command type
            hasCommand[type] = true;
            // Publish / update command
            (_a = this.Client.application) === null || _a === void 0 ? void 0 : _a.commands.create(newCommand);
        };
        this.RemoveCommand = (name, type) => {
            type = type || "Both";
            if (type != "Both") {
                delete commands[type][name];
                return;
            }
            if (commands.Slash[name]) {
                delete commands.Slash[name];
            }
            if (commands.Text[name]) {
                delete commands.Text[name];
            }
        };
        this.HasPermission = (member, access) => {
            return (access == "User" ||
                access == "Admin" && member.permissions.has("Administrator") ||
                access == "Lord" && this.Lords.IsLord(member.id));
        };
        this.Client = client;
        // Check for commands [Only works for slash commands]
        if ((((_a = client.application) === null || _a === void 0 ? void 0 : _a.commands.cache.size) || 0) > 0) {
            hasCommand.Slash = true;
        }
        // Command handler
        client.on("interactionCreate", (int) => {
            if (!int.isCommand() || !hasCommand.Slash || !this.CommandHandler.IsRunning()) {
                return;
            }
            commands.Slash[int.commandName].Executable(int);
        });
        client.on("messageCreate", (mes) => {
            if (!hasCommand.Text || !this.CommandHandler.IsRunning()) {
                return;
            }
            // commands.Slash[].Executable(int)
        });
    }
}
class xClient extends discord_js_1.default.Client {
    constructor() {
        super(...arguments);
        this.XTend = new XModule(this);
    }
}
exports.default = xClient;
