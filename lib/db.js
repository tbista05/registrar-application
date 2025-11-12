import Database from 'better-sqlite3';
const db = new Database('./reg.sqlite', { readonly: true });

export function getOverviews(filters) {
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
  query += " ORDER BY crosslistings.dept ASC, crosslistings.coursenum ASC, classes.classid ASC";
  return db.prepare(query).all(...params);
}

export function getDetails(classid) {
  const stmt = db.prepare(`
    SELECT classes.*, courses.*, profs.profname
    FROM classes
    JOIN courses ON classes.courseid = courses.courseid
    LEFT JOIN coursesprofs ON classes.courseid = coursesprofs.courseid
    LEFT JOIN profs ON coursesprofs.profid = profs.profid
    WHERE classes.classid = ?
  `);
  return stmt.all(classid);
}
