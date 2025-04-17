import eh from './error.js';
import { Weather } from './weather.js';
import { UI } from './ui';

const ui = await UI();

async function fetchWikiSummary(location = 'Jakarta') {
  const searchUrl = `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(location)}&limit=1`;
  const searchResponse = await fetch(searchUrl);
  const searchData = await searchResponse.json();

  if (!searchData.pages?.length) {
    throw new Error('No results found');
  }
  const title = searchData.pages[0].title;
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const summaryResponse = await fetch(summaryUrl);

  const summaryData = await summaryResponse.json();
  return summaryData.extract;
}
const safeSummary = eh(fetchWikiSummary);

async function searchHandler(inputValue) {
  const location = inputValue.trim() || 'Jakarta';
  const fallback = 'Jakarta';

  try {
    const weather = await Weather().safeNext7D(location);
    console.log(weather);
    if (weather.length === 0) {
      throw new Error(`Invalid or unknown location: ${location}`);
    }
    ui.wipeUI();
    ui.renderUI(location);
  } catch (err) {
    console.warn(`Search failed for "${location}", using fallback.`, err);
    ui.wipeUI();
    ui.renderUI(fallback);
  }
}
const safeSearchHandler = eh(searchHandler);

export { safeSummary, safeSearchHandler };
