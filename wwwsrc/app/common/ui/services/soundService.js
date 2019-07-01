/// <reference path="../../../../typings/app.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "aurelia-dependency-injection", "../../core/services/assetService"], function (require, exports, aurelia_dependency_injection_1, assetService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SOUND_BELL_1X = "bell.mp3";
    var SOUND_BELL_2X = "bell_2x.mp3";
    var SoundService = /** @class */ (function () {
        function SoundService(assetService) {
            this._assetService = assetService;
            if (window.AudioContext) {
                this._context = new AudioContext();
            }
        }
        SoundService.prototype.playBell = function (numberOfRings) {
            if (numberOfRings === void 0) { numberOfRings = 1; }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = numberOfRings;
                            switch (_a) {
                                case 1: return [3 /*break*/, 1];
                                case 2: return [3 /*break*/, 3];
                            }
                            return [3 /*break*/, 5];
                        case 1: return [4 /*yield*/, this.play(SOUND_BELL_1X)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 7];
                        case 3: return [4 /*yield*/, this.play(SOUND_BELL_2X)];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.play(SOUND_BELL_1X)];
                        case 6:
                            _b.sent();
                            _b.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        SoundService.prototype.play = function (assetName) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this._assetService.loadArrayBuffer("sounds/" + assetName)
                    .then(function (soundBuffer) {
                    _this.processBuffer(soundBuffer).then(function (source) {
                        source.start(0);
                        resolve(source);
                    }).catch(function (err) {
                        reject(err);
                    });
                }).catch(function (err) {
                    reject(err);
                });
            });
        };
        SoundService.prototype.playBuffer = function (buffer) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.processBuffer(buffer).then(function (source) {
                    source.start(0);
                    resolve(source);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };
        SoundService.prototype.stop = function (source) {
            if (source) {
                source.stop(0);
            }
        };
        SoundService.prototype.processBuffer = function (soundBuffer) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this._source = _this._context.createBufferSource();
                _this._context.decodeAudioData(soundBuffer, function (buffer) {
                    _this._source.buffer = buffer;
                    _this._source.connect(_this._context.destination);
                    resolve(_this._source);
                }, function () {
                    reject();
                });
            });
        };
        SoundService = __decorate([
            aurelia_dependency_injection_1.inject(assetService_1.AssetService),
            __metadata("design:paramtypes", [Object])
        ], SoundService);
        return SoundService;
    }());
    exports.SoundService = SoundService;
});

//# sourceMappingURL=soundService.js.map
