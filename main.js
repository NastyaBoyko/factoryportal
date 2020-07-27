const minW = 4;   // min width and height of boxes
const minH = 4;
const maxS = 50;   // max width and height

const randI = (min, max = min + (min = 0)) => (Math.random() * (max - min) + min) | 0;

$(document).ready(function () {
    let paletteWrapper = $('.palette-wrapper');

    let palettes = [], qty = 10;

    for(let i = 0; i < qty; i++) {
        const box = {
            w : randI(minW*4,maxS*3),
            h : randI(minH*4,maxS*3)
        }
        palettes.push(box);
    }

    palettes.forEach(function (box, index) {
        let palette = createPalette(box, index);
        paletteWrapper.append(palette);
    });

    $('.palette').draggable({
        snap: "#track, .palette",
        stop: function (event) {
            // if palette is in track add class
            let inTrack = isInTrack(this);
            $(this).toggleClass('in-track', inTrack);

            if(!inTrack) {
                $(this).css({'top': 'auto', 'left': 'auto'});
            }
        }
    });
})

function createPalette(box,i) {
    let palette = $('<div class="palette" id="palette_'+ i +'"/>').css({'height': box.h + 'px', 'width': box.w + 'px'});
    palette.dblclick(function () {
        let oldHeight = $(this).css('height');
        $(this).css('height', $(this).css('width'));
        $(this).css('width', oldHeight);
    });
    return palette;
}

function isInTrack(box) {
    let trackPos = $('#track')[0].getBoundingClientRect(),
        boxPos = box.getBoundingClientRect();

    return (boxPos.top >= trackPos.top &&
        boxPos.bottom <= trackPos.bottom &&
        boxPos.left >= trackPos.left &&
        boxPos.right <= trackPos.right + 1);
}

function dragAndDrop () {
    // $(".palette").draggable({ cursor: "crosshair", revert: "invalid"});
    // $(".palette").droppable({
    //     accept: ".palette",
    //     drop: function (event, ui) {
    //         console.log("drop");
    //         let dropped = ui.draggable,
    //             droppedOn = $(this);
    //         $(dropped).detach().css({top: 0, left: 0}).appendTo(droppedOn);
    //     },
    //     over: function (event, elem) {
    //         $(this).addClass("over");
    //         console.log("over");
    //     },
    //     out: function (event, elem) {
    //         $(this).removeClass("over");
    //     },
    // });
    // $("#track").sortable();
    // $(".palette-wrapper").droppable({
    //     accept: ".palette",
    //     drop: function(event, ui) {
    //         console.log("drop");
    //         $(this).removeClass("border").removeClass("over");
    //         let dropped = ui.draggable,
    //             droppedOn = $(this);
    //         $(dropped).detach().css({top: 0,left: 0}).appendTo(droppedOn);
    //     }
    // });

}
