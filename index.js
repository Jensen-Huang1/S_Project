// ====================
// 設定全域模式與狀態常數
// ====================
let modelA = "🟢 自動隨機、狀態",
    modelB = "🔴 強制鎖定、狀態",
    modelC = "🟡 安全待命、狀態",
    stateRun = "🟢 RUN (正常運作)",
    stateAlarm = "🔴 ALARM (故障)",
    stateTempH = "🔴 TEMPERHIGH (溫度過高)",
    stateIdle = "🟡 IDLE (待機/已複位)";

// ====================
// 宣告機台資料庫
// ====================
let machinesDate = [
    { id: "Handler-A01", totalPass: 0, totalFail: 0, model: modelA, state: stateRun, temp: 80.0, tempMax: 100.0 },
    { id: "Handler-A02", totalPass: 0, totalFail: 0, model: modelA, state: stateRun, temp: 80.0, tempMax: 100.0 },
    { id: "Handler-A03", totalPass: 0, totalFail: 0, model: modelA, state: stateRun, temp: 80.0, tempMax: 100.0 }
]

// ====================
// 每秒更新狀態函式
// ====================
$(function () {
    setInterval(updateTime, 1000);
    setInterval(updateProduction, 1000);
})

// ====================
// 抓取最新時間函式
// ====================
function updateTime() {
    $('#nowTime').text(new Date().toLocaleString());
}

// =======================
// 畫面初始化 (只跑一次)
// =======================
function initUI() {
    for (let i = 0; i < machinesDate.length; i++) {
        let cloneId = $($('#card_template')[0].content).clone();
        cloneId.find('.card').attr('data-id', machinesDate[i].id);
        cloneId.find('.machineTitle').text(`機台  ${machinesDate[i].id}`);
        $('#container').append(cloneId);
    }
}
initUI();

// ==========================================
// 生產數據函式
// ==========================================
function updateProduction() {
    // 用迴圈處理每一台機台的生產亂數
    for (let i = 0; i < machinesDate.length; i++) {
        let m = machinesDate[i];
        let cardContent;
        let temperatureState;
        if (m.model == modelA) {
            // A. 模擬這台機台這秒產出 1~3 顆
            let produced = Math.floor(Math.random() * 3) + 1;


            // B. 隨機生產良/不良品
            for (let p = 0; p < produced; p++) {
                if (Math.random() * 100 < 98) {
                    m.totalPass++;
                } else {
                    m.totalFail++;
                }
            }


            // C. 計算良率
            let total = m.totalFail + m.totalPass;
            let yieldRate = (m.totalPass / total * 100).toFixed(1);
            let yieldState;
            if (yieldRate < 90) {
                yieldState = "⚠️低於90";
                newmessage(`⚠️ [警告]  ${yieldState}良率低於 90%，請注意！`);
            } else {
                yieldState = "正常";
            }
            // D. 隨機溫度
            m.temp += (Math.random() * 6 - 3);
            if (m.temp >= m.tempMax) {
                temperatureState = "⚠️溫度過高";
                modelTemp(m);
            } else {
                temperatureState = "±3";
            }

            // C. 精準定位到該機台卡片，只更新「數字」，不重新生成 HTML！
            cardContent = $(`.card[data-id="${m.id}"]`);
            cardContent.find('.machineModel').text(m.model);
            cardContent.find('.machineState').text(m.state);
            cardContent.find('.machineTestCount').text(m.totalPass + m.totalFail);
            cardContent.find('.testCountState').text(`▲ ${produced}`);
            cardContent.find('.passCount').text(m.totalPass);
            cardContent.find('.yieldRate').text(yieldRate);
            cardContent.find('.yieldState').text(yieldState);
            cardContent.find('.temp').text(m.temp.toFixed(1));
            cardContent.find('.tempeTolerance').text(temperatureState);

        } else if (m.model == modelB) {
            // 判斷溫度是否過高，並更新溫度狀態
            if (m.temp >= m.maxTemp) {
                temperatureState = "⚠️溫度過高";
                modelTemp(m);
            } else {
                temperatureState = "±0";
            }
            cardContent = $(`.card[data-id="${m.id}"]`);
            cardContent.find('.machineModel').text(m.model);
            cardContent.find('.machineState').text(m.state);
            cardContent.find('.testCountState').text(`⏸️`);
            cardContent.find('.yieldState').text("暫停");
            cardContent.find('.tempeTolerance').text(temperatureState);
        } else if (m.model == modelC) {
            // 判斷溫度是否過高，並更新溫度狀態
            if (m.temp >= m.maxTemp) {
                temperatureState = "⚠️溫度過高";
                modelTemp(m);
            } else {
                temperatureState = "±0";
            }
            cardContent = $(`.card[data-id="${m.id}"]`);
            cardContent.find('.machineModel').text(m.model);
            cardContent.find('.machineState').text(m.state);
            cardContent.find('.testCountState').text(`▲0`);
            cardContent.find('.tempeTolerance').text("±0");
        }
    }
}








