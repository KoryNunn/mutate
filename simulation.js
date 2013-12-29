var EventEmitter = require('events').EventEmitter;
function Simulation(){
    this.stats = {
        mostLife: 0,
        longestLife: 0,
        mostChildren: 0,
        fastestBreeder: Number.MAX_VALUE,
        highestStrength: 0,
        highestAggression: 0,
        deaths: {},
        ticks: 0
    };

    this.lives = [];
}
Simulation.prototype = Object.create(EventEmitter.prototype);
Simulation.constructor = Simulation;
Simulation.prototype.food = 100000;
Simulation.prototype.maxFood = 100000;
Simulation.prototype.totalLives = 0;
Simulation.prototype.itterater = 0;
Simulation.prototype.tick = function(){
    var simulation = this,
        startTime = Date.now();

    while(Date.now() - startTime < 100){
        try{
            simulation.lives[simulation.itterater].live();
        }catch(e){}
        simulation.itterater = (simulation.itterater + 1) % simulation.lives.length;
        if(simulation.itterater === 0){
            simulation.stats.ticks++;
            this.growFood();
        }
        if(!simulation.lives.length){
            console.log('all life dead');

            console.log(JSON.stringify(this.stats, null, '    '));
            return;
        }
    };

    simulation.stats.populationSize = simulation.lives.length;

    this.emit('tick');

    (process.nextTick || setTimeout)(function(){
        simulation.tick();
    },0);
};
Simulation.prototype.updateStats = function(life){
    this.stats.food = this.food;
    this.stats.mostLife = Math.max(this.stats.mostLife, life.entity.alive.toString().length);
    this.stats.longestLife = Math.max(this.stats.longestLife, (life.deathDate || new Date()) - life.birthDate);
    this.stats.mostChildren = Math.max(this.stats.mostChildren, life.children.length);
    this.stats.fastestBreeder = Math.min(this.stats.fastestBreeder, life.entity.breedTime);
    this.stats.highestStrength = Math.max(this.stats.highestStrength, life.entity.strength);
    this.stats.highestAggression = Math.max(this.stats.highestAggression, life.entity.aggression);
};
Simulation.prototype.getRandomLife = function(){
    return this.lives[Math.floor(Math.random() * this.lives.length)];
}
Simulation.prototype.growFood = function(){
    this.food += 10;
    this.food *= 1.1;
    this.food = Math.min(this.maxFood, this.food);
};
Simulation.prototype.getFood = function(amount){
    var foodEaten = Math.min(amount, this.food);
    this.food -= foodEaten;
    return foodEaten;
};
Simulation.prototype.addLife = function(life){
    var simulation = this;

    life.simulation = this;

    life.begin();

    life.on('death', function(reason){
        simulation.lives.splice(simulation.lives.indexOf(life), 1);
        if(simulation.stats.deaths[reason] == null){
            simulation.stats.deaths[reason] = 0;
        }
        simulation.stats.deaths[reason]++;
        if(simulation.stats.longestLife <= life.deathDate - life.birthDate){
            simulation.stats.bestEntity = life.entity;
        }
    });

    this.lives.push(life);
    this.totalLives++;
};
module.exports = Simulation;