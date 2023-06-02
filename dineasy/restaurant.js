import { category } from "./annyang.js"
import { userLocation } from "위치인식한 파일명"

const restListContainer = document.getElementById("listContainer")

fetch('restaurant.json')
    .then(res => res.json())
    .then(json => showList(json, service));

function showList(json, value) {
    if (value == 0) {nearList(json, userLocation)}
    else if (value == 1) {categoryList(json, category)}

    function nearList(data, location) { //해당 동의 음식점

    }

    function categoryList(data, value) { //카테고리별 음식점
        var rests = data.DATA.filter (function (obj) {
            return obj[UPTAENM] === value;
        });
        showRest(rests);
    }

    function showRest(data) {
        for (let i = 0; i < data.length; i++) {
            let restElement = createRest(i);
            restListContainer.appendChild(restElement);
            
        }
    }

    function createRest(n, d) {
        let restDiv = document.createElement('div');
        restDiv.className = 'restList';
        restDiv.id = 'r ' + n;
        restDiv.style.background = "white";
        restDiv.style.border = "5px solid black"
        let restInfo = document.createElement('p');
        restInfo.innerHTML = d.DATA[n].BPLCNM + "<br>종류: " + d.DATA[n].UPTAENM + "<br>주소: " + d.DATA[n].SITEWHLADDR
        restDiv.appendChild(restInfo);
        restInfo.style.textAlign = "center";
        restInfo.style.position = "relative";
        return restDiv;
    }
}









