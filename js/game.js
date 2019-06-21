let gameScreen = document.getElementById('gameScreen'); //main container
let blastImage = document.createElement('img');
let shockwaveImage = document.createElement('img');
let potionImage = document.createElement('img');
let shieldImage = document.createElement('img');
blastImage.src = 'images/explosion.png';
blastImage.id = 'blast';
shockwaveImage.src = 'images/shockwave.png';
shockwaveImage.id = 'shockwave';
potionImage.src = 'images/potion.png';
potionImage.id = 'potion';
shieldImage.src = 'images/shield.png';
shieldImage.id = 'shield';
deadSrc = 'images/dead.png';

let selectedChar;
let characterCards = ``;
let characterIndex = 0;
let disable = true; //will be used to disable attack buttons.
// let disableEnemyPotion = false; //will be used to disable potion buttons.
let disablePlayerPotion = false; //will be used to disable potion buttons.
let disableEnemySpecial = false; // will be used to disable special attacks
let disablePlayerSpecial = false;// will be used to disable special attacks
let enemyDrankPotion = false; 

gameScreen.innerHTML = initGame();

createCharacters();

function initGame(){
    let screen = `
    <div class="col-8 text-center justify-content-center" style="margin:15px">
        <div class="text-center instrDiv">
            <h1>Welcome to Nadav, Reut and Rotem's Game</h1>
            <br>
            <h4>Play with the console open for instructions</h4>
            <br>
            <h3>about the game</h3>
            <p> This is a basic combat character level based game.</p>
            <p> You will choose a character and an enemy and fight. </p>
            <p> Each win will give you exp points. when you will reach 100 exp your character will level up</p>
            <p> Each level up will upgrade the character stats.</p>
            <p> You can always change you character and your enemies. The lvl and stats will remain always.</p>
            <p> Each player will attack in his turn, the options are: attack, drink potion and special attack.</p>
            <p> Drink potion will increase your Health points. You can use that only once in a battle.</p>
            <p> Special attack is stronger than normal attack. You can also use that only once in a battle.</p>
            <p> You can restart the game by writing the command "localStorage.clear()" in the console.</p>
            <button class="btn btn-success" onclick="renderCards()" style="margin:10px">Start the game</button>
        </div>
    </div>
    `;
    return screen;
}

function createCharacters(){
    if(localStorage['charsObjArr']){
        gotCharacters = JSON.parse(localStorage['charsObjArr']);
    } else{
        gotCharacters = characters;
        for(let char of gotCharacters){
            char.index = 0;
            char.LVL = 1;
            char.ATK = Math.round(Math.random()*100);
            char.DEF = Math.round(Math.random()*100);
            char.HEALTH = Math.round(Math.random()*300);
            char.EXP = 0;
            //upgrade a little the stats
            char.HEALTH < 140 ? char.HEALTH += 45 : 'do nothing';
            char.ATK < 45 ? char.ATK += 20 : 'do nothing';
            char.DEF < 45 ? char.DEF += 25 : 'do nothing';

            //check if they are orphan bitches
            if(char.houseName){
                char.FAM = char.houseName;
            } else {
                char.FAM = "orphan bastard";
            }
            if(!char.characterImageFull){
                char.characterImageFull = 'remove';
            }
            gotCharacters = gotCharacters.filter(char => char.characterImageFull !== 'remove'); //filter the cards without image
    
        
        }
        for(let i = 0; i < gotCharacters.length ; i++){
            gotCharacters[i].index = i;
        }
        localStorage['charsObjArr'] = JSON.stringify(gotCharacters);
    }
    characterIndex = 0; 
}

