import fs from "fs"
import "server-only"
import path from "path";

export interface Ticket {
    id:number;
    name:string;
    status:string;
    type:string;
}

const dbFolder = path.join(process.cwd(), 'database');

export function readFile(model:string){
    return JSON.parse(fs.readFileSync(`${dbFolder}/${model}`,'utf8'))
}

export function writeFile(data:Record<string,Ticket>,model:string){
    return fs.writeFileSync(`${dbFolder}/${model}`,JSON.stringify(data,null,2));
}



export interface Mehanik {
  id: string;
  ime: string;
  priimek:string;
  delavneUre: string;
  narocila:string[]
}

