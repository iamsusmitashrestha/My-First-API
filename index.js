const fs = require('fs');
const http = require('http');
const url = require('url');

/////////////////////////////////////////////////////////////////////////
//Files

//Blocking/Synchronous Way
// const textInp = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textInp);
// const textOut = `This is what we know about Avocado: ${textInp}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/input.txt', textOut)
// console.log('File Written');

//Blocking/Asynchronous Way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log("Your file has been written");
//             })
//         });

//     });
// });
// console.log("Will read this file");


/////////////////////////////////////////////////////////////////////////
//Server

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const pathName = req.url;

    const { query, pathname } = url.parse(req.url, true);

    //OverView Page
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

        //Product Page
    } else if (pathName === '/product') {
        res.end("This is the product");

        //API
    } else if (pathName === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });

        res.end(data);

        //Not Found
    } else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'Hello',
        });
        res.end('<h1> Page not found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});





// const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
// const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
// const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

// const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// const dataObj = JSON.parse(data);

// console.log(dataObj[0].description);

// const server = http.createServer((req, res) => {
//     const pathName = req.url;

//     if (pathName === '/' || pathName === '/overview') {
//         res.writeHead(200, { 'content-type': 'text/html' });


//     }

// });

// server.listen(8000, '127.0.0.1', () => {
//     console.log('Listening to requests on port 8000');
// });
