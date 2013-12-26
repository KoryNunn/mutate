var log = require('./createLog'),
    EventEmitter = require('events').EventEmitter,
    mutate = require('./mutate'),
    createMutant = require('./createMutant');

function attack(life1, life2){
    life2.entity.health -= life1.entity.strength;
    if(life2.entity.health<=0){
        life2.die('Killed by ' + life1.id);
    }else{
        considerAttack(life2, life1);
    }
}

function considerAttack(life1, life2){
    // Don't attack yourself..
    if(life1 === life2){
        return;
    }
    if(Math.random() * 100 < 1){
        attack(life1, life2);
    }
}

function Life(parent){
    this.parent = parent;
    this.children = [];
}
Life.prototype = Object.create(EventEmitter.prototype);
Life.prototype.constructor = Life;
Life.prototype.begin = function() {
    this.id = this.simulation.totalLives;
    log('new life: ' + this.id);
    this.entity = createMutant(this.parent && this.parent.entity);
    this.birthDate = this.lastBreedTime = new Date();
};
Life.prototype.live = function() {
    var now = Date.now(),
        life = this,
        entity = this.entity;

    // Age degradation
    life.entity = mutate(life.entity, 1000000);

    try{
        life.entity.alive()
    }catch(error){
        life.die('Old age.');
    }

    considerAttack(life, life.simulation.getRandomLife());

    if(now - life.lastBreedTime > entity.breedTime){
        if(entity.breed){
            var child = entity.breed(life);

            if(!child){
                life.die('During birth');
            }else{
                life.simulation.addLife(child);

                life.children.push(child);
            }
        }

        life.lastBreedTime = now;
    }

    this.simulation.updateStats(this);
};
Life.prototype.die = function(reason){
    log('entity died: ' + reason);
    this.deathDate = new Date();
    this.lifespan = this.deathDate - this.birthDate;
    this.dead = true;
    this.emit('death');
};

module.exports = Life;