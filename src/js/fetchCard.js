import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34731072-348d9a1558c6b29bcd98e02ff';
const PER_PAGE = 40;
let page = 1;

export default async function fetchData(searchQuery, currentPage = page) {
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

  const data = await axios.get(url).then(({ data }) => data);
  const { hits, totalHits } = data;  
  return { hits, totalHits };
}
