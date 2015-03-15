declare('CharacterDialog', function() {
    include('Element');
    include('Dialog');
    include('CoreUtils');
    include('Resources');
    include('ProgressBar');
    include('Button');
    include('Game');
    include('Data');
    include('Panel');
    include('InventorySlotControl');

    CharacterDialog.prototype = dialog.prototype();
    CharacterDialog.prototype.$super = parent;
    CharacterDialog.prototype.constructor = CharacterDialog;

    function CharacterDialog() {
        dialog.construct(this);

        this.id = "characterDialog";

        this.equipBackground = undefined;

        this.headSlot = undefined;
        this.chestSlot = undefined;
        this.waistSlot = undefined;
        this.legSlot = undefined;
        this.feetSlot = undefined;
        this.shoulderSlot = undefined;
        this.wristSlot = undefined;
        this.armSlot = undefined;
        this.neckSlot = undefined;
        this.ring1Slot = undefined;
        this.ring2Slot = undefined;
        this.mainHandSlot = undefined;
        this.offHandSlot = undefined;
        this.trinket1Slot = undefined;
        this.trinket2Slot = undefined;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    CharacterDialog.prototype.dialogInit = CharacterDialog.prototype.init;
    CharacterDialog.prototype.init = function(parent, attributes) {
        this.dialogInit(parent, attributes);

        this.setHeaderText("Character");

        this.equipBackground = panel.create(this.id + 'EquipBackGround');
        this.equipBackground.init(this.getContentArea());
        this.equipBackground.setImages(resources.ImagePanelBlueInsetLT, resources.ImagePanelBlueInsetT, resources.ImagePanelBlueInsetRT,
            resources.ImagePanelBlueInsetL, resources.ImagePanelBlueInsetContent, resources.ImagePanelBlueInsetR,
            resources.ImagePanelBlueInsetLB, resources.ImagePanelBlueInsetB, resources.ImagePanelBlueInsetRB);
        this.equipBackground.addClass('equipBackGround');

        this.initEquipmentSlots();

        this.hide();
    };

    CharacterDialog.prototype.dialogUpdate = CharacterDialog.prototype.update;
    CharacterDialog.prototype.update = function(gameTime) {
        if(this.dialogUpdate(gameTime) !== true) {
            return false;
        }

        if(this.isVisible !== true) {
            return false;
        }


        return true;
    }

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    CharacterDialog.prototype.initEquipmentSlots = function() {
        this.headSlot = this.createEquipSlot('equipSlotHead');
        this.chestSlot = this.createEquipSlot('equipSlotChest');
        this.waistSlot = this.createEquipSlot('equipSlotWaist');
        this.legSlot = this.createEquipSlot('equipSlotLegs');
        this.feetSlot = this.createEquipSlot('equipSlotFeet');
        this.shoulderSlot = this.createEquipSlot('equipSlotShoulder');
        this.wristSlot = this.createEquipSlot('equipSlotWrist');
        this.armSlot = this.createEquipSlot('equipSlotArms');
        this.neckSlot = this.createEquipSlot('equipSlotNeck');
        this.ring1Slot = this.createEquipSlot('equipSlotRing1');
        this.ring2Slot = this.createEquipSlot('equipSlotRing2');
        this.mainHandSlot = this.createEquipSlot('equipSlotMainHand');
        this.offHandSlot = this.createEquipSlot('equipSlotOffHand');
        this.trinket1Slot = this.createEquipSlot('equipSlotTrinket1');
        this.trinket2Slot = this.createEquipSlot('equipSlotTrinket2');
    }

    CharacterDialog.prototype.createEquipSlot = function(id) {
        var slot = inventorySlotControl.create(this.id + id);
        slot.init(this.getContentArea());
        slot.addClass(id);
        return slot;
    }


    var surrogate = function(){};
    surrogate.prototype = CharacterDialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { CharacterDialog.call(self); },
        create: function() { return new CharacterDialog(); }
    };

});
