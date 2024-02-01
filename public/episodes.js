document.getElementById('episode-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const podcast_id = urlParams.get('podcast_id');
    const title = document.getElementById('title').value;
    const description = document.getElementById('desc').value;
    const publish_date = document.getElementById('published_at').value;
    const audio_url = document.getElementById('audio_url').value;

    if (!title || !description || !publish_date || !audio_url) {
        alert('All fields must be filled out');
        return;
    }

    fetch('/episodes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ podcast_id, title, description, publish_date, audio_url }),
    })
        .then(response => response.json())
        .then(data => {
            displayEpisodes();
            console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

function displayEpisodes() {
    let urlParams = new URLSearchParams(window.location.search);
    let podcastId = urlParams.get('podcast_id');

    fetch(`/episodes?podcast_id=${podcastId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(episodes => {
            let filteredEpisodes = episodes.filter(episode => episode.podcast_id == podcastId);

            let episodesContainer = document.getElementById('episodes-container');
            episodesContainer.innerHTML = '';

            filteredEpisodes.forEach(episode => {
                let episodeCard = document.createElement('div');
                episodeCard.className = 'episode-card';

                let epInfo = document.createElement('div');
                epInfo.className = 'ep-info';

                let title = document.createElement('p');
                title.className = 'title';
                title.textContent = episode.title;
                epInfo.appendChild(title);

                let publishDate = document.createElement('p');
                publishDate.className = 'publish-date';
                publishDate.textContent = episode.publish_date;
                epInfo.appendChild(publishDate);

                let description = document.createElement('p');
                description.className = 'description';
                description.textContent = episode.description;
                epInfo.appendChild(description);

                episodeCard.appendChild(epInfo);

                let audio = new Audio(episode.audio_url);
                let playSvg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="-1.2 -1.2 14.40 14.40" version="1.1" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"> <title>play [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-65.000000, -3803.000000)" fill="#ffffff"><g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M18.074,3650.7335 L12.308,3654.6315 C10.903,3655.5815 9,3654.5835 9,3652.8985 L9,3645.1015 C9,3643.4155 10.903,3642.4185 12.308,3643.3685 L18.074,3647.2665 C19.306,3648.0995 19.306,3649.9005 18.074,3650.7335" id="play-[#ffffff]"> </path> </g> </g> </g> </g></svg>';
                let pauseSvg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="19px" height="19px" viewBox="-1 0 8 8" version="1.1" fill="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"> <title>pause [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-227.000000, -3765.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M172,3605 C171.448,3605 171,3605.448 171,3606 L171,3612 C171,3612.552 171.448,3613 172,3613 C172.552,3613 173,3612.552 173,3612 L173,3606 C173,3605.448 172.552,3605 172,3605 M177,3606 L177,3612 C177,3612.552 176.552,3613 176,3613 C175.448,3613 175,3612.552 175,3612 L175,3606 C175,3605.448 175.448,3605 176,3605 C176.552,3605 177,3605.448 177,3606" id="pause-[#ffffff]"> </path> </g> </g> </g> </g></svg>';

                let playButton = document.createElement('button');
                playButton.className = 'play-button';
                playButton.innerHTML = playSvg;
                playButton.addEventListener('click', function() {
                    if (audio.paused) {
                        audio.play();
                        playButton.innerHTML = pauseSvg;
                    } else {
                        audio.pause();
                        playButton.innerHTML = playSvg;
                    }
                });

                let volumeSlider = document.createElement('input');
                volumeSlider.type = 'range';
                volumeSlider.min = '0';
                volumeSlider.max = '1';
                volumeSlider.step = '0.01';
                volumeSlider.value = '1';
                volumeSlider.addEventListener('input', function() {
                    audio.volume = volumeSlider.value;
                });

                episodeCard.appendChild(playButton);
                episodeCard.appendChild(volumeSlider);

                let deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" width="32px" height="32px" viewBox="-0.5 0 19 19" version="1.1" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"> <title>icon/18/icon-delete</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="out" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <path d="M4.91666667,14.8888889 C4.91666667,15.3571429 5.60416667,16 6.0625,16 L12.9375,16 C13.3958333,16 14.0833333,15.3571429 14.0833333,14.8888889 L14.0833333,6 L4.91666667,6 L4.91666667,14.8888889 L4.91666667,14.8888889 L4.91666667,14.8888889 Z M15,3.46500003 L12.5555556,3.46500003 L11.3333333,2 L7.66666667,2 L6.44444444,3.46500003 L4,3.46500003 L4,4.93000007 L15,4.93000007 L15,3.46500003 L15,3.46500003 L15,3.46500003 Z" id="path" fill="#ffffff" sketch:type="MSShapeGroup"> </path></g></g></svg>';
                deleteButton.addEventListener('click', function() {
                    fetch(`/episodes/${episode.id}`, {
                        method: 'DELETE',
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            displayEpisodes();
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                });
                let cardButtons = document.createElement('div');
                cardButtons.className = 'card-buttons';

                cardButtons.appendChild(playButton);
                cardButtons.appendChild(volumeSlider);
                cardButtons.appendChild(deleteButton);
                
                episodeCard.appendChild(cardButtons);

                episodesContainer.appendChild(episodeCard);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function searchForEpisode() {
    let episodes = document.getElementsByClassName('episode-card');
    let searchBar = document.getElementById('podcast-searchbar');
    searchBar.addEventListener('keyup', function() {
        let searchValue = searchBar.value.toLowerCase();
        if (searchValue === '') {
            displayEpisodes();
        } else {
            for (let i = 0; i < episodes.length; i++) {
                let title = episodes[i].querySelector('.title').textContent.toLowerCase();
                if (title.includes(searchValue)) {
                    episodes[i].style.display = 'block';
                } else {
                    episodes[i].style.display = 'none';
                }
            }
        }
    });
}

function displayPodcastImage() {
    let urlParams = new URLSearchParams(window.location.search);
    let podcastId = urlParams.get('podcast_id');

    fetch(`/podcasts/${podcastId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(podcast => {
            let podcastImages = document.getElementsByClassName('podcast-image');
            for (let i = 0; i < podcastImages.length; i++) {
                podcastImages[i].setAttribute('src', podcast.image_url);
            }
            console.log(podcast);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function displayPodcastTitle() {
    let urlParams = new URLSearchParams(window.location.search);
    let podcastId = urlParams.get('podcast_id');

    fetch(`/podcasts/${podcastId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(podcast => {
            let podcastTitles = document.getElementsByClassName('podcast-title');
            for (let i = 0; i < podcastTitles.length; i++) {
                podcastTitles[i].textContent = podcast.title;
            }
            console.log(podcast);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

searchForEpisode();
displayPodcastTitle();
displayPodcastImage();
displayEpisodes();