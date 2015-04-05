declare('ItemTooltip', function() {
    include('Log');
    include('Assert');
    include('StaticData');
    include('Element');
    include('CoreUtils');
    include('Resources');
    include('Panel');
    include('ItemIcon');
    include('CurrencyControl');

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
        resources.setPanelImages(this.headerPanel, "Blue");
        this.headerPanel.addClass("itemTooltipHeaderPanel");
        this.addManagedChild(this.headerPanel);

        this.headerText = element.create(this.id + "HeaderText");
        this.headerText.templateName = "globalTextElement";
        this.headerText.init(this.headerPanel.getContentArea());
        this.headerText.addClass("itemTooltipHeaderText");
        this.addManagedChild(this.headerText);

        this.topPanel = panel.create(this.id + "Top");
        this.topPanel.init(this);
        resources.setPanelImages(this.topPanel, "Blue");
        this.topPanel.addClass("itemTooltipTopContentPanel");
        this.topPanel.addClass("globalNoDrag");
        this.addManagedChild(this.topPanel);

        this.bottomPanel = panel.create(this.id + "Bottom");
        this.bottomPanel.init(this);
        resources.setPanelImages(this.bottomPanel, "Blue");
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
        this.buildTooltip(data, "Current", this.headerText, this.topPanel, this.bottomPanel);
    };

    ItemTooltip.prototype.buildTooltip = function(data, idSuffix, headerText, topPanel, bottomPanel) {
        headerText.setText(data.metaData.name);

        topPanel.getContentArea().removeContent();

        var iconElement = element.create(this.id + idSuffix + "IconElement");
        iconElement.templateName = "emptyElement";
        iconElement.init(topPanel.getContentArea());
        iconElement.addClass("itemTooltipIcon");
        this.addManagedChild(iconElement);

        var icon = itemIcon.create(this.id + idSuffix + "Icon");
        icon.init(iconElement);
        icon.setItem(data.metaData);
        this.addManagedChild(icon);

        var currencyLabel = element.create(this.id + idSuffix + "SellValueLabel");
        currencyLabel.templateName = "emptyElement";
        currencyLabel.init(bottomPanel.getContentArea());
        currencyLabel.setText("Sell Value: ");
        currencyLabel.addClass("itemTooltipSellValueLabel");
        this.addManagedChild(currencyLabel);

        var currency = currencyControl.create(this.id + idSuffix + "SellValue");
        currency.init(bottomPanel.getContentArea());
        currency.setImage(resources.ImageIconCoin);
        currency.setValue(data.metaData.stats.gold);
        currency.addClass("itemTooltipSellValue");
        this.addManagedChild(currency);
    }


    var surrogate = function(){};
    surrogate.prototype = ItemTooltip.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { ItemTooltip.call(self); },
        create: function() { return new ItemTooltip(); }
    };

});
