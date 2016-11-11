const IDLE = 0, OP = 1, ANS = 2;//OP = operation
const HEX = 16, DEC = 10, OCT = 8, BIN = 2;
var curState = IDLE;
var CARRY = DEC;

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
                init();
                curState = IDLE;
            }
            
            //compute the ans
            else if (btnVal == '=') {
                if (equation != '') {
                    computeAns(equation);
                    //change the ans to different carry systems
                    carrySystem(Number(main.value));
                    //main value should display with present carry system
                    mainValController();
                    curState = ANS;
                }
            }
            
            //backspace button
            else if (btnVal == 'back')
                main.value = main.value.substr(0, main.value.length - 1);
            
            //change the sign of number
            else if (btnVal == 'neg')
                changeSign();
            
            //add value to screen
            else {
                
                //control the main screen
                displayController(btnVal);

                //any two operators shouldn't be placed continuously
                if (isOperator(btnVal)) {
                    if (!isOperator(equation[equation.length - 1]))
                        if (main.value != '')//avoid invalid equation
                            main.value += btnVal;
                        else if (main.value == '' && btnVal == '-')
                            main.value += btnVal;
                }
                else if(isValidButton(btnVal))
                    main.value += btnVal;//just put the number
            }
            //prevent page jumps;
            e.preventDefault();
        }
    }
};

function mainValController() {
    switch(CARRY) {
        case DEC: break;
        case HEX: main.value = hex.value; break;
        case OCT: main.value = oct.value; break;
        case BIN: main.value = bin.value; break;
    }
}

function displayController (btnVal) {
    if(curState == IDLE) main.value = '';
    else if(curState == ANS && isNum(btnVal)) main.value = '';

    curState = OP;
}

function init () {
    main.value = '0';
    hex.value = '0';
    dec.value = '0';
    oct.value = '0';
    bin.value = '0';
}

//change the ans to different carry systems(2,8,16)
function carrySystem (ans) {
    hex.value = ans.toString(16);
    dec.value = ans;
    oct.value = ans.toString(8);
    bin.value = ans.toString(2);
}

function changeSign () {
    if(!isNaN(main.value))
        main.value = -main.value;
}

function isOperator (btnVal) {
    return btnVal == '+' || btnVal == '-' || btnVal == '*' || btnVal == '/' || btnVal == '%';
}

function isNum (btnVal) {
    return (btnVal >= '0' && btnVal <= '9') || (btnVal >= 'A' && btnVal <= 'F');
}

function setCarry(new_carry) {
    CARRY = new_carry;
    alert("You have changed the carry system to " + CARRY);
    init();
    curState = IDLE;
}

function computeAns(equation) {
    switch(CARRY) {
        case DEC: main.value = eval(equation); break;
        case HEX: main.value = computeInHex(equation); break;
        case OCT: main.value = computeInOct(equation); break;
        case BIN: main.value = computeInBin(equation); break;
    }
}

function computeInHex(equation) {
    var e = '';
    var tmp_num = '';
    
    for(var i = 0; i < equation.length; i++) {
        if(isOperator(equation[i])) {
            //change tmp_num(16-base) to a 10-base integer, then convert to string
            //because the parameter of eval must be a string
            e += parseInt(tmp_num, 16).toString() + equation[i];
            tmp_num = '';//clear
        }
        else tmp_num += equation[i];
    }
    e += parseInt(tmp_num, 16).toString();//attach the last number
    
    return eval(e);
}

function computeInOct(equation) {
    var e = '';
    var tmp_num = '';
    
    for(var i = 0; i < equation.length; i++) {
        if(isOperator(equation[i])) {
            e += parseInt(tmp_num, 8).toString() + equation[i];
            tmp_num = '';//clear
        }
        else tmp_num += equation[i];
    }
    e += parseInt(tmp_num, 8).toString();//attach the last number
    
    return eval(e);
}

function computeInBin(equation) {
    var e = '';
    var tmp_num = '';
    
    for(var i = 0; i < equation.length; i++) {
        if(isOperator(equation[i])) {
            e += parseInt(tmp_num, 2).toString() + equation[i];
            tmp_num = '';//clear
        }
        else tmp_num += equation[i];
    }
    e += parseInt(tmp_num, 2).toString();//attach the last number
    
    return eval(e);
}

function isValidButton(btnVal) {
    switch(CARRY) {
        case HEX:
            return true;
        case DEC:
            return btnVal >= '0' && btnVal <= '9';
        case OCT:
            return btnVal >= '0' && btnVal <= '7';
        case BIN:
            return btnVal >= '0' && btnVal <= '1';
    }
}