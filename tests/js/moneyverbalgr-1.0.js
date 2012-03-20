/*@thodoris@thodoris.net*/


/**
* moneyverbalgr.js
* @author: Thodoris Papadopoulos
* @version: 1.0.4
*
* Created by Thodoris Papadopoulos on 2012-02-13. Please report any bug at...
*
* Copyright (c) 2012 Thodoris Papadopoulos http://www.thodoris.net
*
* The MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/* Dictionaries */ 
var m = ["", "ΕΝΑ ", "ΔΥΟ ", "ΤΡΙΑ ", "ΤΕΣΣΕΡΑ ", "ΠΕΝΤΕ ", "ΕΞΙ ", "ΕΠΤΑ ", "ΟΚΤΩ ", "ΕΝΝΕΑ "];
var mF = ["", "ΜΙΑ ", "", "ΤΡΕΙΣ ", "ΤΕΣΣΕΡΙΣ "];
var d1 = ["ΔΕΚΑ ", "ΕΝΤΕΚΑ ", "ΔΩΔΕΚΑ "];
var d = ["", "ΔΕΚΑ", "ΕΙΚΟΣΙ ", "ΤΡΙΑΝΤΑ ", "ΣΑΡΑΝΤΑ ", "ΠΕΝΗΝΤΑ ", "ΕΞΗΝΤΑ ", "ΕΒΔΟΜΗΝΤΑ ", "ΟΓΔΟΝΤΑ ", "ΕΝΕΝΗΝΤΑ "];
var e = ["", "ΕΚΑΤΟ", "ΔΙΑΚΟΣΙ", "ΤΡΙΑΚΟΣΙ", "ΤΕΤΡΑΚΟΣΙ", "ΠΕΝΤΑΚΟΣΙ", "ΕΞΑΚΟΣΙ", "ΕΠΤΑΚΟΣΙ", "ΟΚΤΑΚΟΣΙ", "ΕΝΝΙΑΚΟΣΙ"];
var idx = ["ΛΕΠΤΑ", "ΕΥΡΩ ", "ΧΙΛΙΑΔΕΣ ", "ΕΚΑΤΟΜΜΥΡΙ", "ΔΙΣ", "ΤΡΙΣ", "ΤΕΤΡΑΚΙΣ ", "ΠΕΝΤΑΚΙΣ "];

/* Math Function Ovverides */
Math._round = Math.round;
Math.round = function (number, precision) {
    precision = Math.abs(parseInt(precision)) || 0;
    var coefficient = Math.pow(10, precision);
    return Math._round(number * coefficient) / coefficient;
}

/*******************/
/* Helpers         */
/*******************/

function Cast(value) {
  return Number(value);
}


/* Returns the integer part of a number */
function intPart(num) {
    return Math.floor(num);
}

/* Returns the decimal part of a number */
function decimalPart(num) {
    var n = (num + "").split(".")[1];
    return n;
}

/*******************/
/* Public Functions*/
/*******************/

/* Call this function to take the verbal representation of an amount */
function GetGreekVerbal(money, showZero, showCurrency) {
    var str = "";
    var index = 0;
    var isZero = true;
    var isNegative = false;
    if (money < 0) {
        money = -money;
        isNegative = true;
    }
   if (money!==intPart(money)) { 
       var value = decimalPart(money); 
       
        if (value >= 100) {
            value -= 100;
            money += 1.0;
        }
        money = intPart(money);  
        if (value > 0) {
            isZero = false;
            if (money >= 1 && value > 0) {
                str += "ΚΑΙ ";
            }
            str += GetValue(value, index, showCurrency);
        }
    }
    while (money >= 1) {
        isZero = false;
        var value2 = Cast((Cast(money) % 1000));
        money = Math.round((money/1000)-0.5);
        index += 1;
        str = GetValue(value2, index, showCurrency) + str;
        money = Cast(money);
    }
    if (isZero) {
        if (showZero) {
            str = "ΜΗΔΕΝ  ";
            if (showCurrency) {
                str += idx[1];
            }
        }
    }
    else {
        if (isNegative)
            str.Insert(0, "MEION ");
    }
    return str;
}

/********************/
/* Private Functions*/
/********************/
function GetValue(money, index, showCurrency) {

    
    if (index===2 && money===1)  return "ΧΙΛΙΑ ";
    

    var str = "";
    var dekmon = money % 100;
    var monades = dekmon % 10;
    var ekatontades = Math.round((money / 100) - 0.5);
    var dekades = Math.round((dekmon / 10)- 0.5);
    if (ekatontades===1) {
        if (dekmon===0) {
            str = e[1] + " ";
        }
        else {
            str = e[1] + "Ν ";
        }
    }
    else if (ekatontades > 1) {
        if (index===2) {
            str = e[ekatontades] + "ΕΣ ";
        }
        else {
            str = e[ekatontades] + "Α  ";
        }
    }
    switch (dekmon) {
        case 10:
            str += d1[monades];
            break;
        case 11:
            str += d1[monades];
            monades = 0;
            break;
        case 12:
            str += d1[monades];
            monades = 0;
            break;
        default:
            str += d[dekades];
            break;
    }
    if ((index===2) && (monades===1 || monades===3 || monades===4)) {
        str += mF[monades];
    }
    else {
        if (dekmon < 10 || dekmon > 12) {
            str += m[monades];
        }
    }
    if (str.length > 0 || index===1) {
        if (index===0 && money===1) {
            if (showCurrency) {
                str += "ΛΕΠΤΟ ";
            }
        }
        else {
            if (index > 1 || showCurrency) {
                str += idx[index];
                if (index > 2) {
                    if (index > 3) {
                        str += idx[3];
                    }
                    if (money > 1) {
                        str += "Α ";
                    }
                    else {
                        str += "Ο ";
                    }
                }
            }
        }
    }
    return str;
}

