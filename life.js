var log = require('./createLog'),
    EventEmitter = require('events').EventEmitter,
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
    if(Math.random() * 10 < 1){
        attack(life1, life2);
    }
}

function Life(parent){
    this.parent = parent;
}
Life.prototype = Object.create(EventEmitter.prototype);
Life.prototype.constructor = Life;
Life.prototype.begin = function() {
    this.id = this.simulation.totalLives;
    log('new life: ' + this.id);
    this.entity = createMutant(this.parent);
    this.entity.life = this;
    this.birthDate = this.lastBirthTime = new Date();
};
Life.prototype.live = function() {
    var now = new Date(),
        life = this,
        entity = this.entity;

    if(now - life.birthDate > entity.lifespan){
        life.die('Old age');
        return;
    }

    considerAttack(life, life.simulation.getRandomLife());

    if(now - life.lastBirthTime > entity.breedTime){
        try{
            entity.breed();
            life.lastBirthTime = now;
        }catch(e){
            //console.log(e);
            life.die('During birth');
        }
    }

    this.simulation.updateStats(this);
};
Life.prototype.die = function(reason){
    log('entity died: ' + reason);
    this.deathDate = new Date();
    this.dead = true;
    this.emit('death');
};

module.exports = Life;