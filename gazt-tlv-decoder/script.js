console.log("%c If you are looking for the code of this program, Please visit my github link:", 'background: #333; font-size:large; padding:2px; color: #c2962e');
console.info("%c https://github.com/zeeshananjumjunaidi/zeeshananjumjunaidi", "color:#04574d; font-weight:bolder;");

if (window.addEventListener) {
    window.addEventListener('load', InitApp);
} else if (window.attachEvent) {
    window.attachEvent('onload', InitApp);
} else {
    window.onload = InitApp;
}

var video;
var canvasElement;
var canvas;
var loadingMessage;
var outputContainer;
var outputMessage;
var stopCameraButton;
var scanButton;
var cameraStreaming;

var clearOutputButton;

var imgPreview;

function InitApp() {

    clearOutputButton = document.querySelector('#clearOutputButton');
    video = document.createElement("video");
    canvasElement = document.getElementById("canvas");
    canvas = canvasElement.getContext("2d");
    loadingMessage = document.getElementById("loadingMessage");
    outputContainer = document.getElementById("output");
    outputMessage = document.getElementById("outputMessage");
    scanButton = document.querySelector('#scanButton');
    stopCameraButton = document.querySelector('#stopCameraButton');

    imgPreview = document.querySelector('#image-preview');

    ko.applyBindings(new TabViewModel());
    GetOutput();
}
function scanQR() {



    stopCameraButton.addEventListener('click', stopCamera);
    stopCameraButton.hidden = true;
    scanButton.hidden = false;
    function stopCamera() {
        if (cameraStreaming) {
            cameraStreaming.getTracks().forEach(function (track) { track.stop(); });
        }
        stopCameraButton.hidden = true;
        scanButton.hidden = false;
        cameraStreaming = undefined;
    }
    function drawLine(begin, end, color) {
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 4;
        canvas.strokeStyle = color;
        canvas.stroke();
    }

    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
        video.srcObject = cameraStreaming = stream;
        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.play();
        stopCameraButton.hidden = false;
        scanButton.hidden = true;
        requestAnimationFrame(tick);
    });

    function tick() {
        loadingMessage.innerText = "⌛ Loading video..."
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            loadingMessage.hidden = true;
            canvasElement.hidden = false;
            outputContainer.hidden = false;

            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#c2962e");
                drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#c2962e");
                drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#c2962e");
                drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#c2962e");
                outputMessage.hidden = false;
                outputMessage.innerText = code.data;
                stopCamera();
                parseAndPrintData(code.data);

            } else {
                outputMessage.hidden = true;
            }
        }
        requestAnimationFrame(tick);
    }

}


function GetOutput() {
    let input = document.querySelector('#qr_data');
    // let output = document.querySelector('#output');
    let b64Data = input.value;
    parseAndPrintData(b64Data);
}
function parseAndPrintData(b64Data) {
    let outputData = '';
    if (b64Data) {
        outputData = parseTLVData(_base64ToArrayBuffer(b64Data));
        output.innerHTML = outputData;
        clearOutputButton.hidden = false;
    } else {
        clearOutputButton.hidden = true;
        output.innerHTML = '<b style="color:crimson;">Please enter base64 Data from QR Code</b>';
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


// possible value = 'input', 'file','camera'
var TabViewModel = function () {
    var self = this;

    //Set href value of element
    self.selected = ko.observable(null);

    //initial set to show first tabpanel when loading page
    self.init = ko.observable(1);

    //Get href value og element
    self.getHref = function () {
        var target;
        var element = event.target.hash;
        target = element.substr(1);
        return target;
    };

    //Show Tabpanel
    self.showBlock = function () {
        var target = self.getHref();
        self.selected(target);
        self.init(2);
    };
};
function scanUploadFile(ev) {
    if (ev.files.length == 1 && ev.files[0]) {
        let f = ev.files[0];
        let fileType = f.type.toString();
        if (fileType.endsWith('jpeg') || fileType.endsWith('jpg') || fileType.endsWith('png') || fileType.endsWith('bmp')) {

            imgPreview.src = URL.createObjectURL(f);
            imgPreview.onload=function () {
                // Parse QR
                let imageData = getBase64Image(imgPreview);
                let code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert"
                });

                var imageOutputMessage = document.querySelector('#imageOutputMessage');
                if (code) {
                    imageOutputMessage.hidden = false;
                    imageOutputMessage.innerHTML = code.data;
                    parseAndPrintData(code.data);
                    console.info('Code Found: ', code.data);
                } else {
                    console.info('No Code Found!');
                    imageOutputMessage.hidden = true;
                }
            };
        }
    }
}
function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function clearOutput() {
    output.innerHTML = '';
    clearOutputButton.hidden = true;
}