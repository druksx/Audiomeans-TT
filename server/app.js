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

app.get('/episodes', (req, res) => {
    db.all('SELECT * FROM episodes', (err, episodes) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(episodes);
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
