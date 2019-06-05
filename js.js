let tableArray = [];
let tableAiShots = [];
let tableAiHit = [];
let tableAiShotPredict = [];
let positionsOcuppied = [];
let tableHeight = 15;
let tableWidth = 15;
let digits = ((tableWidth * tableHeight) - 1).toString().length;
const debugg = true;
const lenghtBoats = [2, 3, 5];
let partsOfBoats = 0;
let GameOver = false;
for(let i = 0; i < lenghtBoats.length; i++){
    partsOfBoats += lenghtBoats[i];
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
        GameOver = true;
    }
}

function shotAi(){

    let shotPosition;

    if(tableAiShotPredict.length === 0) {
        do {
            shotPosition = returnRandomPosition();
        } while (tableAiShots.includes(shotPosition) || shotPosition > (tableWidth * tableHeight)-1);
    }else{
        do {
            shotPosition = tableAiShotPredict.shift();
        } while (tableAiShots.includes(shotPosition));
    }

    console.log("Atirando em: " + shotPosition);
    tableAiShots.push(shotPosition);

    if (tableArray[shotPosition] === 'B'){
        tableArray[shotPosition] = 'F';
        tableAiHit.push(shotPosition);
        shotPredict(shotPosition);
    }else{
        tableArray[shotPosition] = 'S';
    }

    renderTable();
    checkWinner();

}

function shotPredict(position){
    //Se a linha de posição for a mesma de posição + 1
    if(Math.floor((position+1)/tableWidth) === Math.floor(position/tableWidth)){
        tableAiShotPredict.push(position+1);
    }

    //Se a linha de posição for a mesma de posição - 1
    if(Math.floor((position-1)/tableWidth) === Math.floor(position/tableWidth)){
        tableAiShotPredict.push(position-1);
    }

    //Se a posição + uma linha estiver dentro do tabuleiro
    if((position + tableWidth) < tableHeight*tableWidth){
        tableAiShotPredict.push(position+tableWidth);
    }

    //Se a posição - uma linha estiver dentro do tabuleiro
    if(position-tableWidth >= 0){
        tableAiShotPredict.push(position-tableWidth);
    }

    // if(debugg){
    //     insertPredictInTable();
    // }
}

function insertPredictInTable(){
    for(let i = 0; i < tableAiShotPredict.length; i++){
        tableArray[tableAiShotPredict[i]] = 'P';
    }
}

function autoPlay() {

    function sleep(milliseconds) {
        let start = new Date().getTime();
        for (let i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }

    shotAi();
    sleep(1000);
    if(!GameOver)
        autoPlay()


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
            console.log("Horizontal");
            return 'H';     //horizontal
        case 1:
            console.log("Vertical");
            return 'V';     //vertical
    }
}

function returnRandomPosition() {
    return Math.round(Math.random().toFixed(digits) * Math.pow(10, digits));
}

function returnStartPosition(boatLenght, orientation) {


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
    console.log("posições definidas " + positions + "\nPosições ocupadas: " + positionsOcuppied);
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