function createCards(){
    document.getElementsByTagName('body')[0].style.backgroundImage = "url(./images/wallpaper.png)"
    characterIndex = 0;
    characterCards = ``;
    for(let char of gotCharacters){ //init characterCards with additional DATA such as att, def, hp..
        characterCards += `
            <div id="${characterIndex}" class="col-8 col-sm-3 col-lg-2 myCard card text-center" onClick="choosePlayer(this)">
                <div class="card-top">
                    <img class="card-img-top img-fluid" src="${char.characterImageFull}" onError="this.src = 'images/unknown.jpg'"  alt="Card image" />
                </div>
                <div class="card-body">
                    <h6>Name: ${char.characterName}</h6>
                    <h6>Family: ${char.FAM}</h6>
                    <h6>LVL: ${char.LVL}</h6>
                    <h6>HEALTH: ${char.HEALTH}</h6>
                    <h6>ATK points: ${char.ATK}</h6>
                    <h6>DEF points: ${char.DEF}</h6>
                </div>    
            </div>
        `;
        characterIndex++;
    }
    return characterCards;
}

function renderCards(){
    disable = true;
    disableEnemyPotion = false;
    disablePlayerPotion = false;
    if(enemyBeenChosen() && playerBeenChosen() ){
        gameScreen.innerHTML = renderCurrentGame();
        console.log('Alright lets get to battle!! press "Start play" to start.')
    } else if(enemyBeenChosen()){
        gameScreen.innerHTML = createCards();
    }else if(playerBeenChosen()){
        chooseCard();
        console.log("I'm your enemy. If youre afraid you can run by seleting other opponent");
    } else{
        gameScreen.innerHTML = createCards();
        console.log('Please select a character from the cards');
    }
}

function choosePlayer(charCard){
    document.getElementsByTagName('body')[0].style.backgroundImage = "url(./images/knee.png)"
    selectedChar = gotCharacters[parseInt(charCard.id)];
    let selectedPlayerCard = `
        <div class="col-3 card text-center myCard">
            <div class="card-top">
                <img class="card-img-top img-fluid" src="${selectedChar.characterImageFull}" onError="this.src = 'images/unknown.jpg'" alt="Card image" />
            </div>
            <div class="card-body">
                <h4>Name: ${selectedChar.characterName}</h4>
                <h4>Family: ${selectedChar.FAM}</h4>
                <h4>LVL: ${selectedChar.LVL}</h4>
                <h4>HEALTH: ${selectedChar.HEALTH}</h4>
                <h4>ATK points: ${selectedChar.ATK}</h4>
                <h4>DEF points: ${selectedChar.DEF}</h4>
            </div>    
        </div>
        <div class="col-10 text-center">
            <button class="btn btn-primary" onclick="chooseCard()" style="width:30%">Choose Card</button>
        </div>
        <div class="col-10 text-center">
            <button class="btn btn-warning" onclick="showCards()" style="width:30%">Return</button>
        </div>`;
    gameScreen.innerHTML = selectedPlayerCard;
    console.log('to continue press Choose card. you can return to the cards list')
}

function renderCurrentGame(){
    document.getElementsByTagName('body')[0].style.backgroundImage = "url(./images/queen.png)"
    enemyObj = JSON.parse(localStorage['enemy']);
    playerChosen = JSON.parse(localStorage['selectedChar']);
    let enemyCard = `
    <div class="card myCard text-center col-7 col-sm-2">
        <div style="width:100%; height:200px; margin: 0 auto;" class="text-center"><img src="${enemyObj.characterImageFull}" class="img-fluid" onError="this.src = 'images/unknown.jpg'"  alt="img"/></div>
        <h3 style="color:orange">Your enemy</h2>
        <h6>Name: ${enemyObj.characterName}</h6>
        <h6>Family: ${enemyObj.FAM}</h6>
        <h6>LVL: ${enemyObj.LVL}</h6>
        <h6>EXP: ${enemyObj.EXP}</h6>
        <h6>ATK: ${enemyObj.ATK}</h6>
        <h6>DEF: ${enemyObj.DEF}</h6>
        <h6>Health: ${enemyObj.HEALTH}</h6>
        <button onclick="changeEnemy()" class="btn btn-primary">change Enemy</button>
    </div>
    <div class="col-8 text-center">
        <button onclick="startPlay()" class="btn btn-lg btn-success playbtn">Start Play</button>
    </div>
    <div class="col-8 text-center">
        <button onclick="clearGame()" class="btn btn-danger newgamebtn">New Game</button>
    </div>`;
    let choosenPlayer = `
    <div class="card myCard text-center col-7 col-sm-2">
        <div style="width:100%; height:200px; margin: 0 auto;" class="text-center"><img src="${playerChosen.characterImageFull}" onError="this.src = 'images/unknown.jpg'" class="img-fluid" alt="img"/></div>
        <h3 style="color:green">Your servent</h2>
        <h6>Name: ${playerChosen.characterName}</h6>
        <h6>Family: ${playerChosen.FAM}</h6>
        <h6>LVL: ${playerChosen.LVL}</h6>
        <h6>EXP: ${playerChosen.EXP}</h6>
        <h6>ATK: ${playerChosen.ATK}</h6>
        <h6>DEF: ${playerChosen.DEF}</h6>
        <h6>Health: ${playerChosen.HEALTH}</h6>
        <button onclick="changePlayer()" class="btn btn-primary">change player</button>
    </div>`;
    return choosenPlayer + enemyCard;
}

