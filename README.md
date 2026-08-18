# ✈️ Ceylon Airlines

A modern **Airline Management System** designed to simplify airline operations, passenger management, flight scheduling, and baggage tracking.

The system is developed using **React, Spring Boot, PostgreSQL, and REST APIs**, following a modern full-stack architecture.

---

## 📌 Project Overview

**Ceylon Airlines** is a full-stack airline management application that provides an efficient platform for managing airline operations.

One of the main objectives of this project is to address common airline problems such as **lost or delayed baggage**, inefficient flight schedule management, and passenger information handling.

The system provides a centralized platform where airline staff can manage flights, passengers, baggage, and schedules efficiently.

---

## 🎯 Main Objectives

* Manage airline flights and schedules.
* Manage passenger information.
* Track passenger baggage.
* Reduce problems related to lost baggage.
* Synchronize and manage flight schedules.
* Provide a user-friendly airline management interface.
* Provide secure REST APIs for communication between frontend and backend.

---

## 🚀 Main Features

### ✈️ Flight Management

* Add new flights.
* Update flight information.
* Delete flights.
* View available flights.
* Manage flight schedules.
* Monitor flight status.

### 🧳 Baggage Tracking

The baggage tracking module is one of the main features of the system.

Passengers and airline staff can track baggage information and identify the current status of baggage.

**Baggage statuses may include:**

* Registered
* Checked-In
* In Transit
* Loaded
* Arrived
* Delivered
* Delayed
* Lost

This feature helps reduce the difficulty of locating missing or delayed baggage.

### 👤 Passenger Management

* Register passengers.
* Update passenger information.
* View passenger details.
* Manage passenger records.
* Associate passengers with flights and baggage.

### 📅 Flight Schedule Management

* Create flight schedules.
* Update schedules.
* View upcoming flights.
* Manage departure and arrival information.
* Synchronize schedule information.

### 🔐 Authentication & Authorization

* Secure user authentication.
* Login system.
* Role-based access control.
* Protected backend APIs.

---

## 🛠️ Technologies Used

### Frontend

* React
* JavaScript / TypeScript
* HTML5
* CSS3
* Axios
* React Router

### Backend

* Java
* Spring Boot
* Spring Data JPA
* Spring Security
* REST API

### Database

* PostgreSQL

### Development Tools

* IntelliJ IDEA
* Visual Studio Code
* Git
* GitHub
* Postman

---

## 🏗️ System Architecture

The application follows a **client-server architecture**.

```text
                    ┌──────────────────────┐
                    │      React App      │
                    │      Frontend       │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │    Spring Boot      │
                    │      Backend        │
                    └──────────┬───────────┘
                               │
                               │ JPA / Hibernate
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL      │
                    │      Database       │
                    └──────────────────────┘
```

---

## 📂 Project Structure

```text
Ceylon_Airlines/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── ...
│   │       └── resources/
│   │
│   └── pom.xml
│
└── README.md
```

> The exact folder structure may vary depending on the current project implementation.

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Vihan4673/Ceylon_Airlines.git
```

```bash
cd Ceylon_Airlines
```

---

# 💻 Backend Setup

### 2. Open the Backend Project

Open the Spring Boot backend using IntelliJ IDEA or another Java IDE.

### 3. Configure PostgreSQL

Create a PostgreSQL database and update the database configuration in:

```text
application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ceylon_airlines
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 4. Run the Backend

Using Maven:

```bash
./mvnw spring-boot:run
```

Or run the main Spring Boot application class from your IDE.

---

# 🌐 Frontend Setup

### 5. Navigate to Frontend

```bash
cd frontend
```

### 6. Install Dependencies

```bash
npm install
```

### 7. Start the React Application

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🔌 API Communication

The React frontend communicates with the Spring Boot backend through REST APIs.

Example API endpoints:

```text
/api/flights
/api/passengers
/api/baggage
/api/schedules
/api/auth
```

> Update these endpoints according to the final backend implementation.

---

## 🧳 Baggage Tracking Workflow

```text
Passenger
    │
    ▼
Check-in Baggage
    │
    ▼
Generate Baggage Information
    │
    ▼
Baggage Loaded
    │
    ▼
Flight Departure
    │
    ▼
Flight Arrival
    │
    ▼
Baggage Delivered
```

If baggage is delayed or cannot be located, staff can use the baggage tracking system to identify its latest recorded status.

---

## 🔒 Security

The backend uses Spring Security to protect application resources.

Security features include:

* Authentication
* Authorization
* Protected REST endpoints
* Password security
* Role-based access

---

## 📸 Screenshots

### Dashboard

Add your dashboard screenshot here.

```markdown
![Dashboard](screenshots/dashboard.png)
```

### Flight Management

```markdown
![Flight Management](screenshots/flights.png)
```

### Baggage Tracking

```markdown
![Baggage Tracking](screenshots/baggage-tracking.png)
```

### Passenger Management

```markdown
![Passenger Management](screenshots/passengers.png)
```

---

## 📊 Key Benefits

* Centralized airline management.
* Faster passenger information management.
* Improved baggage visibility.
* Easier flight schedule management.
* Reduced manual operations.
* Better user experience.
* Scalable backend architecture.

---

## 🔮 Future Improvements

Future versions of the system could include:

* 📱 Mobile application.
* 🔔 Real-time baggage notifications.
* 📍 GPS-based baggage tracking.
* 🤖 AI-powered flight delay prediction.
* 💳 Online ticket booking and payment.
* 📧 Email/SMS notifications.
* 📈 Advanced airline analytics dashboard.
* ☁️ Cloud deployment.
* 🔄 Real-time flight status updates.

---

## 👨‍💻 Author

**Vihan Vimen**

Graduate Diploma in Software Engineering

### GitHub

[GitHub Profile](https://github.com/Vihan4673)

### Project Repository

[Ceylon Airlines](https://github.com/Vihan4673/Ceylon_Airlines)

---

## 📄 License

This project was developed for **educational and academic purposes**.

---

⭐ If you find this project useful, consider giving the repository a star!
