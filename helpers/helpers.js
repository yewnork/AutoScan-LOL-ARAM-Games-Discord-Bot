function CurrentDateTime() {
    var current = new Date();
    var timestamp = current.toLocaleString();

    return timestamp;
}

function CurrentDateTimeForFileName() {
    var today = new Date();
    var y = today.getFullYear();
    var m = today.getMonth() + 1;     // JavaScript months are 0-based.
    m = m.toString().padStart(2, '0');
    var d = today.getDate();
    d = d.toString().padStart(2, '0');
    var h = today.getHours();
    h = h.toString().padStart(2, '0');
    var mi = today.getMinutes();
    mi = mi.toString().padStart(2, '0');
    var s = today.getSeconds();
    s = s.toString().padStart(2, '0');
    return y + "." + m + "." + d + "-" + h + "." + mi + "." + s;
}

export { CurrentDateTime, CurrentDateTimeForFileName };
