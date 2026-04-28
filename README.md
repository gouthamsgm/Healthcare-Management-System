
# 🏥 Healthcare Queue Management System

A full-stack hospital queue management system designed to streamline patient flow, appointment scheduling, and doctor interactions.

---

## 🚀 Features

### 👤 Patient

* Register & Login
* Book Appointments
* Download Medical Reports (PDF)
* Make Payments & Download Receipt

### 🧑‍⚕️ Doctor

* Fill Patient Medical Reports
* Mark Attendance

### 🧑‍💼 Staff

* View Patient Queue
* Manage Appointments
* Add Emergency Cases
* Update Patient Status

---

## 🧠 Key Functionalities

* Token-based Queue System (starting from 101)
* Emergency Priority Handling 🚨
* Auto-removal of inactive appointments
* Real-time queue updates
* PDF Generation (Reports & Receipts)

---

## 🛠️ Tech Stack

| Layer     | Technology             |
| --------- | ---------------------- |
| Frontend  | HTML, CSS, React (CDN) |
| Backend   | Node.js, Express       |
| Database  | MySQL                  |
| Libraries | cors, pdfkit, mysql2   |

---

## 📂 Project Structure

```
PROJECT/
│
├── BACK.js          # Backend (Node.js server)
├── index.html       # Frontend (React UI)
├── package.json
├── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/Healthcare-Management-System.git
cd Healthcare-Management-System
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure MySQL

Update your database credentials in `BACK.js`:

```js
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YOUR_PASSWORD",
  database: "hospital_db"
});
```

### 4️⃣ Run the server

```bash
node BACK.js
```

### 5️⃣ Open in browser

```
http://localhost:5000
```

---

## 🗄️ Database Schema

### Patients

* id
* username
* password

### Appointments

* id, token, first_name, last_name, age
* problem, doctor, date, time
* priority, status

### Reports

* name, age, problem
* assessment, diagnosis, prescription

---

## 📸 Screenshots

### 🔐 Login Page

![Login](screenshots/login.png)

### 📅 Appointment Booking

![Appointment](screenshots/appointment.png)

### 📊 Queue Management

![Queue](screenshots/queue.png)

### 📄 Medical Report

![Report](screenshots/report.png)

---

## 🔮 Future Improvements

* Store appointments in database (currently in-memory)
* Add JWT authentication
* Deploy on cloud (Render / AWS)
* Improve UI with React framework

---

## 👨‍💻 Author

**P R Goutham**

---

## ⭐ If you like this project

Give it a star on GitHub!
