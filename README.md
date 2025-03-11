student Management System
for CSC 451

docker compose up --build

docker exec -it mysql-container mysql -u root -p
empty password

SHOW DATABASES;
USE studentMS;
SHOW TABLES;
SELECT _ FROM students;
SELECT _ FROM enrollments;

docker exec -it postgres-container psql -U postgres

\l -- List databases
\c studentMS -- Switch to studentMS database
\dt -- Show tables
SELECT _ FROM students;
SELECT _ FROM junior*students;
SELECT * FROM courses;
SELECT _ FROM basic_courses;
SELECT _ FROM enrollments;
SELECT \_ FROM pending_enrollments;

3. Run Queries to Test Fragmentation
   Horizontal Fragmentation (Splitting Rows)
   If students are fragmented by year, test it:

In MySQL
sql
Copy
Edit
SELECT _ FROM students WHERE year <= 2;
In PostgreSQL
sql
Copy
Edit
SELECT _ FROM students WHERE year > 2;
✅ If data is split correctly, horizontal fragmentation is working.

Vertical Fragmentation (Splitting Columns)
If students is split by sensitive and non-sensitive fields, test it:

In MySQL
sql
Copy
Edit
SELECT student_id, name, email FROM students;
In PostgreSQL
sql
Copy
Edit
SELECT student_id, national_id, dob FROM students;
✅ If each DB only has part of the columns, vertical fragmentation is working.

4. Test Reconstruction (Joining Fragments)
   You need to reconstruct data from fragments. Possible methods:

Use Views (PostgreSQL)
Use Federated Queries (MySQL)
Use a Decision Site
Using PostgreSQL Views
If PostgreSQL is the decision site, create a view that joins the fragmented students table:

sql
Copy
Edit
CREATE VIEW full_students AS
SELECT s.student_id, s.name, s.email, p.national_id, p.dob
FROM students s
JOIN dblink('host=MYSQL_HOST user=root password=MYSQL_PASS dbname=studentMS',
'SELECT student_id, name, email FROM students') AS p(student_id INT, name TEXT, email TEXT)
ON s.student_id = p.student_id;
Then run:

sql
Copy
Edit
SELECT \* FROM full_students;
✅ This should return reconstructed student data from both MySQL and PostgreSQL.

5. Query Access Frequencies
   If students check grades often, but admins modify enrollments, you can set:

80% of queries on enrollments → MySQL
70% of queries on courses → PostgreSQL
This helps optimize query performance.

Final Steps
Confirm data is split correctly (SHOW TABLES & SELECT queries).
Run distributed queries to verify fragments.
Use views or dblink to reconstruct data.
Optimize access frequency based on query patterns.