function chooseCard(){
    document.getElementsByTagName('body')[0].style.backgroundImage = "url(./images/dragon.png)";
    if(!localStorage['selectedChar']){
        localStorage['selectedChar'] = JSON.stringify(selectedChar);
        console.log(`playerChosen been selected - ${JSON.parse(localStorage['selectedChar']).characterName}`);
        console.log(`Select Enemy from the dropdown list`);
    }
    if(enemyBeenChosen()){
        gameScreen.innerHTML = renderCurrentGame();
    } else {
        enemyObj = gotCharacters[Math.round(Math.random()*230)]
        page = `<div class="col-3 text-center justify-content-center">
                    <div class="card myCard text-center">
                        <div style="width:100%; height:200px; margin: 0 auto;" class="text-center"><img src="${enemyObj.characterImageFull}" onError="this.src = 'images/unknown.jpg'" class="img-fluid" alt="img"/></div>
                        <h4 style="color:#e58d00">Fight me!</h4>
                        <h5>Name: ${enemyObj.characterName}</h5>
                        <h5>Family: ${enemyObj.FAM}</h5>
                        <h5>LVL: ${enemyObj.LVL}</h5>
                        <h5>ATK: ${enemyObj.ATK}</h5>
                        <h5>DEF: ${enemyObj.DEF}</h5>
                        <h5>Health: ${enemyObj.HEALTH}</h5>
                    </div>
                </div>
                <div class="col-12 text-center justify-content-center">
                    <button class="btn btn-success" onclick="chooseEnemy()">Choose enemy</button>
                    <button class="btn btn-warning" onclick="showCards()">return to players cards</button>
                    <button class="btn btn-light" onclick="chooseCard()">Other opponent</button>
                </div>`;
        gameScreen.innerHTML = page;
    }
}

function showCards() {
    if(characterCards !== ''){
        gameScreen.innerHTML = characterCards;
    } else{
        gameScreen.innerHTML = createCards();
    }
    
}

function chooseEnemy(){
    enemy  = enemyObj;
    localStorage['enemy'] = JSON.stringify(enemy);
    renderCards();
}

function changePlayer() {
    localStorage.removeItem('selectedChar');
    renderCards();
};

function changeEnemy() {
    localStorage.removeItem('enemy');
    renderCards();
};

function enemyBeenChosen(){
    if(localStorage['enemy'])
       return localStorage['enemy'] !== "" ? true : false
    return false;
};

function playerBeenChosen() {
    if(localStorage['selectedChar'])
       return localStorage['selectedChar'] !== "" ? true : false;
    return false;
    
};

function clearGame(){
    disableEnemySpecial = false;
    disablePlayerSpecial = false;
    disableEnemyPotion = false;
    disableEnemyPotion = false;
    localStorage.removeItem('selectedChar');
    localStorage.removeItem('enemy');
    localStorage.removeItem('playerEnemy');
    localStorage.removeItem('playerCharacter');
    enemy = undefined;
    selectedChar = undefined;
    renderCards();
}

