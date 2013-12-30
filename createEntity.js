function createEntity(){
    var entity = {
        breedTime: 200,
        aggression: 10,
        strength: 10,
        grazeSpeed: 10,
        energy: 1000,
        idleEnergy: 2,
        fightEnergy: 50,
        efficiency: 0.1,
        breed: function(life){
            return new life.constructor(life);
        },
        attack: function(code){
            var sourceChars = code.split('');

            sourceChars.splice(Math.random() * code.length, this.strength);

            return sourceChars.join('');
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