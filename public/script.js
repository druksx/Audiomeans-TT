document.getElementById('podcast-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const image_url = document.getElementById('image_url').value;

    if (!title || !image_url) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    fetch('/podcasts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, image_url }),
    })
        .then(response => response.json())
        .then(data => {
            window.location.href = '/index.html';
            console.log(data);
        })
        .catch((error) => console.error('Error:', error));
});

function displayPodcasts() {
    fetch('/podcasts')
        .then(response => response.json())
        .then(podcasts => {
            const podcastContainer = document.getElementById('podcast-container');
            podcastContainer.innerHTML = '';
            podcasts.forEach(podcast => {
                const card = document.createElement('div');
                card.className = 'podcast-card';
                card.innerHTML = `
                <div class="podcast-infos">
                    <div class="image-container">
                        <a class="redirect" href="podcast.html?podcast_id=${podcast.id}">
                            <img src="${podcast.image_url}" alt="${podcast.title}">
                        </a>
                    </div>
                    <div class="podcast-title">
                        <h2 style="margin-top: 10px;">${podcast.title}</h2 >
                    </div>
                </div>
                <div class="delete-container">
                    <button class="delete-button" data-id="${podcast.id}">Supprimer</button>
                </div>
            `;
                card.querySelector('.delete-button').addEventListener('click', () => {
                    fetch(`/podcasts/${podcast.id}`, {
                        method: 'DELETE',
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            card.remove();
                        })
                        .catch((error) => console.error('Error:', error));
                });
                podcastContainer.appendChild(card);
            });
        });
}

displayPodcasts();