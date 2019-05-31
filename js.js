let tableArray = [];
let positionsOcuppied = [];
let tableHeight = 15;
let tableWidth = 15;
let digits = ((tableWidth * tableHeight) - 1).toString().length;
console.log(digits);
const debugg = true;
const lenghtBoats = [1, 3, 5];

function start() {
    createTableStructure();
    insertBoat();
    renderTable();

}

function createTableStructure() {
    const numberOfSpaces = tableHeight * tableWidth;

    for (let i = 0; i < numberOfSpaces; i++) {
        tableArray[i] = 'W';                    //set with water
    }
    // console.log("Water: " + water + "\nBoat: " + boat + "\nShot: " + shot + "\nFire: " + fire);
}

function insertBoat() {
    for (let i = 0; i < lenghtBoats.length; i++) {
        const orientation = returnOrientation();
        const boatPositions = returnStartPosition(lenghtBoats[i], orientation);


        for(let j = 0; j < boatPositions.length; j++){
            tableArray[boatPositions[j]] = 'B';
            positionsOcuppied.push(tableArray[boatPositions[j]])
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
        return Math.round(Math.random().toFixed(digits) * Math.pow(10,digits));
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
            rowLastPosition = Math.floor(((randomPosition + boatLenght)-1) / tableWidth);
            lastPosition = randomPosition+boatLenght;
            if (rowFirstPosition === rowLastPosition && lastPosition <= (tableHeight*tableWidth)-1) { //Verifica se está na mesma linha e se a ultima posição está dentro do tabuleiro
                positionFound = true;
                let pos = 0;
                for (let i = randomPosition; i < (randomPosition+boatLenght); i++){
                    if(positionsOcuppied.includes(i)){
                        positionFound = false;
                    }
                    positions[pos] = i;
                    pos++;

                }
            }
        } else {
            columnFirstPosition = Math.floor(randomPosition / tableHeight);
            columnLastPosition = Math.floor((randomPosition + (tableWidth * boatLenght)) / tableHeight) - 1; //contando a linha 0 como 1
            if(columnLastPosition < tableHeight){
                positionFound = true
                let pos = 0;
                for (let i = columnFirstPosition; i <= columnLastPosition; i++){
                    if(positionsOcuppied.includes((randomPosition + (tableWidth*pos)))){
                        positionFound = false;
                    }
                    positions[pos] = randomPosition + (tableWidth*pos);
                    pos++;
                }
            }
        }
    } while (positionFound === false) ;
    console.log("posições definidas " + positions + orientation);
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
                html += `<div class=${object}> ${spaceIndex} </div>`;
                html += '</td>';
            } else {
                html += '<td>';
                html += `<div class=${object}> </div>`;
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
            return 'boat';
        case 'S':
            return 'shot';
        case 'F':
            return 'fire';
    }
}

start();