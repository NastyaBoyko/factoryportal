define(function(){

    class Truck {
        constructor(element, config){
            this._truck = element;
            this._width = config.General.truck.width || null;
            this._height = config.General.truck.height || null;

            window.truck = this;
        }

        get truck() { return this._truck; }
    }

    return Truck;
})