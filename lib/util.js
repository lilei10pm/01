/**
 * Created by Administrator on 2017/7/17 0017.
 */
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function getpm25Level(pm25) {
    if (pm25 <= 35) {
        return 1;
    } else if (35 < pm25 && pm25 <= 75) {
        return 2;
    } else if (75 < pm25 && pm25 <= 115) {
        return 3;
    } else if (115 < pm25 && pm25 <= 150) {
        return 4;
    } else if (150 < pm25 && pm25 <= 250) {
        return 5;
    } else if (250 < pm25 && pm25 <= 350) {
        return 6;
    } else if (pm25 < 500) {
        return 7;
    } else {
        return 8;
    }
}

function getpm10Level(pm10) {
    if (pm10 <= 50) {
        return 1;
    } else if (pm10 <= 150) {
        return 2;
    } else if (pm10 <= 250) {
        return 3;
    } else if (pm10 <= 350) {
        return 4;
    } else if (pm10 <= 420) {
        return 5;
    } else if (pm10 <= 500) {
        return 6;
    } else if (pm10 <= 600) {
        return 7;
    } else {
        return 8;
    }
}
function getValueBylevel(type, level) {
    var pm10level = [50, 150, 250, 350, 420, 500, 600, 11000];
    var pm25level = [35, 75, 115, 150, 250, 350, 500, 11000];
    var themap = pm10level;
    if (type == "pm25") {
        themap = pm25level;
    }

    return themap[level - 1];
}
function getpmlevel(type, value) {
    var v = parseInt(value);
    if (isNaN(v)) {
        return "_invalid";
    }
    if (type == "pm25") {
        return getpm25Level(value);
    } else {
        return getpm10Level(value);
    }
}
function getlevelcolor(level) {
    var colormap = {
        "_invalid": "#888",
        "1": "#67ce0b",
        "2": "#f2d62d",
        "3": "#fa8a04",
        "4": "#f80302",
        "5": "#cf0000",
        "6": "#970454",
        "7": "#5f021d",
        "8": "#A8A5A5"
    };
    return colormap[level + ""];
}
function getgradientcolor(type, value) {
    var level = getpmlevel(type, value);
    var stopColor = getlevelcolor(level);
    if (level == "_invalid" || level == 1) {
        return stopColor;
    }

    var _colorRgb = colorRgb(stopColor),
        _colorRgb2 = _slicedToArray(_colorRgb, 3),
        stopR = _colorRgb2[0],
        stopG = _colorRgb2[1],
        stopB = _colorRgb2[2];

    var startColor = getlevelcolor(level - 1);

    var _colorRgb3 = colorRgb(startColor),
        _colorRgb4 = _slicedToArray(_colorRgb3, 3),
        startR = _colorRgb4[0],
        startG = _colorRgb4[1],
        startB = _colorRgb4[2]; //ת��Ϊrgb����ģʽ


    var lastlevelValue = getValueBylevel(type, level - 1);
    var nextLevelValue = getValueBylevel(type, level);
    var o = (value - lastlevelValue) / (nextLevelValue - lastlevelValue);
    var sR = (stopR - startR) * o; //�ܲ�ֵ
    var sG = (stopG - startG) * o;
    var sB = (stopB - startB) * o;
    // console.log(o)
    return colorHex('rgb(' + parseInt(sR + startR) + ',' + parseInt(sG + startG) + ',' + parseInt(sB + startB) + ')');
}
function colorHex(rgb) {
    var _this = rgb;
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (/^(rgb|RGB)/.test(_this)) {
        var aColor = _this.replace(/(?:(|)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i = 0; i < aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            hex = hex < 10 ? 0 + '' + hex : hex; // ��֤ÿ��rgb��ֵΪ2λ
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = _this;
        }
        return strHex;
    } else if (reg.test(_this)) {
        var aNum = _this.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return _this;
        } else if (aNum.length === 3) {
            var numHex = "#";
            for (var i = 0; i < aNum.length; i += 1) {
                numHex += aNum[i] + aNum[i];
            }
            return numHex;
        }
    } else {
        return _this;
    }
}
function colorRgb(sColor) {
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var sColor = sColor.toLowerCase();
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //������λ����ɫֵ
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return sColorChange;
    } else {
        return sColor;
    }
};
function floatTo1Point(x) {
    var y = parseFloat(x);
    if (isNaN(y)) {
        return y;
    } else {
        if (x > 100) {
            return parseInt(x);
        }
        return parseFloat(y.toFixed(1));
    }
}

//eg: getgradientcolor("pm25",111) ������Ӧ��rgbֵ