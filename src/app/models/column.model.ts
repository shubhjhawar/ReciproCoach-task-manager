import { Task } from "./task.model";
export class Column {
    constructor(public name: string, public inbuilt: boolean, public tasks: Task[], public _id?: string) {
        
    }
}