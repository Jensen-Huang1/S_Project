// ====================
// 設定全域模式與狀態常數
// ====================
let machineId01 = "Handler-A01",
    machineId02 = "Handler-A02",
    machineId03 = "Handler-A03",
    modelA = "🟢 自動隨機、狀態",
    modelB = "🔴 強制鎖定、狀態",
    modelC = "🟡 安全待命、狀態",
    stateRun = "🟢 RUN (正常運作)",
    stateAlarm = "🔴 ALARM (故障)",
    stateTempH = "🔴 TEMPERHIGH (溫度過高)",
    stateIdle = "🟡 IDLE (待機/已複位)",
    m1Temp = 80.0,
    m2Temp = 80.0,
    m3Temp = 80.0,
    m1TempMax = 100.0,
    m2TempMax = 100.0,
    m3TempMax = 100.0;


// ====================
// 宣告機台資料庫
// ====================
let machinesDate = [
    { id: machineId01, totalPass: 0, totalFail: 0, model: modelA, state: stateRun, temp: m1Temp, tempMax: m1TempMax },
    { id: machineId02, totalPass: 0, totalFail: 0, model: modelA, state: stateRun, temp: m2Temp, tempMax: m2TempMax },
    { id: machineId03, totalPass: 0, totalFail: 0, model: modelA, state: stateRun, temp: m3Temp, tempMax: m3TempMax }
]

// ====================
// 每秒更新狀態函式
// ====================
let actionJ = "N";
$("#runFunction").click(function () {
    actionJ = "Y";
    newMessage(`ℹ️ [系統] 系統啟動，完成機台連線檢查，開始正常運作`);
    $(function () {
        let runTime = setInterval(updateTime, 1000);
        let runFunction = setInterval(updateProduction, 1000);
        let runModel = setInterval(modelRun, 1000);
        $("#stopRun").click(function () {
            actionJ = "N";
            newMessage(`ℹ️ 🔴[系統] 系統強制停止，全機台停止運作`);
            clearInterval(runTime);
            clearInterval(runFunction);
            clearInterval(runModel);
        });
    });
});




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
        cloneId.find('.machineTitle').text(machinesDate[i].id);
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
                newMessage(`🎲 [隨機] ${m.id}良率低於 90%，請注意！`);
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
            if (m.temp >= m.tempMax) {
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
            if (m.temp >= m.tempMax) {
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
function modelRun() {
    for (let i = 0; i < machinesDate.length; i++) {
        let m = machinesDate[i];
        if (m.model == modelA) {
            if (Math.random() * 100 > 98) {
                m.model = modelB;
                m.state = stateAlarm;
                newMessage(`🔴 [隨機] ${m.id} 卡料故障，已停機！`)
            }
        }
    }
}


// ==========================================
// 溫度過高停機機制
// ==========================================
function modelTemp(m) {
    if (m.model == modelA) {
        m.model = modelB;
        m.state = stateTempH;
        newMessage(`⚠️ [溫度警示]  ${m.id} 溫度已超過最大限制，已停機！`)
    }
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
    if (actionJ == "Y") {
        let d = $("#displayMachine").val();
        $.each(machinesDate, function (index, machine) {
            if (d == machine.id) {
                if (machine.model == modelB) {
                    machine.model = modelC;
                    machine.state = stateIdle;
                    machine.temp = 80;
                    newMessage(`🛠️ [手動]  ${machine.id} 已排除障礙並複位，請重新啟動！`)
                    alert(`${d} 機台已排除狀況，待命中!`)
                } else if (machine.model == modelA) {
                    alert(`${d} 機台正常運行中，請確認是否誤觸按鈕!`)
                } else if (machine.model == modelC) {
                    alert(`${d} 機台待命中，安全確認後請重啟!`)
                }
            }
        });
    }
});
// 安全確認，重新啟動 (恢復綠燈)
$("#recover").click(function () {
    if (actionJ == "Y") {
        let d = $("#displayMachine").val();
        $.each(machinesDate, function (index, machine) {
            if (d == machine.id) {
                if (machine.model == modelC) {
                    machine.model = modelA;
                    machine.state = stateRun;
                    newMessage(`✅ [手動]  ${machine.id} 已重新啟動，恢復正常運作！`)
                } else if (machine.model == modelA) {
                    alert(`${d} 機台正常運行中，不需重新啟動!`);
                } else if (machine.model == modelB) {
                    alert(`${d} 機台故障中，請先排除狀況!`);
                }
            }
        });
    }
});

// 強制停止生產 (切換紅燈)
$("#alarm").click(function () {
    if (actionJ == "Y") {
        let d = $("#displayMachine").val();
        $.each(machinesDate, function (index, machine) {
            if (d == machine.id) {
                if (machine.model == modelA) {
                    machine.model = modelB;
                    machine.state = stateAlarm;
                    newMessage(`🔴 [強制] 手動注入「卡料警報」於 ${machine.id}`)
                } else if (machine.model == modelB) {
                    alert(`${d} 機台已停機!`)
                } else if (machine.model == modelC) {
                    alert(`${d} 機台待命中，尚未開始運轉!`)
                }
            }
        })
    }
});




// 提高機台溫度 
$("#tempHigh").click(function () {
    if (actionJ == "Y") {
        let d = $("#displayMachine").val();
        $.each(machinesDate, function (index, machine) {
            if (d == machine.id) {
                if (machine.model == modelA) {
                    machine.temp = 98;
                    newMessage(`🛠️[手動]  ${machine.id} 注入溫度至98℃！`)
                } else if (machine.model == modelB) {
                    alert(`${d} 機台已停機，無法提高機台溫度!`);
                } else if (machine.model == modelC) {
                    alert(`${d} 機台待命中，無法提高機台溫度!`);
                }
            }
        });
    }
});


// ==========================================
// 區塊C：最新消息系統通知
// ==========================================
let messageLog = [];
function newMessage(message) {
    let newTime = new Date().toLocaleString();
    let newMessage = `[${newTime}] ${message}`;
    messageLog.unshift(newMessage);
    let messageList = "";
    if (messageLog.length > 50) messageLog.pop();
    for (let i = 0; i < messageLog.length; i++) {
        messageList += `<div> ${messageLog[i]} </div>`;
    }
    $("#newMessageContainer").html(messageList);
}






















