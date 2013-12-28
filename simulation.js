var EventEmitter = require('events').EventEmitter;
function Simulation(){
    this.stats = {
        mostLife: 0,
        longestLife: 0,
        mostChildren: 0,
        fastestBreeder: Number.MAX_VALUE,
        highestStrength: 0,
        highestAggression: 0,
        deaths: {}
    };

    this.lives = [];
}
Simulation.prototype = Object.create(EventEmitter.prototype);
Simulation.constructor = Simulation;
Simulation.prototype.totalLives = 0;
Simulation.prototype.itterater = 0;
Simulation.prototype.tick = function(){
    var simulation = this,
        startTime = Date.now();

    this.emit('tick');

    while(Date.now() - startTime < 100){
        if(!simulation.lives.length){
            console.log('all life dead');
            return;
        }
        try{
            simulation.lives[simulation.itterater].live();
        }catch(e){}
        simulation.itterater = (simulation.itterater + 1) % simulation.lives.length;
        //console.log('itterater: ' + simulation.itterater, simulation.lives.length);
    };

    simulation.stats.populationSize = simulation.lives.length;

    setTimeout(function(){
        simulation.tick();
    },0);
};
Simulation.prototype.updateStats = function(life){
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
Simulation.prototype.getFood = function(){
    return Math.min(100, 100 / this.lives.length);
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