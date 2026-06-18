import alasql from "alasql";

let prete = false;

export function getDb() {
  if (!prete) {
    alasql("CREATE TABLE IF NOT EXISTS users (id INT, email STRING, password STRING, role STRING)");
    alasql("CREATE TABLE IF NOT EXISTS orders (id INT, userId INT, produit STRING, montant INT)");
    alasql("CREATE TABLE IF NOT EXISTS produits (id INT, nom STRING, prix INT)");

    alasql("DELETE FROM users");
    alasql("DELETE FROM orders");
    alasql("DELETE FROM produits");

// ✅ mots de passe HACHÉS (bcrypt)

// nosemgrep: generic.secrets.security.detected-bcrypt-hash.detected-bcrypt-hash

alasql("INSERT INTO users VALUES (1,'alice@vulnshop.test','$2b$10$ea./ASbj4qEnFWQPTaclWOb8tuDt9vsb86rbW/vfgA3nH2CYfWQYG','user')");
alasql("INSERT INTO users VALUES (2,'bob@vulnshop.test','$2b$10$mbsb2WdadK6chM6mcaQzNOaHPd/bHewlvatdSnRMchC/gUrbJe6r6','user')");
alasql("INSERT INTO users VALUES (3,'admin@vulnshop.test','$2b$10$gyh3HcveSyqodxP6qTfNUuKI4xIAw4vE0qs81CnUh8VDtU7aG/L.6','admin')");

    alasql("INSERT INTO orders VALUES (1,1,'Clavier mécanique',89)");
    alasql("INSERT INTO orders VALUES (2,2,'Casque audio',149)");
    alasql("INSERT INTO orders VALUES (3,3,'Licence PRO (compte admin)',499)");

    alasql("INSERT INTO produits VALUES (1,'Clavier mécanique',89)");
    alasql("INSERT INTO produits VALUES (2,'Casque audio',149)");
    alasql("INSERT INTO produits VALUES (3,'Souris ergonomique',39)");

    prete = true;
  }

  return alasql;
}
