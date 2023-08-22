const pokemonOl = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const modal = document.getElementById('pokemonModal');
const modalPokemonName = document.getElementById('modalPokemonName');
const modalPokemonImage = document.getElementById('modalPokemonImage');
const modalPokemonNumber = document.getElementById('modalPokemonNumber');
const modalPokemonTypes = document.getElementById('modalPokemonTypes');

const limit = 10;
let offset = 0;

function openModal(pokemon) {
    modalPokemonName.textContent = pokemon.name;
    modalPokemonImage.src = pokemon.photo;
    modalPokemonImage.alt = pokemon.name;
    modalPokemonNumber.textContent = `Number: #${pokemon.number}`;
    modalPokemonTypes.textContent = `Types: ${pokemon.types.join(', ')}`;
    modalPokemonWeaknesses.textContent = `Faquezas: ${pokemon.weaknesses.join(', ')}`;
    modalPokemonWeight.textContent = `Peso: ${pokemon.weight}`;
    modalPokemonCategory.textContent = `Categoria: ${pokemon.category}`;
    modal.style.display = 'block';
    window.addEventListener('click', closeModalOutside);

    const closeButton = modal.querySelector('close');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';


    });
}

closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});


function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons
            .map((pokemon) => `
                <li class="pokemon ${pokemon.type}" data-pokemon='${JSON.stringify(pokemon)}'>
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        
                        </ol>
                        <img src="${pokemon.photo}" alt="${pokemon.name}" />
                    </div>
                </li>
            `)
            .join('');

        pokemonOl.innerHTML += newHtml;


        const pokemonItems = document.querySelectorAll('.pokemon');
        pokemonItems.forEach((item) => {
            item.addEventListener('click', () => {
                const pokemonData = JSON.parse(item.getAttribute('data-pokemon'));
                openModal(pokemonData);
            });
        });
    });
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    loadPokemonItems(offset, limit);
    loadMoveDetails();
});
