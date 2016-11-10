const IDLE = 0, OP = 1, ANS = 2;//OP = operation
var curState = IDLE;

window.onload = function () {
    var btns = document.querySelectorAll('button');
    
    for (var i = 0; i < btns.length; i++) {
        btns[i].onclick = function (e) {
            //get display elements
            var main = document.querySelector('#main');
            var hex = document.querySelector('#hex');
            var dec = document.querySelector('#dec');
            var oct = document.querySelector('#oct');
            var bin = document.querySelector('#bin');
            
            var equation = main.value;
            var btnVal = this.value;
            
            //clear the screen
            if (btnVal == 'init') {
                init(main, hex, dec, oct, bin);
                curState = IDLE;
            }
            
            //compute the ans
            else if (btnVal == '=') {
                if (equation != '') {
                    main.value = eval(equation);
                    //change the ans to different carry systems
                    carrySystem(Number(main.value), hex, dec, oct, bin);
                    curState = ANS;
                }
            }
            
            //backspace button
            else if (btnVal == 'back')
                main.value = main.value.substr(0, main.value.length - 1);
            
            //change the sign of number
            else if (btnVal == 'neg')
                changeSign(main);
            
            //add value to screen
            else {
                
                //control the main screen
                displayController(main, btnVal);

                //any two operators shouldn't be placed continuously
                if (isOperator(btnVal)) {
                    if (!isOperator(equation[equation.length - 1]))
                        if (main.value != '')//avoid invalid equation
                            main.value += btnVal;
                        else if (main.value == '' && btnVal == '-')
                            main.value += btnVal;
                }
                else
                    main.value += btnVal;//just put the number
            }
            //prevent page jumps;
            e.preventDefault();
        }
    }
};

function displayController (main, btnVal) {
    if(curState == IDLE) {
        main.value = '';//if curState is IDLE, clear the screen
        curState = OP;//change state to OP
    }
    else if(curState == ANS) {
        if(isNum(btnVal)) main.value = '';
        curState = OP;
    }
}

function init (main, hex, dec, oct, bin) {
    main.value = '0';
    hex.value = '0';
    dec.value = '0';
    oct.value = '0';
    bin.value = '0';
}

//change the ans to different carry systems(2,8,16)
function carrySystem (ans, hex, dec, oct, bin) {
    hex.value = ans.toString(16);
    dec.value = ans;
    oct.value = ans.toString(8);
    bin.value = ans.toString(2);
}

function changeSign (main) {
    if(!isNaN(main.value))
        main.value = -main.value;
}

function isOperator (btnVal) {
    return btnVal == '+' || btnVal == '-' || btnVal == '*'
            || btnVal == '/' || btnVal == '%';
}

function isNum (btnVal) {
    return (btnVal >= '0' && btnVal <= 9) || (btnVal >= 'A' && btnVal <= 'F');
}