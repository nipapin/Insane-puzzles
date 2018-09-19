var myApp = {
    defaultColor: ['rgb(245, 245, 245)', 'rgb(255, 170, 170)', 'rgb(170, 170, 204)'],
    colorsBright: ['rgb(245, 245, 245)', 'rgb(255, 170, 170)', 'rgb(170, 170, 204)'],
    colorsDark: ['rgb(225, 225, 225)', 'rgb(255, 120, 100)', 'rgb(43, 47, 51)'],
    global: 0,
    id: null,
    swap: 0,
    clock: document.getElementsByClassName("timer")[0],
    counter: document.getElementsByClassName('counter')[0],
    field: document.getElementsByClassName('boxes')[0],
    divs: document.getElementsByTagName('div'),
    body: document.getElementsByTagName('body')[0],
    boxes: document.getElementsByClassName('tiles'),
    restart: document.getElementsByClassName('restart')[0],
    theme: document.getElementsByClassName('theme')[0],
    swapToDark: function(){
        myApp.counter.style.background = myApp.colorsBright[0];
        myApp.counter.style.color = myApp.colorsDark[2];
        myApp.restart.style.background = myApp.colorsBright[0];
        myApp.restart.style.color = myApp.colorsDark[2];
        myApp.clock.style.background = myApp.colorsBright[0];
        myApp.clock.style.color = myApp.colorsDark[2];
        for(dc = 0; dc<3; dc++)
            myApp.defaultColor[dc] = myApp.colorsDark[dc];

        for( sc = 0; sc < myApp.boxes.length; sc++)
            for(dc = 0; dc<3; dc++)
                if(myApp.boxes[sc].style.background == myApp.colorsBright[dc])
                    myApp.boxes[sc].style.background = myApp.defaultColor[dc];
    },
    swapToBright: function(){
        myApp.counter.style.background = '#aabbee';
        myApp.counter.style.color = '#ffffff';
        myApp.restart.style.background = '#aaeebb';
        myApp.restart.style.color = '#ffffff';
        myApp.clock.style.color = '#ffffff';
        myApp.clock.style.background = '#d3a3b3';
        for(dc = 0; dc<3; dc++)
            myApp.defaultColor[dc] = myApp.colorsBright[dc];

        for( sc = 0; sc < myApp.boxes.length; sc++)
            for(dc = 0; dc<3; dc++)
                if(myApp.boxes[sc].style.background == myApp.colorsDark[dc])
                    myApp.boxes[sc].style.background = myApp.defaultColor[dc];
    },
    changeTheme: function(){
    myApp.swap++;
    this.style.transform = 'rotate('+Math.pow(-1, myApp.swap)*90+'deg)';
    if(myApp.swap%2 != 0){
        myApp.body.style.background = '#3f4347';
        myApp.swapToDark();
    }
    else{
        myApp.body.style.background = '#eebbcc';
        myApp.swapToBright();
    }
    },
    timerTrigger: function() {
        s = 0;
        m = 0;
        myApp.id = setTimeout(function tick(){
            s++;
                if(s == 60){m++; s = 0}

                if(s < 10)
                    s = '0'+s;
                myApp.clock.innerText = m+':'+s;
                myApp.id = setTimeout(tick, 1000);
                if(myApp.stopDetect())
                clearTimeout(myApp.id);
        }, 1000);
    },
    reset: function() {
        if (myApp.field.children.length > 0)
            for (n = myApp.field.children.length - 1; n >= 0; n--)
                myApp.field.removeChild(myApp.field.children[n]);
        myApp.counter.innerText = 'Click:';
        myApp.clock.innerText = '0:00';
        clearTimeout(myApp.id);
        myApp.id = null;
        myApp.global = 0;
        for(di = 0; di < myApp.divs.length; di++)
            if(myApp.divs[di].className == 'final')
                myApp.body.removeChild(myApp.divs[di]);
    },
    startup: function() {
        myApp.reset();
        for (n = 1; n <= 10; n++)
            for (m = 1; m <= 10; m++) {
                var div = document.createElement('div');
                var myDiv = myApp.field.appendChild(div);
                myDiv.style.left = n * 50;
                myDiv.style.top = m * 50;
                myDiv.className = 'tiles';
                myDiv.style.background = myApp.defaultColor[0];
            }

        for (n = 0; n < myApp.boxes.length; n++) {
            myApp.boxes[n].addEventListener('click', myApp.process);
        }

        myApp.randomColor();

        return console.log('Game is Ready!');
    },
    playsound: function(tc){
    var mus = document.getElementsByClassName('audi');
    r = Math.floor(Math.random()*(mus.length-2));
    if(tc == myApp.defaultColor[1]) mus[mus.length-1].play();
    else mus[r].play();
    },
    process: function() {
        if(myApp.id == null)
        myApp.timerTrigger();
        var thisColor = this.style.background;
        myApp.global++;
        myApp.playsound(thisColor);
        myApp.counter.innerText = 'Clicks: ' + myApp.global;
        var xIndex = parseFloat(this.style.left.replace(/px/, '')) / 50;
        var yIndex = parseFloat(this.style.top.replace(/px/, '')) / 50;
        var currentPoint = [xIndex, yIndex];
        switch (thisColor) {
            case myApp.defaultColor[0]:
                myApp.unlock();
                this.style.background = myApp.defaultColor[1];
                break;
            case myApp.defaultColor[2]:
                myApp.unlock();
            break;
        }
        if(thisColor != myApp.defaultColor[1])
            myApp.searchAdjacent(currentPoint);
        myApp.final();
    },
    unlock: function() {
        for (r = 0; r < myApp.boxes.length; r++){
            if (myApp.boxes[r].style.background == myApp.defaultColor[1]){
                myApp.boxes[r].style.background = myApp.defaultColor[2];
                break;
            }
        }
    },
    searchAdjacent: function(point) {
        for (x = -1; x <= 1; x++)
            for (y = -1; y <= 1; y++) {
                if (x == 0 && y == 0) {
                continue;
                } else {
                    var a = point[0] + x;
                    var b = point[1] + y;
                    if (a >= 1 && a <= 10 && b >= 1 && b <= 10)
                        myApp.recolor(a, b);
                }
            }
    },
    recolor: function(i, j) {
        for (n = 0; n < myApp.boxes.length; n++) {
            var xside = myApp.boxes[n].style.left;
            var yside = myApp.boxes[n].style.top;
            var c = myApp.boxes[n].style.background;
            if (xside == i * 50 + 'px' && yside == j * 50 + 'px'){
                    if(c == myApp.defaultColor[0])
                    myApp.boxes[n].style.background = myApp.defaultColor[2];
                    else if(c == myApp.defaultColor[2])
                    myApp.boxes[n].style.background = myApp.defaultColor[0];
                    else if(c == myApp.defaultColor[1])
                    myApp.boxes[n].style.background = myApp.defaultColor[2];
                }
            }
        },
    randomColor: function() {
        for (t = 0; t < 10; t++) {
            var xR = Math.floor(Math.random() * 10) + 1;
            var xY = Math.floor(Math.random() * 10) + 1;
            for (n = 0; n < myApp.boxes.length; n++)
                if (myApp.boxes[n].style.left == xR * 50 + 'px' && myApp.boxes[n].style.top == xY * 50 + 'px')
                    myApp.boxes[n].style.background = myApp.defaultColor[2];
        }
    },
    stopDetect: function() {
        var filled = 0;

        for (f = 0; f < myApp.boxes.length; f++) 
            if (myApp.boxes[f].style.background == myApp.defaultColor[2])
                filled++;

        return (filled==100);
    },
    final: function() {
        if (myApp.stopDetect()) {
            for (f = 0; f < myApp.boxes.length; f++) {
                myApp.boxes[f].removeEventListener('click', myApp.process);
            }
        myApp.congratulation();
        }
    },
    congratulation: function() {
        var newDiv = document.createElement('div');
        var finalPanel = myApp.body.appendChild(newDiv);
        finalPanel.className = 'final';
        finalPanel.innerText = 'Congratulation!';
    }
}
document.addEventListener('DOMContentLoaded', myApp.startup);
myApp.restart.addEventListener('click', myApp.startup);
myApp.theme.addEventListener('click', myApp.changeTheme);