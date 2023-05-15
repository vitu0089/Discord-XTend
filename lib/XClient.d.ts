import discord from "discord.js";
export type XRanks = "User" | "Admin" | "Lord";
export type XCommandType = "Slash" | "Text";
export type XPrefix = string | "Default" | "None";
export interface XSlashCommand {
    Description: string;
    Rank: XRanks;
    Executable: (interaction: discord.CommandInteraction) => void;
}
export interface XTextCommand {
    Description: string;
    Rank: XRanks;
    Executable: (message: discord.Message) => void;
}
declare class XModule {
    private Client;
    Prefix: string;
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
    constructor(client: discord.Client);
    CreateEmbed: (Title: string, Description: string, Options?: {
        Color?: discord.ColorResolvable;
        Timestamp?: string | boolean;
        Fields?: discord.EmbedField[];
    }) => discord.EmbedBuilder;
    CreateDefaultEmbed: (name: string) => discord.EmbedBuilder;
    AddCommand: (type: XCommandType, name: string, settings: XSlashCommand | XTextCommand) => void;
    RemoveCommand: (name: string, type?: XCommandType | "Both") => void;
    ClearExcessCommands: () => Promise<unknown>;
    HasPermission: (member: discord.GuildMember, access: XRanks) => boolean;
    SetPrefix: (prefix: XPrefix) => void;
}
export declare var XMessages: any;
export default class xClient extends discord.Client {
    XTend: XModule;
}
export {};
