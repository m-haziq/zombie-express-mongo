const Survivor = require('../models/survivorSchema').Survivor

const Inventory = require('../models/inventorySchema').Inventory

const checkTradePossibility = async (req, res, next) => {

    let offer_id = req?.params?.id;
    let __demand = req.body?.demand?.items;
    let __offer = req.body?.offerd?.items;

    let otherInventory = await Inventory.findOne({ owner: offer_id }).populate("items.item");
    let myInventory = await Inventory.findOne({ owner: req?.user?._id }).populate("items.item");

    otherInventoryItems = otherInventory.items || [];
    myInventoryItems = myInventory.items || [];
    let demandPoints = 0;
    let offerPoints = 0;

    try {
        __demand.forEach(demandItem => {
            itemMatch = otherInventoryItems.find(i => i.item._id == demandItem.item);
            if (itemMatch && itemMatch.quantity >= demandItem.quantity) {
                demandPoints = demandPoints + (itemMatch?.item?.point * demandItem.quantity);
            } else {
                throw Error("Invalid demand, item Unavailable." + demandItem.item);
            }
        });

        __offer.forEach(offeredItem => {

            itemMatch = myInventoryItems.find(i => i.item._id == offeredItem.item);
            if (itemMatch && itemMatch.quantity >= offeredItem.quantity) {
                offerPoints = offerPoints + (itemMatch?.item?.point * offeredItem.quantity);
            } else {
                throw Error("Invalid offer, item Unavailable." + offeredItem.item);
            }
        })
        if (demandPoints != offerPoints) {
            throw Error('Items points mismatch.');
        }

    } catch (e) {
        res.status(400).send(String(e));
    }

    return next()

}

module.exports = checkTradePossibility;