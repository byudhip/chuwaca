import eh from './error.js';

function Weather() {
  async function next7D(location = 'Jakarta') {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next7days?unitGroup=metric&include=days&key=VRD9MDGGXWYGBLN6L9RTJTVYG&contentType=json`,
      {
        method: 'GET',
        headers: {},
      }
    );
    const weatherData = await response.json();
    return weatherData;
  }
  const safeNext7D = eh(next7D);
  return { safeNext7D };
}

export { Weather };
