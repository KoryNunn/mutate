var log = require('./createLog'),
    EventEmitter = require('events').EventEmitter,
    mutate = require('./mutate'),
    createMutant = require('./createMutant');

function attack(life1, life2){
    var aliveFunctionSource = life1.entity.attack(life2.entity.alive.toString());
    try{
        life2.entity.alive = new Function('return ' + aliveFunctionSource)();
        if(!life2.alive()){
            life2.die('Killed by', life1.id);
        }
    }catch(error){
        life2.die('Killed', life1.id);
    }
    considerAttack(life2, life1);
}

function considerAttack(life1, life2){
    // Don't attack yourself..
    if(life1 === life2 || life1.parent === life2 || life2.parent === life1){
        return;
    }
    if(Math.random() * (1000000 / life1.simulation.lives.length / life1.entity.aggression) < 1){

        life1.useEnergy(life1.entity.fightEnergy);
        life2.useEnergy(life2.entity.fightEnergy);

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
Life.prototype.useEnergy = function(amount){
    this.entity.energy -= amount;
    if(this.entity.energy <= 0){
        this.die('Starvation');
    }
};
Life.prototype.eat = function(){
    var amount = this.simulation.getFood(this.entity.grazeSpeed);
    this.entity.energy += amount * this.entity.efficiency;
};
Life.prototype.live = function() {
    var now = Date.now(),
        life = this,
        entity = this.entity;


    // Age degradation
    life.entity.alive = mutate(life.entity.alive, 10000000);

    try{
        life.entity.alive()
    }catch(error){
        life.die('Old age.');
    }


    life.useEnergy(life.entity.idleEnergy);

    life.eat();

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
Life.prototype.die = function(reason, details){
    log('entity died: ' + reason);
    this.deathDate = new Date();
    this.lifespan = this.deathDate - this.birthDate;
    this.dead = true;
    this.emit('death', reason);
};

module.exports = Life;