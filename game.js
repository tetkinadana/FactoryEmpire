// ==========================================
// FACTORY EMPIRE
// ОСНОВНАЯ ИГРОВАЯ СИСТЕМА
// ==========================================


// ==========================================
// ДАННЫЕ
// ==========================================

let money =
    Number(localStorage.getItem("money")) || 0;

let ore =
    Number(localStorage.getItem("ore")) || 0;

let metal =
    Number(localStorage.getItem("metal")) || 0;

let parts =
    Number(localStorage.getItem("parts")) || 0;


let playerLevel =
    Number(localStorage.getItem("playerLevel")) || 1;

let xp =
    Number(localStorage.getItem("xp")) || 0;


let talentPoints =
    Number(localStorage.getItem("talentPoints")) || 0;


let mineLevel =
    Number(localStorage.getItem("mineLevel")) || 1;

let smelterLevel =
    Number(localStorage.getItem("smelterLevel")) || 1;

let factoryLevel =
    Number(localStorage.getItem("factoryLevel")) || 1;


let workers =
    Number(localStorage.getItem("workers")) || 0;


let prestigeLevel =
    Number(localStorage.getItem("prestigeLevel")) || 0;


// ==========================================
// ТАЛАНТЫ
// ==========================================

let talentMining =
    localStorage.getItem("talentMining") === "true";

let talentEconomy =
    localStorage.getItem("talentEconomy") === "true";

let talentProduction =
    localStorage.getItem("talentProduction") === "true";


// ==========================================
// СОХРАНЕНИЕ
// ==========================================

function saveGame() {

    localStorage.setItem("money", money);

    localStorage.setItem("ore", ore);

    localStorage.setItem("metal", metal);

    localStorage.setItem("parts", parts);


    localStorage.setItem(
        "playerLevel",
        playerLevel
    );

    localStorage.setItem(
        "xp",
        xp
    );


    localStorage.setItem(
        "talentPoints",
        talentPoints
    );


    localStorage.setItem(
        "mineLevel",
        mineLevel
    );

    localStorage.setItem(
        "smelterLevel",
        smelterLevel
    );

    localStorage.setItem(
        "factoryLevel",
        factoryLevel
    );


    localStorage.setItem(
        "workers",
        workers
    );


    localStorage.setItem(
        "prestigeLevel",
        prestigeLevel
    );


    localStorage.setItem(
        "talentMining",
        talentMining
    );

    localStorage.setItem(
        "talentEconomy",
        talentEconomy
    );

    localStorage.setItem(
        "talentProduction",
        talentProduction
    );

}


// ==========================================
// БАЗОВАЯ ДОБЫЧА
// ==========================================

function getBaseMining() {

    return mineLevel * 0.1;

}


// ==========================================
// ДОБЫЧА РАБОЧИХ
// ==========================================

function getWorkerMining() {

    return workers * 0.2;

}


// ==========================================
// ТАЛАНТ ДОБЫЧИ
// ==========================================

function getMiningMultiplier() {

    let multiplier = 1;


    if (talentMining) {

        multiplier += 0.10;

    }


    // бонус престижа

    multiplier += prestigeLevel * 0.10;


    return multiplier;

}


// ==========================================
// ОБЩАЯ ДОБЫЧА
// ==========================================

function getOrePerSecond() {

    let total =
        getBaseMining()
        +
        getWorkerMining();


    total *= getMiningMultiplier();


    return total;

}


// ==========================================
// РУЧНАЯ ДОБЫЧА
// ==========================================

function mine() {

    ore += getBaseMining();

    saveGame();

    updateUI();

}


// ==========================================
// НАЙМ РАБОЧЕГО
// ==========================================

function hireWorker() {

    let cost =
        25 * Math.pow(1.25, workers);


    cost = Math.round(cost * 10) / 10;


    if (money < cost) {

        alert(
            "Недостаточно факсов."
        );

        return;

    }


    money -= cost;

    workers++;


    saveGame();

    updateUI();

}


// ==========================================
// ПЛАВИЛЬНЯ
// ==========================================

function smelt() {

    let requiredOre = 2.0;


    if (ore < requiredOre) {

        alert(
            "Недостаточно руды."
        );

        return;

    }


    ore -= requiredOre;


    let output =
        1.0 + (smelterLevel - 1) * 0.1;


    metal += output;


    saveGame();

    updateUI();

}


// ==========================================
// ЗАВОД
// ==========================================

function produceParts() {

    let requiredMetal = 2.0;


    if (metal < requiredMetal) {

        alert(
            "Недостаточно металла."
        );

        return;

    }


    metal -= requiredMetal;


    let output =
        1.0 + (factoryLevel - 1) * 0.1;


    if (talentProduction) {

        output *= 1.10;

    }


    parts += output;


    saveGame();

    updateUI();

}


// ==========================================
// ПРОДАЖА
// ==========================================

function sellParts() {

    if (parts <= 0) {

        alert(
            "Нет деталей для продажи."
        );

        return;

    }


    let income =
        parts * 100;


    if (talentEconomy) {

        income *= 1.10;

    }


    money += income;


    addXP(
        parts * 20
    );


    parts = 0;


    saveGame();

    updateUI();

}


