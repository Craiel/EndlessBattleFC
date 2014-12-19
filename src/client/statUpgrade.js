declare("StatUpgrade", function () {

    // A random stat the player can choose when they level up
    function StatUpgrade(type, amount) {
        this.type = type;
        this.amount = amount;
    }

    return {
        create: function() { return new StatUpgrade(); }
    }

});