function startPlay(){
    disableEnemySpecial = false;
    disablePlayerSpecial = false;
    disableEnemyPotion = false;
    disableEnemyPotion = false;
    playerCharacter = JSON.parse(localStorage['selectedChar']);
    playerEnemy = JSON.parse(localStorage['enemy']);
    localStorage['playerCharacter'] = JSON.stringify(playerCharacter);
    localStorage['playerEnemy'] = JSON.stringify(playerEnemy);
    enemyMaxHp = playerEnemy.HEALTH;
    playerMaxHp = playerCharacter.HEALTH;
    gameScreen.innerHTML = createFightDiv(playerCharacter, playerEnemy);

}

function createFightDiv(player, enemy){ 
    document.getElementsByTagName('body')[0].style.backgroundImage = "url(https://i.pinimg.com/originals/a6/a3/b9/a6a3b946edd24c5a9399b49b13681ff6.jpg)";
    let arenaDiv = `
        <div class="container arena">
            <div class="row justify-content-center text-center">
                <button class="btn btn-light" onclick="renderCards()">Return</button> 
            </div>
            <div class="row fightRow justify-content-between">
                <div id="playerCol" class="col-3">
                    <div id="playerCard" class="card fightCard justify-content-center text-center">
                        <div style="width:100%; height:200px; margin: 0 auto;" class="text-center justify-content-center">
                            <img id="playerImage" src="${player.characterImageFull}" onError="this.src = 'images/unknown.jpg'"  class="imgFight img-fluid" alt="img"/>
                        </div>
                        <h6>Name: ${player.characterName}</h6>
                        <h6>Family: ${player.FAM}</h6>
                        <h6>LVL: ${player.LVL}</h6>
                        <h6>EXP: ${player.EXP}</h6>
                        <h6>ATK: ${player.ATK}</h6>
                        <h6>DEF: ${player.DEF}</h6>
                        <h6>Health: <span id="playerhp" style="color:${player.HEALTH < 50 ? 'red':'black'}">${player.HEALTH}</span></h6>
                        <progress id="playerProgress" max="${playerMaxHp}" value="${player.HEALTH}">${player.HEALTH}</progress>
                    </div>
                </div>
                <div id="playerBlasted" class="col-3">
                </div>
                <div id="enemyBlasted" class="col-3">
                </div>
                <div id="enemyCol" class="col-3">
                    <div id="enemyCard" class="card fightCard justify-content-center text-center">
                        <div style="width:100%; height:200px; margin: 0 auto;" class="text-center justify-content-center">
                            <img id="enemyImage" src="${enemy.characterImageFull}" onError="this.src = 'images/unknown.jpg'" class="imgFight img-fluid" alt="img"/>
                        </div>
                        <h6>Name: ${enemy.characterName}</h6>
                        <h6>Family: ${enemy.FAM}</h6>
                        <h6>LVL: ${enemy.LVL}</h6>
                        <h6>EXP: ${enemy.EXP}</h6>
                        <h6>ATK: ${enemy.ATK}</h6>
                        <h6>DEF: ${enemy.DEF}</h6>
                        <h6>Health: <span id="enemyhp" style="color:${enemy.HEALTH < 50 ? 'red':'black'}">${enemy.HEALTH}</span></h6>
                        <progress id="enemyProgress" max="${enemyMaxHp}" value="${enemy.HEALTH}"></progress>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center text-center" style="border-radius:6px">
                <div style="min-height:40px; background-color:white;" class="col-12 text-center">
                    <h4 id="monitor"></h4>
                </div>
                <div style="min-height:40px; background-color:white;" class="col-12 text-center">
                    <button id="playerbtn" onclick="attack()" class="btn btn-primary"${!disable ? 'disabled':''}>Attack</button>
                    <button id="playerpotion" onclick="drinkPotion('player')" class="btn btn-danger" ${disablePlayerPotion || !disable ? 'disabled' : ''}>drink hp potion</button>
                    <button id="playerspecial" onclick="specialAttack('player')" class="btn btn-success" ${disablePlayerSpecial || !disable ? 'disabled' : ''}>Special Attack</button>
                </div>
            
            </div>
        </div>
    `;
    return arenaDiv;
}

