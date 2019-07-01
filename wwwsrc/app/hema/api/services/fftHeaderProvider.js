var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-dependency-injection"], function (require, exports, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FftHeaderProvider = /** @class */ (function () {
        function FftHeaderProvider() {
        }
        FftHeaderProvider.prototype.setStaticHeaders = function (staticHeaders) {
            this._staticHeaders = staticHeaders;
        };
        FftHeaderProvider.prototype.getHeaders = function (routeName) {
            var headers = [];
            var engineerIdHeader = (this._staticHeaders || []).slice(0)
                .find(function (header) { return header.name === "engineerId"; });
            if (engineerIdHeader) {
                headers.push(engineerIdHeader);
            }
            return Promise.resolve(headers);
            // let headers: IHttpHeader[] = (this._staticHeaders || []).slice(0);
            // return this._gpsService.getLocation()
            //     .catch(() => {
            //         /* swallow any errors from the gps service, we definitely don't want this to stop API calls */
            //     })
            //     .then((location) => {
            //         if (location && location.latitude !== undefined && location.longitude !== undefined) {
            //             headers.push({name: "latitude", value: location.latitude.toString()});
            //             headers.push({name: "longitude", value: location.longitude.toString()});
            //         }
            //         // #14682 - reintroducing all other headers but keep "date" disabled
            //         // headers.push({name: "date", value: DateHelper.toJsonDateTimeString(new Date())});
            //         return headers;
            //     });
        };
        FftHeaderProvider = __decorate([
            aurelia_dependency_injection_1.inject(),
            __metadata("design:paramtypes", [])
        ], FftHeaderProvider);
        return FftHeaderProvider;
    }());
    exports.FftHeaderProvider = FftHeaderProvider;
});

//# sourceMappingURL=fftHeaderProvider.js.map
