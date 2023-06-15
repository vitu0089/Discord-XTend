"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const XGlobal_1 = __importDefault(require("./XGlobal"));
const XQueue_1 = __importDefault(require("./XQueue"));
var Cache = {};
var ShouldCache = true;
var CacheTimer = 2; // Seconds
const ModuleQueue = new XQueue_1.default();
var Con = null;
var Module = {
    ConfigureSQL(Config) {
        if (Con) {
            XGlobal_1.default.warn("SQL already configured");
            return;
        }
        Con = mysql_1.default.createConnection(Config);
        Con.on("error", (err) => {
            if (!err)
                return;
            XGlobal_1.default.error(err);
        });
    },
    ChangeCacheTimer(Seconds) {
        CacheTimer = Seconds || 2;
    },
    ToggleCache(Enabled) {
        ShouldCache = Enabled || !ShouldCache;
    },
    Query(Request, GetCached, RowHandler) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ModuleQueue.Queue((TimePassed) => {
                if (!Con) {
                    XGlobal_1.default.error("Connection was not initiated before request");
                    return;
                }
                if (GetCached && Cache[Request]) {
                    return Cache[Request].Result;
                }
                var Quer = Con.query(Request);
                var Result = [];
                Quer.on("error", (err) => {
                    if (!err)
                        return;
                    XGlobal_1.default.error(err);
                });
                Quer.on("result", (Res) => {
                    Result.push(Res);
                    if (RowHandler) {
                        RowHandler(Res);
                    }
                });
                Quer.on("end", () => {
                    if (ShouldCache) {
                        Cache[Request] = {
                            Activated: XGlobal_1.default.tick(),
                            Result: Result
                        };
                    }
                    return Result;
                });
            });
        });
    }
};
setInterval(() => {
    var Time = XGlobal_1.default.tick();
    for (const index in Cache) {
        if (Cache[index].Activated + CacheTimer > Time) {
            continue;
        }
        delete Cache[index];
    }
}, 1000);
exports.default = Module;
