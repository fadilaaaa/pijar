let express = require("express");
let app = express();
let db = require("./database.js");

let HTTP_PORT = 8000;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/produk", (req, res, next) => {
  var sql = "select * from produk";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

app.get("/api/produk/:id", (req, res, next) => {
  var sql = "select * from produk where id = ?";
  var params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

app.post("/api/produk/", (req, res, next) => {
  let errors = [];
  //   console.log(req);
  if (!req.body.nama_produk) {
    errors.push("No name specified");
  }
  if (!req.body.keterangan) {
    errors.push("No keterangan specified");
  }
  if (!req.body.harga) {
    errors.push("No harga specified");
  }
  if (!req.body.jumlah) {
    errors.push("No jumlah specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }
  let data = {
    nama_produk: req.body.nama_produk,
    keterangan: req.body.keterangan,
    harga: req.body.harga,
    jumlah: req.body.jumlah,
  };
  let sql =
    "INSERT INTO produk (nama_produk, keterangan, harga,jumlah) VALUES (?,?,?,?)";
  let params = [data.nama_produk, data.keterangan, data.harga, data.jumlah];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      id: this.lastID,
    });
  });
});

app.patch("/api/produk/:id", (req, res, next) => {
  let data = {
    nama_produk: req.body.nama_produk,
    keterangan: req.body.keterangan,
    harga: req.body.harga,
    jumlah: req.body.jumlah,
  };
  db.run(
    `UPDATE produk set
           nama_produk = COALESCE(?,nama_produk),
           keterangan = COALESCE(?,keterangan),
           harga = COALESCE(?,harga),
           jumlah = COALESCE(?,jumlah)
           WHERE id = ?`,
    [data.nama_produk, data.keterangan, data.harga, data.jumlah, req.params.id],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({
        message: "success",
        data: data,
        changes: this.changes,
      });
    }
  );
});

app.delete("/api/produk/:id", (req, res, next) => {
  db.run(
    "DELETE FROM produk WHERE id = ?",
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({ message: "deleted", changes: this.changes });
    }
  );
});

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});

app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});
