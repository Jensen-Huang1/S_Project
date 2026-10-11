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
