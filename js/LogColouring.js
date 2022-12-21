
function ColouredStringGen(str = undefined, colour = "red") {
    if (str === undefined)
        str = this;
    return GetColouredString(str, colour);
}


function GetColouredString(str, colour) {
    switch (colour) {
        case "red":
            return `\x1b[31m${str}\x1b[0m`;
            break;
        case "green":
            return `\x1b[32m${str}\x1b[0m`;
        case "yellow":
            return `\x1b[33m${str}\x1b[0m`;
        case "magenta":
            return `\x1b[35m${str}\x1b[0m`;
        case "blue":
            return `\x1b[34m${str}\x1b[0m`;
        case "cyan":
            return `\x1b[36m${str}\x1b[0m`;

    }
};


String.prototype.GetColouredString = ColouredStringGen;

String.prototype.red = function () {
    return this.GetColouredString(undefined, "red");
}
String.prototype.blue = function () {
    return this.GetColouredString(undefined, "blue");
}
String.prototype.yellow = function () {
    return this.GetColouredString(undefined, "yellow");
}
String.prototype.magenta = function () {
    return this.GetColouredString(undefined, "magenta");
}
String.prototype.cyan = function () {
    return this.GetColouredString(undefined, "cyan");
}
String.prototype.green = function () {
    return this.GetColouredString(undefined, "green");
}