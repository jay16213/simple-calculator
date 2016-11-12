const IDLE = 0, OP = 1, ANS = 2;//the state for calculator, OP = operation
const HEX = 16, DEC = 10, OCT = 8, BIN = 2;//present carry system
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
                    carrySystem(main.value);
                    curState = ANS;
                }
            }
            
            //backspace button
            else if (btnVal == 'back')
                main.value = main.value.substr(0, main.value.length - 1);
            
            //change the sign of number
            else if (btnVal == 'neg') {
                changeSign();
                carrySystem(main.value);
            }
            
            //add value to screen
            else {
                
                //control the main screen
                displayController(btnVal);

                //any two operators shouldn't be placed continuously
                if (isOperator(btnVal)) {
                    if (!isOperator(equation[equation.length - 1]))
                        if (main.value != '')//avoid invalid equation
                            main.value += btnVal;
                        else if (main.value == '' && btnVal == '-')//negative number
                            main.value += btnVal;
                }
                else if(isValidButton(btnVal)) {
                    main.value += btnVal;
                    
                    //change number to different carry system if possible
                    if(Number(main.value) != NaN) carrySystem(main.value);
                }
                else alert("Shouldn't input " + btnVal + " in carry system " + CARRY);
            }
            //prevent page jumps;
            e.preventDefault();
        }
    }
};

function init () {
    main.value = '0';
    hex.value = '0';
    dec.value = '0';
    oct.value = '0';
    bin.value = '0';
}

//check if necessary to clear the screen
function displayController (btnVal) {
    if(curState == IDLE) main.value = '';
    else if(curState == ANS && isNum(btnVal)) main.value = '';

    curState = OP;
}

//change the number to different carry systems(2,8,16)
function carrySystem (ans) {
    switch(CARRY) {
        case HEX:
            var num = parseInt(ans, HEX);
            hex.value = num.toString(HEX);
            dec.value = num.toString(DEC);
            oct.value = num.toString(OCT);
            bin.value = num.toString(BIN);
            break;
        case DEC:
            var num = parseInt(ans, DEC);
            hex.value = num.toString(HEX);
            dec.value = num.toString(DEC);
            oct.value = num.toString(OCT);
            bin.value = num.toString(BIN);
            break;
        case OCT:
            var num = parseInt(ans, OCT);
            hex.value = num.toString(HEX);
            dec.value = num.toString(DEC);
            oct.value = num.toString(OCT);
            bin.value = num.toString(BIN);
            break;
        case BIN:
            var num = parseInt(ans, BIN);
            hex.value = num.toString(HEX);
            dec.value = num.toString(DEC);
            oct.value = num.toString(OCT);
            bin.value = num.toString(BIN);
            break;
    }
}

//positive to negative or negative to positive
function changeSign () {
    //if main.value is a number, not an equation
    if(main.value.indexOf("+") == -1 && main.value.indexOf("-") <= 0 && 
    main.value.indexOf("*") == -1 && main.value.indexOf("/") == -1 && main.value.indexOf("%") == -1) {
        
        //hex contains english char, so we have to change it to an integer first
        if(CARRY == HEX)
            main.value = (-parseInt(main.value, HEX)).toString(HEX);
        else main.value = -main.value;
    }
}

function isOperator (btnVal) {
    return btnVal == '+' || btnVal == '-' || btnVal == '*' || btnVal == '/' || btnVal == '%';
}

function isNum (btnVal) {
    return (btnVal >= '0' && btnVal <= '9') || (btnVal >= 'A' && btnVal <= 'F');
}

//set carry system
function setCarry(new_carry) {
    CARRY = new_carry;
    alert("You have changed the carry system to " + CARRY);
    init();
    curState = IDLE;
}

//compute ans in present carry system
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
    
    if(equation[0] == '-') e += equation[0];//if the first operand is negative
    else tmp_num += equation[0];//otherwise, just put number in tmp_num
    
    for(var i = 1; i < equation.length; i++) {
        if(isOperator(equation[i])) {
            //change tmp_num(N-base) to a 10-base integer, then convert to string
            //because the parameter of eval must be a string
            e += parseInt(tmp_num, HEX).toString(DEC) + equation[i];
            tmp_num = '';//clear
        }
        else tmp_num += equation[i];
    }
    e += parseInt(tmp_num, HEX).toString(DEC);//attach the last number
    
    return Number(eval(e)).toString(HEX);//change ans to present carry system
}

function computeInOct(equation) {
    var e = '';
    var tmp_num = '';
    
    if(equation[0] == '-') e += equation[0];
    else tmp_num += equation[0];
    
    for(var i = 1; i < equation.length; i++) {
        if(isOperator(equation[i])) {
            e += parseInt(tmp_num, OCT).toString(DEC) + equation[i];
            tmp_num = '';//clear
        }
        else tmp_num += equation[i];
    }
    e += parseInt(tmp_num, OCT).toString();//attach the last number
    
    return Number(eval(e)).toString(OCT);
}

function computeInBin(equation) {
    var e = '';
    var tmp_num = '';
    
    if(equation[0] == '-') e += equation[0];
    else tmp_num += equation[0];
    
    for(var i = 1; i < equation.length; i++) {
        if(isOperator(equation[i])) {
            e += parseInt(tmp_num, BIN).toString(DEC) + equation[i];
            tmp_num = '';//clear
        }
        else tmp_num += equation[i];
    }
    e += parseInt(tmp_num, BIN).toString(DEC);//attach the last number
    
    return Number(eval(e)).toString(BIN);
}

//detect if the number is valid in the carry system
//ex. shouldn't input 'A' in dec system
function isValidButton(btnVal) {
    switch(CARRY) {
        case HEX: return true;
        case DEC: return btnVal >= '0' && btnVal <= '9';
        case OCT: return btnVal >= '0' && btnVal <= '7';
        case BIN: return btnVal >= '0' && btnVal <= '1';
    }
}