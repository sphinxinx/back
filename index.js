const express = require("express")
const sqlite3 = require('sqlite3').verbose();
const app = express()
const cors = require("cors")

let sql;
//Para concurrencia cambiar Journal Size Limit de -1 a lo que quieras (NO TOCAR)
//Por defecto el Journal Size Limit es -1 (NO TOCAR)

app.use(cors());
app.use(express.json());
//Instanciamos la bbdd para poder realizar cualquier consulta y creamos la BBDD
const db = new sqlite3.Database('./BBDD/BBDDGym.db', sqlite3.OPEN_READWRITE,(err) =>{
    if (err) return console.error(err.message);

});
//Crear la tabla
sql = 'CREATE TABLE IF NOT EXISTS seguimiento (IDregistro INTEGER PRIMARY KEY AUTOINCREMENT,ejercicio TEXT,series INTEGER,repeticiones TEXT,peso_maximo INTEGER,fecha DATE)'
db.run(sql)

//Drop la tabla (solo funcion para el desarrollo de la app)
// db.run('DROP TABLE seguimiento')

app.post("/create",(req,res) => {
    const ejercicio = req.body.ejercicio
    const series = req.body.series
    const repeticiones = req.body.repeticiones
    const peso = req.body.peso
    const fecha = req.body.fecha

    db.run('INSERT INTO seguimiento(ejercicio,series,repeticiones,peso_maximo,fecha) VALUES(?,?,?,?,?)',[ejercicio,series,repeticiones,peso,fecha],
    (err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    }
    );
})

app.get("/marca/:nombre",(req,res) => {
    const nombre = req.params.nombre
    db.all('SELECT MAX(peso_maximo) AS max_peso FROM seguimiento WHERE ejercicio=?',[nombre],(err,result) => {
        if(err){
            console.log(err)
            res.status(500).send("Error en el servidor");
        }else{
            if (result[0].max_peso !== null) {
                const maxPeso = result[0].max_peso;
                res.status(200).send(maxPeso.toString());
              } else {
                res.status(500).send("No hay valor");
              }
        }
    })
})

app.get("/registros",(req,res) => {

    db.all('SELECT * FROM seguimiento',
    (err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        } 
    }
    );
})

app.put("/update",(req,res) => {
    const IDregistro = req.body.IDregistro
    const ejercicio = req.body.ejercicio
    const series = req.body.series
    const repeticiones = req.body.repeticiones
    const peso = req.body.peso
    const fecha = req.body.fecha
    db.run('UPDATE seguimiento SET ejercicio=?,series=?,repeticiones=?,peso_maximo=?,fecha=? WHERE IDregistro=?',[ejercicio,series,repeticiones,peso,fecha,IDregistro],
    (err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    });
})

app.delete("/delete/:ID",(req,res) => {
    const IDregistro = req.params.ID
    
    db.run('DELETE FROM seguimiento WHERE IDregistro=?',IDregistro,
    (err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    });
})

app.listen(3001,() =>{
    console.log("Arrancado en el puerto 3001")
})


