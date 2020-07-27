define([
    '../helper/html',
    '../helper/color'
],function(HtmlHelper, Color) {
    let Type = {
        Door: 'door',
        Window: 'window'
    },
    defaultColor = '#fff';

    class Pallet {
        constructor(element, configObject, parent, truck) {
            this._element = element;
            this._width = configObject.width || null;
            this._height = configObject.height || null;
            this._ldm = this._width * this._height; //square
            this._items = []; //qty
            this._type = configObject.type;
            this._orderID = configObject.orderId;
            this._truckObject = truck; //сделать ссылку на truck через parent
            this._parent = parent;

            this._initDraggable(); //вопросики: создать Helper?

            this._initEvents();
        }

        _initEvents() {
            this._element.addEventListener("contextmenu", this.rotate);
            this._element.addEventListener('click', this.highlightItemsSameOrder.bind(this));
        }

        _initDraggable() {
            let self = this;
            $(this._element).draggable({
                snap: "#truck, .pallet",
                stop: function (event) {
                    // if palette is in track add class
                    let inTrack = self.isInTrack(this);
                    $(this).toggleClass('in-track', inTrack);

                    if(!inTrack) {
                        $(this).css({'top': 'auto', 'left': 'auto'});
                    }
                }
            });
        }

        isInTrack(box) {
            let boxPos = box.getBoundingClientRect(),
                trackPos = this._truckObject.getBoundingClientRect();

            return (boxPos.top >= trackPos.top &&
                boxPos.bottom <= trackPos.bottom &&
                boxPos.left >= trackPos.left &&
                boxPos.right <= trackPos.right + 1);
        }

        rotate(event) {
            event.preventDefault();
            let oldHeight = $(this).css('height');
            $(this).css('height', $(this).css('width'));
            $(this).css('width', oldHeight);
            return false;
        }

        highlightItemsSameOrder() {
            let actualOrderID = this.orderId;

            let isClicked = !Color.compareColors(this._element.style.backgroundColor, defaultColor);

            // перенести в PalletList?
            this._parent.children.forEach(function(pallet) {
                pallet.clearBGColor();
            });

            if(!isClicked) {
                this._parent.getChildrenWithOrderID(actualOrderID).forEach(function(pallet){
                    pallet.changeBGColor();
                });

                // перенести функцию
                this._parent

            }

        }

        clearBGColor() {
            // let defaultColor = '#fff';
            HtmlHelper.changeBGColor(this._element, defaultColor);
        }

        changeBGColor(color) {
            let newColor = color ? color : '#b6d497';
            HtmlHelper.changeBGColor(this._element, newColor);
        }

        get orderId() { return this._orderID; }

    }

    return Pallet;
})