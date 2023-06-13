import Discord from "discord.js"
import Sentry from "@sentry/node"

var SentryEnabled = false
var Client:Discord.Client | undefined = undefined
var IsTest:boolean = false
var EnableTestErrorCatch:boolean = false

export default {
    TweakSettings(Settings:{
        Client?:Discord.Client,
        IsTest?:boolean,
        EnableTestErrorCatch?:boolean
    }) {
        Client = Settings.Client
        IsTest = Settings.IsTest && true || false
        EnableTestErrorCatch = Settings.EnableTestErrorCatch && true || false
    },

    SetupSentry(SentrySettings:Sentry.NodeOptions,Force?:true) {
        if (SentryEnabled && !Force) {
            this.warn("Sentry is already running...")
            return
        }

        Sentry.init(SentrySettings)
        SentryEnabled = true
    },

    GetWrittenTime(){
        var ReturnVariable = ""
        var Uptime = (Client && Client.uptime || 0) / 1000
        var Seconds = Math.floor(Uptime % 60)
        var Minutes = Math.floor(Uptime / 60 % 60)
        var Hours = Math.floor(Uptime / 60 / 60)
    
        if (Hours > 0) {
                ReturnVariable += (Hours < 10 && "0" || "") + Hours.toString() + "h"
        }
    
        if (Minutes > 0 || Hours > 0) {
            ReturnVariable += Hours > 0 && " " + (Minutes < 10 && "0" || "") + Minutes.toString() + "m" || Minutes.toString() + "m"
        }
    
        ReturnVariable += ((Minutes > 0 || Hours > 0) && " " || "") + (Seconds < 10 && "0" || "") + Seconds.toString() + "s" || Seconds.toString() + "s"
    
        return ReturnVariable
    },

    // Colors from: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
    print(...Data: any[]){
        // Add to start of array
        Data.unshift("\x1b[36m[\x1b[37m" + this.GetWrittenTime() + "\x1b[36m]\x1b[0m \x1b[34m")
        console.log.apply(console,Data)
    },

    test(...Data: any[]){
        // Check
        if (!IsTest) {
            return
        }

        // Add to start of array
        Data.unshift("\x1b[36m[\x1b[37m" + this.GetWrittenTime() + " \x1b[32m\x1b[5mTest\x1b[36m\x1b[0m]\x1b[0m \x1b[34m")
        console.log.apply(console,Data)
    },
    
    error(ExceptionMessage:string | Error){
        const HasError = ExceptionMessage instanceof Error
        var Data:any[] = []
        var Exception =  HasError && ExceptionMessage || new Error()
        if (!HasError) {
            Exception.name = ExceptionMessage
        }

        // Send to sentry error tracker
        if (!IsTest || EnableTestErrorCatch) {
            Sentry.captureException(Exception)
        }
        
        // Add to start of array
        Data.unshift("\x1b[36m[\x1b[37m" + this.GetWrittenTime() + " \x1b[31m\x1b[5mError\x1b[36m\x1b[0m]\x1b[0m \x1b[34m")
        
        // Add to end of array
        Data.push(Exception.stack)
        console.log.apply(console,Data)
    },

    warn(ExceptionMessage:string) {
        var Data:any[] = []
        var Exception = new Error()
        Exception.name = ExceptionMessage

        // Send to sentry error tracker
        if (!IsTest || EnableTestErrorCatch) {
            Sentry.captureException(Exception)
        }

        // Add to start of array
        Data.unshift("\x1b[36m[\x1b[37m" + this.GetWrittenTime() + " \x1b[33m\x1b[5mWarning\x1b[36m\x1b[0m]\x1b[0m \x1b[34m")

        // Add to end of array
        Data.push(Exception.stack)
        console.log.apply(console,Data)
    },

    wait(seconds: number){
        return new Promise(resolve => setTimeout(resolve, seconds * 1000))
    },
    
    tick(){
        return Math.floor(Date.now()/1000)
    },

    FindProcessArgument(Name:string) {
        return process.argv.findIndex(v => v == Name) != -1 && true || false
    }
}