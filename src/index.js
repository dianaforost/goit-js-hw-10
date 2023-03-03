import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onCountrySearch, DEBOUNCE_DELAY));

function onCountrySearch(e) {
  e.preventDefault();
  const inputName = e.target.value.trim();
  if (!inputName) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(inputName)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
      } else if (countries.length === 1) {
        createCountryInfo(countries);
        countryList.innerHTML = '';
      } else {
        createCountryList(countries);
        countryInfo.innerHTML = '';
      }
    })
    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    });
}

function createCountryList(countries) {
  const countriesMarkup = countries
    .map(({ name, flags }) => {
      return `<li class ="country-list__item"><img class ="country-list__img" src ="${flags.svg}" alt="Country flag" width ="30px"><p class ="country-list__text">${name.official}</p></li>`;
    })
    .join('');
  return countryList.insertAdjacentHTML('beforeend', countriesMarkup);
}

function createCountryInfo(countries) {
  const countriesMarkup = countries
    .map(({ name, flags, capital, population, languages }) => {
      return `<div class="country-info__container">
        <img class="country-info__img" src ="${
          flags.svg
        }" alt="Country flag" width ="50px"><p class="country-info__text">${
        name.official
      }</p>
        </div>
        <ul class ="country-info__list">
        <li class ="country-info__item"><p><b>Capital: </b>${capital}</p></li>
        <li class ="country-info__item"><p><b>Population: </b> ${population}</p></li>
        <li class ="country-info__item"><p><b>Languages:</b> ${Object.values(
          languages
        )}</p></li>
        </ul>`;
    })
    .join('');
  return countryInfo.insertAdjacentHTML('beforeend', countriesMarkup);
}
