"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const extendedClient = __importStar(require("./XClient/ExtendedClient"));
const TOKEN = "NzgzMzEyNDYwMzE2MTQ3ODEy.G7LgcQ.DDi1meNhVbO5x_jGcRKgxlheDme4bxBk-BvMWw";
const CLIENT = new extendedClient.default({ "intents": ["Guilds", "MessageContent", "GuildMessages", "GuildMembers", "GuildMessageTyping"] });
const SERVER_ID = "782886097008197662";
const CHANNEL_ID = "782886097008197665";
CLIENT.on("ready", () => {
    CLIENT.XTend.AddCommand("Slash", "Ping", {
        Description: "Will return a Pong",
        Rank: "User",
        Executable: (interaction) => {
            interaction.reply("Recieved");
        }
    });
});
CLIENT.XTend.Lords.SetLords([
    "109715580327591936"
]);
CLIENT.login(TOKEN);
