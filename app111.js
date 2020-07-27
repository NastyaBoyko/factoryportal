const canvas = document.getElementById('canvas');

const minW = 4;   // min width and height of boxes
const minH = 4;
const maxS = 50;   // max width and height
const space = 2;
const numberBoxesToPlace = 20; // number of boxes to place befor fitting
const fixedBoxColor = "blue";

// Demo only
const addCount = 2;  // number to add per render cycle
const ctx = canvas.getContext("2d");
canvas.width = canvas.height = 1024;

// create a random integer randI(n) return random val 0-n randI(n,m) returns random int n-m, and iterator that can break
const randI = (min, max = min + (min = 0)) => (Math.random() * (max - min) + min) | 0;
const eachOf = (array, cb) => { var i = 0; const len = array.length; while (i < len && cb(array[i], i++, len) !== true ); };



// creates a random box. If place is true the box also gets a x,y position and is flaged as fixed
function createBox(place){
    if(place){
        const box = {
            w : randI(minW*4,maxS*4),
            h : randI(minH*4,maxS*4),
            fixed : true,
        }
        box.x = randI(space, canvas.width - box.w - space * 2);
        box.y = randI(space, canvas.height - box.h - space * 2);
        return box;
    }
    return {
        w : randI(minW,maxS),
        h : randI(minH,maxS),
    }
}

