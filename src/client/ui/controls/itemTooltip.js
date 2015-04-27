declare('ItemTooltip', function() {
    include('Assert');
    include('Element');
    include('Panel');
    include('ItemIcon');
    include('CurrencyControl');
    include('GameData');
    include('StaticData');
    include('ItemUtils');

    var nextId = 0;

    ItemTooltip.prototype = element.prototype();
    ItemTooltip.prototype.$super = parent;
    ItemTooltip.prototype.constructor = ItemTooltip;

    function ItemTooltip() {
        element.construct(this);

        this.id = "itemTooltip" + (nextId++);

        this.setTemplate("itemTooltip");

        this.headerPanel = undefined;
        this.headerText = undefined;
        this.topPanel = undefined;
        this.bottomPanel = undefined;
    }

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    ItemTooltip.prototype.elementInit = ItemTooltip.prototype.init;
    ItemTooltip.prototype.init = function(parent, attributes) {
        this.elementInit(parent, attributes);

        this.headerPanel = panel.create(this.id + "Header");
        this.headerPanel.init(this);
        this.headerPanel.setStyle("Blue");
        this.headerPanel.addClass("itemTooltipHeaderPanel");
        this.addManagedChild(this.headerPanel);

        this.headerText = element.create(this.id + "HeaderText");
        this.headerText.templateName = "globalTextElement";
        this.headerText.init(this.headerPanel.getContentArea());
        this.headerText.addClass("itemTooltipHeaderText");
        this.addManagedChild(this.headerText);

        this.topPanel = panel.create(this.id + "Top");
        this.topPanel.init(this);
        this.topPanel.setStyle("Blue");
        this.topPanel.addClass("itemTooltipTopContentPanel");
        this.topPanel.addClass("globalNoDrag");
        this.addManagedChild(this.topPanel);

        this.bottomPanel = panel.create(this.id + "Bottom");
        this.bottomPanel.init(this);
        this.bottomPanel.setStyle("Blue");
        this.bottomPanel.addClass("itemTooltipBottomContentPanel");
        this.bottomPanel.addClass("globalNoDrag");
        this.addManagedChild(this.bottomPanel);
    };

    ItemTooltip.prototype.elementUpdate = ItemTooltip.prototype.update;
    ItemTooltip.prototype.update = function(gameTime) {
        if(this.elementUpdate(gameTime) !== true) {
            return false;
        }

        return true;
    };

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    ItemTooltip.prototype.setSlotData = function(slot) {
        console.log(slot.item);
        assert.isDefined(slot.item, "Item for tooltip was not defined!");
        itemUtils.checkItemIsValid(slot.item);

        // Todo: Build to tooltip for the equipped item...
        var prefix = "Current";

        this.headerText.setText(slot.item.name);

        this.buildTooltipTopArea(slot.item, prefix, this.topPanel);
        this.buildTooltipBottomArea(slot.item, prefix, this.bottomPanel);
    };

    ItemTooltip.prototype.buildTooltipTopArea = function(item, idSuffix, topPanel) {
        topPanel.getContentArea().removeContent();

        var attributes = {};
        attributes.type = item.type.id;
        attributes.slot = item.baseType.id;
        attributes.value = this.getValueContent(item);
        attributes.desc = this.getDescriptiveContent(item);
        attributes.details = this.getDetailContent(item);
        attributes.stats = this.getStatContent(item);

        var contentId = this.id + idSuffix + "TopContent";
        var topContent = element.create(contentId);
        topContent.templateName = "itemTooltipTop";
        topContent.init(topPanel.getContentArea(), attributes);

        var icon = itemIcon.create(contentId + "Icon");
        icon.init(topContent);
        icon.setItem(item);
        this.addManagedChild(icon);
        this.addManagedChild(topContent);
    };

    ItemTooltip.prototype.dataIsDpsType = function(item) {
        return item.slot === gameData.ItemSlots.weapon.id
            && item.type !== gameData.WeaponTypes.shield.id;
    };

    ItemTooltip.prototype.getValueContent = function(item) {
        if(this.dataIsDpsType(item)) {
            // Compute DPS...
            return "<TODO>";
        }

        return item.stats.armor;
    };

    ItemTooltip.prototype.getDetailContent = function(item) {
        var content = "";
        if(this.dataIsDpsType(item)) {
            content = "Damage Per Second";
        } else {
            content = "Armor"
        }
    }

    ItemTooltip.prototype.getDescriptiveContent = function(item) {
        return "Desc - TODO";
    };

    ItemTooltip.prototype.getStatContent = function(item) {
        return "STAT - TODO";
    };

    ItemTooltip.prototype.buildTooltipBottomArea = function(item, idSuffix, bottomPanel) {
        var contentId = this.id + idSuffix + "BottomContent";
        var bottomContent = element.create(contentId);
        bottomContent.templateName = "itemTooltipBottom";
        bottomContent.init(bottomPanel.getContentArea());

        var currency = currencyControl.create(contentId + "SellValue");
        currency.imageAfterText = true;
        currency.classPrefix = "itemTooltipCurrency";
        currency.init(bottomContent);
        currency.addClass("itemTooltipSellValue");
        currency.setImage(ResImg(iconGold));
        currency.setValue(item.stats.gold);
        currency.setHeight(16);
        this.addManagedChild(currency);

        this.addManagedChild(bottomContent);
    }

    var surrogate = function(){};
    surrogate.prototype = ItemTooltip.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { ItemTooltip.call(self); },
        create: function() { return new ItemTooltip(); }
    };

});
