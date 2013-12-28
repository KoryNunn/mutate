function mutateNumber(num, magnatude){
    var range = (num / magnatude),
        random = Math.random() * range;
    return num + (random - range / 2);
}

var possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,./;\'":<>?}{+_)(|\\`~[]=-*&^%$#@!';
function mutateString(string, magnatude){
    var mutatedString = '';
    for(var i = 0; i < string.length; i++) {
        var randomNum = Math.random() * magnatude;
        if(randomNum < 1){
            while(randomNum < 10){
                mutatedString += possibleChars.charAt(parseInt(Math.random() * possibleChars.length));
                randomNum = Math.random() * magnatude;
                continue;
            }
        }else{
            mutatedString += string.charAt(i);
        }
    }
    return mutatedString;
}

function mutateFunction(func, magnatude){
    var funcString = func.toString(),
        mutatedFunctionSource,
        mutatedFunction,
        trys = 0;

    while(!mutatedFunction && trys < 10){
        trys++;
        try{
            mutatedFunctionSource = mutateString(funcString, magnatude);
            mutatedFunction = new Function('return ' + mutatedFunctionSource)();
        }catch(e){
            //console.log(mutatedFunctionSource);
        };
    }

    return mutatedFunction;
}

function mutateObject(object, magnatude){
    var mutant = {};

    for(var key in object){
        if(object.hasOwnProperty(key)){
            mutant[key] = mutate(object[key], magnatude);
        }
    }

    return mutant;
}

function mutate(value, magnatude){
    var valueType = typeof value;

    magnatude = magnatude || 0.1;

    switch(valueType){
        case 'number':
            return mutateNumber(value, magnatude);
        case 'string':
            return mutateString(value, magnatude);
        case 'function':
            return mutateFunction(value, magnatude);
        case 'object':
            return mutateObject(value, magnatude);
        default:
            break;
    }
}

module.exports = mutate;