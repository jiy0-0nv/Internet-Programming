// 상단에 npm으로 설치한 패키지 express를 불러옴
// const로 선언하여 다른 값으로 덮어쓰는 것 방지
const express = require("express");

// 파일을 읽고 쓸 수 있게 해주는 기본 모듈
// npm install로 설치할 필요가 없이 내장되어 있음
const fs = require("fs");


// express 인스턴스 생성
const app = express();

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

async function getDBConnection(){
    const db = await sqlite.open({
        filename: 'product.db',
        driver: sqlite3.Database
    });
    return db;
}

// POST의 body에 사용자 입력을 받을 수 있도록 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static file을 서버에서 전달하도록 설정
app.use(express.static("public"));

app.get('/', async function(req, res){ // '/'위치에 'get'요청을 받는 경우,

    let db = await getDBConnection();

    let q = '' ;

    if ((req.query.search) && (req.query.category)) {
        q = `SELECT * FROM product 
                WHERE product_title LIKE "%${req.query.search}%"
                  AND product_category = "${req.query.category}"`
    }
    else if (req.query.search) {
        q = `SELECT * FROM product 
                WHERE product_title LIKE "%${req.query.search}%"`
    }
    else if (req.query.category) {
        q = `SELECT * FROM product 
                WHERE product_category = "${req.query.category}"`
    }
    else {q = `SELECT * FROM product` ;}

    let books = await db.all(q, req.params.product_id);
    let html = fs.readFileSync('./public/main.html', 'utf-8');

    html += `<div class="flex-container">
    <div style="margin-top: 30px;">`;

    for (let book of books) {
        
        let script = `
        <div class="item">
            <a href="http://localhost:3000/product/:${book.product_id}">
                <img src="${book.product_image}" height="200px" alt="${book.product_title}" /></a>
            <p class="appear">${book.product_title}<br><b5>${book.product_category}<br>${book.product_price}won</b5></p>
        </div>
        `

        html += script;

    };
     
    html += `</div></div></div></body>`
    

    res.send(html);   
});

app.get('/product/:product_id', async (req, res) => {
    const productId = req.params.product_id;
  
    let db = await getDBConnection();
    let query = `SELECT * FROM product WHERE product_id = ?`;
    let book = await db.get(query, productId);
  
    const html = fs.readFileSync('./public/info.html', 'utf-8');

    let html2 = `
        <img src="${book.product_image}" class="bookImg" alt="${book.product_title}"/>
        <span class="bookInfo">
                product_id: ${book.product_id}
                <br>product image: ${book.product_image}
                <br>product title: ${book.product_title}
                <br>product price: ${book.product_price}
                <br>product category: ${book.product_category}
        </span>
    </div></div>
    </div>
</body>`

    res.send(html+html2);
});

var port = 3000; //사용할 포트 번호를 port 변수에 넣음
app.listen(port, function(){
    console.log('server on! http://localhost: '+port);
});