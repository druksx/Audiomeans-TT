const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('audiomeans.db');

db.run(`
  CREATE TABLE IF NOT EXISTS podcasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    image_url TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS episodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    podcast_id INTEGER,
    title TEXT,
    description TEXT,
    publish_date TEXT,
    audio_url TEXT,
    FOREIGN KEY (podcast_id) REFERENCES podcasts(id)
  )
`);

module.exports = db;
