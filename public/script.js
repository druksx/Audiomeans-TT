document.addEventListener('DOMContentLoaded', function () {
    function fetchPodcasts() {
        fetch('/podcasts')
            .then((response) => response.json())
            .then((podcasts) => {
                console.log('Podcasts:', podcasts);
            })
            .catch((error) => console.error('Error fetching podcasts:', error));
    }

    function fetchEpisodes() {
        fetch('/episodes')
            .then((response) => response.json())
            .then((episodes) => {
                console.log('Episodes:', episodes);
            })
            .catch((error) => console.error('Error fetching episodes:', error));
    }
    fetchPodcasts();
    fetchEpisodes();
});

document.getElementById('podcast-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const image_url = document.getElementById('image_url').value;

    fetch('/podcasts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, image_url }),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => console.error('Error:', error));
});

function displayPodcasts() {
    fetch('/podcasts')
        .then(response => response.json())
        .then(podcasts => {
            const podcastContainer = document.getElementById('podcast-container');
            podcasts.forEach(podcast => {
                const card = document.createElement('div');
                card.className = 'podcast-card';
                card.innerHTML = `
              <h2>${podcast.title}</h2>
              <img src="${podcast.image_url}" alt="${podcast.title}">
              <button class="delete-button" data-id="${podcast.id}">Delete</button>
            `;
                card.addEventListener('click', function() {
                    window.location.href = `podcast.html?podcast_id=${podcast.id}`;
                });
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