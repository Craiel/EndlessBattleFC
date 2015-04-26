declare('ItemIcon', function() {
    include('Element');
    include('ItemUtils');

    ItemIcon.prototype = element.prototype();
    ItemIcon.prototype.$super = parent;
    ItemIcon.prototype.constructor = ItemIcon;

    function ItemIcon(id) {
        element.construct(this);

        this.id = id;

        this.setTemplate("itemIcon");

        this.currentRarityClass = undefined;

        this.itemChanged = true;
        this.itemRarity = undefined;
        this.itemType = undefined;

        this.borderControl = undefined;
        this.imageControl = undefined;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    ItemIcon.prototype.elementInit = ItemIcon.prototype.init;
    ItemIcon.prototype.init = function(parent, attributes) {
        this.elementInit(parent, attributes);

        this.borderControl = element.create(this.id + "Border");
        this.borderControl.init(this);
        this.addManagedChild(this.borderControl);

        this.imageControl = element.create(this.id + "Image");
        this.imageControl.init(this);
        this.addManagedChild(this.imageControl);

        this.updateRarityClass(undefined);
    };

    ItemIcon.prototype.elementUpdate = ItemIcon.prototype.update;
    ItemIcon.prototype.update = function(gameTime) {
        if(this.elementUpdate(gameTime) !== true) {
            return false;
        }

        if(this.itemChanged === true) {
            this.updateRarityClass(this.itemRarity);
            this.updateIcon(this.itemType);
            this.itemChanged = false;
        }

        return true;
    };

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    ItemIcon.prototype.setItem = function(item) {
        if(item !== undefined) {
            this.itemRarity = item.rarity;
            this.itemType = item.type;
        } else {
            this.itemRarity = undefined;
            this.itemType = undefined;
        }

        this.itemChanged = true;
    };

    ItemIcon.prototype.updateRarityClass = function(rarity) {
        if(this.currentRarityClass !== undefined) {
            this.removeClass(this.currentRarityClass);
        }

        if(rarity === undefined) {
            this.currentRarityClass = "itemIconRarityDefault";
        } else {
            this.currentRarityClass = "itemIconRarity_" + rarity;
        }

        this.addClass(this.currentRarityClass);
    };

    ItemIcon.prototype.updateIcon = function(type) {
        var style = {'background-repeat': 'no-repeat', 'background-size': '70% 70%', 'background-position': "center"};

        if(type === undefined) {
            style['background-image'] = undefined;
        } else {
            style['background-image'] = itemUtils.getItemIconUrl(type);
        }

        this.imageControl.setStyle(style);
    };

    var surrogate = function(){};
    surrogate.prototype = ItemIcon.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { ItemIcon.call(self); },
        create: function(id) { return new ItemIcon(id); }
    };

});
