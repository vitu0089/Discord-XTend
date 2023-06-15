export default class Queue {
    ID: string;
    List: string[];
    constructor(ID?: string);
    Queue(Function: (msPassed: number) => any): Promise<unknown>;
}
export declare function GetAllQueues(): Queue[];