function attack(){
    animateMe('playerCard');
    if( (playerCharacter.ATK/playerEnemy.DEF) + Math.random() < 0.7){
        document.getElementById('monitor').innerHTML = `${playerEnemy.characterName} blocked the attack`;
        document.getElementById('enemyBlasted').appendChild(shieldImage);
    }
    else if(Math.random() > 0.8){
        dmg = Math.floor((playerCharacter.ATK/playerEnemy.DEF)*Math.random()*35+10);
        playerEnemy.HEALTH -= dmg;
        document.getElementById('monitor').innerHTML = `${playerEnemy.characterName} been damaged ${dmg} points`;
        document.getElementById('enemyBlasted').appendChild(blastImage);
    } else{
        dmg = Math.floor((playerCharacter.ATK/playerEnemy.DEF)*Math.random()*25+12);
        playerEnemy.HEALTH -= dmg;
        document.getElementById('monitor').innerHTML = `${playerEnemy.characterName} been damaged ${dmg} points`;
        document.getElementById('enemyBlasted').appendChild(blastImage);
    }
    if(playerEnemy.HEALTH <= 0){
        playerEnemy.HEALTH = 0;
        playerCharacter.HEALTH = playerMaxHp;
        calculateExp(playerCharacter);
        setTimeout(renderCards, 3000);
    } else{
        enemyNextMove();
    }
}

function enemyAttack(){
    animateMe('enemyCard');
    if( (playerEnemy.ATK/playerCharacter.DEF) + Math.random() < 0.7){
        document.getElementById('monitor').innerHTML = `${playerCharacter.characterName} blocked the attack`;
        document.getElementById('playerBlasted').appendChild(shieldImage);
    }
    else if(Math.random() > 0.8){
        dmg = Math.floor((playerEnemy.ATK/playerCharacter.DEF)*Math.random()*25+5);
        playerCharacter.HEALTH -= dmg;
        document.getElementById('monitor').innerHTML = `${playerCharacter.characterName} been damaged ${dmg} points`;
        document.getElementById('playerBlasted').appendChild(blastImage);
    } else{
        dmg = Math.floor((playerEnemy.ATK/playerCharacter.DEF)*Math.random()*20+5);
        playerCharacter.HEALTH -= dmg;
        document.getElementById('monitor').innerHTML = `${playerCharacter.characterName} been damaged ${dmg} points`;
        document.getElementById('playerBlasted').appendChild(blastImage);
    }
    if(playerCharacter.HEALTH <= 0){
        playerCharacter.HEALTH = 0;
        setTimeout(renderCards, 3000);
        enemyDrankPotion = false;
    }
}

function specialAttack(someString){
    if(someString !== 'player'){
        disableEnemySpecial = true;
        animateMe('enemyCard');
        dmg = Math.floor((playerEnemy.ATK/playerCharacter.DEF)*Math.random()*60+20);
        playerCharacter.HEALTH -= dmg;
        document.getElementById('monitor').innerHTML = `${playerCharacter.characterName} been damaged ${dmg} points`;
        document.getElementById('playerBlasted').appendChild(shockwaveImage);
        if(playerCharacter.HEALTH <= 0){
            playerCharacter.HEALTH = 0;
            setTimeout(renderCards, 3000);
            enemyDrankPotion = false;
            disableEnemySpecial = false;
        }
    } else{
        disablePlayerSpecial = true;
        animateMe('playerCard');
        dmg = Math.floor((playerEnemy.ATK/playerCharacter.DEF)*Math.random()*60+30);
        playerEnemy.HEALTH -= dmg;
        document.getElementById('monitor').innerHTML = `${playerEnemy.characterName} been damaged ${dmg} points`;
        document.getElementById('enemyBlasted').appendChild(shockwaveImage);
        if(playerEnemy.HEALTH <= 0){
            playerEnemy.HEALTH = 0;
            playerCharacter.HEALTH = playerMaxHp;
            calculateExp(playerCharacter);
            setTimeout(() => document.getElementById('enemyImage').src = deadSrc , 500)
            setTimeout(renderCards, 3000);
        }else{
            enemyNextMove();
        }
    }
}

