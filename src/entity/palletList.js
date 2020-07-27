define([
    './pallet',
    '../helper/element',
    '../helper/html'
], function(Pallet, ElementFactory, HtmlHelper){

    const palletClass = 'pallet';

    class PalletList {
        constructor(element, config, truckElem, toolbar) {
            this._element = element;
            this._children = [];
            this._toolbar = toolbar;

            this._initElements(config, truckElem);
        }

        _initElements(config, truckElem) {
            let self = this,
                children = config.Data;

            if(children) {
                children.forEach(function(child){
                    let ef = new ElementFactory(),
                        palletElement = ef.make('div');
                    HtmlHelper.addClassName(palletElement, palletClass);
                    HtmlHelper.setWidth(palletElement, child.width);
                    HtmlHelper.setHeight(palletElement, child.height);
                    self._children.push(new Pallet(palletElement, child, self, truckElem));
                    self._element.appendChild(palletElement);
                });
            }
        }

        getChildrenWithOrderID(orderID) {
            return this.children.filter(child => child.orderId === orderID);s
        }

        get children() { return this._children; }

        get toolbar() { return this._toolbar; }
    }

    return PalletList;
})