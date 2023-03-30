import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34731072-348d9a1558c6b29bcd98e02ff';
const PER_PAGE = 40;

export default async function fetchData(searchQuery, page) {
  try {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: PER_PAGE,
    });
    const url = `${BASE_URL}?${searchParams}`;

    const response = await axios.get(url);
    const { hits, totalHits } = response.data;
    return { hits, totalHits };
  } catch (error) {
    console.error(error);
  }
}
