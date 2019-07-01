define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GroupByValueConverter = /** @class */ (function () {
        function GroupByValueConverter() {
        }
        GroupByValueConverter.prototype.toView = function (array, groupBy) {
            var groups = {};
            if (array) {
                array.forEach(function (o) {
                    var group = o[groupBy];
                    if (!!group) {
                        groups[group] = groups[group] || [];
                        groups[group].push(o);
                    }
                });
                if (Object.keys(groups).length === 0 && groups.constructor === Object) {
                    return [];
                }
            }
            return Object.keys(groups).map(function (group) {
                return {
                    group: group,
                    values: groups[group]
                };
            });
        };
        return GroupByValueConverter;
    }());
    exports.GroupByValueConverter = GroupByValueConverter;
});

//# sourceMappingURL=groupByValueConverter.js.map
