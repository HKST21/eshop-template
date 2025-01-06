// Importy potřebných knihoven
import sqlite3 from 'sqlite3';       // SQLite databáze
import fs from 'fs';                 // Práce se soubory
import path from 'path';             // Práce s cestami

export class Database {
   private db: sqlite3.Database;    // Instance SQLite databáze

   constructor() {
       // Vytvoření připojení k databázi v složce db
       this.db = new sqlite3.Database(path.join(__dirname, 'database.sqlite')); 
   }

   async init() {
       // Načtení SQL schématu ze souboru
       const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
       
       // Promise wrapper pro asynchronní inicializaci databáze
       return new Promise((resolve, reject) => {
           this.db.exec(schema, (err) => {
               if (err) {
                   reject(err);     // Pokud nastane chyba
               } else {
                   resolve(true);   // Úspěšná inicializace
               }
           });
       });
   }
}