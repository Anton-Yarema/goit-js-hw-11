import ImagesService from './js/fetchImages.js';
import Notiflix from 'notiflix';
import axios from 'axios';
import './css/styles.css';

formRef = document.querySelector('.search-form');
galleryRef = document.querySelector('.gallery');

class ImageSearch {
  #targetElement = null;
  #infinityLoading = false;
  #searchQuery = null;
  #refs = {};
  #images = [];

  constructor({ targetElement, infinityLoading = false } = {}) {
    this.#targetElement = targetElement || document.body;
    this.#infinityLoading = infinityLoading;
  }

  init() {
    // this.#targetElement.innerHTML = this.#markup;
    this.#initRefs();
    this.#initListeners();

    // if (this.#infinityLoading) {
    //   this.#initInfinityLoading();
    // }
  }

  #initRefs() {
    this.#refs.search = document.querySelector('.search-form');
    this.#refs.images = document.querySelector('.gallery');
    // this.#refs.moreBtn = document.querySelector('.news-app .load-more__btn');
  }

  #initListeners() {
    this.#refs.search.addEventListener('submit', this.#onSearch.bind(this));
    // this.#refs.moreBtn.addEventListener(
    //   'click',
    //   this.#onClickLoadMoreBtn.bind(this)
    // );
  }

  #updateArticles(images) {
    this.#images = images;
    this.#render();

    // if (!this.#infinityLoading) {
    //   this.#toggleMoreButton();
    // }
  }

  async #onSearch(e) {
    e.preventDefault();
    this.#searchQuery = e.currentTarget.elements.search.value;
    console.log('gfasgas');
    const images = await this.#fetchArticles();

    if (images.length > 0) {
      this.#updateArticles(images);
    } else {
      notifier.info('No results. Please clarify your search');
    }
    e.target.reset();

    // this.#fetchArticles()
    //   .then((articles) => {
    //     if (articles.length === 0) {
    //       return notifier.info('No results. Please clarify your search');
    //     }

    //     this.#updateArticles(articles);
    //   })
    //   .finally(() => {
    //     e.target.reset();
    //   });
  }

  async #fetchArticles() {
    try {
      return await ImagesService.fetchData(this.#searchQuery);
    } catch (error) {
      console.error(error);
      notifier.error('Something went wrong. Please try later');
    }

    // return articlesService
    //   .fetchData(this.#searchQuery)
    //   .then((articles) => articles)
    //   .catch((error) => {
    //     console.error(error); // dev
    //     notifier.error('Something went wrong. Please try later');
    //   });
  }

  //   async #loadMore() {
  //     const articles = await this.#fetchArticles();
  //     this.#updateArticles([...this.#articles, ...articles]);

  // return this.#fetchArticles().then((articles) => {
  //   this.#updateArticles([...this.#articles, ...articles]);
  // });
  //   }

  //   async #onClickLoadMoreBtn() {
  //     this.#refs.moreBtn.classList.add('load-more__btn_loading');
  //     this.#refs.moreBtn.disabled = true;

  //     await this.#loadMore();
  //     this.#refs.moreBtn.classList.remove('load-more__btn_loading');
  //     this.#refs.moreBtn.disabled = false;

  // this.#loadMore().finally(() => {
  //   this.#refs.moreBtn.classList.remove('load-more__btn_loading');
  //   this.#refs.moreBtn.disabled = false;
  // });
  //   }

  //   #toggleMoreButton() {
  //     if (this.#articles.length > 0) {
  //       this.#refs.moreBtn.classList.remove('load-more__btn_hidden');
  //     } else {
  //       this.#refs.moreBtn.classList.add('load-more__btn_hidden');
  //     }
  //   }

  //   #initInfinityLoading() {
  //     const observer = new IntersectionObserver(
  //       entries => {
  //         for (const entry of entries) {
  //           if (entry.isIntersecting && this.#images.length > 0) {
  //             this.#loadMore();
  //           }
  //         }
  //       },
  //       { rootMargin: '400px' }
  //     );

  //     observer.observe(this.#refs.moreBtn);
  //   }

  #render(images) {
    const markup = images
      .map(image => {
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
      })
      .join('');

    galleryRef.innerHTML = markup;
  }
}

