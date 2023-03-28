import ImagesService from './js/fetchImages.js';
import Notiflix from 'notiflix';
import axios from 'axios';
import './css/styles.css';
// import SimpleLightbox from "simplelightbox";
// import "simplelightbox/dist/simple-lightbox.min.css";


formRef = document.querySelector('.search-form');
galleryRef = document.querySelector('.gallery');

// class ImagesService {
//   #page = 1;
//   #previousQuery = null;

//   async fetchData(searchQuery) {
//     this.#page = searchQuery === this.#previousQuery ? this.#page + 1 : 1;
//     this.#previousQuery = searchQuery;

//     const searchParams = new URLSearchParams({
//       key: API_KEY,
//       q: searchQuery,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: 'true',
//       page: 1,
//       per_page: 40,
//     });

//     // return fetch(`${BASE_URL}?${searchParams}`)
//     //   .then(response => response.json())
//     //   .then(({ hits }) => ImagesService.prepareData(hits));
    
//     const { hits } = await fetch(`${BASE_URL}?${searchParams}`).then((response) =>
//       response.json(),
//     );
//     return ImagesService.prepareData(hits);
//   }

//   static prepareData(images) {
//     return images.map(image => {
//       const {
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       } = image;
//       return {
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       };
//     });
//   } 
// }

class ImageSearch {
  constructor() {
    // this.ImagesService = new ImagesService();
    this.page = 1;
    this.searchQuery = '';
    this.isLoading = false;

    formRef.addEventListener('submit', this.onSubmit.bind(this));
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  onSubmit(event) {
    event.preventDefault();
    this.searchQuery = event.target.elements.searchQuery.value.trim();
    this.page = 1;
    this.isLoading = false;    
    galleryRef.innerHTML = '';
    this.fetchImages();
  }

  onScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !this.isLoading) {
      this.fetchImages();
    }
  }

  fetchImages() {
    this.isLoading = true;
    ImagesService.fetchData(this.searchQuery).then(images => {
      this.renderImages(images);
      this.isLoading = false;
    });
  }
  

  renderImages(images) {
    const markup = images.map(image => {
      return `
        <div class="gallery-item">
          <a href="${image.largeImageURL}" target="_blank">
            <img src="${image.webformatURL}" alt="${image.alt}" width = "420px">
          </a>
          <div class="info">
            <p><b>Likes</b> ${image.likes}</p>
            <p><b>Views</b> ${image.views}</p>
            <p><b>Comments</b> ${image.comments}</p>
            <p><b>Downloads</b> ${image.downloads}</p>
          </div>
        </div>
      `;
    }).join('');

    galleryRef.innerHTML = markup;
  }
}

new ImageSearch();