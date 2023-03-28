import Notiflix from 'notiflix';
import axios from 'axios';
import './css/styles.css';
import fetchData from './js/fetchCard';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const btnRef = document.querySelector('.load-more');
let searchQuery = '';
let page = 1;
let imagesData = [];

formRef.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.elements.searchQuery.value;
  if (!searchQuery) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  fetchData(searchQuery).then(data => renderMarkup(data));
}

function renderMarkup(data) {  
  const { hits } = data;
  if (hits.length === 0) {
    return Notiflix.Notify.failure(
     'Sorry, there are no images matching your search query. Please try again.');
  }  
  renderImagesCard(hits);
  initInfinityLoading();
}

function renderImagesCard(imagesData) {
  const markup = imagesData
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="gallery-item">
          <a href="${largeImageURL}" target="_blank">
            <img src="${webformatURL}" alt="${tags}" width = "420px">
          </a>
          <div class="info">
            <p><b>Likes</b> ${likes}</p>
            <p><b>Views</b> ${views}</p>
            <p><b>Comments</b> ${comments}</p>
            <p><b>Downloads</b> ${downloads}</p>
          </div>
        </div>        
             `;
      }
    )
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

function initInfinityLoading(hits) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && hits.length > 0) {
            fetchData();
          }
        }
      },
      { rootMargin: '400px' },
    );

    observer.observe(btnRef);
}
  
function incrementPage() { 
  currentPage += 1;
}