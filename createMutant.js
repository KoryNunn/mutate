var createEntity = require('./createEntity');

function mutateNumber(num){
    var random = Math.random() * (num / 100);
    return num + (random - random / 2);
}

var possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,./;\'":<>?}{+_)(|\\`~[]=-*&^%$#@!';
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

function mutateFunction(func){
    var funcString = func.toString(),
        mutatedFunction,
        trys = 0;

    while(!mutatedFunction && trys < 1000){
        trys++;
        try{
            mutatedFunction = new Function('return ' + mutateString(funcString))();
        }catch(error){
            //console.log(error);
        }
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
                mutant[key] = new prop.constructor();
                break;
            default:
                break;
        }
    }

    return mutant;
}

module.exports = createMutant;