//======================================================================
// BoxArea object using BM67 box packing algorithum
// https://stackoverflow.com/questions/45681299/algorithm-locating-enough-space-to-draw-a-rectangle-given-the-x-and-y-axis-of
// Please leave this and the above two lines with any copies of this code.
//======================================================================
//
// usage
//  var area = new BoxArea({
//      x: ?,  // x,y,width height of area
//      y: ?,
//      width: ?,
//      height : ?.
//      space : ?, // optional default = 1 sets the spacing between boxes
//      minW : ?, // optional default = 0 sets the in width of expected box. Note this is for optimisation you can add smaller but it may fail
//      minH : ?, // optional default = 0 sets the in height of expected box. Note this is for optimisation you can add smaller but it may fail
//  });
//
//  Add a box at a location. Not checked for fit or overlap
//  area.placeBox({x : 100, y : 100, w ; 100, h :100});
//
//  Tries to fit a box. If the box does not fit returns false
//  if(area.fitBox({x : 100, y : 100, w ; 100, h :100})){ // box added
//
//  Resets the BoxArea removing all boxes
//  area.reset()
//
//  To check if the area is full
//  area.isFull();  // returns true if there is no room of any more boxes.
//
//  You can check if a box can fit at a specific location with
//  area.isBoxTouching({x : 100, y : 100, w ; 100, h :100}, area.boxes)){ // box is touching another box
//
//  To get a list of spacer boxes. Note this is a copy of the array, changing it will not effect the functionality of BoxArea
//  const spacerArray = area.getSpacers();
//
//  Use it to get the max min box size that will fit
//
//  const maxWidthThatFits = spacerArray.sort((a,b) => b.w - a.w)[0];
//  const minHeightThatFits = spacerArray.sort((a,b) => a.h - b.h)[0];
//  const minAreaThatFits = spacerArray.sort((a,b) => (a.w * a.h) - (b.w * b.h))[0];
//
//  The following properties are available
//  area.boxes  // an array of boxes that have been added
//  x,y,width,height  // the area that boxes are fitted to
const BoxArea = (()=>{
    const defaultSettings = {
        minW : 0, // min expected size of a box
        minH : 0,
        space : 1, // spacing between boxes
    };
    const eachOf = (array, cb) => { var i = 0; const len = array.length; while (i < len && cb(array[i], i++, len) !== true ); };

    function BoxArea(settings){
        settings = Object.assign({},defaultSettings,settings);

        this.width = settings.width;
        this.height = settings.height;
        this.x = settings.x;
        this.y = settings.y;

        const space = settings.space;
        const minW = settings.minW;
        const minH = settings.minH;

        const boxes = [];  // added boxes
        const spaceBoxes = [];
        this.boxes = boxes;



        // cuts box to make space for cutter (cutter is a box)
        function cutBox(box,cutter){
            var b = [];
            // cut left
            if(cutter.x - box.x - space >= minW){
                b.push({
                    x : box.x,  y : box.y, h : box.h,
                    w : cutter.x - box.x - space,
                });
            }
            // cut top
            if(cutter.y - box.y - space >= minH){
                b.push({
                    x : box.x,  y : box.y, w : box.w,
                    h : cutter.y - box.y - space,
                });
            }
            // cut right
            if((box.x + box.w) - (cutter.x + cutter.w + space) >= space + minW){
                b.push({
                    y : box.y, h : box.h,
                    x : cutter.x + cutter.w + space,
                    w : (box.x + box.w) - (cutter.x + cutter.w + space),
                });
            }
            // cut bottom
            if((box.y + box.h) - (cutter.y + cutter.h + space) >= space + minH){
                b.push({
                    w : box.w, x : box.x,
                    y : cutter.y + cutter.h + space,
                    h : (box.y + box.h) - (cutter.y + cutter.h + space),
                });
            }
            return b;
        }
        // get the index of the spacer box that is closest in size and aspect to box
        function findBestFitBox(box, array = spaceBoxes){
            var smallest = Infinity;
            var boxFound;
            var aspect = box.w / box.h;
            eachOf(array, (sbox, index) => {
                if(sbox.w >= box.w && sbox.h >= box.h){
                    var area = ( sbox.w * sbox.h) * (1 + Math.abs(aspect - (sbox.w / sbox.h)));
                    if(area < smallest){
                        smallest = area;
                        boxFound = index;
                    }
                }
            })
            return boxFound;
        }
        // Exposed helper function
        // returns true if box is touching any boxes in array
        // else return false
        this.isBoxTouching = function(box, array = []){
            for(var i = 0; i < array.length; i++){
                var sbox = array[i];
                if(!(sbox.x > box.x + box.w + space || sbox.x + sbox.w < box.x - space ||
                    sbox.y > box.y + box.h + space || sbox.y + sbox.h < box.y - space )){
                    return true;
                }
            }
            return false;
        }
        // returns an array of boxes that are touching box
        // removes the boxes from the array
        function getTouching(box, array = spaceBoxes){
            var boxes = [];
            for(var i = 0; i < array.length; i++){
                var sbox = array[i];
                if(!(sbox.x > box.x + box.w + space || sbox.x + sbox.w < box.x - space ||
                    sbox.y > box.y + box.h + space || sbox.y + sbox.h < box.y - space )){
                    boxes.push(array.splice(i--,1)[0])
                }
            }
            return boxes;
        }

        // Adds a space box to the spacer array.
        // Check if it is inside, too small, or can be joined to another befor adding.
        // will not add if not needed.
        function addSpacerBox(box, array = spaceBoxes){
            var dontAdd = false;
            // is box to0 small?
            if(box.w < minW || box.h < minH){ return }
            // is box same or inside another box
            eachOf(array, sbox => {
                if(box.x >= sbox.x && box.x + box.w <= sbox.x + sbox.w &&
                    box.y >= sbox.y && box.y + box.h <= sbox.y + sbox.h ){
                    dontAdd = true;
                    return true;   // exits eachOf (like a break statement);
                }
            })
            if(!dontAdd){
                var join = false;
                // check if it can be joined with another
                eachOf(array, sbox => {
                    if(box.x === sbox.x && box.w === sbox.w &&
                        !(box.y > sbox.y + sbox.h || box.y + box.h < sbox.y)){
                        join = true;
                        var y = Math.min(sbox.y,box.y);
                        var h = Math.max(sbox.y + sbox.h,box.y + box.h);
                        sbox.y = y;
                        sbox.h = h-y;
                        return true;   // exits eachOf (like a break statement);
                    }
                    if(box.y === sbox.y && box.h === sbox.h &&
                        !(box.x > sbox.x + sbox.w || box.x + box.w < sbox.x)){
                        join = true;
                        var x = Math.min(sbox.x,box.x);
                        var w = Math.max(sbox.x + sbox.w,box.x + box.w);
                        sbox.x = x;
                        sbox.w = w-x;
                        return true;   // exits eachOf (like a break statement);
                    }
                })
                if(!join){ array.push(box) }// add to spacer array
            }
        }

        // Adds a box by finding a space to fit.
        // returns true if the box has been added
        // returns false if there was no room.
        this.fitBox = function(box){
            if(boxes.length === 0){ // first box can go in top left
                box.x = space;
                box.y = space;
                boxes.push(box);
                var sb = spaceBoxes.pop();
                spaceBoxes.push(...cutBox(sb,box));
            }else{
                var bf = findBestFitBox(box); // get the best fit space
                if(bf !== undefined){
                    var sb = spaceBoxes.splice(bf,1)[0]; // remove the best fit spacer
                    box.x = sb.x; // use it to position the box
                    box.y = sb.y;
                    spaceBoxes.push(...cutBox(sb,box)); // slice the spacer box and add slices back to spacer array
                    boxes.push(box);            // add the box
                    var tb = getTouching(box);  // find all touching spacer boxes
                    while(tb.length > 0){       // and slice them if needed
                        eachOf(cutBox(tb.pop(),box),b => addSpacerBox(b));
                    }
                } else {
                    return false;
                }
            }
            return true;
        }
        // Adds a box at location box.x, box.y
        // does not check if it can fit or for overlap.
        this.placeBox = function(box){
            boxes.push(box); // add the box
            var tb = getTouching(box);  // find all touching spacer boxes
            while(tb.length > 0){       // and slice them if needed
                eachOf(cutBox(tb.pop(),box),b => addSpacerBox(b));
            }
        }
        // returns a copy of the spacer array
        this.getSpacers = function(){
            return [...spaceBoxes];
        }
        this.isFull = function(){
            return spaceBoxes.length === 0;
        }
        // resets boxes
        this.reset = function(){
            boxes.length = 0;
            spaceBoxes.length = 0;
            spaceBoxes.push({
                x : this.x + space, y : this.y + space,
                w : this.width - space * 2,
                h : this.height - space * 2,
            });
        }
        this.reset();
    }
    return BoxArea;
})();


