var log = require('./createLog'),
    Simulation = require('./simulation'),
    simulation = new Simulation(),
    Life = require('./life');

if(typeof window !== 'undefined'){
    window.onerror = function(error){
        log(error);
    };
}else{
    process.on('uncaughtException', function(error) {
        // handle the error safely
        log(error);
    });
}

simulation.addLife(new Life());

simulation.on('tick', function(){
    console.log(simulation.lives.length);
    log.print(-10);
    console.log(JSON.stringify(simulation.stats));
});

simulation.tick();