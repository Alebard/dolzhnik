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
        rate: 18,
        end: new Date("2025-07-28"),
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


function calcLoanInterest(principal, annualRate, termMonths, earlyPayments = [], startDate) {
    const dailyRate = annualRate / 100 / 365;
    const start = new Date(startDate);
    let currentDate = new Date(start);
    let endDate = new Date(start);
    endDate.setMonth(start.getMonth() + termMonths);

    let balance = principal;
    let totalInterest = 0;

    // Сортируем досрочные платежи
    earlyPayments = earlyPayments.map(p => ({
        date: new Date(p.date),
        amount: p.amount
    })).sort((a, b) => a.date - b.date);

    // Рассчитываем исходный аннуитет
    const monthlyRate = annualRate / 100 / 12;
    let annuityPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);

    let paymentIndex = 0;
    let nextAnnuityDate = new Date(start);
    nextAnnuityDate.setMonth(nextAnnuityDate.getMonth() + 1);

    while (currentDate <= endDate && balance > 0.01) {
        // Применяем досрочные платежи
        while (paymentIndex < earlyPayments.length &&
        isSameDay(currentDate, earlyPayments[paymentIndex].date)) {
            balance = Math.max(0, balance - earlyPayments[paymentIndex].amount);
            paymentIndex++;

            // Пересчитываем срок кредита
            if (balance > 0) {
                const remainingTerm = Math.log(annuityPayment/(annuityPayment - balance*monthlyRate)) /
                    Math.log(1 + monthlyRate);
                endDate = new Date(currentDate);
                endDate.setMonth(endDate.getMonth() + Math.ceil(remainingTerm));
            }
        }

        // Начисляем проценты
        const dailyInterest = balance * dailyRate;
        totalInterest += dailyInterest;
        balance += dailyInterest;

        // Аннуитетный платёж
        if (isSameDay(currentDate, nextAnnuityDate)) {
            const payment = Math.min(annuityPayment, balance);
            balance = Math.max(0, balance - payment);
            nextAnnuityDate.setMonth(nextAnnuityDate.getMonth() + 1);
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return parseFloat(totalInterest.toFixed(2));
}

// Сравнение дат
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}


const lastBankDay = conditions.at(-1).end;

// Пример использования
const totalInterest1 = calcLoanInterest(
    1700000,
    21,
    60,
    [
        { date: lastBankDay, amount: sum }
    ],
    lastBankDay
);
const totalInterest2 = calcLoanInterest(
    1700000,
    21,
    60,
    [
        { date: new Date(), amount: sum }
    ],
    lastBankDay
);

days = days + (Math.floor((new Date() - lastBankDay )/ (1000 * 60 * 60 * 24)));
const daysNode = document.getElementById('days');
daysNode.innerHTML = days;

sum = sum + (totalInterest2 - totalInterest1);
const sumNode = document.getElementById('sum');
sumNode.innerHTML = sum.toLocaleString('ru-RU', { maximumFractionDigits: 0 });



