// ===============================
// СОХРАНЕНИЕ
// ===============================

let money = Number(localStorage.getItem("money")) || 0;

let ore = Number(localStorage.getItem("ore")) || 0;

let metal = Number(localStorage.getItem("metal")) || 0;

let parts = Number(localStorage.getItem("parts")) || 0;

let playerLevel =
    Number(localStorage.getItem("playerLevel")) || 1;

let xp =
    Number(localStorage.getItem("xp")) || 0;


// ===============================
// УРОВНИ ЗДАНИЙ
// ===============================

let mineLevel =
    Number(localStorage.getItem("mineLevel")) || 1;

let smelterLevel =
    Number(localStorage.getItem("smelterLevel")) || 1;

let factoryLevel =
    Number(localStorage.getItem("factoryLevel")) || 1;


// ===============================
// СОХРАНЕНИЕ ИГРЫ
// ===============================

function saveGame() {

    localStorage.setItem("money", money);

    localStorage.setItem("ore", ore);

    localStorage.setItem("metal", metal);

    localStorage.setItem("parts", parts);

    localStorage.setItem("playerLevel", playerLevel);

    localStorage.setItem("xp", xp);

    localStorage.setItem("mineLevel", mineLevel);

    localStorage.setItem("smelterLevel", smelterLevel);

    localStorage.setItem("factoryLevel", factoryLevel);

}


// ===============================
// ДОБЫЧА РУДЫ
// ===============================

function mine() {

    ore += mineLevel;

    saveGame();

    updateUI();

}


// ===============================
// ПЛАВКА
// ===============================

function smelt() {

    let requiredOre = 2;

    if (ore < requiredOre) {

        alert("Недостаточно руды.");

        return;

    }

    ore -= requiredOre;

    metal += smelterLevel;

    saveGame();

    updateUI();

}


// ===============================
// ПРОИЗВОДСТВО ДЕТАЛЕЙ
// ===============================

function produceParts() {

    let requiredMetal = 2;

    if (metal < requiredMetal) {

        alert("Недостаточно металла.");

        return;

    }

    metal -= requiredMetal;

    parts += factoryLevel;

    saveGame();

    updateUI();

}


// ===============================
// ПРОДАЖА
// ===============================

function sellParts() {

    if (parts <= 0) {

        alert("Нет деталей для продажи.");

        return;

    }

    let sold = parts;

    parts = 0;

    money += sold * 100;

    addXP(sold * 20);

    saveGame();

    updateUI();

}


// ===============================
// XP
// ===============================

function addXP(amount) {

    xp += amount;

    let requiredXP = playerLevel * 100;

    while (xp >= requiredXP) {

        xp -= requiredXP;

        playerLevel++;

        showLevelUp();

        requiredXP = playerLevel * 100;

    }

}


// ===============================
// УЛУЧШЕНИЕ ШАХТЫ
// ===============================

function upgradeMine() {

    let cost = mineLevel * 50;

    if (money < cost) {

        alert("Недостаточно денег.");

        return;

    }

    money -= cost;

    mineLevel++;

    saveGame();

    updateUI();

}


// ===============================
// УЛУЧШЕНИЕ ПЛАВИЛЬНИ
// ===============================

function upgradeSmelter() {

    let cost = smelterLevel * 100;

    if (money < cost) {

        alert("Недостаточно денег.");

        return;

    }

    money -= cost;

    smelterLevel++;

    saveGame();

    updateUI();

}


// ===============================
// УЛУЧШЕНИЕ ЗАВОДА
// ===============================

function upgradeFactory() {

    let cost = factoryLevel * 200;

    if (money < cost) {

        alert("Недостаточно денег.");

        return;

    }

    money -= cost;

    factoryLevel++;

    saveGame();

    updateUI();

}


// ===============================
// ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ
// ===============================

function showScreen(screen) {

    let production =
        document.getElementById("productionScreen");

    let upgrades =
        document.getElementById("upgradeScreen");

    let productionTab =
        document.getElementById("productionTab");

    let upgradeTab =
        document.getElementById("upgradeTab");


    if (screen === "production") {

        production.classList.remove("hidden");

        upgrades.classList.add("hidden");

        productionTab.classList.add("active");

        upgradeTab.classList.remove("active");

    }


    if (screen === "upgrades") {

        production.classList.add("hidden");

        upgrades.classList.remove("hidden");

        productionTab.classList.remove("active");

        upgradeTab.classList.add("active");

    }

}


// ===============================
// УРОВЕНЬ ПОВЫШЕН
// ===============================

function showLevelUp() {

    let message =
        document.getElementById("levelUpMessage");

    message.style.display = "block";


    setTimeout(function() {

        message.style.display = "none";

    }, 2500);

}


// ===============================
// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ===============================

function updateUI() {

    document.getElementById("money").textContent =
        money;

    document.getElementById("ore").textContent =
        ore;

    document.getElementById("metal").textContent =
        metal;

    document.getElementById("parts").textContent =
        parts;


    document.getElementById("playerLevel").textContent =
        playerLevel;


    document.getElementById("xp").textContent =
        xp;


    let requiredXP =
        playerLevel * 100;


    document.getElementById("xpNeeded").textContent =
        requiredXP;


    let progress =
        (xp / requiredXP) * 100;


    document.getElementById("xpProgress").style.width =
        progress + "%";


    // ШАХТА

    document.getElementById("mineLevel").textContent =
        mineLevel;

    document.getElementById("minePower").textContent =
        mineLevel;


    // ПЛАВИЛЬНЯ

    document.getElementById("smelterLevel").textContent =
        smelterLevel;


    // ЗАВОД

    document.getElementById("factoryLevel").textContent =
        factoryLevel;


    // УЛУЧШЕНИЯ

    document.getElementById("upgradeMineLevel").textContent =
        mineLevel;

    document.getElementById("upgradeMinePower").textContent =
        mineLevel;

    document.getElementById("upgradeMineNextPower").textContent =
        mineLevel + 1;


    document.getElementById("mineCost").textContent =
        mineLevel * 50;


    document.getElementById("upgradeSmelterLevel").textContent =
        smelterLevel;

    document.getElementById("smelterCost").textContent =
        smelterLevel * 100;


    document.getElementById("upgradeFactoryLevel").textContent =
        factoryLevel;

    document.getElementById("factoryCost").textContent =
        factoryLevel * 200;

}


// ===============================
// ЗАПУСК
// ===============================

updateUI();
