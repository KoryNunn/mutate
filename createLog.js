function createLog(){
    var logs = [],
        logFunction = function(message){
            logs.push(message);
            logs = logs.slice(-100);
        };

    logFunction.print = function(){
        console.log(logs.slice.apply(logs, arguments).join('\n'));
    };

    return logFunction;
}

module.exports = createLog();