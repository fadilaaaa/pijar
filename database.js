var sqlite3 = require("sqlite3").verbose();
var md5 = require("md5");

const DBSOURCE = "pijarcamp.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    db.run(
      `CREATE TABLE produk (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nama_produk text, 
                keterangan text, 
                harga INTEGER, 
                jumlah INTEGER
                )`,
      (err) => {
        if (err) {
          // Table already created
          console.error(err.message);
        } else {
          // Table just created, creating some rows
          var insert =
            "INSERT INTO produk (nama_produk, keterangan, harga,jumlah) VALUES (?,?,?,?)";
          db.run(insert, [
            "robot x",
            "robot x adalah robot yang sangat canggih",
            1000000,
            10,
          ]);
          db.run(insert, [
            "robot y",
            "robot y adalah robot yang tidak canggih",
            100,
            10,
          ]);
          console.log("Table created");
        }
      }
    );
  }
});

module.exports = db;
