const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate=require('./modules/replaceTemplate')
//#+#+#+#+#+#+#+#++##+#+#++#+#
//FILES

/* 
//This is an Example /Exercise of Blocking/ synchronous way

const textIn=fs.readFileSync('./txt/input.txt', 'utf-8')
console.log(textIn);

const textOut= `This is what we know about to avocado: ${textIn}. /n Created on ${Date.now()}`;

fs.writeFileSync('./txt/output.txt',textOut)
console.log('File written!');

//This is an Example /Exercise of Non-Blocking /asynchronous way

fs.readFile(`./txt/start.txt`, "utf-8", (err, data1) => {
  if (err) return console.log('There is a freaking ERROR!!!!');
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
      console.log(data3);
      fs.writeFile('./txt/final.txt',`${data2}\n${data3}`, 'utf-8', err =>{
        console.log('Freaking file has been written');
      })

    });
  });
});

console.log("will read File");

 */

//#+#+#+#+#+#+#+#++##+#+#++#+#
//SERVERS



const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const PORT = 5000;

const server = http.createServer((req, res) => {
const {query, pathname}= url.parse(req.url, true);
  

  //Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output=tempOverview.replace('{%PRODUCTS_CARDS%}', cardsHtml)

    res.end(output);

    //Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" });
    const product=dataObj[query.id]
    const output=replaceTemplate(tempProduct, product)

    res.end(output)

  

    //Api Page
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);

    //Not Found Page
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "My-own-header": "Hello MoBi",
    });
    res.end("<h1>page not found<h1/>");
  }

  // res.end("Hello from the Server Siiiiiiiiiiide!!!!!!!!!!!!!");
});

server.listen(PORT, "localhost", () => {
  console.log(`Server is running for life on port ${PORT}`);
});
