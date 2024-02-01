const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/podcasts', (req, res) => {
    db.all('SELECT * FROM podcasts', (err, podcasts) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(podcasts);
    });
});

app.get('/podcasts/:id', (req, res) => {
    db.get('SELECT * FROM podcasts WHERE id = ?', req.params.id, (err, podcast) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(podcast);
    });
});

app.get('/episodes', (req, res) => {
    const podcast_id = req.query.podcast_id;

    const sql = 'SELECT * FROM episodes WHERE podcast_id = ?';

    db.all(sql, [podcast_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/podcasts', (req, res) => {
    const { title, image_url } = req.body;
    db.run('INSERT INTO podcasts (title, image_url) VALUES (?, ?)', [title, image_url], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Podcast added successfully',
            podcast_id: this.lastID,
        });
    });
});

app.post('/episodes', (req, res) => {
    const { podcast_id, title, description, publish_date, audio_url } = req.body;
    db.run(
        'INSERT INTO episodes (podcast_id, title, description, publish_date, audio_url) VALUES (?, ?, ?, ?, ?)',
        [podcast_id, title, description, publish_date, audio_url],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                message: 'Episode added successfully',
                episode_id: this.lastID,
            });
        }
    );
});

app.delete('/episodes/:id', (req, res) => {
    db.run('DELETE FROM episodes WHERE id = ?', req.params.id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: `Episode ${req.params.id} deleted successfully` });
    });
});

app.delete('/podcasts/:id', (req, res) => {
    db.run('DELETE FROM podcasts WHERE id = ?', req.params.id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: `Podcast ${req.params.id} deleted successfully` });
    });
});

app.use(express.static('public'));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
