# Smart Student Attendance and Performance System

A full MERN classroom dashboard for managing a student roster, recording daily attendance, and tracking assessment scores. The React + Vite frontend talks to an Express REST API, which stores student, attendance, and performance records in MongoDB through Mongoose. It uses MongoDB Atlas by default and does not include database credentials.

## Features

- Student create, view, edit, and delete, with unique roll number validation
- Daily attendance for Present, Absent, Late, and Excused, with bulk save by date
- Performance assessment records with subject, score, maximum score, date, and remarks
- Dashboard summary of student count, attendance, average score, and recent assessments
- Search, responsive layout, form validation, and clear API errors
- Deleting a student also deletes their attendance and performance records

## Requirements

- Windows 10/11
- Node.js 20.19+ or 22.12+ (includes npm)
- A MongoDB Atlas account and cluster (or a local MongoDB server)
- Visual Studio Code

## Configure MongoDB Atlas

1. Sign in to MongoDB Atlas and create a cluster if you do not have one.
2. In **Database Access**, create a database user and save its password. This is separate from your Atlas website sign-in.
3. In **Network Access**, add your current computer IP address. Atlas will reject connections from IPs that are not allowed. For a safer setup, allow only your current IP instead of `0.0.0.0/0`.
4. Select **Connect → Drivers**, choose Node.js, and copy the connection string Atlas provides.
5. Replace the username, password, and cluster host in that string with the database user's real values. URL-encode special characters in the password. Add the database name `smart_student_db` before the query parameters if the copied URI does not contain a database name.

No Atlas credentials are supplied by this project. Keep your connection string private and do not commit your `.env` file.

## Run in VS Code on Windows

1. Extract the ZIP. In VS Code choose **File → Open Folder** and select `smart-student-attendance-mern`.
2. Open **Terminal → New Terminal**. Make sure the terminal is at the project root (the folder containing `package.json`, `client`, and `server`).
3. Install the three sets of packages:

   ```powershell
   npm install
   npm --prefix server install
   npm --prefix client install
   ```

4. In VS Code Explorer, copy `server/.env.example` to `server/.env`. Replace the `MONGO_URI` placeholder with your Atlas connection string. Keep `PORT=5000` and `CLIENT_ORIGIN=http://localhost:5173` unless you have changed those ports.
5. Start the frontend and API from the project root:

   ```powershell
   npm run dev
   ```

6. Open the Vite URL shown in the terminal, normally `http://localhost:5173`.
7. Check `http://localhost:5000/api/health`. A successful Atlas connection reports `"database":"connected"`.

The application runs on your computer; Atlas hosts the database. For local MongoDB instead, replace `MONGO_URI` with `mongodb://127.0.0.1:27017/smart_student_db` and start the local MongoDB service.

## Useful commands

- `npm run dev` — start API and frontend together
- `npm run build` — create the optimized frontend in `client/dist`
- `npm start` — start the API only

## API routes

- `GET /api/health` — API and database status
- `GET /api/dashboard` — classroom summary
- `GET /api/students`, `POST /api/students` — list or add students
- `PUT /api/students/:id`, `DELETE /api/students/:id` — edit or remove a student
- `GET /api/attendance?date=YYYY-MM-DD` — attendance register for a date
- `POST /api/attendance/bulk` — save daily attendance entries
- `GET /api/performance`, `POST /api/performance` — list or record assessment results
- `PUT /api/performance/:id`, `DELETE /api/performance/:id` — edit or remove a result

Attendance and assessment routes require a student to exist. Score must be between zero and the maximum score. Duplicate roll numbers, invalid IDs, missing records, invalid input, and database connection errors receive clear JSON responses.
