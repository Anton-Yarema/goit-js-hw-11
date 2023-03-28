import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import './css/styles.css';
import fetchData from './js/fetchCard';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
let searchQuery = '';
let page = 1;
let isLoading = false;
let totalImages = 0;

formRef.addEventListener('submit', onSearch);
galleryRef.addEventListener('click', onGalleryClick);

function onGalleryClick(e) {
  e.preventDefault();

  const galleryItem = e.target.classList.contains('gallery__image');

  if (!galleryItem) {
    return;
  }
}

async function onSearch(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.elements.searchQuery.value;
  page = 1;
  if (!searchQuery) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  clearCard();
  currentPage = 1;
 await fetchData(searchQuery).then(data => renderMarkup(data));
}

function renderMarkup({ hits, totalHits }) {
  totalImages += hits.length;
  
  if (hits.length === 0) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  const message = `Hooray! We found ${totalHits} images.`;
  Notiflix.Notify.success(message);

  if (totalImages >= totalHits) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    return;
  }
  renderImagesCard(hits);  
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
      <a class="gallery__link" href="${largeImageURL}">
        <div class="photo-card">
         <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width = "420px"/>
         <div class="info">
          <p class="info-item">
         <b>likes</b> ${likes}
         </p>
       <p class="info-item">
      <b>views</b> ${views}
    </p>
    <p class="info-item">
      <b>comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>downloads</b> ${downloads}
    </p>
        </div>
    </div>
  </a>`;
      }
    )
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);

  const lightBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
}

window.addEventListener('scroll', async () => {
  const documentRect = document.documentElement.getBoundingClientRect();

  if (
    documentRect.bottom < document.documentElement.clientHeight + 200 &&
    !isLoading
  ) {
    isLoading = true;
    page++;
    const data = await fetchData(searchQuery, page);
    renderMarkup(data);
    isLoading = false;
  }
});

function clearCard() {
  galleryRef.innerHTML = '';
}
