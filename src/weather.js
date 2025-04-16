import eh from './error.js';

function Weather() {
  async function next7D(location = 'Jakarta') {
    const API_KEY = 'VRD9MDGGXWYGBLN6L9RTJTVYG';
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next7days?unitGroup=metric&include=days&key=${API_KEY}&contentType=json`,
      {
        method: 'GET',
        headers: {},
      }
    );
    const weatherData = await response.json();
    function getDay(str) {
      const date = new Date(str);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    function formatDate(str) {
      const date = new Date(str);

      const dayAbbr = getDay(date);
      const day = date.getDate();
      const monthAbbr = date.toLocaleDateString('en-US', { month: 'short' });

      function getOrdinal(n) {
        if (n > 3 && n < 21) return 'th';
        switch (n % 10) {
          case 1:
            return 'st';
          case 2:
            return 'nd';
          case 3:
            return 'rd';
          default:
            return 'th';
        }
      }
      const ordinal = getOrdinal(day);
      return `${dayAbbr}, ${day}${ordinal} ${monthAbbr}`;
    }
    const daysDetails = [];
    for (let i = 0; i < weatherData.days.length; i++) {
      const location = weatherData.resolvedAddress;
      const timezone = weatherData.timezone;
      const date = weatherData.days[i].datetime;
      const formattedDate = formatDate(date);
      const day = getDay(date);
      const temp = weatherData.days[i].feelslike + '°C';
      const desc = weatherData.days[i].description;
      const icon = weatherData.days[i].icon;
      daysDetails.push({
        location,
        timezone,
        formattedDate,
        day,
        temp,
        desc,
        icon,
      });
    }
    return daysDetails;
  }
  async function fetchWikiSummary(location = 'Jakarta') {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(location)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.extract;
  }
  const safeNext7D = eh(next7D);
  const safeSummary = eh(fetchWikiSummary);
  return { safeNext7D, safeSummary };
}

export { Weather };

// keys to use
// address: for city
// for all the following: day+num.key
// timezone
// feelslikemax & tempmin
// conditions
// icon
// precipprob
// description
