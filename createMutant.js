var createEntity = require('./createEntity');
    mutate = require('./mutate');

function createMutant(parent){
    parent = parent || createEntity();
    return mutate(parent, 1000);
}

module.exports = createMutant;