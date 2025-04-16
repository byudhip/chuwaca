import eh from './error.js';
import em from 'element-maker';
import { Weather } from './weather.js';

async function loadBackground(query = 'jakarta') {
  const API_KEY = 'zqvNi0j55L1UteAnSsoZmpDW7zyQl2QdeYxUX2BRC0qkNxz2SuJcFD6a';

  const response = await fetch(
    `https://api.pexels.com/v1/search/?query=${query}%20skyline&per_page=80`,
    { headers: { Authorization: API_KEY } }
  );
  const data = await response.json();
  const randomIndex = () => Math.floor(Math.random() * data.photos.length);
  const bgUrl = data.photos[randomIndex()].src.landscape;

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
  function renderClock(timezone = 'Asia/Jakarta', callback) {
    function updateTime() {
      const now = new Date();
      const timeString = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now);
      if (typeof callback === 'function') {
        callback(timeString);
      }
    }
    updateTime();
    return setInterval(updateTime, 1000);
  }
  const currentLocationTime = em('p', { id: 'clock' });

  renderClock(undefined, (time) => {
    currentLocationTime.textContent = time;
  });
  const weekBox = em('div', { id: 'week-box' });
  const todayBox = em('div', { id: 'today-box' });
  const todayMidBox = em('div', { id: 'today-mid-box' });
  const todayDate = em('p', {
    textContent: weatherData[0].formattedDate,
    id: 'today-date',
  });
  const todayTemp = em('p', {
    textContent: weatherData[0].temp,
    id: 'today-temp',
  });
  const todayIcon = em('img', {
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
  weekBox.appendChild(todayBox);

  for (let i = 1; i < weatherData.length; i++) {
    const dayBox = em('div', { classNames: 'day-box' });
    const date = em('p', {
      textContent: weatherData[i].day,
      classNames: 'date',
    });
    const icon = em('img', {
      attributes: { src: images[`${weatherData[i].icon}.svg`] },
    });
    const temp = em('p', {
      textContent: weatherData[i].temp,
      classNames: 'today-temp',
    });
    dayBox.appendChild(date);
    dayBox.appendChild(icon);
    dayBox.appendChild(temp);
    weekBox.appendChild(dayBox);
  }

  container.appendChild(locationSearch);
  container.appendChild(currentLocationBox);
  container.appendChild(currentLocationTime);
  container.appendChild(weekBox);

  body.appendChild(container);
}

export { initUI };
// create container
// create search box upper left corner
// create location box (city, country, local time),
// create daysBox (today, rest of week)
// today = temperature, date, icon
