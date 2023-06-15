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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const XClient_1 = __importStar(require("../XClient"));
const TOKEN = "NzgzMzEyNDYwMzE2MTQ3ODEy.GcDe_D.lZikNMSM85hVvOvL0jpEVGc_WLWQ4oxtq2-e5A";
const CLIENT = new XClient_1.default.XClient({ "intents": ["Guilds", "MessageContent", "GuildMessages", "GuildMembers", "GuildMessageTyping"] });
const SERVER_ID = "782886097008197662";
const CHANNEL_ID = "782886097008197665";
CLIENT.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    XClient_1.XMySQL.ConfigureSQL({
        host: "66.11.118.47",
        port: 3306,
        user: "u1208_uTH3ao5YAw",
        password: "gdTofCHV!zT1i^5sq3xhip@W"
    });
    CLIENT.XTend.ClearExcessCommands();
}));
CLIENT.login(TOKEN);
