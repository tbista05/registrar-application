import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Create a helper that opens the DB once per request
export async function connectToDatabase() {
  const dbPath = path.join(process.cwd(), 'reg.sqlite');
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

export async function getOverviews(filters) {
  const db = await connectToDatabase();           // ✅ open connection
  const { dept = '', coursenum = '', area = '', title = '' } = filters;

  let query = `
    SELECT DISTINCT classes.classid, crosslistings.dept, crosslistings.coursenum,
           courses.area, courses.title
    FROM classes
    JOIN courses ON classes.courseid = courses.courseid
    JOIN crosslistings ON crosslistings.courseid = courses.courseid
    WHERE 1=1
  `;
  const params = [];
  if (dept) { query += " AND crosslistings.dept LIKE ?"; params.push(`%${dept}%`); }
  if (coursenum) { query += " AND crosslistings.coursenum LIKE ?"; params.push(`%${coursenum}%`); }
  if (area) { query += " AND courses.area LIKE ?"; params.push(`%${area}%`); }
  if (title) { query += " AND courses.title LIKE ?"; params.push(`%${title}%`); }
  query += " ORDER BY crosslistings.dept, crosslistings.coursenum, classes.classid";

  const rows = await db.all(query, params);
  await db.close();
  return rows;
}

export async function getDetails(classid) {
  const db = await connectToDatabase();           // ✅ open connection
  const rows = await db.all(`
    SELECT classes.*, courses.*, profs.profname
    FROM classes
    JOIN courses ON classes.courseid = courses.courseid
    LEFT JOIN coursesprofs ON classes.courseid = coursesprofs.courseid
    LEFT JOIN profs ON coursesprofs.profid = profs.profid
    WHERE classes.classid = ?
  `, [classid]);
  await db.close();
  return rows;
}
