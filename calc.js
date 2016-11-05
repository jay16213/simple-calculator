window.onload = function() {
    var btns = document.querySelectorAll('button');
    const INIT = 0, ANS = 1, EX = 2;
    var curState = INIT;
    
    for(var i = 0; i < btns.length; i++) {
        btns[i].onclick = function(e) {
            var display = document.querySelector('#main');
            var equation = display.value;
            var btnVal = this;
            
            if(btnVal.innerHTML == 'C' || btnVal.innerHTML == 'CE') {
                display.value = '0';
                initialize();
                curState = INIT;
            }
            else if(btnVal.innerHTML == '=') {
                if(equation != '') {
                    display.value = eval(equation);
                    carrySystem(Number(display.value));
                    curState = ANS;
                }
            }
            else if(btnVal.innerHTML == '&plusmn;') {
                if(Number(display.value) != NaN)
                    display.value = -display.value;
            }
            else {
                if(curState == INIT || curState == ANS) {
                    display.value = "";
                    curState = EX;
                }
                
                if(btnVal.innerHTML == 'Mod')
                    display.value += '%'
                else if(btnVal.value == "back")
                    display.value.substr(0, display.value.length - 1);
                else
                    display.value += btnVal.innerHTML;
            }
            //prevent page jumps;
            e.preventDefault();
        }
    }
};

function initialize() {
    var hex = document.querySelector('#hex');
    var dec = document.querySelector('#dec');
    var oct = document.querySelector('#oct');
    var bin = document.querySelector('#bin');
    hex.value = '0';
    dec.value = '0';
    oct.value = '0';
    bin.value = '0';
}

function carrySystem(mainVal) {
    var hex = document.querySelector('#hex');
    var dec = document.querySelector('#dec');
    var oct = document.querySelector('#oct');
    var bin = document.querySelector('#bin');
    hex.value = mainVal.toString(16);
    dec.value = mainVal;
    oct.value = mainVal.toString(8);
    bin.value = mainVal.toString(2);
}