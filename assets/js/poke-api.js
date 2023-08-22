
const pokeApi = {};

function convertPokeApiDtailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.order;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    const typePromises = types.map(type => {
        return fetch(`https://pokeapi.co/api/v2/type/${type}`)
            .then(response => response.json())
            .then(typeDetail => typeDetail.damage_relations.double_damage_from.map(weakness => weakness.name));
    });

    return Promise.all(typePromises)
        .then(weaknesses => {
            const allWeaknesses = weaknesses.flat();
            pokemon.weaknesses = allWeaknesses;
            return pokemon;
        })
        .then(() => {
            return fetch(pokeDetail.species.url);
        })
        .then(response => response.json())
        .then(pokemonSpecies => {
            pokemon.weight = pokeDetail.weight;
            pokemon.category = pokemonSpecies.genera.find(genera => genera.language.name === "en").genus;
            return pokemon;
        })
        .catch(error => {
            console.error('Erro ao obter detalhes:', error);
            return pokemon;
        });
    }
pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then((convertPokeApiDtailToPokemon));
};


pokeApi.getPokemons = (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequest) => Promise.all(detailRequest))
        .then((getPokemonDetail) => getPokemonDetail);
};