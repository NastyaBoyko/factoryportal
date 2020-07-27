define([
    'blockLib/truck/truck',
    'blockLib/entity/palletList',
    'blockLib/entity/toolbar',
    './config',
    'blockLib/helper/element'
], function(Truck, PalletList, Toolbar, Config, ElementFactory) {

    //truck
    {
        let trackElement = document.getElementById('truck'),
            track = new Truck(trackElement, Config);

        let ef = new ElementFactory(),
            toolBarElement = ef.make('div', {id: 'toolbar'}),
            toolBar = new Toolbar(toolBarElement);

        let palletListElement = document.getElementsByClassName('palette-wrapper')[0],
            palletList = new PalletList(palletListElement, Config, track.truck, toolBar);
        palletListElement.prepend(toolBarElement);

        console.log(palletList);
    }

});
