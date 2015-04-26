declare('Item', function() {
    include('Assert');


    // Can't have functions here, this will be loaded / saved from storage as well!
    function Item(id) {
        assert.isDefined(id, "Item must have valid ID!");

        this.id = id;

        this.name = undefined;
        this.rarity = undefined;
        this.slot = undefined;
        this.type = undefined;
        this.typeName = undefined;
        this.baseTypeName = undefined;

        this.stats = {};
        this.metaData = {};
    };

    return {
        create: function(id) { return new Item(id); }
    }
});