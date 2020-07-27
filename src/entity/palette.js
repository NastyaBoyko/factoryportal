let Type = {
    Door: 'door',
    Window: 'window'
};

class Palette {
    constructor() {
        this._width = 0;
        this._height = 0;
        this._ldm = this._width * this._height; //square
        this._items = []; //qty
        this._type = null;
        this._orderID = null;
    }


}