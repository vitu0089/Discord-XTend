import SQL from "mysql"
import Global from "./XGlobal"
import Queue from "./XQueue"

var Cache:{[key:string]:{Activated:number,Result:any}} = {}
var ShouldCache:boolean = true
var CacheTimer = 2 // Seconds

const ModuleQueue = new Queue()

var Con: null | SQL.Connection = null
var Module = {
    ConfigureSQL(Config:SQL.ConnectionConfig) {
        if (Con) {
            Global.warn("SQL already configured")
            return
        }

        Con = SQL.createConnection(Config)

        Con.on("error",(err) => {
            if (!err) return;

            Global.error(err)
        })
    },

    ChangeCacheTimer(Seconds?:number) {
        CacheTimer = Seconds || 2
    },

    ToggleCache(Enabled?:boolean) {
        ShouldCache = Enabled || !ShouldCache
    },

    async Query(Request:string,GetCached:boolean,RowHandler?:(Response:any) => any) {
        return await ModuleQueue.Queue((TimePassed) => {
            if (!Con) {
                Global.error("Connection was not initiated before request")
                return
            }

            if (GetCached && Cache[Request]) {
                return Cache[Request].Result
            }

            var Quer = Con.query(Request)
            var Result:any[] = []
            
            Quer.on("error",(err) => {
                if (!err) return;

                Global.error(err)
            })
            
            Quer.on("result",(Res) => {
                Result.push(Res)

                if (RowHandler) {
                    RowHandler(Res)
                }
            })

            Quer.on("end",() => {
                if (ShouldCache) {
                    Cache[Request] = {
                        Activated: Global.tick(),
                        Result: Result
                    }
                }

                return Result
            })
        })
    }
}

setInterval(() => {
    var Time = Global.tick()

    for (const index in Cache) {
        if (Cache[index].Activated + CacheTimer > Time) {
            continue
        }

        delete Cache[index]
    }
},1000)

export default Module