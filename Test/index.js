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
const XClient_1 = __importDefault(require("../XClient"));
const TOKEN = "NzgzMzEyNDYwMzE2MTQ3ODEy.GTNIr5.ZYUq4fCbUtPAXXyriI2v9ibsLHHCmeJ86h0wkI";
const CLIENT = new XClient_1.default.XClient({ "intents": ["Guilds", "MessageContent", "GuildMessages", "GuildMembers", "GuildMessageTyping"] });
const SERVER_ID = "782886097008197662";
const CHANNEL_ID = "782886097008197665";
CLIENT.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    CLIENT.XTend.AddCommand("Text", "ping", {
        Description: "Pings the server",
        Rank: "User",
        Executable: (message) => {
            message.reply("Pong!");
        }
    });
    CLIENT.XTend.ClearExcessCommands();
}));
CLIENT.XTend.Lords.SetLords([
//"109715580327591936"
]);
CLIENT.login(TOKEN);
