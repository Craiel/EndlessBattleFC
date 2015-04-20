declare('ItemTooltip', function() {
    include('Element');
    include('Panel');
    include('ItemIcon');
    include('CurrencyControl');
    include('GameData');
    include('StaticData');

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
    ItemTooltip.prototype.setSlotData = function(data) {
        // Todo: Build to tooltip for the equipped item...
        var prefix = "Current";

        this.headerText.setText(data.metaData.name);

        this.buildTooltipTopArea(data, prefix, this.topPanel);
        this.buildTooltipBottomArea(data, prefix, this.bottomPanel);
    };

    ItemTooltip.prototype.buildTooltipTopArea = function(data, idSuffix, topPanel) {
        topPanel.getContentArea().removeContent();

        var attributes = {};
        attributes.type = data.metaData.typeName;
        attributes.slot = data.metaData.baseTypeName;
        attributes.value = this.getValueContent(data);
        attributes.desc = this.getDescriptiveContent(data);
        attributes.details = this.getDetailContent(data);
        attributes.stats = this.getStatContent(data);

        var contentId = this.id + idSuffix + "TopContent";
        var topContent = element.create(contentId);
        topContent.templateName = "itemTooltipTop";
        topContent.init(topPanel.getContentArea(), attributes);

        var icon = itemIcon.create(contentId + "Icon");
        icon.init(topContent);
        icon.setItem(data.metaData);
        this.addManagedChild(icon);
        this.addManagedChild(topContent);
    };

    ItemTooltip.prototype.dataIsDpsType = function(data) {
        return data.metaData.slot === gameData.ItemSlots.weapon.id
            && data.metaData.type !== gameData.WeaponTypes.shield.id;
    };

    ItemTooltip.prototype.getValueContent = function(data) {
        if(this.dataIsDpsType(data)) {
            // Compute DPS...
            return "<TODO>";
        }

        return data.metaData.stats.armor;
    };

    ItemTooltip.prototype.getDetailContent = function(data) {
        var content = "";
        if(this.dataIsDpsType(data)) {
            content = "Damage Per Second";
        } else {
            content = "Armor"
        }
    }

    ItemTooltip.prototype.getDescriptiveContent = function(data) {
        return "Desc - TODO";
    };

    ItemTooltip.prototype.getStatContent = function(data) {
        return "STAT - TODO";
    };

    ItemTooltip.prototype.buildTooltipBottomArea = function(data, idSuffix, bottomPanel) {
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
        currency.setValue(data.metaData.stats.gold);
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
