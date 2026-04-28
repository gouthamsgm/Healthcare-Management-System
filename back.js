const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Server running"));

// Add Patient
app.post("/addPatient", (req, res) => {
  const { name, age, gender, phone, address } = req.body;

  // 🔥 Debug (VERY IMPORTANT)
  console.log("Incoming data:", req.body);

  // ✅ Validation
  if (!name || name.trim() === "") {
    return res.send("Name is required");
  }

  db.query(
    "INSERT INTO Patient (Name, Age, Gender, Phone, Address) VALUES (?, ?, ?, ?, ?)",
    [name, age, gender, phone, address],
    (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.send("Error adding patient");
      }

      res.send("Patient Added Successfully");
    }
  );
});
app.delete("/deletePatient/:id", (req, res) => {
  const id = req.params.id;

  // Step 1: delete payments
  db.query(`
    DELETE FROM Payment 
    WHERE BillID IN (
      SELECT BillID FROM Bill 
      WHERE AppointmentID IN (
        SELECT AppointmentID FROM Appointment WHERE PatientID=?
      )
    )
  `, [id]);

  // Step 2: delete bills
  db.query(`
    DELETE FROM Bill 
    WHERE AppointmentID IN (
      SELECT AppointmentID FROM Appointment WHERE PatientID=?
    )
  `, [id]);

  // Step 3: delete treatments
  db.query(`
    DELETE FROM Treatment 
    WHERE AppointmentID IN (
      SELECT AppointmentID FROM Appointment WHERE PatientID=?
    )
  `, [id]);

  // Step 4: delete appointments
  db.query("DELETE FROM Appointment WHERE PatientID=?", [id]);

  // Step 5: delete patient
  db.query("DELETE FROM Patient WHERE PatientID=?", [id], (err) => {
    if (err) {
      console.log(err);
      return res.send("Error deleting patient");
    }

    res.send("Patient deleted successfully");
  });
});

// DELETE appointment after completion
app.delete("/deleteAppointment/:id", (req, res) => {
  const id = req.params.id;

  // 1. Delete Treatment
  db.query("DELETE FROM Treatment WHERE AppointmentID=?", [id], (err) => {
    if (err) return res.send(err);

    // 2. Delete Payment
    db.query(
      "DELETE FROM Payment WHERE BillID IN (SELECT BillID FROM Bill WHERE AppointmentID=?)",
      [id],
      (err) => {
        if (err) return res.send(err);

        // 3. Delete Bill
        db.query("DELETE FROM Bill WHERE AppointmentID=?", [id], (err) => {
          if (err) return res.send(err);

          // 4. Delete Appointment
          db.query(
            "DELETE FROM Appointment WHERE AppointmentID=?",
            [id],
            (err) => {
              if (err) return res.send(err);

              res.send("Deleted successfully");
            }
          );
        });
      }
    );
  });
});

app.put("/updateAppointment/:id", (req, res) => {
  const id = req.params.id;
  const { date, time } = req.body;

  db.query(
    "UPDATE Appointment SET AppointmentDate=?, AppointmentTime=? WHERE AppointmentID=?",
    [date, time, id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Error updating appointment");
      }

      res.send("Appointment updated successfully");
    }
  );
});
// Patients
app.get("/patients", (req, res) => {
  db.query("SELECT * FROM Patient", (err, r) => res.json(r));
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM Users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Error" });
      }

      if (result.length === 0) {
        return res.json({ message: "Invalid credentials" });
      }

      res.json({
        message: "Login successful",
        role: result[0].role
      });
    }
  );
});

app.get("/medicines", (req, res) => {
  db.query("SELECT * FROM Medicine", (err, r) => res.json(r));
});


app.get("/medicines", (req, res) => {
  db.query("SELECT * FROM Medicine", (err, r) => {
    console.log("MEDICINES FROM DB:", r); // 🔥 ADD THIS

    if (err) {
      console.log(err);
      return res.send("Error");
    }
    res.json(r);
  });
});
app.post("/prescribe", (req, res) => {
  const { doctorId, medicineId } = req.body;

  db.query(
    "INSERT INTO Prescribed VALUES (?, ?)",
    [doctorId, medicineId],
    (err) => res.send(err || "Prescribed")
  );
});

// Doctors
app.get("/doctors", (req, res) => {
  db.query("SELECT * FROM Doctor", (err, r) => res.json(r));
});

// Appointment
app.post("/appointment", (req, res) => {
  const { date, time, patientId, doctorId } = req.body;

  db.query(
    "INSERT INTO Appointment VALUES (NULL, ?, ?, ?, ?)",
    [date, time, patientId, doctorId],
    () => res.send("Appointment Booked")
  );
});

// Get Appointments
app.get("/appointments", (req, res) => {
  db.query(
    `SELECT a.AppointmentID, p.Name AS Patient, d.Name AS Doctor,
     a.AppointmentDate, a.AppointmentTime
     FROM Appointment a
     JOIN Patient p ON a.PatientID=p.PatientID
     JOIN Doctor d ON a.DoctorID=d.DoctorID`,
    (err, r) => res.json(r)
  );
});

// Get One Appointment
app.get("/appointment/:id", (req, res) => {
  db.query(
    `SELECT p.Name AS Patient, d.Name AS Doctor, a.AppointmentDate
     FROM Appointment a
     JOIN Patient p ON a.PatientID=p.PatientID
     JOIN Doctor d ON a.DoctorID=d.DoctorID
     WHERE a.AppointmentID=?`,
    [req.params.id],
    (err, r) => res.json(r[0])
  );
});

// Bill
app.post("/bill", (req, res) => {
  const { date, amount, appointmentId } = req.body;

  db.query(
    "SELECT * FROM Bill WHERE AppointmentID=?",
    [appointmentId],
    (err, r) => {
      if (r.length) return res.send("Already Exists");

      db.query(
        "INSERT INTO Bill VALUES (NULL, ?, ?, ?)",
        [date, amount, appointmentId],
        () => res.send("Bill Generated")
      );
    }
  );
});

// Bills
app.get("/bills", (req, res) => {
  db.query(
    `SELECT b.BillID, p.Name, b.TotalAmount
     FROM Bill b
     JOIN Appointment a ON b.AppointmentID=a.AppointmentID
     JOIN Patient p ON a.PatientID=p.PatientID`,
    (err, r) => res.json(r)
  );
});

// Payment
app.post("/payment", (req, res) => {
  const { date, amount, mode, billId } = req.body;

  db.query(
    "INSERT INTO Payment VALUES (NULL, ?, ?, ?, ?)",
    [date, amount, mode, billId],
    () => res.send("Payment Done")
  );
});

app.listen(3000, () => console.log("Running on 3000"));