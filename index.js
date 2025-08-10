let start = new Date("2025-05-05");
let sum = 150000;
let days = 0

const conditions = [
    {
        rate: 20,
        end: new Date("2025-06-06")
    },
    {
        rate: 18,
        end: new Date("2025-07-25"),
    },
    {
        correct: () => {sum = sum - 80000},
        rate: 18,
        end: new Date("2025-07-26"),
    },
    {
        rate: 17.6,
        end: new Date("2025-07-28"),
    },
    {
        rate: 22,
        end: new Date(),
    },
];


conditions.forEach((condition, index) => {
    condition?.correct?.();
    let diffMs = condition.end - start;
    let diffDays = Math.floor((diffMs / (1000 * 60 * 60 * 24)));
    for (let i = 1; i <= diffDays; i++) {
        sum = sum + condition.rate/365 * 0.01 * sum
        days++
    }
    start = condition.end
})

const daysNode = document.getElementById('days');
daysNode.innerHTML = days;

const sumNode = document.getElementById('sum');
sumNode.innerHTML = sum.toLocaleString('ru-RU', { maximumFractionDigits: 0 });
