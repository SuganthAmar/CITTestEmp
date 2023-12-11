const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const urlDB=`mysql://root:-656646a2E3aEcahecHG442-3c314DdB@roundhouse.proxy.rlwy.net:18505/railway`

// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'password',
//   database: 'employeedetails',
// });
const db=mysql.createConnection(urlDB);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/get", (req, res) => {
  const sqlGet = "SELECT * from employee";

  db.query(sqlGet, (err, result) => {
    res.send(result);
  });
});

app.post("/api/insert", (req, res) => {
  const { emp_name, emp_job, dob, salary, date_of_joining } = req.body;

  const sqlInsert = "INSERT INTO employee (emp_name, emp_job, dob, salary, date_of_joining) VALUES (?, ?, ?, ?, ?)";

  db.query(sqlInsert, [emp_name, emp_job, dob, salary, date_of_joining], (err, result) => {
    if (err) {
      console.error('Error inserting into database:', err);
      res.status(500).send('Error inserting into database');
    } else {
      console.log('Inserted into database successfully');
      res.status(200).send('Inserted into database successfully');
    }
  });
});

app.delete("/api/delete/:empn", (req, res) => {
  const name = req.params.empn;
  const sqlDelete = "DELETE FROM employee where emp_name=?";
  
  db.query(sqlDelete, name, (err, result) => {
    if (err) {
      console.error('Error deleting from database:', err);
      res.status(500).send('Error deleting from database');
    } else {
      console.log('Deleted from database successfully');
      res.status(200).send('Deleted from database successfully');
    }
  });
});

app.listen(3001, () => {
  console.log("Server is running");
});
