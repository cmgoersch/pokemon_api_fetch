document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("searchButton"); 
    const input = document.getElementById("pokemonName"); 
    const ul = document.getElementById("pokemonList"); 
    const card = document.getElementById("pokemonCard");
    const prevButton = document.getElementById("prevPokemon");
    const nextButton = document.getElementById("nextPokemon");
    const closeButton = document.getElementById("closeCard");

    let pokemonArray = [];
    let currentPokemonIndex = -1;

    button.addEventListener("click", searchPokemon);
    
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); 
            searchPokemon();
        }
    });

    ul.addEventListener("click", (event) => {
        if (event.target.tagName === "LI") {
            input.value = event.target.textContent;
            searchPokemon(); 
        }
    });

    prevButton.addEventListener("click", () => navigatePokemon(-1));
    nextButton.addEventListener("click", () => navigatePokemon(1));
    closeButton.addEventListener("click", () => card.style.display = "none") ;

    async function searchPokemon() {
        let pokemonName = input.value.toLowerCase().trim();
        
        if (pokemonName === "") {
            alert("Bitte gib einen Pokémon-Namen ein!");
            return;
        }
    
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            if (!response.ok) {
                throw new Error("Pokémon nicht gefunden!");
            }
    
            const data = await response.json();
    
            document.getElementById("name").textContent = data.name.toUpperCase();
            document.getElementById("sprite").src = data.sprites.front_default;
    
          
            const statsList = document.getElementById("stats");
            statsList.innerHTML = "";
            data.stats.forEach(stat => {
                let li = document.createElement("li");
                li.textContent = `${stat.stat.name}: ${stat.base_stat}`;
                statsList.appendChild(li);
            });
    
        
            const abilitiesList = document.getElementById("abilities");
            abilitiesList.innerHTML = "";
            data.abilities.forEach(ability => {
                let li = document.createElement("li");
                li.textContent = ability.ability.name;
                abilitiesList.appendChild(li);
            });
    
            card.style.display = "block";
    
            currentPokemonIndex = pokemonArray.findIndex(pokemon => pokemon.name === data.name.toLowerCase());
    
        } catch (error) {
            alert("Pokémon nicht gefunden. Bitte überprüfe den Namen.");
            card.style.display = "none";
        }
    }
    async function loadPokemonList() {
        try {
            const pokemonListElement = document.getElementById("pokemonList");
            const apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=200";

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Fehler beim Abrufen der Pokémon-Liste");

            const data = await response.json();
            pokemonArray = data.results;

            pokemonArray.forEach(pokemon => {
                const li = document.createElement("li");
                li.textContent = capitalizeFirstLetter(pokemon.name);
                pokemonListElement.appendChild(li);
            });

        } catch (error) {
            console.error("Fehler:", error);
        }
    }

    function navigatePokemon(direction) {
        if (currentPokemonIndex === -1) return;

        let newIndex = currentPokemonIndex + direction;

        if (newIndex < 0 || newIndex >= pokemonArray.length) return;

        currentPokemonIndex = newIndex;
        input.value = capitalizeFirstLetter(pokemonArray[currentPokemonIndex].name);
        searchPokemon();
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    loadPokemonList();
});


