import Global from "./XGlobal"

var AllQueues:Queue[] = []
var UsedIDs:string[] = []

function GenerateUniqueID(Length:number) {
    var ID = ""

    for (var i = 1; i<=Length; i++) {
        ID += Math.max(
            Math.min(
                Math.floor(Math.random() * 9),
                0
            ),
            9
        ).toString()
    }

    if (UsedIDs.find(v => v == ID)) {
        ID = GenerateUniqueID(Length)
    }

    UsedIDs.push(ID)
    return ID
}

export default class Queue {
    ID:string
    List:string[] = []

    constructor(ID?:string) {
      this.ID = ID || GenerateUniqueID(20)  
    }

    Queue(Function:(msPassed:number) => any) {
        var PositionID = GenerateUniqueID(8)
        var QueuedTime = Global.tick()
        this.List.push(PositionID)

        return new Promise(async (res,rej) => {
            if (this.List[0] == PositionID) {
                res(true)
                return
            }

            while (this.List[0] == PositionID) {
                await Global.wait(0.2)
            }

            await Function(Global.tick() - QueuedTime)

            res(true)
        })
    }
}

export function GetAllQueues() {
    return AllQueues
}