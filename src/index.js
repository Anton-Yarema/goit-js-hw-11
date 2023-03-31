import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';
import fetchData from './js/fetchCard';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');

let searchQuery = '';
let currentPage = '';
let isLoading = false;
let endOfCollection = false;
const PER_PAGE = 40;

const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

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
  try {
    e.preventDefault();
    searchQuery = e.currentTarget.elements.searchQuery.value.trim();
    currentPage = 1;
    endOfCollection = false;
    if (!searchQuery) {     
      return;
    }
    clearCard();
    const data = await fetchData(searchQuery, currentPage);
    renderMarkup(data);
    notifTotalHits(data);
  } catch (error) {
    console.error(error);
  }
}

function renderMarkup({ hits }) {  
  renderImagesCard(hits);
  lightBox.refresh();
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
}

window.addEventListener('scroll', async () => {
  try {
    const documentRect = document.documentElement.getBoundingClientRect();

    if (
      documentRect.bottom < document.documentElement.clientHeight + 200 &&
      !isLoading &&
      !endOfCollection
    ) {
      isLoading = true;
      currentPage++;
      const data = await fetchData(searchQuery, currentPage);
      renderMarkup(data);
      lightBox.refresh();
      endList(data);
      isLoading = false;
    } else if (endOfCollection) {
      window.removeEventListener('scroll', arguments.callee); // удаляем обработчик, если достигнут конец коллекции
    }
  } catch (error) {
    console.error(error);
  }
});
function endList(data) {
  const { totalHits, hits } = data;
  if (hits.length === 0) { 
    return;
  }
  else if (totalHits - (currentPage * PER_PAGE) < 40) {
    endOfCollection = true;
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function clearCard() {
  galleryRef.innerHTML = '';
}
function notifTotalHits(data) {
  const { totalHits, hits } = data;
  if (hits.length > 0) {
    return Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  } else if (hits.length === 0) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}
