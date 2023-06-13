"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XGlobal = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const XMessages_1 = __importDefault(require("./XMessages"));
const XGlobal_1 = __importDefault(require("./XGlobal"));
exports.XGlobal = XGlobal_1.default;
var XModule;
(function (XModule) {
    class Client {
        constructor(Client) {
            var _a;
            this.Prefix = DEFAULT_PREFIX;
            // Command handler states & tools
            this.CommandHandler = {
                handlerState: {
                    paused: false,
                    stopped: false
                },
                Start() {
                    if (this.handlerState.stopped) {
                        XGlobal_1.default.print("Handler has been stopped for good");
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
            this.CreateDefaultEmbed = (name) => {
                var message = XMessages_1.default.GetMessage(name) || XMessages_1.default.GetMessage("InvalidDefault") || {
                    Name: "Null",
                    Title: "Null",
                    Description: "Null",
                    Color: "Grey"
                };
                return this.CreateEmbed(message === null || message === void 0 ? void 0 : message.Title, message === null || message === void 0 ? void 0 : message.Description, { Color: message === null || message === void 0 ? void 0 : message.Color });
            };
            this.AddCommand = (type, name, settings) => {
                var _a;
                var currentCatagory = commands[type];
                name = name.toLowerCase();
                if (currentCatagory[name]) {
                    console.log("Overwriting command: " + name);
                }
                // @ts-ignore  Not sure how to handle this error
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
                var _a;
                type = type || "Both";
                if (type != "Both") {
                    delete commands[type][name];
                    return;
                }
                if (commands.Slash[name]) {
                    var exsisting = (_a = this.Client.application) === null || _a === void 0 ? void 0 : _a.commands.cache.find(v => v.name == name);
                    if (this.Client.application && exsisting) {
                        this.Client.application.commands.delete(exsisting);
                    }
                    delete commands.Slash[name];
                }
                if (commands.Text[name]) {
                    delete commands.Text[name];
                }
            };
            this.ClearExcessCommands = () => {
                return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
                    if (!this.Client.application) {
                        return;
                    }
                    (yield this.Client.application.commands.fetch()).forEach((command, key, map) => {
                        var _a, _b, _c;
                        if (!commands.Slash[command.name]) {
                            (_a = this.Client.application) === null || _a === void 0 ? void 0 : _a.commands.delete(command);
                        }
                        if (key == ((_c = (_b = this.Client.application) === null || _b === void 0 ? void 0 : _b.commands.cache.last()) === null || _c === void 0 ? void 0 : _c.id)) {
                            res(true);
                        }
                    });
                }));
            };
            this.HasPermission = (member, access) => {
                return (access == "User" ||
                    access == "Admin" && member.permissions.has("Administrator") ||
                    access == "Lord" && this.Lords.IsLord(member.id));
            };
            this.SetPrefix = (prefix) => {
                this.Prefix = prefix == "Default" && DEFAULT_PREFIX || prefix != "None" && prefix || "";
            };
            this.Client = Client;
            // Check for commands [Only works for slash commands]
            if ((((_a = Client.application) === null || _a === void 0 ? void 0 : _a.commands.cache.size) || 0) > 0) {
                hasCommand.Slash = true;
            }
            // Command handler
            Client.on("interactionCreate", (int) => __awaiter(this, void 0, void 0, function* () {
                if (!int.isCommand() || !hasCommand.Slash || !this.CommandHandler.IsRunning()) {
                    return;
                }
                yield int.deferReply();
                var command = commands.Slash[int.commandName];
                var member = int.member;
                if (member && !this.HasPermission(member, command.Rank)) {
                    int.editReply({
                        embeds: [
                            this.CreateDefaultEmbed("PermissionError")
                        ]
                    });
                    return;
                }
                command.Executable(int);
            }));
            Client.on("messageCreate", (mes) => {
                var _a;
                if (!hasCommand.Text || !this.CommandHandler.IsRunning()) {
                    return;
                }
                var content = mes.content;
                var splitContent = content.substring(this.Prefix.length).split(" ");
                var command = commands.Text[splitContent[0]];
                var member = mes.member;
                if (((_a = mes.member) === null || _a === void 0 ? void 0 : _a.user.bot) || !content.startsWith(this.Prefix)) {
                    return;
                }
                if (!command) {
                    mes.reply({
                        embeds: [
                            this.CreateDefaultEmbed("CommandError")
                        ]
                    });
                    return;
                }
                if (member && !this.HasPermission(member, command.Rank)) {
                    mes.reply({
                        embeds: [
                            this.CreateDefaultEmbed("PermissionError")
                        ]
                    });
                    return;
                }
                command.Executable(mes);
            });
            Client.once("ready", () => {
                var _a;
                XGlobal_1.default.print(((_a = Client.user) === null || _a === void 0 ? void 0 : _a.username) + " is ready...");
            });
        }
    }
    var commands = {
        Text: {},
        Slash: {}
    };
    var hasCommand = {
        Text: false,
        Slash: false
    };
    var DEFAULT_PREFIX = "!";
    class XClient extends discord_js_1.default.Client {
        constructor() {
            super(...arguments);
            this.XTend = new Client(this);
        }
    }
    XModule.XClient = XClient;
})(XModule || (XModule = {}));
exports.default = XModule;
