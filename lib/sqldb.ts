import alasql from "alasql";

let prete = false;

export function getDb() {
  if (!prete) {
    alasql("CREATE TABLE IF NOT EXISTS users    (id INT, email STRING, password STRING, role STRING)");
    alasql("CREATE TABLE IF NOT EXISTS orders   (id INT, userId INT, produit STRING, montant INT)");
    alasql("CREATE TABLE IF NOT EXISTS produits (id INT, nom STRING, prix INT)");

    // on repart propre à chaque (re)chargement du module
    alasql("DELETE FROM users");
    alasql("DELETE FROM orders");
    alasql("DELETE FROM produits");

    alasql("INSERT INTO users VALUES (1,'alice@vulnshop.test','$2b$10$Q8e6Yv0m3kJrPxhelk1IZ.tQ6q3yqv9oQ1qg8t3xV2u4lC7yq9bGK','user')");
    alasql("INSERT INTO users VALUES (2,'bob@vulnshop.test','$2b$10$N4f7Zw1n4lKsQyifml2JA.uR7r4zrw0pR2rh9u4yW3v5mD8zr0cHL','user')");
    alasql("INSERT INTO users VALUES (3,'admin@vulnshop.test','$2b$10$M3e6Yv0m3kJrPxgdkj1HZ.sP5p2xpu8nP0pf7s2wU1t3kB6xp8aFJ','admin')");

    alasql("INSERT INTO orders VALUES (1,1,'Clavier mécanique',89)");
    alasql("INSERT INTO orders VALUES (2,2,'Casque audio',149)");
    alasql("INSERT INTO orders VALUES (3,3,'Licence PRO (compte admin)',499)");

    alasql("INSERT INTO produits VALUES (1,'Clavier mécanique',89)");
    alasql("INSERT INTO produits VALUES (2,'Casque audio',149)");
    alasql("INSERT INTO produits VALUES (3,'Souris ergonomique',39)");

    prete = true;
  }
  return alasql; // alasql est appelable : db("SELECT ...")
}
