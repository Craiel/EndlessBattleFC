declare("Loot", function () {

    function Loot(gold, item) {
        this.gold = gold;
        this.item = item;
    }

    return {
        create: function() { return new Loot(); }
    }

});