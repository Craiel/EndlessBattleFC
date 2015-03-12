declare('StatUpgrade', function () {

    // A random stat the player can choose when they level up
    function StatUpgrade() {
        this.type = undefined;
        this.amount = 0;
    }

    StatUpgrade.prototype.init = function(type, amount) {
        this.type = type;
        this.amount = amount;
    }

    return {
        create: function() { return new StatUpgrade(); }
    }

});