import axios from 'axios';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from './createMarkup';



const selectors = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('input'),
  submitBtn: document.querySelector('[type="submit"]'),
  galleryEl: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

const API_KEY = '38483766-3961d12a0fdf66ae1b3a92855';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = '40';
let currentPage = 1;
let currentQuery = '';
let requestUrl = '';

 const lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  });

selectors.formEl.addEventListener('submit', handlerFormChange);
selectors.loadMore.addEventListener('click', handlerLoadMore);

async function handlerFormChange(e) {
  e.preventDefault();
  currentQuery = selectors.inputEl.value.trim();
  currentPage = 1;

  clearGalery();
  await fetchData();
  lightbox.refresh();
}

async function fetchData() {
  requestUrl = getRequest(currentQuery, currentPage);

  try {
    const data = await fetchImages(requestUrl);
    chackFatchResult(data);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry! An error occurred while getting the images. Please try again later'
    );
  }
}

function chackFatchResult(data) {
  const { hits, totalHits } = data;
  if (hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry! There are no images matching your search query. Please try again.'
    );
    hideLoadMoreBtn();
  } else {
    createMarkup(hits);
    if (currentPage * PER_PAGE <= totalHits) {
      showLoadMoreBtn();
    } else {
      hideLoadMoreBtn();
      Notiflix.Notify.info(
        "We're sorry! But you've reached the end of search results."
      );
    }
  }
}

function getRequest(query, page) {
  const url = new URL(BASE_URL);
  url.searchParams.append('key', API_KEY);
  url.searchParams.append('q', query);
  url.searchParams.append('image_type', 'photo');
  url.searchParams.append('orientation', 'horizontal');
  url.searchParams.append('safesearch', 'true');
  url.searchParams.append('page', page.toString());
  url.searchParams.append('per_page', PER_PAGE.toString());
  return url.toString();
}

function clearGalery() {
  selectors.galleryEl.innerHTML = '';
}

function hideLoadMoreBtn() {
  selectors.loadMore.style.display = 'none';
}

function showLoadMoreBtn() {
  selectors.loadMore.style.display = 'block';
}

async function handlerLoadMore() {
  currentPage += 1;
  await fetchData();
}

async function fetchImages(requestUrl) {
  try {
    const response = await axios.get(requestUrl);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}