// ==========================================
// XP
// ==========================================

function addXP(amount) {

    xp += amount;


    let requiredXP =
        playerLevel * 100;


    while (xp >= requiredXP) {

        xp -= requiredXP;

        playerLevel++;


        talentPoints++;


        showLevelUp();


        requiredXP =
            playerLevel * 100;

    }

}


// ==========================================
// УЛУЧШЕНИЕ ШАХТЫ
// ==========================================

function upgradeMine() {

    let cost =
        mineLevel * 50;


    if (money < cost) {

        alert(
            "Недостаточно факсов."
        );

        return;

    }


    money -= cost;

    mineLevel++;


    saveGame();

    updateUI();

}


// ==========================================
// УЛУЧШЕНИЕ ПЛАВИЛЬНИ
// ==========================================

function upgradeSmelter() {

    let cost =
        smelterLevel * 100;


    if (money < cost) {

        alert(
            "Недостаточно факсов."
        );

        return;

    }


    money -= cost;

    smelterLevel++;


    saveGame();

    updateUI();

}


// ==========================================
// УЛУЧШЕНИЕ ЗАВОДА
// ==========================================

function upgradeFactory() {

    let cost =
        factoryLevel * 200;


    if (money < cost) {

        alert(
            "Недостаточно факсов."
        );

        return;

    }


    money -= cost;

    factoryLevel++;


    saveGame();

    updateUI();

}


// ==========================================
// ТАЛАНТЫ
// ==========================================

function buyTalent(type) {


    // ДОБЫЧА

    if (type === "mining") {

        if (talentMining) {

            return;

        }


        if (talentPoints < 1) {

            alert(
                "Недостаточно кредитов талантов."
            );

            return;

        }


        talentPoints--;

        talentMining = true;

    }


    // ЭКОНОМИКА

    if (type === "economy") {

        if (!talentMining) {

            return;

        }


        if (talentEconomy) {

            return;

        }


        if (talentPoints < 1) {

            alert(
                "Недостаточно кредитов талантов."
            );

            return;

        }


        talentPoints--;

        talentEconomy = true;

    }


    // ПРОИЗВОДСТВО

    if (type === "production") {

        if (!talentEconomy) {

            return;

        }


        if (talentPoints < 2) {

            alert(
                "Нужно 2 кредита талантов."
            );

            return;

        }


        if (talentProduction) {

            return;

        }


        talentPoints -= 2;

        talentProduction = true;

    }


    saveGame();

    updateUI();

}


// ==========================================
// ПРЕСТИЖ
// ==========================================

function prestige() {

    if (playerLevel < 10) {

        alert(
            "Для престижа нужен 10 уровень."
        );

        return;

    }


    let confirmation =
        confirm(
            "Начать престиж? Обычный прогресс будет сброшен."
        );


    if (!confirmation) {

        return;

    }


    prestigeLevel++;


    money = 0;

    ore = 0;

    metal = 0;

    parts = 0;


    playerLevel = 1;

    xp = 0;


    mineLevel = 1;

    smelterLevel = 1;

    factoryLevel = 1;


    workers = 0;


    saveGame();

    updateUI();


    alert(
        "Престиж выполнен! Постоянный бонус: +" +
        (prestigeLevel * 10) +
        "% к добыче."
    );

}


// ==========================================
// ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ
// ==========================================

function showScreen(screen) {

    let screens = [
        "production",
        "upgrades",
        "talents",
        "prestige"
    ];


    screens.forEach(function(name) {

        let element =
            document.getElementById(
                name === "production"
                    ? "productionScreen"
                    : name === "upgrades"
                    ? "upgradeScreen"
                    : name === "talents"
                    ? "talentScreen"
                    : "prestigeScreen"
            );


        element.classList.add("hidden");

    });


    let selected;


    if (screen === "production") {

        selected =
            document.getElementById(
                "productionScreen"
            );

    }


    if (screen === "upgrades") {

        selected =
            document.getElementById(
                "upgradeScreen"
            );

    }


    if (screen === "talents") {

        selected =
            document.getElementById(
                "talentScreen"
            );

    }


    if (screen === "prestige") {

        selected =
            document.getElementById(
                "prestigeScreen"
            );

    }


    selected.classList.remove("hidden");


    let tabs = [
        "productionTab",
        "upgradeTab",
        "talentTab",
        "prestigeTab"
    ];


    tabs.forEach(function(tab) {

        document
            .getElementById(tab)
            .classList.remove("active");

    });


    if (screen === "production") {

        document
            .getElementById("productionTab")
            .classList.add("active");

    }


    if (screen === "upgrades") {

        document
            .getElementById("upgradeTab")
            .classList.add("active");

    }


    if (screen === "talents") {

        document
            .getElementById("talentTab")
            .classList.add("active");

    }


    if (screen === "prestige") {

        document
            .getElementById("prestigeTab")
            .classList.add("active");

    }

}


