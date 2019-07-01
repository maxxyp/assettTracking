import * as Logging from "aurelia-logging";
import { inject } from "aurelia-dependency-injection";
import { ChargeableTask } from "../../models/charge/chargeableTask";
import { IPartService } from "../interfaces/IPartService";
import { Part } from "../../models/part";
import { PartService } from "../partService";
import { IChargePartsHelperService } from "../interfaces/charge/IChargePartsHelperService";
import * as bignumber from "bignumber";
import { IChargePartsCatalogDependencies } from "../interfaces/charge/IChargePartsCatalogDependencies";

@inject(PartService)
export class ChargePartsHelperService implements IChargePartsHelperService {

    private _logger: Logging.Logger;
    private _partService: IPartService;

    constructor(partService: IPartService) {

        this._partService = partService;
        this._logger = Logging.getLogger("ChargePartsHelperService");
    }

    /**
     *
     * @param {ChargeableTask} chargeableTask
     * @param {string} jobId
     * @param {boolean} shouldChargeForParts
     * @param {IChargePartsCatalogDependencies} dependencies
     * @returns {Promise<ChargeableTask>}
     */
    public async addPartsCharge(chargeableTask: ChargeableTask, jobId: string,
                                shouldChargeForParts: boolean, dependencies: IChargePartsCatalogDependencies): Promise<ChargeableTask> {

        const {visitStatuses, notUsedStatusCode, excludePartStatusPrevious, vanStockPartOrderStatus} = dependencies;

        let partsToday = await this._partService.getTodaysParts(jobId);

        let first: ChargeableTask = chargeableTask;

        if (partsToday && partsToday.parts && partsToday.parts.length > 0) {
            this._logger.debug("Today's parts found", partsToday.parts);
            first = this.createPartChargeableItems(chargeableTask, partsToday.parts, shouldChargeForParts);
        }

        let second = await this.addVanStockPartsCharge(first, jobId, shouldChargeForParts, vanStockPartOrderStatus);
        return this.addPartsChargePreviousActivity(second, shouldChargeForParts, visitStatuses, notUsedStatusCode, excludePartStatusPrevious);
    }

    /**
     *
     * @param {ChargeableTask} chargeableTask
     * @param {string} jobId
     * @param {boolean} shouldCharge
     * @param {string} vanStockPartOrderStatus
     * @returns {Promise<ChargeableTask>}
     */
    private async addVanStockPartsCharge(chargeableTask: ChargeableTask, jobId: string,
                                         shouldCharge: boolean, vanStockPartOrderStatus: string): Promise<ChargeableTask> {

        const partBasketBusinessModel = await this._partService.getPartsBasket(jobId);

        if (partBasketBusinessModel
            && partBasketBusinessModel.partsToOrder
            && partBasketBusinessModel.partsToOrder.length > 0) {

            this._logger.debug("Van stock parts found", partBasketBusinessModel.partsToOrder);

            let parts = partBasketBusinessModel.partsToOrder.filter(p => p.partOrderStatus === vanStockPartOrderStatus);

            return this.createPartChargeableItems(chargeableTask, parts, shouldCharge);
        }

        return chargeableTask;
    }

