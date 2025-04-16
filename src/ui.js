import eh from './error.js';
import em from 'element-maker';
import { Weather } from './weather.js';

async function loadBackground(query = 'jakarta') {
  const API_KEY = 'zqvNi0j55L1UteAnSsoZmpDW7zyQl2QdeYxUX2BRC0qkNxz2SuJcFD6a';

  const response = await fetch(
    `https://api.pexels.com/v1/search/?query=${query}&per_page=1`,
    { headers: { Authorization: API_KEY } }
  );
  const data = await response.json();
  const randomIndex = Math.floor(Math.random() * data.photos.length);
  const bgUrl = data.photos[randomIndex].src.landscape;

  document.body.style.backgroundImage = `url(${bgUrl})`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
}

const safeLoadBackground = eh(loadBackground);

function getImages(r) {
  let images = {};
  r.keys().forEach((key) => {
    images[key.replace('./', '')] = r(key);
  });
  return images;
}

async function initUI() {
  await safeLoadBackground();
  const images = getImages(
    require.context('./icons', false, /\.(png|jpe?g|svg)$/)
  );
  const weatherData = await Weather().safeNext7D();
  const body = document.querySelector('body');
  const container = em('div', { id: 'container' });
  const locationSearch = em('input', {
    attributes: {
      type: 'search',
      id: 'location-search',
      placeholder: 'Search for location',
      maxlength: '50',
    },
  });

  const currentLocationBox = em('div', {
    id: 'current-location',
    textContent: weatherData[0].location,
  });
  const todayBox = em('div', { id: 'today' });
  const todayMidBox = em('div', { id: 'today-mid-box' });
  const todayDate = em('p', {
    textContent: weatherData[0].formattedDate,
    id: 'today-date',
  });
  const todayTemp = em('p', {
    textContent: weatherData[0].temp,
    id: 'today-temp',
  });
  console.log(`/src/icons/${weatherData[0].icon}.svg`);
  const todayIcon = em('img', {
    className: 'icon',
    attributes: { src: images[`${weatherData[0].icon}.svg`] },
  });
  const todayDesc = em('p', {
    textContent: weatherData[0].desc,
    id: 'today-desc',
  });
  todayBox.appendChild(todayDate);
  todayMidBox.appendChild(todayIcon);
  todayMidBox.appendChild(todayTemp);
  todayBox.appendChild(todayMidBox);
  todayBox.appendChild(todayDesc);

  container.appendChild(locationSearch);
  container.appendChild(currentLocationBox);
  container.appendChild(todayBox);

  body.appendChild(container);
}

export { initUI };
// create container
// create search box upper left corner
// create location box (city, country, local time),
// create daysBox (today, rest of week)
// today = temperature, date, icon
