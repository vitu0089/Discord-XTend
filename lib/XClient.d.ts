import Discord from "discord.js";
import Messages from "./XMessages";
import Global from "./XGlobal";
declare module XModule {
    export type XRanks = "User" | "Admin" | "Lord";
    export type XCommandType = "Slash" | "Text";
    export type XPrefix = string | "Default" | "None";
    export interface XSlashCommand {
        Description: string;
        Rank: XRanks;
        Executable: (interaction: Discord.CommandInteraction) => void;
    }
    export interface XTextCommand {
        Description: string;
        Rank: XRanks;
        Executable: (message: Discord.Message) => void;
    }
    class Client {
        Prefix: string;
        private Client;
        CommandHandler: {
            handlerState: {
                paused: boolean;
                stopped: boolean;
            };
            Start(): void;
            Stop(): void;
            Pause(): void;
            BypassStart(): void;
            IsRunning(): boolean;
        };
        Lords: {
            Lords: string[];
            AddLord(lord: string): void;
            SetLords(lords: string[]): void;
            RemoveLord(lordID: string): void;
            ResetLord(): void;
            IsLord(lordID: string): boolean;
        };
        constructor(Client: Discord.Client);
        CreateEmbed: (Title: string, Description: string, Options?: {
            Color?: Discord.ColorResolvable;
            Timestamp?: string | boolean;
            Fields?: Discord.EmbedField[];
        }) => Discord.EmbedBuilder;
        CreateDefaultEmbed: (name: string) => Discord.EmbedBuilder;
        AddCommand: (type: XCommandType, name: string, settings: XSlashCommand | XTextCommand) => void;
        RemoveCommand: (name: string, type?: XCommandType | "Both") => void;
        ClearExcessCommands: () => Promise<unknown>;
        HasPermission: (member: Discord.GuildMember, access: XRanks) => boolean;
        SetPrefix: (prefix: XPrefix) => void;
    }
    export class XClient extends Discord.Client {
        XTend: Client;
    }
    export {};
}
export default XModule;
export { Global as XGlobal, Messages as XMessages };
