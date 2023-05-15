import discord from "discord.js";
export type XMessage = {
    Name: string;
    Title: string;
    Description: string;
    Color?: discord.ColorResolvable | undefined;
};
declare var messages: {
    GetMessage: (name: string) => XMessage | null;
    SetMessage: (name: string, newSettings: XMessage) => void;
    Messages: readonly XMessage[];
};
export default messages;
