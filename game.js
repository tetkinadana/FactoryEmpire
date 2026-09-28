// ===============================
// FACTORY EMPIRE
// Основной игровой код
// ===============================


// ===============================
// СОСТОЯНИЕ ИГРЫ
// ===============================

let game = {
    money: 0,

    ore: 0,
    metal: 0,
    parts: 0,

    playerLevel: 1,
    xp: 0,

    mineLevel: 1,
    smelterLevel: 1,
    factoryLevel: 1,

    workers: 0,

    talentPoints: 0,

    talentMining: false,
    talentEconomy: false,
    talentProduction: false,

    prestigeLevel: 0
};


// ===============================
// ЗАГРУЗКА ИГРЫ
// ===============================

function loadGame() {

    const saved = localStorage.getItem("factoryEmpireSave");

    if (!saved) {
        updateUI();
        return;
    }

    try {

        const data = JSON.parse(saved);

        game = {
            ...game,
            ...data
        };

    } catch (error) {

        console.log("Ошибка загрузки сохранения");

    }

    updateUI();
}


// ===============================
// СОХРАНЕНИЕ
// ===============================

function saveGame() {

    localStorage.setItem(
        "factoryEmpireSave",
        JSON.stringify(game)
    );

    showMessage("Игра сохранена");
}


// ===============================
// СБРОС
// ===============================

function resetGame() {

    const confirmed = confirm(
        "Точно сбросить весь прогресс?"
    );

    if (!confirmed) return;

    localStorage.removeItem("factoryEmpireSave");

    location.reload();
}


// ===============================
// ДОБЫЧА РУДЫ
// ===============================

function getMiningPower() {

    let power = game.mineLevel * 0.1;

    power += game.workers * 0.2;


    // Талант добычи

    if (game.talentMining) {
        power *= 1.1;
    }


    // Престиж

    if (game.prestigeLevel > 0) {

        power *= (
            1 +
            game.prestigeLevel * 0.1
        );

    }


    return power;
}


function mine() {

    const amount = getMiningPower();

    game.ore += amount;

    addXP(1);

    updateUI();
}


// ===============================
// АВТОМАТИЧЕСКАЯ ДОБЫЧА
// ===============================

function automaticMining(delta) {

    const amountPerSecond =
        getMiningPower();

    game.ore +=
        amountPerSecond * delta;
}


// ===============================
// ПРОИЗВОДСТВО
// ===============================

function automaticProduction(delta) {

    // ---------------------------
    // ПЛАВИЛЬНЯ
    // ---------------------------

    let smeltingSpeed =
        game.smelterLevel * 0.1;

    if (game.talentProduction) {
        smeltingSpeed *= 1.1;
    }

    const possibleMetal =
        smeltingSpeed * delta;

    const maxMetalByOre =
        game.ore / 2;

    const metalProduced =
        Math.min(
            possibleMetal,
            maxMetalByOre
        );

    if (metalProduced > 0) {

        game.ore -=
            metalProduced * 2;

        game.metal +=
            metalProduced;

    }


    // ---------------------------
    // ЗАВОД ДЕТАЛЕЙ
    // ---------------------------

    let factorySpeed =
        game.factoryLevel * 0.1;

    if (game.talentProduction) {
        factorySpeed *= 1.1;
    }

    const possibleParts =
        factorySpeed * delta;

    const maxPartsByMetal =
        game.metal / 2;

    const partsProduced =
        Math.min(
            possibleParts,
            maxPartsByMetal
        );

    if (partsProduced > 0) {

        game.metal -=
            partsProduced * 2;

        game.parts +=
            partsProduced;

    }
}


// ===============================
// ПРОДАЖА ДЕТАЛЕЙ
// ===============================

function sellParts() {

    if (game.parts <= 0) {

        showMessage(
            "Нет деталей для продажи"
        );

        return;
    }


    let price = 100;


    // Талант экономики

    if (game.talentEconomy) {
        price *= 1.1;
    }


    const income =
        game.parts * price;


    const soldParts =
        game.parts;


    game.money += income;

    game.parts = 0;


    // XP за продажу

    addXP(
        soldParts * 20
    );


    showMessage(
        `Продано деталей: ${formatNumber(soldParts)}`
    );

    updateUI();
}


// ===============================
// ОПЫТ И УРОВЕНЬ
// ===============================

function getXPNeeded() {

    return game.playerLevel * 100;
}


function addXP(amount) {

    game.xp += amount;


    while (
        game.xp >= getXPNeeded()
    ) {

        game.xp -=
            getXPNeeded();

        game.playerLevel++;

        game.talentPoints++;

        showLevelUpMessage();
    }


    updateUI();
}


