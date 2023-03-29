import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34731072-348d9a1558c6b29bcd98e02ff';
export const PER_PAGE = 40;
let page = 1;

export default async function fetchData(searchQuery, currentPage = page) {
  try {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: currentPage,
      per_page: PER_PAGE,
    });
    const url = `${BASE_URL}?${searchParams}`;

    const response = await axios.get(url);
    const { hits, totalHits } = response.data;
    const tara = totalHits - (page * PER_PAGE);

    if (tara < PER_PAGE) { 
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    // if (hits.length === 0 && currentPage > 1) {
    //   Notiflix.Notify.info(
    //     "We're sorry, but you've reached the end of search results."
    //   );
    // }
    page = currentPage;
    return { hits, totalHits };
  } catch (error) {
    console.error(error);
  }
}
