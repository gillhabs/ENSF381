window.onload = async() => {
    // Disables button while getting dictionary, displays "Loading..."
    document.getElementById("startagain").disabled = true;
    document.getElementById("startagain").innerHTML = "Loading..."
    // Get dictionary
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
    headers: {
    "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
    },
    });

    let json = await res.json();
    let{dictionary} = json;

    // Enables button again after dictionary is fetched, displays "Start Over"
    document.getElementById("startagain").disabled = false;
    document.getElementById("startagain").innerHTML = "Start Over"

   // Default state and variable initializaiton
    const state = {
        answer: dictionary[Number.parseInt(Math.random() * dictionary.length)],
        grid: Array(4)
            .fill()
            .map(() => Array(4).fill('')),
        currentRow: 0,
        currentCol: 0,
        reveal: 0,
        info: 0,
        dark: 0
    };


    // Draws grid outline and uses drawBox function for each box
    function drawGrid(container){
        const grid = document.createElement("div");
        grid.className = "grid";
        
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                drawBox(grid, i, j)
            }
        }
        container.appendChild(grid);
    }


    // Draws original boxes for each state[i][j]
    function drawBox(container, row, col, letter = ''){
        const box = document.createElement("div");
        box.className = "box";
        box.id = `box${row}${col}`;
        box.textContent = letter;

        container.appendChild(box);
        return box;
    }


    // Updates grud with values of text content
    function updateGrid() {
        for (let i = 0; i < state.grid.length; i++){
            for (let j = 0; j < state.grid[i].length; j++){
                const box = document.getElementById(`box${i}${j}`);
                box.textContent = state.grid[i][j];
            }
        }
    }


    // Uses onclick() to perform action when a button is pressed
    function registerKeyboardEvents() {
        document.body.onkeydown = (e) => {
            const key = e.key;

            if(key === "Enter"){
                if(state.currentCol === 4){
                    const word = getCurrentWord();
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0; 
                }
                else{
                    window.alert("You must complete the word first");
                }
            }

            if(key === "Backspace"){
                removeLetter();
            }

            if(isLetter(key)){
                addLetter(key);
            }

            updateGrid();
        };
    }


    // Get the word input into the boxes
    function getCurrentWord(){
        return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
    }

    // Change box colors based on the guess, displays win or lose screen if needed
    function revealWord(guess){
        const row = state.currentRow;

        for(let i = 0; i < 4; i++){
            const box = document.getElementById(`box${row}${i}`);
            const letter = box.textContent;

            if(letter.toUpperCase() === state.answer.word[i].toUpperCase()){
                box.classList.add("right");
                box.classList.add("black");
            }
            else if(state.answer.word.toUpperCase().includes(letter.toUpperCase())){
                box.classList.add("wrong");
                box.classList.add("black");
            }
            else{
                box.classList.add("empty");
                box.classList.add("white");
            }
        }

        const isWinner = state.answer.word.toUpperCase() === guess.toUpperCase();
        const isGameOver = state.currentRow === 3;

        if(isWinner){
            const win = document.getElementById("box3");
            win.innerHTML = `You guessed the word&nbsp<strong>${state.answer.word}</strong>&nbspcorrectly!`;
            win.classList.add("box3win");
            win.style.display = "";
            document.getElementById("winimage").style.display = "";
            document.getElementById("startagainimg").style.display = "";
            document.getElementById("game").style.display = "none";
        }

        else if (isGameOver) {
            const fail = document.getElementById("box3");
            fail.innerHTML = `You missed the word&nbsp<strong>${state.answer.word}</strong>&nbspand lost!`;
            fail.classList.add("box3fail");
            fail.style.display = "";
        }
    }

    // Checks if the key pressed is a letter
    function isLetter(key){
        return key.length === 1 && key.match(/[a-z]/i);
    }

    // Adds key inputted to box
    function addLetter(letter){
        if(state.currentCol === 4) return;
        state.grid[state.currentRow][state.currentCol] = letter;
        state.currentCol++;
    }

    // Deletes current key and moves cursor back one space
    function removeLetter(){
        if(state.currentCol === 0) return;
        state.grid[state.currentRow][state.currentCol - 1] = '';
        state.currentCol--;
    }

    // Start over button
    document.getElementById("startagain").addEventListener("click", startOver);
    document.getElementById("startagainimg").addEventListener("click", startOver);
    function startOver() {
        for (let i = 0; i < state.grid.length; i++){
            for (let j = 0; j < state.grid[i].length; j++){
                const box = document.getElementById(`box${i}${j}`);
                box.classList.remove("right");
                box.classList.remove("wrong");
                box.classList.remove("empty");
                box.classList.remove("white");
                box.classList.remove("black");
                state.grid[i][j] = '';
                box.textContent = '';
                removeLetter(box.textContent);

            }
        }
        state.currentCol = 0;
        state.currentRow = 0;
        state.answer = dictionary[Number.parseInt(Math.random() * dictionary.length)];
        const reset = document.getElementById("box3");
        reset.innerHTML = ``;
        reset.style.display = "none";
        reset.classList.remove("box3fail");
        reset.classList.remove("box3win");
        document.getElementById("winimage").style.display = "none";
        document.getElementById("startagainimg").style.display = "none";
        document.getElementById("game").style.display = "";
        if(state.dark === 1){
            for (let i = 0; i < state.grid.length; i++){
                for (let j = 0; j < state.grid[i].length; j++){
                    const box = document.getElementById(`box${i}${j}`);
                    box.classList.add("white");
                }
            }

        }

    }

    // Dark mode button
    document.getElementById("darkmode").addEventListener("click", darkMode);
    function darkMode() {
        if(state.dark === 0) { 
            state.dark = 1;
            for (let i = 0; i < state.grid.length; i++){
                for (let j = 0; j < state.grid[i].length; j++){
                    const box = document.getElementById(`box${i}${j}`);
                    const body = document.getElementById(`body`);
                    const darkbutton = document.getElementById("darkmode");
                    const hintbutton = document.getElementById("hint");
                    const infobutton = document.getElementById("info");
                    const headertext = document.getElementById("wordle");
                    const footertext = document.getElementById("copyright");
                    const info = document.getElementById("inforeveal");
                    box.classList.add("blackbackground");
                    box.classList.add("white");
                    box.classList.add("borderwhite");
                    body.classList.add("blackbackground");
                    darkbutton.classList.remove("headerbuttonlight");
                    darkbutton.classList.add("headerbuttondark");
                    hintbutton.classList.remove("headerbuttonlight");
                    hintbutton.classList.add("headerbuttondark");
                    infobutton.classList.remove("headerbuttonlight");
                    infobutton.classList.add("headerbuttondark");
                    headertext.classList.add("darktext");
                    footertext.classList.add("darktext");
                    info.classList.add("darktext");
                }
            }
        }
        else if(state.dark === 1) {
            state.dark = 0;
            for (let i = 0; i < state.grid.length; i++){
                for (let j = 0; j < state.grid[i].length; j++){
                    const box = document.getElementById(`box${i}${j}`);
                    const body = document.getElementById(`body`);
                    const darkbutton = document.getElementById("darkmode");
                    const hintbutton = document.getElementById("hint");
                    const infobutton = document.getElementById("info");
                    const headertext = document.getElementById("wordle");
                    const footertext = document.getElementById("copyright");
                    const info = document.getElementById("inforeveal");
                    box.classList.remove("blackbackground");
                    box.classList.remove("white");
                    box.classList.remove("borderwhite");
                    body.classList.remove("blackbackground");
                    darkbutton.classList.add("headerbuttonlight");
                    darkbutton.classList.remove("headerbuttondark");
                    hintbutton.classList.add("headerbuttonlight");
                    hintbutton.classList.remove("headerbuttondark");
                    infobutton.classList.add("headerbuttonlight");
                    infobutton.classList.remove("headerbuttondark");
                    headertext.classList.remove("darktext");
                    footertext.classList.remove("darktext");
                    info.classList.remove("darktext");
                }
            }
        }
    }

    // Hint button
    document.getElementById("hint").addEventListener("click", hintReveal);
    function hintReveal() {
        if(state.reveal === 0){
            const hinting = document.getElementById("box3");
            hinting.innerHTML = `<em>Hint</em>: ${state.answer.hint}.`;
            hinting.style.display = "";
            hinting.classList.add("box3hint");
            state.reveal = 1;
        }
        else if(state.reveal === 1){
            const hinting = document.getElementById("box3");
            hinting.innerHTML = ``;
            hinting.style.display = "none";
            hinting.classList.remove("box3hint");
            state.reveal = 0;
        }
    }

    // Info button
    document.getElementById("info").addEventListener("click", infoReveal);
    function infoReveal() {
        if(state.info === 0){
            document.getElementById("inforeveal").style.display = "";
            state.info = 1;
        }
        else if(state.info === 1){
            document.getElementById("inforeveal").style.display = "none";
            state.info = 0;
        }
    }


    // Draws grid and starts the game, registers onclick events
    function startup(){
        const game = document.getElementById("game");
        drawGrid(game);

        registerKeyboardEvents();

    }

    startup();
}

