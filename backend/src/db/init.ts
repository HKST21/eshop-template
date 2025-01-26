// Importy potřebných knihoven
import sqlite3 from 'sqlite3';       // SQLite databáze
import fs from 'fs';                 // Práce se soubory
import path from 'path';             // Práce s cestami

export class Database {
   private db: sqlite3.Database;    // Instance SQLite databáze

   constructor() {
       // Vytvoření připojení k databázi v složce db
       const dbPath = path.join(__dirname, 'database.sqlite');
       
       // Logování cesty k databázi pro snazší debugging
       console.log('Inicializace databáze na cestě:', dbPath);
       
       this.db = new sqlite3.Database(dbPath); 
   }

   async init() {
       try {
           // Načtení SQL schématu ze souboru
           const schemaPath = path.join(__dirname, 'schema.sql');
           console.log('Načítání schema souboru z:', schemaPath);
           
           const schema = fs.readFileSync(schemaPath, 'utf8');
           
           // Promise wrapper pro asynchronní inicializaci databáze
           return new Promise((resolve, reject) => {
               this.db.exec(schema, (err) => {
                   if (err) {
                       console.error('Chyba při inicializaci databáze:', err);
                       reject(err);     // Pokud nastane chyba
                   } else {
                       console.log('Databázové schéma bylo úspěšně inicializováno');
                       resolve(true);   // Úspěšná inicializace
                   }
               });
           });
       } catch (error) {
           console.error('Chyba při čtení schema souboru:', error);
           throw error;
       }
   }

   // Metoda pro uzavření databáze - dobrá praxe pro čistý shutdown
   async close() {
       return new Promise((resolve, reject) => {
           this.db.close((err) => {
               if (err) {
                   console.error('Chyba při zavírání databáze:', err);
                   reject(err);
               } else {
                   console.log('Databáze byla úspěšně uzavřena');
                   resolve(true);
               }
           });
       });
   }
}