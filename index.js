$(function () {
    function updateTime() {
        $('#nowTime').text(new Date().toLocaleString());
    }
    updateTime();
    setInterval(updateTime, 1000);
}) //目前時間


function machineNo1() {
    let produceCountNo1 = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
    for (let i = 0; i < produceCountNo1; i++) {
        let randomRate = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
        if (randomRate < 98) {
            totalPassNo1++;
        } else {
            totalFailNo1++;
        }
    }
    // $('#test_number').text(totalNo1All);
    // $('#qualified_number').text(totalPassNo1);
    // $('#yield_rate').text(totalRate);
}
// setInterval(machineNo1,1000);


let machine_all = ["Handler-A01", "Handler-A02", "Handler-A03"];
let model_all = ["🟢 自動隨機", "🔴 強制鎖定", "🟡 安全待命"]
let state_all = ["🟢 RUN (正常運作)", "🔴 ALARM (卡料故障)", "🟡 IDLE (待機/已複位) "]

let table_all, return_table;
let machine_name, model_name, state_name;







table_all = document.querySelector("template");
return_table = document.getElementById("return_table");

for (let i = 0; i < machine_all.length; i++) {
    let clone = table_all.content.cloneNode(true);
    let toolSpan = clone.querySelector("#tool");
    let modelSpan = clone.querySelector("#model");
    let stateSpan = clone.querySelector("#state");
    toolSpan.textContent = machine_all[i];
    modelSpan.textContent = model_all[i];
    stateSpan.textContent = state_all[i];
    return_table.appendChild(clone);
}

$(function () {

    let aa = "Handler-A01";
    $('#jeee').text(aa);

})
