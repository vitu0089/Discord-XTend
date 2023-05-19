export default {
    Print(...content:string[]) {
        var uptime = process.uptime()
        var time = {
            hours:      Math.floor((uptime / 3600)),
            minutes:    Math.floor((uptime / 60) % 60) ,
            seconds:    Math.floor(uptime % 60)
        }

        var stringTime = (
            (time.hours > 0 && (time.hours < 10 && "0" || "") + time.hours.toString() + "h:" || "") +
            ((time.minutes > 0 || time.hours > 0) && (time.minutes < 10 && "0" || "") + time.minutes.toString() + "m:" || "") +
            (time.seconds < 10 && "0" || "") + time.seconds.toString() + "s"
        )

        console.log("[" + stringTime + "]",
        content.reduce((total,current) => total + current))
    }
}