function showLevelUpMessage() {

    const message =
        document.getElementById(
            "levelMessage"
        );

    if (!message) return;


    message.textContent =
        `🎉 Новый уровень! Уровень ${game.playerLevel}. +1 очко талантов`;

    setTimeout(() => {

        message.textContent = "";

    }, 4000);
}


// ===============================
// УЛУЧШЕНИЕ ШАХТЫ
// ===============================

function upgradeMine() {

    const cost =
        game.mineLevel * 50;


    if (game.money < cost) {

        showMessage(
            `Недостаточно денег. Нужно ${formatNumber(cost)} 💰`
        );

        return;
    }


    game.money -= cost;

    game.mineLevel++;


    showMessage(
        `Шахта улучшена до уровня ${game.mineLevel}!`
    );


    updateUI();
}


// ===============================
// УЛУЧШЕНИЕ ПЛАВИЛЬНИ
// ===============================

function upgradeSmelter() {

    const cost =
        game.smelterLevel * 100;


    if (game.money < cost) {

        showMessage(
            `Недостаточно денег. Нужно ${formatNumber(cost)} 💰`
        );

        return;
    }


    game.money -= cost;

    game.smelterLevel++;


    showMessage(
        `Плавильня улучшена до уровня ${game.smelterLevel}!`
    );


    updateUI();
}


// ===============================
// УЛУЧШЕНИЕ ЗАВОДА
// ===============================

function upgradeFactory() {

    const cost =
        game.factoryLevel * 200;


    if (game.money < cost) {

        showMessage(
            `Недостаточно денег. Нужно ${formatNumber(cost)} 💰`
        );

        return;
    }


    game.money -= cost;

    game.factoryLevel++;


    showMessage(
        `Завод улучшен до уровня ${game.factoryLevel}!`
    );


    updateUI();
}


// ===============================
// РАБОЧИЕ
// ===============================

function hireWorker() {

    const cost = 100;


    if (game.money < cost) {

        showMessage(
            "Недостаточно денег для найма рабочего"
        );

        return;
    }


    game.money -= cost;

    game.workers++;


    showMessage(
        `Рабочий нанят! Всего рабочих: ${game.workers}`
    );


    updateUI();
}


// ===============================
// ТАЛАНТЫ
// ===============================

function buyTalent(type) {

    if (type === "mining") {

        if (game.talentMining) {

            showMessage(
                "Этот талант уже изучен"
            );

            return;
        }


        if (game.talentPoints < 1) {

            showMessage(
                "Недостаточно очков талантов"
            );

            return;
        }


        game.talentPoints--;

        game.talentMining = true;


        showMessage(
            "Талант «Эффективная добыча» изучен!"
        );
    }


    else if (type === "economy") {

        if (game.talentEconomy) {

            showMessage(
                "Этот талант уже изучен"
            );

            return;
        }


        if (!game.talentMining) {

            showMessage(
                "Сначала изучите «Эффективную добычу»"
            );

            return;
        }


        if (game.talentPoints < 1) {

            showMessage(
                "Недостаточно очков талантов"
            );

            return;
        }


        game.talentPoints--;

        game.talentEconomy = true;


        showMessage(
            "Талант «Экономика» изучен!"
        );
    }


    else if (type === "production") {

        if (game.talentProduction) {

            showMessage(
                "Этот талант уже изучен"
            );

            return;
        }


        if (!game.talentEconomy) {

            showMessage(
                "Сначала изучите «Экономику»"
            );

            return;
        }


        if (game.talentPoints < 2) {

            showMessage(
                "Нужно 2 очка талантов"
            );

            return;
        }


        game.talentPoints -= 2;

        game.talentProduction = true;


        showMessage(
            "Талант «Производство» изучен!"
        );
    }


    updateUI();
}


// ===============================
// ПРЕСТИЖ
// ===============================

function prestige() {

    if (game.playerLevel < 100) {

        showMessage(
            "Престиж доступен только с 100 уровня"
        );

        return;
    }


    const confirmed = confirm(
        "Престиж сбросит текущий прогресс. Продолжить?"
    );


    if (!confirmed) return;


    game.prestigeLevel++;


    game.money = 0;

    game.ore = 0;

    game.metal = 0;

    game.parts = 0;

    game.playerLevel = 1;

    game.xp = 0;

    game.mineLevel = 1;

    game.smelterLevel = 1;

    game.factoryLevel = 1;

    game.workers = 0;


    showMessage(
        `Престиж ${game.prestigeLevel} получен!`
    );


    updateUI();

    saveGame();
}


// ===============================
// МОДАЛЬНЫЕ ОКНА
// ===============================

function openModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.style.display = "block";
}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.style.display = "none";
}


// ===============================
// ЭКРАНЫ
// ===============================

function showScreen(id) {

    const screens =
        document.querySelectorAll(".screen");


    screens.forEach(screen => {

        screen.classList.add("hidden");

    });


    const target =
        document.getElementById(id);


    if (target) {

        target.classList.remove("hidden");

    }
}


