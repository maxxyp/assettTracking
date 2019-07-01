/// <reference path="../../../../../typings/app.d.ts" />

import {NumberBox} from "../../../../../app/common/ui/elements/numberBox";
import {Threading} from "../../../../../app/common/core/threading";

describe("the NumberBox module", () => {
    let numberBox: NumberBox;

    it("can be created", () => {
        numberBox = new NumberBox(<Element>{});
        expect(numberBox).toBeDefined();
    });


    describe("valueChanged", () => {
        it("will not allow a number larger than the max value", (done) => {
            numberBox = new NumberBox(<Element>{});
            numberBox.maxValue = 20;
            numberBox.value = 1000;
            numberBox.valueChanged(25, 0);
            Threading.delay(() => {
                expect(numberBox.value).toBe(0);
                done();
            }, 100);
        });

        it("will not allow more decimal places than specified", (done) => {
            numberBox = new NumberBox(<Element>{});
            numberBox.decimalPlaces = 1;
            numberBox.value = 10.5;
            numberBox.valueChanged(1.45, 0);
            Threading.delay(() => {
                expect(numberBox.value).toBe(0);
                done();
            }, 100);
        });

        it("will allow more decimal places than specified", (done) => {
            numberBox = new NumberBox(<Element>{});
            numberBox.decimalPlaces = 1;
            numberBox.value = 10.5;
            numberBox.valueChanged(1.5, 0);

            // have to check against the original value as aurelia 
            // isnt running so it wont actually update the value
            Threading.delay(() => {
                expect(numberBox.value).toBe(10.5);
                done();
            }, 100);
        });
    });

});
