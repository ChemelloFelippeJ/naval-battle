let tableArray = [];
let positionsOcuppied = [];
let tableHeight = 10;
let tableWidth = 10;
let digits = ((tableWidth * tableHeight) - 1).toString().length;
console.log(digits);
const debugg = false;
const lenghtBoats = [2, 3, 5];
let partsOfBoats = 0;

for(let i = 0; i < lenghtBoats.length; i++){
    partsOfBoats += lenghtBoats[i];
    console.log(partsOfBoats);
}


if(debugg){
    // document.getElementsByClassName('debbug')
}

function start() {
    createTableStructure();
    insertBoatInRandomPositions();
    renderTable();
}

function createTableStructure() {
    const numberOfSpaces = tableHeight * tableWidth;

    for (let i = 0; i < numberOfSpaces; i++) {
        tableArray[i] = 'W';                    //set with water
    }
    // console.log("Water: " + water + "\nBoat: " + boat + "\nShot: " + shot + "\nFire: " + fire);
}

function selectBoatPositions() {
    let html = '<table>';

    for (let row = 0; row < tableHeight; row++) {
        html += '<tr>';

        for (let column = 0; column < tableWidth; column++) {
            const spaceIndex = column + (row * tableWidth);

            html += '<td>';
            html += `<input type="checkbox" name="boat" value="${spaceIndex}">`;
            html += '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    document.querySelector('#tableCanvas').innerHTML = html;

    const sendButtonHtml = `<input type="button" value="Enviar Seleção!" onclick="insertBoatInPredefinedPosition()">`;

    document.querySelector('#sendButton').innerHTML = sendButtonHtml;
}

function insertBoatInPredefinedPosition() {
    createTableStructure();
    let boatPositions = document.getElementsByName('boat');

    for (let i = 0; i < boatPositions.length; i++){
        if(boatPositions[i].checked){
            tableArray[i] = 'B';
        }
    }
}

function shot() {
    console.log("Atirou");
    let boatPositions = document.getElementsByName('positions');

    for(let i = 0; i < boatPositions.length; i++){
        if(boatPositions[i].checked){
            if(tableArray[i] === 'B'){
                tableArray[i] = 'F';
            }else{
                tableArray[i] = 'S';
            }
        }
    }

    renderTable();
    checkWinner();
}

function checkWinner(){
    let count = 0;

    for(let i = 0; i < tableArray.length; i++){
        if(tableArray[i] === 'F'){
            count++;
        }
    }
    console.log(count + " - " + partsOfBoats);
    if(count === partsOfBoats){
        alert("ACABOU!!!");
    }
}

function insertBoatInRandomPositions() {
    for (let i = 0; i < lenghtBoats.length; i++) {
        const orientation = returnOrientation();
        const boatPositions = returnStartPosition(lenghtBoats[i], orientation);


        for (let j = 0; j < boatPositions.length; j++) {
            tableArray[boatPositions[j]] = 'B';
            positionsOcuppied.push(boatPositions[j]);
        }

    }
}

function returnOrientation() {
    switch (Math.round(Math.random())) {
        case 0:
            return 'H';     //horizontal
        case 1:
            return 'V';     //vertical
    }
}

function returnStartPosition(boatLenght, orientation) {
    function returnRandomPosition() {
        return Math.round(Math.random().toFixed(digits) * Math.pow(10, digits));
    }

    let randomPosition, lastPosition;
    let rowFirstPosition, rowLastPosition;
    let columnFirstPosition, columnLastPosition;
    let positionFound = false;
    let positions = [];

    do {
        randomPosition = returnRandomPosition();
        if (orientation === 'H') {
            rowFirstPosition = Math.floor(randomPosition / tableWidth);
            rowLastPosition = Math.floor(((randomPosition + boatLenght) - 1) / tableWidth);
            lastPosition = randomPosition + boatLenght;
            if (rowFirstPosition === rowLastPosition && lastPosition <= (tableHeight * tableWidth) - 1) { //Verifica se está na mesma linha e se a ultima posição está dentro do tabuleiro
                positionFound = true;
                let pos = 0;
                for (let i = randomPosition; i < (randomPosition + boatLenght); i++) {
                    if (positionsOcuppied.includes(i)) {
                        positionFound = false;
                    } else {
                        positions[pos] = i;
                        pos++;
                    }
                }
            }
        } else {
            columnFirstPosition = Math.floor(randomPosition / tableHeight);
            columnLastPosition = Math.floor((randomPosition + (tableWidth * boatLenght)) / tableHeight) - 1; //contando a linha 0 como 1
            if (columnLastPosition < tableHeight) {
                positionFound = true;
                let pos = 0;
                for (let i = columnFirstPosition; i <= columnLastPosition; i++) {
                    if (positionsOcuppied.includes((randomPosition + (tableWidth * pos)))) {
                        positionFound = false;
                    } else {
                        positions[pos] = randomPosition + (tableWidth * pos);
                        pos++;
                    }
                }
            }
        }
    } while (positionFound === false) ;
    console.log("posições definidas " + positions + " " + orientation + "\nPosições ocupadas: " + positionsOcuppied);
    return positions;
}


function renderTable() {
    let html = '<table>';

    for (let row = 0; row < tableHeight; row++) {
        html += '<tr>';

        for (let column = 0; column < tableWidth; column++) {
            const spaceIndex = column + (row * tableWidth);

            const object = checkColorOfIndex(spaceIndex);

            if (debugg === true) {
                html += '<td>';
                html += `<div class=${object}> ${spaceIndex}`;
                html += `<input type="radio" name="positions" value="${spaceIndex}">`
                html += `</div>`;
                html += '</td>';
            } else {
                html += '<td>';
                html += `<div class=${object}> ${spaceIndex}`;
                html += `<input type="radio" name="positions" value="${spaceIndex}">`
                html += `</div>`;
                html += '</td>';
            }
        }
        html += '</tr>';
    }
    html += '</table>';
    document.querySelector('#tableCanvas').innerHTML = html;

}

function checkColorOfIndex(spaceIndex) {
    switch (tableArray[spaceIndex]) {
        case 'W':
            return 'water';
        case 'B':
            if(debugg) {
                return 'boat';
            }else{
                return 'water';
            }
        case 'S':
            return 'shot';
        case 'F':
            return 'fire';
    }
}