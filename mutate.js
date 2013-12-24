var internalLog = [];
function log(message){
    internalLog.push(message);
}


function createEntity(){
    var entity = {
        children: [],
        lifespan: 1000,
        breedTime: 900,
        strength: 10,
        health: 100
    };
    entity.breed = function(){
        var child = new Life(this);
        this.children.push(child);
        child.live();
    }

    return entity;
}

function mutateNumber(num){
    var random = Math.random() * (num / 100);
    return num + (random - random / 2);
}

var possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function mutateString(string){
    var mutatedString = '';
    for(var i = 0; i < string.length; i++) {
        var randomNum = Math.random() * 100;
        if(randomNum > 0  && randomNum < 1){
            mutatedString += possibleChars.charAt(parseInt(Math.random() * possibleChars.length));
            continue;
        }
        mutatedString += string.charAt(i);
    }
    return mutatedString;
}

function mutateFunction(func, entity){
    var funcString = func.toString(),
        mutatedFunction,
        trys = 0;

    while(!mutatedFunction && trys < 1000){
        trys++;
        try{
            mutatedFunction = new Function('Life', 'return ' + mutateString(funcString))(Life);
        }catch(error){}
    }

    return mutatedFunction;
}

function createMutant(parent){
    parent = parent || createEntity();
    var mutant = {};

    for(var key in parent){
        var prop = parent[key],
            valueType = typeof prop;

        switch(valueType){
            case 'number':
                mutant[key] = mutateNumber(prop);
                break;
            case 'string':
                mutant[key] = mutateString(prop);
                break;
            case 'function':
                mutant[key] = mutateFunction(prop);
                break;
            case 'object':
                mutant[key] = new prop.__proto__.constructor();
                break;
            default:
                break;
        }
    }

    return mutant;
}

var stats = {
    longestLife: 0,
    mostChildren: 0
};

    function updateStats(life){
        debugger;
    stats.longestLife = Math.max(stats.longestLife, life.deathDate - life.birthDate);
    stats.mostChildren = Math.max(stats.mostChildren, life.entity.children.length);
}

function attack(life1, life2){
    life2.entity.health-= life1.entity.strength;
    if(life2.entity.health<=0){
        life2.die('Killed by ' + life1.id);
    }else{
        considerAttack(life2, life1);
    }
}

function considerAttack(life1, life2){
    if(Math.random() * 10 < 1){
        attack(life1, life2);
    }
}

function getRandomLife(){
    return lives[Math.floor(Math.random() * lives.length)];
}

var lives = [];

function Life(parent){
    Life.totalLives++;
    this.id = Life.totalLives;
    lives.push(this);
    this.entity = createMutant(parent);
    this.birthDate = this.lastBirthTime = new Date();
    log('new life: ' + this.id);
}
Life.totalLives = 0;
Life.prototype.live = function() {
    var now = new Date(),
        life = this,
        entity = this.entity;

    considerAttack(life, getRandomLife());

    if(now - life.lastBirthTime > entity.breedTime){
        try{
            entity.breed();
            life.lastBirthTime = now;
        }catch(e){
            life.die('During birth');
        }
    }

    if(now - life.birthDate > entity.lifespan){
        life.die('Old age');
    }
};
Life.prototype.die = function(reason){
    log('entity died: ' + reason);
    this.deathDate = new Date();
    this.dead = true;
    lives.splice(lives.indexOf(this), 0);
    updateStats(this);
};

var life = new Life();

setInterval(function(){
    if(!lives.length){
        console.log('all life dead');
    }
    for(var i = 0; i < lives.length; i++) {
        lives[i].live();
    }
}, 100);

setInterval(function(){
    console.log(lives.length);
    console.log(internalLog.slice(-10).join('\n'));
    console.log(JSON.stringify(stats));
},1000);