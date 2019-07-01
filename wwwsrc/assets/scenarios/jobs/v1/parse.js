var fs = require('fs');
/*var md5 = require('md5');

var getWorklists = (fileName) =>
    fs.readFileSync(fileName, 'utf8')
        .split("\n")
        .filter(line => line.match(/Success.*worklist/))
        .map(line => line.split("\t"))
        .filter(splits => splits && splits.length >= 4)
        .map(splits => splits[3]) // the HTTP client response log string
        .map(split => split.replace(" \"Success\" ", ""));

var getMemoChangedWorklists = (worklists) =>
    worklists
        .map(fragment => JSON.parse(fragment))
        .map(obj => ({
            timestamp: (obj.result.meta || {}).modifiedTimestamp,
            memoHash:   md5(JSON.stringify(obj.result.data.memoList) || ""),
            dataHash:   md5(JSON.stringify(obj.result.data.list) || "")
        }))
        .map((obj, i, all) => ({
            timestamp: obj.timestamp,
            timestampChanged: i === 0 || obj.timestamp !== all[i-1].timestamp,
            memoListChanged: i === 0 || obj.memoHash !== all[i-1].memoHash,
            dataChanged: i === 0 || obj.dataHash !== all[i-1].dataHash
        }))
        .filter(obj => obj.memoListChanged)
        .map(obj => JSON.stringify(obj));

var getLogs = (dirName) =>
    fs.readdirSync(dirName)
        .filter(fileName => fileName.indexOf(".txt") !== -1);


var logs = getLogs('C:\\Users\\stef\\Desktop\\logs');
logs.forEach(fileName => {
    console.log(fileName);
    var worklists = getWorklists(fileName)
    worklists.forEach(line => console.log(line));
    // var lines = getMemoChangedWorklists(worklists);
    // lines.forEach(line => console.log(line));
})

*/

var dirName = "C:\\BG\\HEMA\\EWB\\wwwsrc\\assets\\scenarios\\jobs\\v1";

fs.readdirSync(dirName)
    .filter(dirName => fs.existsSync(dirName + "\\scenario.json"))
    .map(dirName => fs.readFileSync(dirName + "\\scenario.json", "utf8"))
    .map(fileString => JSON.parse(fileString))
    .map(scenarioObj => scenarioObj
                        && scenarioObj.data
                        && scenarioObj.data.data
                        && scenarioObj.data.data.job
                        && scenarioObj.data.data.job.tasks
                        && scenarioObj.data.data.job.tasks.some(task => task.activities && task.activities.some(activity => activity.status !== "D" && activity.parts && activity.parts.length))
                        && {
                            jobId:scenarioObj.data.data.job.id,
                            tasks: scenarioObj.data.data.job.tasks
                                .filter(task => task && task.activities && task.activities.some(activity => activity.status !== "D" && activity.parts && activity.parts.length))
                                .map(task => ({
                                    taskId: task.id,
                                    //activities: task.activities
                                    statuses: task.activities.map(activity => activity.status + "-" + (activity.parts || []).map(part => part.status).join(",")
                                    )
                            })
                            )})
    .filter(jobIdAndTasks => jobIdAndTasks)
    .forEach(jobIdAndTasks => console.log(JSON.stringify(jobIdAndTasks, null, 2) + ",\n\n"));



