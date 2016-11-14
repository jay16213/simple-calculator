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
            
            //button C
            if (btnVal == 'init') {
                init();
                curState = IDLE;
            }
            
            //button CE
            else if(btnVal == 'clear') {
                while(main.value != '' && !isOperator(main.value[main.value.length-1]))
                    back();
                
                if(main.value == '-')//negative number
                    back();
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
                back();
            
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
                    if(isOperator(equation[equation.length-1])) {
                        back();//clear the old operator
                    }
                    
                    if(main.value == '') {//negative number
                        if(btnVal == '-') main.value += btnVal;
                    }
                    else main.value += btnVal;//replace with new operator
                }
                else if(isValidButton(btnVal)) {
                    main.value += btnVal;
                    
                    //convert number to different carry system if possible
                    carrySystem(main.value);
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
    curState = IDLE;
}

//check if necessary to clear the screen
function displayController (btnVal) {
    if(curState == IDLE) main.value = '';
    else if(curState == ANS && isNum(btnVal)) main.value = '';

    curState = OP;
}

//convert the number to different carry systems(2,8,16) if ans is a valid number
function carrySystem (ans) {
    if(Number(ans) != NaN) {
        var num = parseInt(ans, CARRY);
        hex.value = num.toString(HEX);
        dec.value = num.toString(DEC);
        oct.value = num.toString(OCT);
        bin.value = num.toString(BIN);
    }
}

//positive to negative or negative to positive
function changeSign () {
    //if main.value is a number, not an equation
    if(main.value.indexOf("+") == -1 && main.value.indexOf("-") <= 0 && 
    main.value.indexOf("*") == -1 && main.value.indexOf("/") == -1 && main.value.indexOf("%") == -1) {
        main.value = (-parseInt(main.value, CARRY)).toString(CARRY);
    }
}

function back() {
    main.value = main.value.substr(0, main.value.length - 1);
}

function isOperator (btnVal) {
    return btnVal == '+' || btnVal == '-' || btnVal == '*' || btnVal == '/' || btnVal == '%';
}

function isNum (btnVal) {
    return (btnVal >= '0' && btnVal <= '9') || (btnVal >= 'A' && btnVal <= 'F');
}

//set carry system
function setCarry(new_carry) {
    if(Number(main.value) != NaN) {//if there is a number, convert it to new_carry system
        main.value = parseInt(main.value, CARRY).toString(new_carry);
    }
    else init();//otherwise, init the screen
    
    CARRY = new_carry;//set carry
    carrySystem(main.value);

    alert("You have changed the carry system to " + CARRY);
}

//compute ans in present carry system
function computeAns(equation) {
    switch(CARRY) {
        case DEC: main.value = eval(equation); break;
        default: main.value = computeInCarry(equation); break;
    }
}

function computeInCarry(equation) {
    var e = '';
    var tmp_num = '';
    
    if(equation[0] == '-') e += equation[0];//if the first operand is negative
    else tmp_num += equation[0];//otherwise, just put number in tmp_num
    
    for(var i = 1; i < equation.length; i++) {
        if(isOperator(equation[i])) {
            //change tmp_num(N-base) to a 10-base integer, then convert to string
            e += parseInt(tmp_num, CARRY).toString(DEC) + equation[i];
            tmp_num = '';//clear
        }
        else tmp_num += equation[i];
    }
    e += parseInt(tmp_num, CARRY).toString(DEC);//attach the last number
    
    return Number(eval(e)).toString(CARRY);
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