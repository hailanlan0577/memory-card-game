// 初始化变量
const cardsContainer = document.getElementById("cards");
const movesCount = document.getElementById("moves-count");
const timeValue = document.getElementById("timer");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const result = document.getElementById("result");
const controlsContainer = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = false;
let secondCard = false;
let moves = 0;
let seconds = 0;
let matchedCards = 0;

// 卡片内容数组（使用表情符号作为卡片内容）
const emojis = [
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"
];

// 计时器
const timeGenerator = () => {
    seconds += 1;
    timeValue.innerHTML = seconds;
};

// 计算移动次数
const movesCounter = () => {
    moves += 1;
    movesCount.innerHTML = moves;
};

// 随机生成卡片数组
const generateCards = () => {
    // 创建包含所有配对卡片的数组
    let cardValues = [...emojis, ...emojis];
    // 随机排序
    cardValues.sort(() => Math.random() - 0.5);
    return cardValues;
};

// 创建卡片布局
const matrixGenerator = (cardValues) => {
    cardsContainer.innerHTML = "";
    for (let i = 0; i < cardValues.length; i++) {
        cardsContainer.innerHTML += `
            <div class="card" data-card-value="${cardValues[i]}">
                <div class="card-front">${cardValues[i]}</div>
                <div class="card-back">?</div>
            </div>
        `;
    }
    // 网格布局
    cardsContainer.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(cardValues.length))}, 1fr)`;

    // 添加点击事件
    cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            // 如果选中的卡片不是已经匹配的卡片
            if (!card.classList.contains("matched") && !card.classList.contains("flipped")) {
                // 翻转卡片
                card.classList.add("flipped");
                // 如果是第一张卡片
                if (!firstCard) {
                    firstCard = card;
                } else {
                    // 如果是第二张卡片
                    secondCard = card;
                    movesCounter();
                    // 检查是否匹配
                    let firstCardValue = firstCard.getAttribute("data-card-value");
                    let secondCardValue = secondCard.getAttribute("data-card-value");
                    if (firstCardValue === secondCardValue) {
                        // 匹配成功
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        // 重置卡片选择
                        firstCard = false;
                        secondCard = false;
                        matchedCards += 2;
                        // 检查是否获胜
                        if (matchedCards === emojis.length * 2) {
                            setTimeout(() => {
                                result.innerHTML = `恭喜你! <br> 步数: ${moves} <br> 用时: ${seconds}秒`;
                                stopGame();
                            }, 500);
                        }
                    } else {
                        // 匹配失败，翻回去
                        let tempFirst = firstCard;
                        let tempSecond = secondCard;
                        firstCard = false;
                        secondCard = false;
                        setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 500);
                    }
                }
            }
        });
    });
};

// 初始化游戏
const initializer = () => {
    // 重置游戏状态
    matchedCards = 0;
    moves = 0;
    seconds = 0;
    movesCount.innerHTML = moves;
    timeValue.innerHTML = seconds;
    firstCard = false;
    secondCard = false;
    // 生成并布置卡片
    let cardValues = generateCards();
    matrixGenerator(cardValues);
    // 隐藏控制界面，显示游戏
    controlsContainer.classList.add("hide");
    stopButton.classList.remove("hide");
    // 启动计时器
    interval = setInterval(timeGenerator, 1000);
};

// 停止游戏
const stopGame = () => {
    // 显示控制界面
    controlsContainer.classList.remove("hide");
    stopButton.classList.add("hide");
    // 停止计时器
    clearInterval(interval);
};

// 开始按钮事件
startButton.addEventListener("click", () => {
    initializer();
});

// 停止按钮事件
stopButton.addEventListener("click", () => {
    stopGame();
    result.innerHTML = "游戏已停止";
});