declare('StaticData', function () {
    include('Component');

    StaticData.prototype = component.prototype();
    StaticData.prototype.$super = parent;
    StaticData.prototype.constructor = StaticData;

    function StaticData() {
        component.construct(this);

        this.id = "StaticData";

        this.versionFile = "version.txt";

        this.dialogDefaultZIndex = 5;
        this.dragZIndex = 100;

        this.tooltipOffset = 10;

        this.mercenaryPriceIncreaseFactor = 1.15;

        this.XpSourceMonster = 0;

        this.GoldSourceMonster = 0;
        this.GoldSourceMercenary = 1;
        this.GoldSourceItemSale = 2;

        this.ItemSourceUnknown = 0;
        this.ItemSourceMonster = 1;

        this.FameSourceMonster = 0;

        this.EventCombatHit = "eventCombatHit";
        this.EventCombatDeath = "eventCombatDeath";
        this.EventXpGain = "eventXpGain";
        this.EventGoldGain = "eventGoldGain";
        this.EventItemGain = "eventItemGain";
        this.EventTooltip = "eventTooltip";
        this.EventDebugLog = "eventDebugLog";
        this.EventFameGain = "eventFameGain";

        this.InventoryModeUnknown = "inventoryUnknown";
        this.InventoryModePlayer = "inventoryPlayer";
        this.InventoryModeVendor = "inventoryVendor";

        // These match the data in ItemSlots
        this.EquipSlotHead = "head";
        this.EquipSlotChest = "chest";
        this.EquipSlotWaist = "waist";
        this.EquipSlotLegs = "legs";
        this.EquipSlotFeet = "feet";
        this.EquipSlotShoulder = "shoulder";
        this.EquipSlotWrist = "wrist";
        this.EquipSlotHands = "hands";
        this.EquipSlotMainHand = "mainHand";
        this.EquipSlotOffHand = "offHand";
        this.EquipSlotNeck = "neck";
        this.EquipSlotRing1 = "ring|1";
        this.EquipSlotRing2 = "ring|2";
        this.EquipSlotTrinket1 = "trinket|1";
        this.EquipSlotTrinket2 = "trinket|2";

        this.EquipSlots = [this.EquipSlotHead, this.EquipSlotChest, this.EquipSlotWaist, this.EquipSlotLegs,
            this.EquipSlotFeet, this.EquipSlotShoulder, this.EquipSlotWrist, this.EquipSlotHands, this.EquipSlotMainHand,
            this.EquipSlotOffHand, this.EquipSlotNeck, this.EquipSlotRing1, this.EquipSlotRing2,
            this.EquipSlotTrinket1, this.EquipSlotTrinket2];

    }

    StaticData.prototype.setRoot = function(value) {
        this.imageRoot = value + 'images/';
        this.imageRootInterface = this.imageRoot + "interface/";
        this.imageRootItem = this.imageRoot + 'item/';
        this.imageRootIcon = this.imageRoot + 'icon/';
    };

    StaticData.prototype.getImagePath = function(fileName) {
        return this.imageRoot + fileName;
    };

    return new StaticData();
});
