declare('ItemUtils', function () {
    include('Assert');
    include('CoreUtils');
    include('StaticData');

    function ItemUtils() {
    }

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    ItemUtils.prototype.getItemIconUrl = function(type) {

        return coreUtils.getImageUrl("{0}{1}Default.png".format(staticData.imageRootItem, type));

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
        assert.isDefined(item.type);
        assert.isDefined(item.typeName);
        assert.isDefined(item.baseTypeName);
    };

    return new ItemUtils;
});