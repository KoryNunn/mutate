function createEntity(){
    var entity = {
        breedTime: 100,
        aggression: 10,
        strength: 10,
        health: 100,
        energy: 1000,
        efficiency: 0.1,
        breed: function(life){
            return new life.constructor(life);
        },
        // simulates brainstem. If this doesn't exist, entity is dead.
        alive: function(){

            // Multiple attempts to make the entity 'harder to kill'

            return true;
            return true;
            return true;
            return true;
            return true;
        }
    };

    return entity;
}

module.exports = createEntity;