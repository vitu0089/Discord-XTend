"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __importDefault(require("@sentry/node"));
var SentryEnabled = false;
var Client = undefined;
var IsTest = false;
var EnableTestErrorCatch = false;
exports.default = {
    TweakSettings(Settings) {
        Client = Settings.Client;
        IsTest = Settings.IsTest && true || false;
        EnableTestErrorCatch = Settings.EnableTestErrorCatch && true || false;
    },
    SetupSentry(SentrySettings, Force) {
        if (SentryEnabled && !Force) {
            this.warn("Sentry is already running...");
            return;
        }
        node_1.default.init(SentrySettings);
        SentryEnabled = true;
    },
    GetWrittenTime() {
        var ReturnVariable = "";
        var Uptime = (Client && Client.uptime || 0) / 1000;
        var Seconds = Math.floor(Uptime % 60);
        var Minutes = Math.floor(Uptime / 60 % 60);
        var Hours = Math.floor(Uptime / 60 / 60);
        if (Hours > 0) {
            ReturnVariable += (Hours < 10 && "0" || "") + Hours.toString() + "h";
        }
        if (Minutes > 0 || Hours > 0) {
            ReturnVariable += Hours > 0 && " " + (Minutes < 10 && "0" || "") + Minutes.toString() + "m" || Minutes.toString() + "m";
        }
        ReturnVariable += ((Minutes > 0 || Hours > 0) && " " || "") + (Seconds < 10 && "0" || "") + Seconds.toString() + "s" || Seconds.toString() + "s";
        return ReturnVariable;
    },
    // Colors from: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
    print(...Data) {
        // Add to start of array
        Data.unshift("\x1b[36m[\x1b[37m" + this.GetWrittenTime() + "\x1b[36m]\x1b[0m \x1b[34m");
        console.log.apply(console, Data);
    },
    test(...Data) {
        // Check
        if (!IsTest) {
            return;
        }
        // Add to start of array
        Data.unshift("\x1b[36m[\x1b[37m" + this.GetWrittenTime() + " \x1b[32m\x1b[5mTest\x1b[36m\x1b[0m]\x1b[0m \x1b[34m");
        console.log.apply(console, Data);
    },
    error(ExceptionMessage) {
        const HasError = ExceptionMessage instanceof Error;
        var Data = [];
        var Exception = HasError && ExceptionMessage || new Error();
        if (!HasError) {
            Exception.name = ExceptionMessage;
        }
        // Send to sentry error tracker
        if (!IsTest || EnableTestErrorCatch) {
            node_1.default.captureException(Exception);
        }
        // Add to start of array
        Data.unshift("\x1b[36m[\x1b[37m" + this.GetWrittenTime() + " \x1b[31m\x1b[5mError\x1b[36m\x1b[0m]\x1b[0m \x1b[34m");
        // Add to end of array
        Data.push(Exception.stack);
        console.log.apply(console, Data);
    },
    warn(ExceptionMessage) {
        var Data = [];
        var Exception = new Error();
        Exception.name = ExceptionMessage;
        // Send to sentry error tracker
        if (!IsTest || EnableTestErrorCatch) {
            node_1.default.captureException(Exception);
        }
        // Add to start of array
        Data.unshift("\x1b[36m[\x1b[37m" + this.GetWrittenTime() + " \x1b[33m\x1b[5mWarning\x1b[36m\x1b[0m]\x1b[0m \x1b[34m");
        // Add to end of array
        Data.push(Exception.stack);
        console.log.apply(console, Data);
    },
    wait(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    },
    tick() {
        return Math.floor(Date.now() / 1000);
    },
    FindProcessArgument(Name) {
        return process.argv.findIndex(v => v == Name) != -1 && true || false;
    }
};
