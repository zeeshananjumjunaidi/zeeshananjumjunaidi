if (window.addEventListener) {
    window.addEventListener('load', GetOutput);
} else if (window.attachEvent) {
    window.attachEvent('onload', GetOutput);
} else {
    window.onload = GetOutput;
}

function GetOutput() {
    let input = document.querySelector('#qr_data');
    let output = document.querySelector('#output')
    let b64Data = input.value;
    let outputData = '';
    if (b64Data) {
        outputData = parseTLVData(_base64ToArrayBuffer(b64Data));
        output.innerHTML = outputData;
    } else {
        output.innerHTML ='<b style="color:crimson;">Please enter base64 Data from QR Code</b>';
    }
}
function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}
function parseTLVData(bytesArray) {
    data = '<table><tr><th>Tag</th><th>Length</th><th>Value</th></tr>';
    start = true;
    let i = 0;
    while (i < bytesArray.length) {
        let b = bytesArray[i];
        data += `<tr><td>${b}</td>`;
        i++;
        let tagLength = bytesArray[i];
        data += `<td>${tagLength}</td>`;
        i++;
        let value = uintToString(bytesArray.slice(i, i + tagLength + 2));
        i += tagLength;
        data += `<td>${value}</td></tr>`;


    }
    data += '</table>';
    return data;
}
function uintToString(uintArray) {
    var encodedString = String.fromCharCode.apply(null, uintArray),
        decodedString = decodeURIComponent(escape(encodedString));
    return decodedString;
}