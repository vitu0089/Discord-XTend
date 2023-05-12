"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messages = {
    GetMessage(name) {
        var index = this.Messages.findIndex(v => v.Name == name);
        return index > -1 && this.Messages[index] || null;
    },
    SetMessage(name, newSettings) {
        var index = this.Messages.find(v => v.Name == name);
        if (!index) {
            console.error("Message not found: " + name);
            return;
        }
    },
    Messages: [
        {
            Name: "InvalidDefault",
            Title: "Invalid Default Name",
            Description: "Couldn't find the default message in question",
            Color: "DarkRed"
        },
        {
            Name: "PermissionError",
            Title: "Permissions NULL",
            Description: "You do not have permission to execute this command",
            Color: "DarkRed"
        },
        {
            Name: "CommandError",
            Title: "Command NULL",
            Description: "This command doesn't exsist",
            Color: "DarkRed"
        },
    ]
};
exports.default = messages;