const ImageSearch = new ImageSearch();
ImageSearch.init();



        // <div class="gallery-item">
        //   <a href="${largeImageURL}" target="_blank">
        //     <img src="${webformatURL}" alt="${tags}" width = "420px">
        //   </a>
        //   <div class="info">
        //     <p><b>Likes</b> ${likes}</p>
        //     <p><b>Views</b> ${views}</p>
        //     <p><b>Comments</b> ${comments}</p>
        //     <p><b>Downloads</b> ${downloads}</p>
        //   </div>
        // </div>


//         import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// import './css/styles.css';
// import fetchData from './js/fetchCard';

// const formRef = document.querySelector('.search-form');
// const galleryRef = document.querySelector('.gallery');

// let searchQuery = '';
// let page = 1;
// let isLoading = false;

// const lightBox = new SimpleLightbox('.gallery a', {
//   captionsData: 'alt',
//   captionDelay: 250,
// });

// formRef.addEventListener('submit', onSearch);
// galleryRef.addEventListener('click', onGalleryClick);

// function onGalleryClick(e) {
//   e.preventDefault();
//   const galleryItem = e.target.classList.contains('gallery__image');
//   if (!galleryItem) {
//     return;
//   }
// }

// async function onSearch(e) {
//   try {
//     e.preventDefault();
//     searchQuery = e.currentTarget.elements.searchQuery.value.trim();
//     page = 1;
//     if (!searchQuery) {
//       Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//       return;
//     }
//     clearCard();
//     const data = await fetchData(searchQuery);
//     renderMarkup(data);
//     notifTotalHits(data);
//     endList(data);
//   } catch (error) {
//     console.error(error);
//   }
// }

// function renderMarkup({ hits }) {
//   renderImagesCard(hits);
//   lightBox.refresh();
// }

// function renderImagesCard(imagesData) {
//   const markup = imagesData
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => {
//         return `
//       <a class="gallery__link" href="${largeImageURL}">
//         <div class="photo-card">
//          <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width = "420px"/>
//          <div class="info">
//           <p class="info-item">
//          <b>likes</b> ${likes}
//          </p>
//        <p class="info-item">
//       <b>views</b> ${views}
//     </p>
//     <p class="info-item">
//       <b>comments</b> ${comments}
//     </p>
//     <p class="info-item">
//       <b>downloads</b> ${downloads}
//     </p>
//         </div>
//     </div>
//   </a>`;
//       }
//     )
//     .join('');
//   galleryRef.insertAdjacentHTML('beforeend', markup);
// }

// window.addEventListener('scroll', async () => {
//   try {
//     const documentRect = document.documentElement.getBoundingClientRect();

//     if (
//       documentRect.bottom < document.documentElement.clientHeight + 200 &&
//       !isLoading
//     ) {
//       isLoading = true;
//       page++;
//       const data = await fetchData(searchQuery, page);
//       renderMarkup(data);
//       lightBox.refresh();
//       isLoading = false;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// });

// function clearCard() {
//   galleryRef.innerHTML = '';
// }

// function notifTotalHits(data) {
//   const { totalHits, hits } = data;
//   if (hits.length > 0) {
//     return Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
//   } else if (hits.length === 0) {
//     return Notiflix.Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//   }
// }


// import axios from 'axios';
// import Notiflix from 'notiflix';

// const BASE_URL = 'https://pixabay.com/api/';
// const API_KEY = '34731072-348d9a1558c6b29bcd98e02ff';
// const PER_PAGE = 40;
// let page = 1;

// export default async function fetchData(searchQuery, currentPage = page) {
//   try {
//     const searchParams = new URLSearchParams({
//       key: API_KEY,
//       q: searchQuery,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: 'true',
//       page: currentPage,
//       per_page: PER_PAGE,
//     });
//     const url = `${BASE_URL}?${searchParams}`;

//     const response = await axios.get(url);
//     const { hits, totalHits } = response.data;
//     // if ((totalHits - (page * PER_PAGE)) < PER_PAGE) {
//     //   Notiflix.Notify.info(
//     //     "We're sorry, but you've reached the end of search results."
//     //   );
//     // }

//     // if (hits.length === 0 && currentPage > 1) {
//     //   Notiflix.Notify.info(
//     //     "We're sorry, but you've reached the end of search results."
//     //   );
//     // }
//     // page = currentPage;
//     return { hits, totalHits };
//   } catch (error) {
//     console.error(error);
//   }
// }
