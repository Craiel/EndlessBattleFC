declare("Loot", function () {

    function Loot(gold, item) {
        this.gold = gold;
        this.item = item;
    }

    return {
        create: function(gold, item) { return new Loot(gold, item); }
    }

});