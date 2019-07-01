/// <reference path="../../../../typings/app.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SecureStorage = /** @class */ (function () {
        function SecureStorage() {
        }
        SecureStorage.prototype.get = function (container, key) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var localSettings = Windows.Storage.ApplicationData.current.localSettings;
                if (_this.calcId(container, key).length > 0) {
                    var localSettingsValue = localSettings.values.lookup(_this.calcId(container, key));
                    if (localSettingsValue) {
                        var data = Windows.Security.Cryptography.
                            CryptographicBuffer.decodeFromBase64String(localSettingsValue);
                        _this.decryptData(data)
                            .then(function (result) {
                            return result;
                        })
                            .then(function (getResult) {
                            resolve(getResult);
                        })
                            .catch(function (error) {
                            reject(null);
                        });
                    }
                    else {
                        resolve(null);
                    }
                }
                else {
                    resolve(null);
                }
            });
        };
        SecureStorage.prototype.set = function (container, key, data) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var getEncryptedData;
                if (data !== null) {
                    _this.encryptData(data).then(function (result) {
                        getEncryptedData = Windows.Security.Cryptography.
                            CryptographicBuffer.encodeToBase64String(result);
                        if (_this.calcId(container, key).length > 0 && getEncryptedData.length > 0) {
                            Windows.Storage.ApplicationData.current.localSettings.values.
                                insert(_this.calcId(container, key), getEncryptedData);
                        }
                    })
                        .then(function () {
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                }
                else {
                    reject("data is null");
                }
            });
        };
        SecureStorage.prototype.remove = function (container, key) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                Windows.Storage.ApplicationData.current.localSettings.values.remove(_this.calcId(container, key));
                resolve();
            });
        };
        SecureStorage.prototype.clear = function () {
            return new Promise(function (resolve, reject) {
                Windows.Storage.ApplicationData.current.localSettings.values.clear();
                resolve();
            });
        };
        SecureStorage.prototype.calcId = function (container, key) {
            return container + "_" + key;
        };
        SecureStorage.prototype.encryptData = function (data) {
            return new Promise(function (resolve, reject) {
                if (data) {
                    var strMsg = JSON.stringify(data);
                    var strDescriptor = "LOCAL=user";
                    var provider = new Windows.Security.Cryptography.DataProtection.DataProtectionProvider(strDescriptor);
                    var buffMsg = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(strMsg, Windows.Security.Cryptography.BinaryStringEncoding.utf8);
                    provider.protectAsync(buffMsg).done(function (result) {
                        resolve(result);
                    }, function (err) {
                        reject(err);
                    });
                }
                else {
                    reject();
                }
            });
        };
        SecureStorage.prototype.decryptData = function (data) {
            return new Promise(function (resolve, reject) {
                var provider = new Windows.Security.Cryptography.DataProtection.DataProtectionProvider();
                if (data) {
                    provider.unprotectAsync(data).done(function (result) {
                        var resultString = Windows.Security.Cryptography.CryptographicBuffer.convertBinaryToString(Windows.Security.Cryptography.BinaryStringEncoding.utf8, result);
                        var binaryToStringData = JSON.parse(resultString);
                        resolve(binaryToStringData);
                    }, function (err) {
                        reject(err);
                    });
                }
                else {
                    reject();
                }
            });
        };
        return SecureStorage;
    }());
    exports.SecureStorage = SecureStorage;
});

//# sourceMappingURL=secureStorage.js.map
