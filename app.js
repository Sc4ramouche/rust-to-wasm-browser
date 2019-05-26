const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

app.post('/compile', (req, res) => {
    fs.writeFileSync('./src/lib.rs', req.body.code);

    exec(
        'cargo build --target wasm32-unknown-unknown --release',
        (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                return;
            }

            if (stdout) console.log(`stdout: ${stdout}`);
            if (stderr) console.log(`stderr: ${stderr}`);

            let file;
            try {
                file = fs.readFileSync(
                    `${__dirname}/target/wasm32-unknown-unknown/release/rust_module.wasm`
                );
            } catch (e) {
                console.log(e);
            }

            res.writeHead(200, { 'Content-Type': 'application/wasm' });
            res.end(file);
        }
    );
});

app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
});
