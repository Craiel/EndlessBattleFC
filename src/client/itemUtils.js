declare('ItemUtils', function () {
    include('Assert');
    include('CoreUtils');
    include('StaticData');

    function ItemUtils() {
    }

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    ItemUtils.prototype.getItemIconUrl = function(baseType, type) {

        if(type.icon === undefined) {
            return coreUtils.getImageUrl("{0}{1}Default.png".format(staticData.imageRootItem, baseType.id));
        }

        return coreUtils.getImageUrl("{0}{1}.png".format(staticData.imageRootItem, type.icon));

        //return coreUtils.getImageUrl(ResImg(placeHolder));

        // TODO:
        /*var key = 'ImageItemDefault_' + type;
        assert.isDefined(resources[key], "ItemType has no Icon set: " + type);

        return coreUtils.getImageUrl(resources[key]);*/
    };

    // ---------------------------------------------------------------------------
    // item functions
    // ---------------------------------------------------------------------------
    ItemUtils.prototype.checkItemIsValid = function(item) {
        assert.isDefined(item.name);
        assert.isDefined(item.rarity);
        assert.isDefined(item.slot);
        assert.isDefined(item.baseType);
        assert.isDefined(item.type);
    };

    return new ItemUtils;
});