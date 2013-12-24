var internalLog = [];
function log(message){
    internalLog.push(message);
}


function createEntity(){
    var entity = {
        children: [],
        lifespan: 1000,
        breedTime: 100
    }
    entity.breed = function(){
        var child = new Life(this);
        this.children.push(child);
        child.live();
    }

    return entity;
}

function mutateNumber(num){
    var random = Math.random() / 10;
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
        mutatedFunction;
    while(!mutatedFunction){
        try{
            mutatedFunction = new Function('Life', 'return ' + mutateString(funcString))(Life);
        }catch(error){}
    }
    return mutatedFunction;
}

function mutate(entity){
    var mutant = {};

    for(var key in entity){
        var prop = entity[key],
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

function createMutant(parent){
    var parent = parent || createEntity();

    return mutate(parent);
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

function Life(parent){
    Life.totalLives++;
    Life.lives++;
    this.id = Life.totalLives;
    this.entity = createMutant(parent);
    this.birthDate = new Date();
    log('new life: ' + this.id);
}
Life.lives = 0;
Life.totalLives = 0;
Life.prototype.live = function() {
    var life = this,
        entity = this.entity;

    setTimeout(function(){
        try{
            entity.breed();
        }catch(e){
            life.die('During birth');
        }

        if(new Date() - entity.birthDate > entity.lifespan){
            life.die('Old age');
        }
        if(!life.dead){
            life.live();
        }
    }, entity.breedTime);
};
Life.prototype.die = function(reason){
    log('entity died: ' + reason);
    this.deathDate = new Date();
    this.dead = true;
    Life.lives--;
    updateStats(this);
};

var life = new Life();

life.live();

setInterval(function(){
    console.log(Life.lives);
    console.log(internalLog.slice(-10).join('\n'));
    console.log(JSON.stringify(stats));
},1000);