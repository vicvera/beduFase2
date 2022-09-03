import 'bootstrap';
import '../scss/styles.scss';
import swal from 'sweetalert';

const search = document.getElementById('search');
const sendButton = document.getElementById('sendButton');
const randomButton = document.getElementById('randomButton');
const modal = document.getElementById('modal');
const close = document.getElementsByClassName('close')[0];

sendButton.onclick = function (e) {
    e.preventDefault();
    const valor = search.value;
    const container = document.getElementById("results-container");
    container.innerHTML = '';

    if(!valor.length) {
        swal('Debe ingresar un termino de búsqueda.');
    } else if (valor.length === 1){
        getByFirstLetter(valor).then(function (data) {
            if(!data.length) {
                swal('No se encontró información.');
            } else {
                container.appendChild(buildResults(formatData(data)));
                container.scrollIntoView();
            }
        });
    } else {
        getByName(valor).then(function (data) {
            if(!data.length) {
                swal('No se encontró información.');
            } else {
                container.appendChild(buildResults(formatData(data)));
                container.scrollIntoView();
            }
        });
    }
}

randomButton.onclick = function (e) {
    getRandom().then(data => {
        showModal(data[0]);
    });
}

function buildResults(data) {
    const results = document.createElement('div');
    results.className = 'row';

    data.forEach(async object => {
        const container = document.createElement("div");
        container.className = 'col-lg-3 col-md-4 col-sm-6 col-xs-12 p-2';
        const card = document.createElement('div');
        card.className = "card w-100"
        const cardBody = document.createElement('div');
        cardBody.className = "card-body";
        const image = document.createElement('img');
        image.className = 'card-img-top';
        const title = document.createElement('h5');
        title.className = 'card-title';
        const subtitle = document.createElement('h6');
        subtitle.className = 'card-subtitle mb-2 text-muted';
        const text = document.createElement('p');
        text.className = 'card-text';

        image.onclick = function() { showDetail(object['id']); };
        image.src = object['image'];
        card.appendChild(image);

        let name = object['name'];
        name = name.toLowerCase();
        name = name.charAt(0).toUpperCase() + name.slice(1);
        title.appendChild(document.createTextNode(name));
        cardBody.appendChild(title);

        subtitle.appendChild(document.createTextNode(object['area']));
        cardBody.appendChild(subtitle);

        text.appendChild(document.createTextNode(object['category']));
        cardBody.appendChild(text);

        card.appendChild(cardBody);
        container.appendChild(card);

        results.appendChild(container);
    });

    return results;
}

const formatData = (data) => {
    return data.map(item => {
        return {
            id: item.idMeal,
            image: item.strMealThumb,
            name: item.strMeal,
            area: item.strArea,
            category: item.strCategory
        }
    });
}

function showModal(receipt) {
    const modalImage = document.getElementById('modal-image');
    const receiptTitle = document.getElementById('receipt-title');
    const ingredientList = document.getElementById('ingredients-list');
    const instructions = document.getElementById('receipt-instructions');

    modalImage.innerHTML = '';
    receiptTitle.innerHTML = '';
    ingredientList.innerHTML = '';
    instructions.innerHTML = '';

    modalImage.className = "img-fluid rounded mx-auto d-block"
    modalImage.width = 300;
    modalImage.src = receipt.strMealThumb;
    receiptTitle.appendChild(document.createTextNode(receipt.strMeal));
    ingredientList.appendChild(getIngredients(receipt));
    instructions.appendChild(document.createTextNode(receipt.strInstructions));
    instructions.className = "text-justify";
        
    modal.style.display = "block";
}

function showDetail(id) {
    getById(id).then(data => {
        showModal(data[0]);
    })
}

close.addEventListener('click', function() {
  modal.style.display = "none";
})

function getIngredients(data) {
    const list = document.createElement('ul');
    for(let field of Object.keys(data)) {
        if(field.indexOf('strIngredient') >= 0 && !!data[field]) {
            const itemList = document.createElement('li');
            let ingredient = data[field];
            ingredient = ingredient.toLowerCase();
            ingredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1)
            const text = document.createTextNode(ingredient);
            itemList.appendChild(text);
            list.appendChild(itemList);
        }
    }

    return list;
}

function getByFirstLetter(value) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${value}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data.meals || [];
        })
}

function getRandom() {
    return fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data.meals || [];
        })
}

function getByName(value) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data.meals || [];
        })
}

function getById(id) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data.meals || [];
        })
}