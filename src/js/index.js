import swal from 'sweetalert';
import 'bootstrap';
import '../scss/styles.scss';


const search = document.getElementById('search');
const sendButton = document.getElementById('sendButton');
const randomButton = document.getElementById('randomButton');


sendButton.onclick = function (e) {
    e.preventDefault();
    const valor = search.value;
    const container = document.getElementById("mountains");
    container.innerHTML = '';
    //const container = document.getElementById('search-container');
    //container.className += ' visually-hidden';
    
    getGithubUsers(valor).then(function (data) {
        if(!data.length) {
            swal('No se encontró información.')
        } else {
            container.appendChild(buildTable(formatData(data)));
            container.scrollIntoView();
        }
    });
}

randomButton.onclick = function (e) {
    getRandom().then(data => {
        showModal(data[0]);
    });
}

function getUrlParameters(param) {
    let pageURL = window.location.search.substring(1);
    let urlVariables = pageURL.split('&');
    for (let i = 0; i < urlVariables.length; i++) {
        let parameterName = urlVariables[i].split('=');
        if (parameterName[0] == param) {
            return parameterName[1];
        }
    }
}

function getGithubUsers(value) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${value}`) //s=${value}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data.meals || [];
        })
}

function getById(id) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`) //s=${value}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data.meals || [];
        })
}

function getRandom() {
    return fetch(`https://www.themealdb.com/api/json/v1/1/random.php`) //s=${value}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data.meals || [];
        })
}

function buildTable(data) {
    const results = document.createElement('div');
    results.className = 'row';
    //const fields = Object.keys(data[0]);

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


    /*const table = document.createElement("table");
    table.className = 'table table-striped';

    
    const header = document.createElement("thead");
    const headRow = document.createElement("tr");
    const headCell = document.createElement("th");
    headCell.scope = 'col';

    headCell.appendChild(document.createTextNode('#'));
    headRow.appendChild(headCell);

    fields.forEach(function (field) {
        if(field !== 'id') {
        const headCell = document.createElement("th");
        headCell.scope = 'col';
        headCell.appendChild(document.createTextNode(field === 'Imagen' ? '' : field));
        headRow.appendChild(headCell);
        }
    });

    header.appendChild(headRow);
    table.appendChild(header);

    const body = document.createElement("tbody");
    data.forEach(function (object, i) {
        console.log(object);
        const row = document.createElement("tr");
        const cell = document.createElement("th");
        cell.scope = 'row';
        cell.appendChild(document.createTextNode(`${i + 1}`));
        row.appendChild(cell);

        fields.forEach(function (field) {
            if(field !== 'id') {
            const cell = document.createElement("td");
            if (field === 'Imagen') {
                const image = document.createElement('img');
                image.className = 'img-fluid img-thumbnail';
                image.onclick = function() { showDetail(object['id']); };
                image.width = 75;
                image.src = object[field];
                cell.appendChild(image)
            } else {
                cell.appendChild(document.createTextNode(object[field]));
                if (typeof object[field] == "number") {
                    cell.style.textAlign = "right";
                }
            }
            row.appendChild(cell);
            }
        });
        body.appendChild(row);
    });
    table.appendChild(body);
    return table;*/
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


const modal = document.getElementById("modal");

const button = document.getElementsByTagName('button')[0];
const modalImage = document.getElementById("modal-image");
const close = document.getElementsByClassName("close")[0];

function showModal(receipt) {
    const receiptTitle = document.getElementById('receipt-title');
    const ingredientList = document.getElementById('ingredients-list');
    const instructions = document.getElementById('receipt-instructions');

    receiptTitle.innerHTML = '';
    ingredientList.innerHTML = '';
    instructions.innerHTML = '';
        
    receiptTitle.appendChild(document.createTextNode(receipt.strMeal));
    ingredientList.appendChild(getIngredients(receipt));
    instructions.appendChild(document.createTextNode(receipt.strInstructions));

    instructions.className = "text-justify";
        
    modal.style.display = "block";
    modalImage.className = "img-fluid rounded mx-auto d-block"
    modalImage.width = 300;
    modalImage.src = receipt.strMealThumb;
}

function showDetail(id) {
    getById(id).then(data => {
        showModal(data[0]);
    })
}


/*button.addEventListener('click', function() {
    modal.style.display = "block";
    modalImage.src = 'https://picsum.photos/300/200';
})*/

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


/*
var form = document.forms['form'];

form.onsubmit = function(e){
    e.preventDefault();
    var select = document.form.fruit.value;
    console.log(select);
    document.getElementById('print').innerHTML=select.toUpperCase();
}

window.prueba = function () {
    alert('Si entra la prueba.');
}
*/