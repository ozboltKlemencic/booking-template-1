"use server"

import { readFile, writeFile } from "./helpers"


interface Stranka {
  id: string;
  ime: string;
  priimek: string;
  email: string;
  narocila:string[];
}

interface Storitev {
  naziv: string;
  cena: string;
  trajanje: string;
  tip: string;
  value:string;
}

export interface Mehanik {
  id: string;
  ime: string;
  priimek:string;
  delavneUre: string;
  narocila:string[]
}

export interface Rezervacija {
  id: string;
  datumRezervacije: string;
  datumTermina:string;
  ura: string;
  storitevId:string;
  mehanikId:string;
  strankaId:number;
  status:string;
}



export async function delovneUreMehanika(mehanikId:string){
  const database = readFile('mehaniki.json'); 
  const mehanik = database.mehaniki.find((mehanik:Mehanik) => mehanik.id === mehanikId);

  if (!mehanik) {
    throw new Error(`Mehanik z IDjem ${mehanikId} ni bil najden.`);
  }
  return mehanik.delavneUre
}

interface uraDatumSez {
  ura: string;
  datumRezervacije: string;  // ISO 8601 format (npr. '2024-10-31T23:00:00.000Z')
}

export async function zasedeneUreDatuma(datum: string, rezervacije: uraDatumSez[]) {
  const seznam:string[] = []
  rezervacije.forEach((uraDatum) => {
    if (uraDatum.datumRezervacije === datum) {
      seznam.push(uraDatum.ura)
    }
  });
  return seznam
}

export async function zasedenDanMehanika(delovneUre: number[], zasedeneUre: string[]) {
  const vseZasedene = delovneUre.every((ura) => zasedeneUre.includes(ura.toString()));
  return vseZasedene;
}

export async function datumRezervacije(mehanikId: string) {
  try {
    const database = await readFile('rezervacije.json');
    
    const rezervacijeMehanika = Object.values(database as Record<string, Rezervacija>).filter(
      (rezervacija) => rezervacija.mehanikId === String(mehanikId)
    );

    const seznam = rezervacijeMehanika.map((uraDatum) => ({
      ura: uraDatum.ura,
      datumRezervacije: uraDatum.datumRezervacije
    }));
    
    return seznam

  } catch (error) {
    console.error('Napaka pri branju datoteke:', error);
    return [];
  }
}


function najdiStranko(email: string): Stranka | null {
  const database = readFile('stranke.json'); 
  const stranka = database.stranke.find((stranka: Stranka) => stranka.email === email);
  return stranka || null;
}

function ustvariStranko(ime:string,priimek:string,email:string){
  const stranke = readFile("stranke.json");
    const id = stranke.stranke.length ? Math.max(...stranke.stranke.map((stranka: Stranka) => stranka.id)) + 1 : 1;
    const novaStranka = {
        id: String(id),
        ime: ime,
        priimek: priimek,
        email: email,
        narocila:[]
    };
    stranke.stranke.push(novaStranka);
    writeFile(stranke,"stranke.json");
    return novaStranka;
}

function dodajNarociloStranki(id:string,email:string){
  const database = readFile('stranke.json'); 
  const strankaa = database.stranke.find((strankaa:Stranka) => strankaa.email === email);
  if(strankaa){
    strankaa.narocila.push(id);
    writeFile(database,"stranke.json");
  }
}

function najdiStoritev(value:string) {
  const database = readFile('storitve.json'); 
  const storitev = database.storitve.find((storitev:Storitev) => storitev.value === value);
  return storitev || null;
}

function najdiMehanika(id:string) {
  const database = readFile('mehaniki.json'); 
  const mehanik = database.mehaniki.find((mehanik:Mehanik )=> mehanik.id === id);
  return mehanik || null;
}

function dodajNarociloMehaniku(id:string,mehanikId:string){
  const database = readFile('mehaniki.json'); 
  const mehanik = database.mehaniki.find((mehanik:Mehanik) => mehanik.id === mehanikId);
  if(mehanik){
    mehanik.narocila.push(id);
    writeFile(database,"mehaniki.json");
  }
}


export async function narediRezervacijo(formData:FormData){
    const email= formData.get("email") as string
    const ime= formData.get("ime") as string
    const priimek= formData.get("priimek") as string
    const datumRezervacije= formData.get("datumRezervacije") as string
    const ura= formData.get("ura") as string
    const mehaniki= formData.get("mehaniki") as string
    const storitve= formData.get("storitve") as string

    let storitevId
    const storitev = najdiStoritev(storitve); 
    if (storitev) {
      storitevId = storitev.id; 
    }

    let mehanikId
    const mehanik = najdiMehanika(mehaniki); 
    if (mehanik) {
      mehanikId = mehanik.id; 
    }

    let strankaId
    let stranka = najdiStranko(email); 
    if (stranka) {
       strankaId = stranka.id; 
    } else{
      stranka = ustvariStranko(ime,priimek,email);
      strankaId = stranka.id; 
    }

    const status = "potrjena";
    const lokalniDatum = new Date;
    const rezervacije = readFile("rezervacije.json");
    const datumTermina = lokalniDatum.toISOString().split('T')[0]
   
    
    

    const id = Object.keys(rezervacije).length ? Math.max(...Object.keys(rezervacije).map(Number))+1:1;
    rezervacije[id] = {id,datumRezervacije,datumTermina ,ura,storitevId,mehanikId,strankaId,status};

    dodajNarociloMehaniku(String(id),mehanikId)
    dodajNarociloStranki(String(id),email)

    writeFile(rezervacije,"rezervacije.json");
}
