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
        return coreUtils.getImageUrl(ResImg(placeHolder));

        // TODO:
        /*var key = 'ImageItemDefault_' + type;
        assert.isDefined(resources[key], "ItemType has no Icon set: " + type);

        return coreUtils.getImageUrl(resources[key]);*/
    };

    return new ItemUtils;
});