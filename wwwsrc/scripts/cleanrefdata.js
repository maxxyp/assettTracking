
var targets = [
    "../assets/services/reference/businessRule.json",
    "../assets/services/reference/label.json",
    "../assets/services/reference/validation.json"
];

targets.forEach(function (target) {

    var businessRules = require(target);
    var fs = require('fs');

    var initialCount = businessRules.length;

    var matches = [];
    var exactDuplicates = [];
    businessRules.forEach(function (value, idx) {
        let tempVal = JSON.parse(JSON.stringify(value));
        delete tempVal.key;

        var stringifyed = JSON.stringify(tempVal);
        if (matches.indexOf(stringifyed) > -1) {
            exactDuplicates.push(value);
        } else {
            matches.push(stringifyed);
        }
    });

    exactDuplicates.forEach(function (duplicate) {
        businessRules.splice(businessRules.indexOf(duplicate), 1);
    });

    console.log("Removed " + (initialCount - businessRules.length) + " duplicates.");
    console.log(JSON.stringify(exactDuplicates, null, 2, 2))

    matches = [];
    var duplicateIndexes = [];
    businessRules.forEach(function (value) {
        var identifier = value.id ? "id" : "property";
        var objectsWithSameIndex = businessRules.filter(x => x[identifier] === value[identifier] && x.viewModel === value.viewModel);
        if (objectsWithSameIndex.length > 1) {
            duplicateIndexes.push(value)
        }

    });

    console.log("Found " + (duplicateIndexes.length) + " conflicting.");
    console.log(JSON.stringify(duplicateIndexes, null, 2, 2));

    if (duplicateIndexes.length === 0) {
        var groupedViewModels = {};
        businessRules.forEach(function (rule) {
            if (!groupedViewModels[rule.viewModel]) {
                groupedViewModels[rule.viewModel] = [];
            }
            groupedViewModels[rule.viewModel].push(rule);
        });

        var finished = [];
        Object.keys(groupedViewModels).forEach(function (viewModel, groupIdx) {
            groupedViewModels[viewModel].forEach(function (value, idx) {
                value.key = (((groupIdx + 1) * 1000) + (idx + 1)).toString();
                finished.push(value);
            });
        });

        finished.sort(function(a, b) {
            return parseInt(a.key) - parseInt(b.key);
        });

        console.log("Rewritting " + target);
        fs.writeFileSync(target, JSON.stringify(finished, null, 2, 2), { encoding: 'utf8'});
    }

});

// console.log(JSON.stringify(businessRules, null, 2, 2));

// duplicates.forEach(function (value, idx) {
//     var objectsWithSameIndex = businessRules.filter(x => x.id === value.id && x.viewModel === value.viewModel);
//     var firstObjectWithSameIndex = objectsWithSameIndex[0];

//     var allExactDuplictes = objectsWithSameIndex.every(function (obj) {
//         return JSON.stringify(obj) === JSON.stringify(firstObjectWithSameIndex);
//     });

//     if (allExactDuplictes) {
//         objectsWithSameIndex.shift()
//         objectsWithSameIndex.forEach(function (value) {
//             // businessRules = businessRules.splice(businessRules.indexOf(value), 1)
//         });


//     } else {
//         // conflicting objects with same index
//     }



    
// });

// console.log(JSON.stringify(businessRules, null, 2, 2));

