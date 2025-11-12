import path from 'path';
import Database from 'better-sqlite3';

export async function connectToDatabase() {
  const dbPath = path.join(process.cwd(), 'reg.sqlite');
  const db = new Database(dbPath, { readonly: true });
  return db;
}

export async function getOverviews(filters) {
  const db = await connectToDatabase();
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

  const rows = db.prepare(query).all(...params);
  db.close();
  return rows;
}

export async function getDetails(classid) {
  const db = await connectToDatabase();
  const rows = db
    .prepare(`
      SELECT classes.*, courses.*, profs.profname
      FROM classes
      JOIN courses ON classes.courseid = courses.courseid
      LEFT JOIN coursesprofs ON classes.courseid = coursesprofs.courseid
      LEFT JOIN profs ON coursesprofs.profid = profs.profid
      WHERE classes.classid = ?
    `)
    .all(classid);
  db.close();
  return rows;
}
