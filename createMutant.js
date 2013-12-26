var createEntity = require('./createEntity');
    mutate = require('./mutate');

function createMutant(parent){
    parent = parent || createEntity();
    return mutate(parent);
}

module.exports = createMutant;