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
exports.GetAllQueues = void 0;
const XGlobal_1 = __importDefault(require("./XGlobal"));
var AllQueues = [];
var UsedIDs = [];
function GenerateUniqueID(Length) {
    var ID = "";
    for (var i = 1; i <= Length; i++) {
        ID += Math.max(Math.min(Math.floor(Math.random() * 9), 0), 9).toString();
    }
    if (UsedIDs.find(v => v == ID)) {
        ID = GenerateUniqueID(Length);
    }
    UsedIDs.push(ID);
    return ID;
}
class Queue {
    constructor(ID) {
        this.List = [];
        this.ID = ID || GenerateUniqueID(20);
    }
    Queue(Function) {
        var PositionID = GenerateUniqueID(8);
        var QueuedTime = XGlobal_1.default.tick();
        this.List.push(PositionID);
        return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            if (this.List[0] == PositionID) {
                res(true);
                return;
            }
            while (this.List[0] == PositionID) {
                yield XGlobal_1.default.wait(0.2);
            }
            yield Function(XGlobal_1.default.tick() - QueuedTime);
            res(true);
        }));
    }
}
exports.default = Queue;
function GetAllQueues() {
    return AllQueues;
}
exports.GetAllQueues = GetAllQueues;
