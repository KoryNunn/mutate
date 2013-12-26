function Simulation(){
    this.stats = {
        longestLife: 0,
        mostChildren: 0,
        fastestBreeder: Number.MAX_VALUE,
        highestStrength: 0
    };

    this.lives = [];
}
Simulation.prototype.totalLives = 0;
Simulation.prototype.tick = function(){
    var simulation = this;

    setTimeout(function(){
        if(!simulation.lives.length){
            console.log('all life dead');
            return;
        }
        for(var i = 0; i < simulation.lives.length; i++) {
            simulation.lives[i].live();
        }
        simulation.tick();
    }, 100);
};
Simulation.prototype.updateStats = function(life){
    this.stats.longestLife = Math.max(this.stats.longestLife, (life.deathDate || new Date()) - life.birthDate);
    this.stats.mostChildren = Math.max(this.stats.mostChildren, life.children.length);
    this.stats.fastestBreeder = Math.min(this.stats.fastestBreeder, life.entity.breedTime);
    this.stats.highestStrength = Math.max(this.stats.highestStrength, life.entity.strength);
};
Simulation.prototype.getRandomLife = function(){
    return this.lives[Math.floor(Math.random() * this.lives.length)];
}
Simulation.prototype.addLife = function(life){
    var simulation = this;

    life.simulation = this;

    life.begin();

    life.on('death', function(){
        simulation.lives.splice(simulation.lives.indexOf(life), 1);
        if(simulation.stats.longestLife <= life.deathDate - life.birthDate){
            simulation.stats.bestEntity = life.entity;
        }
    });

    this.lives.push(life);
    this.totalLives++;
};
module.exports = Simulation;