    /**
     *
     * @param {ChargeableTask} chargeableTask
     * @param {boolean} isPart
     * @param {string[]} visitStatuses
     * @param {string} notUsedStatusCode
     * @param {string[]} excludePartStatusPrevious
     * @returns {ChargeableTask}
     */
    private addPartsChargePreviousActivity(chargeableTask: ChargeableTask, isPart: boolean,
                                                   visitStatuses: string [], notUsedStatusCode: string, excludePartStatusPrevious: string []): ChargeableTask {

        if (!chargeableTask.task || !chargeableTask.task.activities || chargeableTask.task.activities.length === 0) {
            return chargeableTask;
        }

        const {task} = chargeableTask;
        const {activities} = task;

        // filter activities we can carry forward charges:
        // i.e.  Complete, Another Visit Reqd, Field Manager Reqd,  Parts Reqd, Wait Advice
        // c, ia, if, ip, wa

        const chargeableActivities = activities.filter(a => visitStatuses.some(vs => vs === a.status)
            && a.parts && a.parts.length > 0);

        let parts: Part[] = [];
        chargeableActivities.forEach(activity => {

            if (activity.parts && activity.parts.length > 0) {

                // if an NU record is present, it represents an amount that needs to be subtracted from
                //  a adjoining FP record (only ordered parts can be NU'ed, van stock cannot)
                let notUsed: { [stockReferenceId: string]: number; } = {};
                for (const p of activity.parts.filter(a => a.status === notUsedStatusCode)) {
                    notUsed[p.stockReferenceId] = (notUsed[p.stockReferenceId] || 0) + p.quantity;
                }

                let getAndChalkOffQuantityToReturn = (thisPartQuantity: number, stockReferenceId: string) => {
                    let amountLeftToAllocate = notUsed[stockReferenceId];
                    if (!amountLeftToAllocate || amountLeftToAllocate <= 0) {
                        return undefined;
                    }

                    let amountToAllocateHere = amountLeftToAllocate <= thisPartQuantity
                                                ? amountLeftToAllocate
                                                : thisPartQuantity;

                    notUsed[stockReferenceId] = notUsed[stockReferenceId] - amountToAllocateHere;
                    return amountToAllocateHere;
                };

                // for FP parts (ordered parts), any warranty amount has not been subtracted in the FP line and so we need to
                //  hunt for a CP line for that part to see its warranty amount.
                // for U* parts (van stock) they already have their warranty amounts subtracted (!)
                let claimedWarrantied: { [stockReferenceId: string]: number; } = {};
                for (const p of activity.parts.filter(a => a.status === "CP")) {
                    claimedWarrantied[p.stockReferenceId] = (claimedWarrantied[p.stockReferenceId] || 0) + p.quantity;
                }

                let getAndChalkOffQuantityWarrantied = (thisPartQuantity: number, stockReferenceId: string) => {
                    let amountLeftToAllocate = claimedWarrantied[stockReferenceId];
                    if (!amountLeftToAllocate || amountLeftToAllocate <= 0) {
                        return undefined;
                    }

                    let amountToAllocateHere = amountLeftToAllocate <= thisPartQuantity
                                                ? amountLeftToAllocate
                                                : thisPartQuantity;

                    claimedWarrantied[stockReferenceId] = claimedWarrantied[stockReferenceId] - amountToAllocateHere;
                    return amountToAllocateHere;
                };

                activity.parts
                    .forEach(part => {
                            // beware - this bit mutates data, and this change to the underlying data is relied upon when we send
                            //  charges information back to WMIS.
                            if (part.status === "FP") {
                                let returnedQuantity = getAndChalkOffQuantityToReturn(part.quantity, part.stockReferenceId);
                                if (returnedQuantity) {
                                    part.notUsedReturn.quantityToReturn = returnedQuantity;
                                }
                            }

                            if (part.status === "FP" || part.status === "UP") {
                                let warrantiedQuantity = getAndChalkOffQuantityWarrantied(part.quantity, part.stockReferenceId);
                                if (warrantiedQuantity) {
                                    part.warrantyReturn.isWarrantyReturn = true;
                                    part.warrantyReturn.quantityToClaimOrReturn = warrantiedQuantity;
                                }
                            }
                    });

                const partsToChargeFor = activity.parts
                    .filter(p => !excludePartStatusPrevious.some(s => s === p.status));

                parts.push(...partsToChargeFor);
            }
        });

        return this.createPartChargeableItems(chargeableTask, parts, isPart && task.isCharge, true);
    }

    /**
     *
     * @param {ChargeableTask} chargeableTask
     * @param {Part[]} parts
     * @param {boolean} charge
     * @param {boolean} previous
     * @returns {ChargeableTask}
     */
    private createPartChargeableItems(chargeableTask: ChargeableTask, parts: Part[], charge: boolean, previous: boolean = false): ChargeableTask {

        let qty = 0;
        let description = "";
        let stockReferenceId = "";
        let isWarranty = false;
        let isReturn = false;
        let qtyCharged = 0;

        const partsFiltered = parts.filter(p => p.taskId === chargeableTask.task.id);

        if (!partsFiltered || partsFiltered.length === 0) {
            return chargeableTask;
        }

        for (const part of partsFiltered) {

            this._logger.debug("Parts found", [part]);

            qty = part.quantity;
            let totalCharge = new bignumber.BigNumber(0);

            let returnQty = 0;
            let warrantyQty = 0;

            if (!part || !part.price) {
                break;
            }

            description = part.description || part.stockReferenceId;
            stockReferenceId = part.stockReferenceId;

            // if no charge, add part but set value to 0
            if (!chargeableTask.task.isCharge || !charge) {
                chargeableTask.addPartItem(description, new bignumber.BigNumber(0), false, false,
                    qty, 0, stockReferenceId, 0, 0, previous);
            } else {
                let qtyToChargeFor = part.quantity;

                if (part.warrantyReturn && part.warrantyReturn.isWarrantyReturn) {
                    if (part.warrantyReturn.quantityToClaimOrReturn > 0) {
                        warrantyQty = part.warrantyReturn.quantityToClaimOrReturn;
                        isWarranty = true;
                        qtyToChargeFor -= warrantyQty;
                    }
                }

                if (part.notUsedReturn && part.notUsedReturn.quantityToReturn > 0) {
                    returnQty = part.notUsedReturn.quantityToReturn;
                    isReturn = true;
                    qtyToChargeFor -= returnQty;
                }

                if (charge && qtyToChargeFor > 0 && part.price.greaterThan(0)) {
                    totalCharge = new bignumber.BigNumber(part.price).times(qtyToChargeFor);
                }

                qtyCharged = qtyToChargeFor;

                chargeableTask.addPartItem(description, totalCharge, isReturn, isWarranty, qty, qtyCharged, stockReferenceId, returnQty, warrantyQty, previous, part.status);

                this._logger.debug("Part added to chargeableTask", [chargeableTask]);
            }
        }

        return chargeableTask;
    }
}
