// send source code to compile
let wasmModule;
let outputCounter = 0;

const editor = document.getElementById('editor');
const compileButton = document.getElementById('compile');
const outputContainer = document.getElementById('output');

compileButton.onclick = () => {
    WebAssembly.instantiateStreaming(
        fetch('/compile', {
            headers: {
                'Content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ code: editor.innerText }),
        })
    ).then(obj => {
        wasmModule = obj;
        appendOutput(
            '<span class="result">wasm</span> module compiled succesfully.'
        );
    });
};

// call given wasm module
const callButton = document.getElementById('call');
const moduleName = document.getElementById('name');
const moduleInputValue = document.getElementById('value');

callButton.onclick = () => {
    const name = moduleName.value;
    const value = +moduleInputValue.value;

    let output;
    if (wasmModule) {
        output = wasmModule.instance.exports[name](value);
        appendOutput(
            `Function <span class="func-name">${name}</span> executed with value <span class="value">${value}</span>. Result: <span class="result">${output}</span>`
        );
    } else {
        const result = document.createElement('p');
        result.innerHTML = `No compiled <span class="result">wasm module</span> found. Try to press 'compile' button.`;
        outputContainer.appendChild(
            `No compiled <span class="result">wasm module</span> found. Try to press 'compile' button.`
        );
    }
};

function appendOutput(output) {
    let line;

    if (outputCounter === 0) {
        line = document.getElementById('first-line');
        line.innerHTML = '~: ' + output;
    } else {
        line = document.createElement('p');
        line.innerHTML = '~: ' + output;
        outputContainer.appendChild(line);
    }

    outputCounter++;
}
