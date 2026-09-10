# Healthcare Management System

Full-stack clinic management app built with React, ASP.NET Core 8, and MySQL.

---

## Project Structure
CapstoneProject/
.NET-Backend/ # C# Web API
React-Frontend/ # React App
database/
schema.sql # Database setup script


---

## Setup

### 1. Database

1. Open MySQL Workbench
2. Open the file `database/schema.sql`
3. Click the lightning bolt icon to run the script

This creates the `healthcaredb` database and all required tables.

### 2. Backend

Open a terminal and run:

```bash
cd .NET-Backend
dotnet run --urls="https://localhost:7184" --no-launch-profile

https://localhost:7184/swagger


Frontend
Open a second terminal (keep the backend running in the first one):

bash
cd React-Frontend
npm install
npm start


Login Credentials
Role	Username	Password
Admin	admin	admin123
Doctor	drjohn	doctor123
Doctor	drsarah	doctor123
Doctor	drmichael	doctor123
Receptionist	receptionist	receptionist123