// ==========================================
// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ==========================================

function updateUI() {


    // РЕСУРСЫ

    document.getElementById("money").textContent =
        money.toFixed(1);


    document.getElementById("ore").textContent =
        ore.toFixed(1);


    document.getElementById("metal").textContent =
        metal.toFixed(1);


    document.getElementById("parts").textContent =
        parts.toFixed(1);


    // УРОВЕНЬ

    document.getElementById("playerLevel").textContent =
        playerLevel;


    // XP

    let requiredXP =
        playerLevel * 100;


    document.getElementById("xp").textContent =
        xp.toFixed(1);


    document.getElementById("xpNeeded").textContent =
        requiredXP.toFixed(1);


    let xpProgress =
        Math.min(
            100,
            (xp / requiredXP) * 100
        );


    document.getElementById(
        "xpProgress"
    ).style.width =
        xpProgress + "%";


    // ДОБЫЧА

    let orePerSecond =
        getOrePerSecond();


    document.getElementById(
        "orePerSecond"
    ).textContent =
        orePerSecond.toFixed(1);


    document.getElementById(
        "mineProduction"
    ).textContent =
        orePerSecond.toFixed(1);


    // РАБОЧИЕ

    document.getElementById(
        "workerCount"
    ).textContent =
        workers;


    document.getElementById(
        "workerCountMain"
    ).textContent =
        workers;


    let workerCost =
        25 * Math.pow(
            1.25,
            workers
        );


    document.getElementById(
        "workerCost"
    ).textContent =
        workerCost.toFixed(1);


    // УЛУЧШЕНИЯ

    document.getElementById(
        "mineLevel"
    ).textContent =
        mineLevel;


    document.getElementById(
        "smelterLevel"
    ).textContent =
        smelterLevel;


    document.getElementById(
        "factoryLevel"
    ).textContent =
        factoryLevel;


    document.getElementById(
        "upgradeMineLevel"
    ).textContent =
        mineLevel;


    document.getElementById(
        "upgradeMinePower"
    ).textContent =
        getBaseMining().toFixed(1);


    document.getElementById(
        "upgradeMineNextPower"
    ).textContent =
        ((mineLevel + 1) * 0.1).toFixed(1);


    document.getElementById(
        "mineCost"
    ).textContent =
        (mineLevel * 50).toFixed(1);


    document.getElementById(
        "upgradeSmelterLevel"
    ).textContent =
        smelterLevel;


    document.getElementById(
        "smelterOutput"
    ).textContent =
        (
            1 +
            (smelterLevel - 1) * 0.1
        ).toFixed(1);


    document.getElementById(
        "smelterCost"
    ).textContent =
        (smelterLevel * 100).toFixed(1);


    document.getElementById(
        "upgradeFactoryLevel"
    ).textContent =
        factoryLevel;


    document.getElementById(
        "factoryOutput"
    ).textContent =
        (
            1 +
            (factoryLevel - 1) * 0.1
        ).toFixed(1);


    document.getElementById(
        "factoryCost"
    ).textContent =
        (factoryLevel * 200).toFixed(1);


    // ТАЛАНТЫ

    document.getElementById(
        "talentPoints"
    ).textContent =
        talentPoints;


    let miningButton =
        document.getElementById(
            "talentMining"
        );


    let economyButton =
        document.getElementById(
            "talentEconomy"
        );


    let productionButton =
        document.getElementById(
            "talentProduction"
        );


    if (talentMining) {

        miningButton.textContent =
            "ИЗУЧЕНО";

        miningButton.disabled = true;

    }
    else {

        miningButton.textContent =
            "ИЗУЧИТЬ";

        miningButton.disabled =
            talentPoints < 1;

    }


    if (talentEconomy) {

        economyButton.textContent =
            "ИЗУЧЕНО";

        economyButton.disabled = true;

    }
    else {

        economyButton.textContent =
            "ИЗУЧИТЬ";

        economyButton.disabled =
            !talentMining ||
            talentPoints < 1;

    }


    if (talentProduction) {

        productionButton.textContent =
            "ИЗУЧЕНО";

        productionButton.disabled = true;

    }
    else {

        productionButton.textContent =
            "ИЗУЧИТЬ";

        productionButton.disabled =
            !talentEconomy ||
            talentPoints < 2;

    }


    // ПРЕСТИЖ

    document.getElementById(
        "prestigeButton"
    ).disabled =
        playerLevel < 10;

}


// ==========================================
// АВТОМАТИЧЕСКАЯ ДОБЫЧА
// ==========================================

let lastTime =
    Date.now();


function gameLoop() {

    let now =
        Date.now();


    let delta =
        (now - lastTime) / 1000;


    lastTime = now;


    // защита от огромного скачка времени

    if (delta > 1) {

        delta = 1;

    }


    let production =
        getOrePerSecond();


    ore +=
        production * delta;


    updateUI();


    saveGame();

}


setInterval(
    gameLoop,
    100
);


// ==========================================
// ЗАПУСК
// ==========================================

updateUI();