// draws a box array
function drawBoxes(list,col,col1){
    eachOf(list,box=>{
        if(col1){
            ctx.fillStyle = box.fixed ? fixedBoxColor : col1;
            ctx.fillRect(box.x+ 1,box.y+1,box.w-2,box.h - 2);
        }
        ctx.fillStyle = col;
        ctx.fillRect(box.x,box.y,box.w,1);
        ctx.fillRect(box.x,box.y,1,box.h);
        ctx.fillRect(box.x+box.w-1,box.y,1,box.h);
        ctx.fillRect(box.x,box.y+ box.h-1,box.w,1);
    })
}

// Show the process in action
ctx.clearRect(0,0,canvas.width,canvas.height);
var count = 0;
var failedCount = 0;
var timeoutHandle;
var addQuick = false;

// create a new box area
const area = new BoxArea({x : 0, y : 0, width : canvas.width, height : canvas.height, space : space, minW : minW, minH : minH});

// fit boxes until a box cant fit or count over count limit
function doIt(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(addQuick){
        while(area.fitBox(createBox()));
        count = 2000;

    }else{
        for(var i = 0; i < addCount; i++){
            if(!area.fitBox(createBox())){
                failedCount += 1;
                break;
            }
        }
    }
    drawBoxes(area.boxes,"black","#CCC");
    drawBoxes(area.getSpacers(),"red");
    if(count < 5214 && !area.isFull()){
        count += 1;
        timeoutHandle = setTimeout(doIt,10);
    }
}

// resets the area places some fixed boxes and starts the fitting cycle.
function start(event){
    clearTimeout(timeoutHandle);
    area.reset();
    failedCount = 0;
    for(var i = 0; i < numberBoxesToPlace; i++){
        var box = createBox(true); // create a fixed box
        if(!area.isBoxTouching(box,area.boxes)){
            area.placeBox(box);
        }
    }
    if(event && event.shiftKey){
        addQuick = true;
    }else{
        addQuick = false;
    }
    timeoutHandle = setTimeout(doIt,10);
    count = 0;
}
canvas.onclick = start;
start();