import './styles.css';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import { Notify } from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

const refs = {
  select: document.querySelector('.breed-select'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
  catInfo: document.querySelector('.cat-info'),
};
const { select, loader, error, catInfo } = refs;

select.addEventListener('change', onSelectBreed);
loader.classList.replace('loader', 'hidden');
error.classList.add('hidden');
catInfo.classList.add('hidden');

let arrBreed = [];
fetchBreeds()
  .then(data => {
    data.forEach(element => {
      arrBreed.push({ text: element.name, value: element.id });
    });
    new SlimSelect({
      select: select,
      data: arrBreed,
    });
  })
  .catch(onError);

function onSelectBreed(event) {
  loader.classList.replace('hidden', 'loader');
  select.classList.add('hidden');
  catInfo.classList.add('hidden');

  const breedId = event.currentTarget.value;
  fetchCatByBreed(breedId)
    .then(data => {
      loader.classList.replace('loader', 'hidden');
      select.classList.remove('hidden');

      const { url, breeds } = data[0];
      catInfo.innerHTML = `<div class="box-img">
    <img src="${url}" alt="${breeds[0].name}" width="550"/></div>
    <div class="box">
    <h1>${breeds[0].name}</h1>
    <p>${breeds[0].description}</p>
    <p><b>Temperament: ${breeds[0].temperament}</b></p></div>`;
      catInfo.classList.remove('hidden');
    })
    .catch(onError);
}
function onError() {
  select.classList.remove('hidden');
  loader.classList.replace('loader', 'hidden');
  Notify.failure(
    'Oops! Something went wrong! Try reloading the page or select another cat breed!',
    {
      width: '400px',
      fontSize: '20px',
    }
  );
}