// ===============================
// СООБЩЕНИЯ
// ===============================

function showMessage(text) {

    const message =
        document.getElementById(
            "levelMessage"
        );


    if (!message) return;


    message.textContent = text;


    clearTimeout(
        window.messageTimeout
    );


    window.messageTimeout =
        setTimeout(() => {

            message.textContent = "";

        }, 3000);
}


// ===============================
// ФОРМАТ ЧИСЕЛ
// ===============================

function formatNumber(number) {

    if (!Number.isFinite(number)) {
        return "0";
    }


    if (number < 10) {

        return number.toFixed(1);

    }


    if (number < 1000) {

        return Math.floor(number).toString();

    }


    return Math.floor(number)
        .toLocaleString("ru-RU");
}


// ===============================
// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ===============================

function updateUI() {

    // ---------------------------
    // РЕСУРСЫ
    // ---------------------------

    setText(
        "money",
        formatNumber(game.money)
    );

    setText(
        "ore",
        formatNumber(game.ore)
    );

    setText(
        "metal",
        formatNumber(game.metal)
    );

    setText(
        "parts",
        formatNumber(game.parts)
    );


    // ---------------------------
    // УРОВЕНЬ
    // ---------------------------

    setText(
        "playerLevel",
        game.playerLevel
    );


    // ---------------------------
    // XP
    // ---------------------------

    const xpNeeded =
        getXPNeeded();


    setText(
        "xp",
        formatNumber(game.xp)
    );

    setText(
        "xpNeeded",
        formatNumber(xpNeeded)
    );


    const xpPercent =
        Math.min(
            100,
            (game.xp / xpNeeded) * 100
        );


    const xpFill =
        document.getElementById(
            "xpFill"
        );


    if (xpFill) {

        xpFill.style.width =
            xpPercent + "%";

    }


    // ---------------------------
    // ДОБЫЧА
    // ---------------------------

    const miningPower =
        getMiningPower();


    setText(
        "autoMining",
        miningPower.toFixed(1)
    );


    setText(
        "manualMining",
        "+" + miningPower.toFixed(1)
    );


    // ---------------------------
    // УРОВЕНЬ ШАХТЫ
    // ---------------------------

    setText(
        "mineLevel",
        game.mineLevel
    );


    // ---------------------------
    // УЛУЧШЕНИЯ
    // ---------------------------

    setText(
        "upgradeMineLevel",
        game.mineLevel
    );

    setText(
        "mineUpgradeCost",
        game.mineLevel * 50
    );


    setText(
        "upgradeSmelterLevel",
        game.smelterLevel
    );

    setText(
        "smelterUpgradeCost",
        game.smelterLevel * 100
    );


    setText(
        "upgradeFactoryLevel",
        game.factoryLevel
    );

    setText(
        "factoryUpgradeCost",
        game.factoryLevel * 200
    );


    // ---------------------------
    // РАБОЧИЕ
    // ---------------------------

    setText(
        "workersCount",
        game.workers
    );


    setText(
        "workerProduction",
        (game.workers * 0.2).toFixed(1)
    );


    // ---------------------------
    // СВОДКА
    // ---------------------------

    setText(
        "summaryOre",
        formatNumber(game.ore)
    );

    setText(
        "summaryMetal",
        formatNumber(game.metal)
    );

    setText(
        "summaryParts",
        formatNumber(game.parts)
    );

    setText(
        "summaryWorkers",
        game.workers
    );


    // ---------------------------
    // ТАЛАНТЫ
    // ---------------------------

    setText(
        "talentPoints",
        game.talentPoints
    );
}


// ===============================
// БЕЗОПАСНОЕ ИЗМЕНЕНИЕ ТЕКСТА
// ===============================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent = value;

    }
}


// ===============================
// ИГРОВОЙ ЦИКЛ
// ===============================

let lastTime =
    performance.now();


function gameLoop(currentTime) {

    const delta =
        (currentTime - lastTime) / 1000;


    lastTime = currentTime;


    // Защита от огромного скачка времени

    const safeDelta =
        Math.min(delta, 1);


    automaticMining(
        safeDelta
    );


    automaticProduction(
        safeDelta
    );


    updateUI();


    requestAnimationFrame(
        gameLoop
    );
}


// ===============================
// ЗАПУСК
// ===============================

loadGame();

requestAnimationFrame(
    gameLoop
);


// ===============================
// АВТОСОХРАНЕНИЕ
// ===============================

setInterval(() => {

    saveGame();

}, 5000);


// ===============================
// ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА
// ПРИ НАЖАТИИ ВНЕ ЕГО
// ===============================

window.addEventListener(
    "click",
    function(event) {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            event.target.style.display =
                "none";

        }

    }
);