// ==========================================
// 每秒突發故障狀態隨機產生 (2% 機率)
// ==========================================



// ==========================================
// 溫度過高停機機制
// ==========================================
function modelTemp(m) {
    m.model = modelB;
    m.state = stateTempH;
}


// ==========================================
// 區塊B下拉式清單回傳
//=========================================
let selectE1 = $('#displayMachine');
$.each(machinesDate, function (index, machine) {
    selectE1.append($('<option>', {
        text: machine.id
    }));
});

//===========================================
// 按鈕事件
//===========================================
// 排除障礙並複位 (切換黃燈)
$("#fixed").click(function () {
    let d = $("#displayMachine").val();
    $.each(machinesDate, function (index, machine) {
        if (d == machine.id) {
            if (machine.model == modelB) {
                machine.model = modelC;
                machine.state = stateIdle;
                machine.temp = 80;
                alert(`${d} 機台已排除狀況，待命中!`)
            } else if (machine.model == modelA) {
                alert(`${d} 機台正常運行中，請確認是否誤觸按鈕!`)
            } else if (machine.model == modelC) {
                alert(`${d} 機台待命中，安全確認後請重啟!`)
            }
        }
    });
});
// 安全確認，重新啟動 (恢復綠燈)
$("#recover").click(function () {
    let d = $("#displayMachine").val();
    $.each(machinesDate, function (index, machine) {
        if (d == machine.id) {
            if (machine.model == modelC) {
                machine.model = modelA;
                machine.state = stateRun;
            } else if (machine.model == modelA) {
                alert(`${d} 機台正常運行中，不需重新啟動!`);
            } else if (machine.model == modelB) {
                alert(`{d} 機台故障中，請先排除狀況!`);
            }
        }
    });
});

// 強制停止生產 (切換紅燈)
$("#alarm").click(function () {
    let d = $("#displayMachine").val();
    $.each(machinesDate, function (index, machine) {
        if (d == machine.id) {
            if (machine.model == modelA) {
                machine.model = modelB;
                machine.state = stateAlarm;
            } else if (machine.model == modelB) {
                alert(`${d} 機台已停機!`)
            } else if (machine.model == modelC) {
                alert(`${d} 機台待命中，尚未開始運轉!`)
            }
        }
    })
});




// 提高機台溫度 
$("#tempHigh").click(function () {
    let d = $("#displayMachine").val();
    $.each(machinesDate, function (index, machine) {
        if (machine.model == modelA) {
            if (d = machine.id) {
                machine.temp = 98;
            }
        } else if (machine.model == modelB) {
            alert(`${d} 機台已停機，無法提高機台溫度!`);
        } else if (machine.model == modelC) {
            alert(`${d} 機台待命中，無法提高機台溫度!`);
        }

    });
});


// ==========================================
// 區塊C：最新消息系統通知
// ==========================================
function newmessage() {

}








// let machine_all = ["Handler-A01", "Handler-A02", "Handler-A03"];
// let model_all = ["🟢 自動隨機", "🔴 強制鎖定", "🟡 安全待命"]
// let state_all = ["🟢 RUN (正常運作)", "🔴 ALARM (卡料故障)", "🟡 IDLE (待機/已複位) "]

// let table_all, return_table;
// let machine_name, model_name, state_name;




// function machineInfo() {
//     for (let i = 0; i < machineDate.length; i++) {
//         let clone = $($('#card-template')[0].content).clone();
//         clone.find('.card').attr('data-id', machineDate[i].id);
//         clone.find('.machine-title').text("機台" + machineDate[i].id);
//         $(container).append(clone);
//     }
// }

// table_all = document.querySelector("template");
// return_table = document.getElementById("return_table");

// for (let i = 0; i < machine_all.length; i++) {
//     let clone = table_all.content.cloneNode(true);

//     let toolSpan = clone.querySelector("#tool");
//     let modelSpan = clone.querySelector("#model");
//     let stateSpan = clone.querySelector("#state");
//     toolSpan.textContent = machine_all[i];
//     modelSpan.textContent = model_all[i];
//     stateSpan.textContent = state_all[i];
//     return_table.appendChild(clone);
// }




// 機台生產運作
// function machineOperate() {
//     let produceCount = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
//     for (let i = 0; i < produceCount; i++) {
//         let randomRate = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
//         if (randomRate < 98) {
//             totalPassNo1++;
//         } else {
//             totalFailNo1++;
//         }
//     }
// $('#test_number').text(totalNo1All);
// $('#qualified_number').text(totalPassNo1);
// $('#yield_rate').text(totalRate);
// }
// setInterval(machineNo1,1000);













