declare('Upgrade', function () {

     function Upgrade(name, cost, type, requirementType, requirementAmount, description, iconSourceLeft, iconSourceTop) {
        this.name = name;
        this.cost = cost;
        this.type = type;
        this.requirementType = requirementType;
        this.requirementAmount = requirementAmount;
        this.description = description;
        this.iconSourceLeft = iconSourceLeft;
        this.iconSourceTop = iconSourceTop;

        this.available = false;
        this.purchased = false;
    }

    return {
        create: function(name, cost, type, requirementType, requirementAmount, description, iconSourceLeft, iconSourceTop) { return new Upgrade(name, cost, type, requirementType, requirementAmount, description, iconSourceLeft, iconSourceTop); }
    }

});