function animateMe(divId){
    disable = !disable
    pos = 50;
    card = document.getElementById(divId);
    if(divId === 'playerCard'){
        hpTitle = document.getElementById('enemyhp');
        hpTitle.style.color = "red";
        hpTitle.style.fontWeight = 700;
    } else{
        hpTitle = document.getElementById('playerhp');
        hpTitle.style.color = "red";
        hpTitle.style.fontWeight = 700;
    }
    id = setInterval(frame, 0.00005);
    function frame(){
        if (pos === 250) {
            clearInterval(id);
            gameScreen.innerHTML = createFightDiv(playerCharacter, playerEnemy);
            if(playerCharacter.HEALTH <= 0){
                document.getElementById('monitor').innerHTML = `You Lost noob!`;
                document.getElementById('playerImage').src = deadSrc;
            } else if(playerEnemy.HEALTH <= 0){
                document.getElementById('monitor').innerHTML = `You Won!`;
                document.getElementById('enemyImage').src = deadSrc
            }
        } else {
            pos++;
            if(divId === 'playerCard'){
                card.style.left = pos + "px";
            } else{
                card.style.right = pos + "px";
            }
        }
    }                 
}   

function drinkPotion(someString){
    if(someString !== 'player'){
        if(playerEnemy.HEALTH + 50 > enemyMaxHp){
            playerEnemy.HEALTH = enemyMaxHp;
            disableEnemyPotion = true;
            disable = !disable;
            renderFightDiv();
            document.getElementById('enemyBlasted').appendChild(potionImage);
            setTimeout(()=> document.getElementById('enemyBlasted').removeChild(potionImage), 900);
            document.getElementById('monitor').innerHTML = `${playerEnemy.characterName} recovered full health`;
        } else{
            playerEnemy.HEALTH += 50;
            disableEnemyPotion = true;
            disable = !disable;
            renderFightDiv();
            document.getElementById('enemyBlasted').appendChild(potionImage);
            setTimeout(()=> document.getElementById('enemyBlasted').removeChild(potionImage), 900);
            document.getElementById('monitor').innerHTML = `${playerEnemy.characterName} recovered 50 health`;
        }
    } else {
        if(playerCharacter.HEALTH + 50 > playerMaxHp){
            playerCharacter.HEALTH = playerMaxHp;
            disablePlayerPotion = true;
            disable = !disable;
            setTimeout(enemyNextMove,900);
            renderFightDiv();
            document.getElementById('playerBlasted').appendChild(potionImage);
            setTimeout(()=> document.getElementById('playerBlasted').removeChild(potionImage), 900);
            document.getElementById('monitor').innerHTML = `${playerCharacter.characterName} recovered full health`;

        } else{
            playerCharacter.HEALTH += 50;
            disablePlayerPotion = true;
            disable = !disable;
            setTimeout(enemyNextMove,900);
            renderFightDiv()
            document.getElementById('playerBlasted').appendChild(potionImage);
            setTimeout(()=> document.getElementById('playerBlasted').removeChild(potionImage), 900);
            document.getElementById('monitor').innerHTML = `${playerCharacter.characterName} recovered 50 health`;
        }
    }
    function renderFightDiv(){
        gameScreen.innerHTML = createFightDiv(playerCharacter, playerEnemy);
    }
}

function enemyNextMove(){
    if(playerEnemy.HEALTH < 50 && !enemyDrankPotion){
        setTimeout(drinkPotion, 1000);
        enemyDrankPotion = true;
    }else if(Math.random() > 0.75 && !disableEnemySpecial){
        setTimeout(specialAttack, 1000);
        console.log('enemy special attack!!!')
        disableEnemySpecial = true;
    }else{
        setTimeout(enemyAttack, 1000);
    }
}

function calculateExp(player){  
    enemyDrankPotion = false;
    disableEnemySpecial = false;
    player.EXP += Math.floor(Math.random()*100);
    if (player.EXP >= 100){
        player.LVL++;
        player.ATK += Math.floor(Math.random()*50);
        player.DEF += Math.floor(Math.random()*50);
        player.HEALTH += Math.floor(Math.random()*50);
        player.EXP = player.EXP - 100;
    }
    gotCharacters[player.index] = player;
    localStorage['selectedChar'] = JSON.stringify(player);
    localStorage['charsObjArr'] = JSON.stringify(gotCharacters);
}