// Tab switching functionality
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    const activeTab = Array.from(tabs).find(tab =>
        tab.textContent.toLowerCase().includes(tabName)
    );
    if (activeTab) {
        activeTab.classList.add('active');
    }

    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Utility functions
function getVal(id) {
    const element = document.getElementById(id);
    if (!element) return 0;
    return parseFloat(element.value) || 0;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatPercent(value) {
    return `${value.toFixed(2)}%`;
}

function setVal(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = typeof value === 'number' ? formatCurrency(value) : value;
    }
}

// Calculate monthly mortgage payment
function calculateMonthlyPayment(principal, annualRate, years) {
    if (principal <= 0 || annualRate <= 0) return 0;

    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;

    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
           (Math.pow(1 + monthlyRate, numPayments) - 1);
}

// Calculate IRR using Newton-Raphson method
function calculateIRR(cashFlows, guess = 0.1) {
    const maxIterations = 1000;
    const tolerance = 0.00001;

    let rate = guess;

    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let dnpv = 0;

        for (let t = 0; t < cashFlows.length; t++) {
            npv += cashFlows[t] / Math.pow(1 + rate, t);
            dnpv -= t * cashFlows[t] / Math.pow(1 + rate, t + 1);
        }

        const newRate = rate - npv / dnpv;

        if (Math.abs(newRate - rate) < tolerance) {
            return newRate * 100; // Return as percentage
        }

        rate = newRate;
    }

    return 0; // If no convergence
}

// Calculate loan balance after N years
function calculateLoanBalance(principal, annualRate, years, yearsElapsed) {
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;
    const monthsElapsed = yearsElapsed * 12;

    const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);

    // Calculate remaining balance
    const remainingMonths = totalMonths - monthsElapsed;
    const balance = monthlyPayment * (Math.pow(1 + monthlyRate, remainingMonths) - 1) /
                   (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths));

    return balance;
}

// SCENARIO 1: SELL
function calculateSellScenario() {
    const exitYear = getVal('exit-year');
    const appreciationRate = getVal('appreciation-rate') / 100;
    const initialValue = getVal('final-appraisal');
    const sellingCosts = getVal('selling-costs') / 100;
    const loanAmount = getVal('loan-amount');
    const interestRate = getVal('interest-rate');
    const loanTerm = getVal('loan-term');
    const totalEquity = getVal('total-equity');

    // Calculate future value
    const futureValue = initialValue * Math.pow(1 + appreciationRate, exitYear);

    // Check if using cap rate for valuation
    const useCapRate = document.getElementById('use-cap-rate').checked;
    let salePrice = futureValue;

    if (useCapRate) {
        const capRate = getVal('cap-rate') / 100;
        const ltrRent = getVal('ltr-monthly-rent') * 12;
        const expenses = getVal('property-tax') + getVal('insurance') +
                        getVal('maintenance') + getVal('hoa');
        const noi = ltrRent - expenses;
        salePrice = noi / capRate;
    }

    // Calculate loan balance at exit
    const loanBalance = calculateLoanBalance(loanAmount, interestRate, loanTerm, exitYear);

    // Net proceeds
    const grossProceeds = salePrice * (1 - sellingCosts);
    const netProceeds = grossProceeds - loanBalance;

    // Total profit
    const totalProfit = netProceeds - totalEquity;

    // Calculate cash flows for IRR
    const cashFlows = [-totalEquity]; // Initial investment

    // Add holding costs each year
    const annualHoldingCosts = getVal('property-tax') + getVal('insurance') +
                              getVal('maintenance') + getVal('hoa');
    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
    const annualDebtService = monthlyPayment * 12;

    for (let year = 1; year < exitYear; year++) {
        cashFlows.push(-(annualHoldingCosts + annualDebtService));
    }

    // Final year: exit proceeds minus last year costs
    cashFlows.push(netProceeds - (annualHoldingCosts + annualDebtService));

    const irr = calculateIRR(cashFlows);

    return {
        salePrice,
        netProceeds,
        totalProfit,
        irr,
        exitYear
    };
}

// SCENARIO 2: REFINANCE & HOLD
function calculateRefiScenario() {
    const refiYear = getVal('refi-year');
    const exitYear = getVal('exit-year');
    const appreciationRate = getVal('appreciation-rate') / 100;
    const initialValue = getVal('final-appraisal');
    const refiLTV = getVal('refi-ltv') / 100;
    const refiRate = getVal('refi-rate');
    const refiTerm = getVal('refi-term');
    const loanAmount = getVal('loan-amount');
    const interestRate = getVal('interest-rate');
    const loanTerm = getVal('loan-term');
    const totalEquity = getVal('total-equity');

    // Value at refinance
    const valueAtRefi = initialValue * Math.pow(1 + appreciationRate, refiYear);

    // Old loan balance at refi
    const oldLoanBalance = calculateLoanBalance(loanAmount, interestRate, loanTerm, refiYear);

    // New loan amount
    const newLoanAmount = valueAtRefi * refiLTV;

    // Cash out
    const cashOut = newLoanAmount - oldLoanBalance;

    // New monthly payment
    const newMonthlyPayment = calculateMonthlyPayment(newLoanAmount, refiRate, refiTerm);

    // Calculate LTR cash flow
    const ltrMonthlyRent = getVal('ltr-monthly-rent');
    const ltrVacancy = getVal('ltr-vacancy') / 100;
    const ltrMgmtFee = getVal('ltr-mgmt-fee') / 100;
    const ltrRentGrowth = getVal('ltr-rent-growth') / 100;

    const annualHoldingCosts = getVal('property-tax') + getVal('insurance') +
                              getVal('maintenance') + getVal('hoa');

    // Build cash flow array
    const cashFlows = [-totalEquity]; // Initial investment

    const oldMonthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);

    let totalReturn = 0;

    for (let year = 1; year <= exitYear; year++) {
        let annualRent = ltrMonthlyRent * 12 * Math.pow(1 + ltrRentGrowth, year - 1);
        annualRent *= (1 - ltrVacancy);
        annualRent *= (1 - ltrMgmtFee);

        let annualDebtService;
        if (year < refiYear) {
            annualDebtService = oldMonthlyPayment * 12;
        } else if (year === refiYear) {
            // Refi year: get cash out, new payment starts
            annualDebtService = newMonthlyPayment * 12;
            cashFlows.push(cashOut + annualRent - annualDebtService - annualHoldingCosts);
            totalReturn += cashOut + annualRent - annualDebtService - annualHoldingCosts;
            continue;
        } else {
            annualDebtService = newMonthlyPayment * 12;
        }

        const yearCashFlow = annualRent - annualDebtService - annualHoldingCosts;
        cashFlows.push(yearCashFlow);
        totalReturn += yearCashFlow;
    }

    const irr = calculateIRR(cashFlows);

    return {
        refiYear,
        cashOut,
        newPayment: newMonthlyPayment,
        totalReturn,
        irr
    };
}

// SCENARIO 3: HOLD LONG-TERM RENTAL
function calculateLTRScenario() {
    const exitYear = getVal('exit-year');
    const ltrMonthlyRent = getVal('ltr-monthly-rent');
    const ltrVacancy = getVal('ltr-vacancy') / 100;
    const ltrMgmtFee = getVal('ltr-mgmt-fee') / 100;
    const ltrRentGrowth = getVal('ltr-rent-growth') / 100;
    const loanAmount = getVal('loan-amount');
    const interestRate = getVal('interest-rate');
    const loanTerm = getVal('loan-term');
    const totalEquity = getVal('total-equity');
    const appreciationRate = getVal('appreciation-rate') / 100;
    const initialValue = getVal('final-appraisal');

    const annualHoldingCosts = getVal('property-tax') + getVal('insurance') +
                              getVal('maintenance') + getVal('hoa');
    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
    const annualDebtService = monthlyPayment * 12;

    // Build cash flow array
    const cashFlows = [-totalEquity];

    let totalCashFlow = 0;
    let firstYearCashFlow = 0;

    for (let year = 1; year <= exitYear; year++) {
        let annualRent = ltrMonthlyRent * 12 * Math.pow(1 + ltrRentGrowth, year - 1);
        annualRent *= (1 - ltrVacancy);
        annualRent *= (1 - ltrMgmtFee);

        const yearCashFlow = annualRent - annualDebtService - annualHoldingCosts;
        cashFlows.push(yearCashFlow);
        totalCashFlow += yearCashFlow;

        if (year === 1) {
            firstYearCashFlow = yearCashFlow;
        }
    }

    // Equity growth
    const futureValue = initialValue * Math.pow(1 + appreciationRate, exitYear);
    const loanBalance = calculateLoanBalance(loanAmount, interestRate, loanTerm, exitYear);
    const equityGrowth = futureValue - loanBalance - totalEquity;

    const irr = calculateIRR(cashFlows);

    return {
        monthlyCashFlow: firstYearCashFlow / 12,
        annualIncome: firstYearCashFlow,
        totalCashFlow,
        equityGrowth,
        irr
    };
}

// SCENARIO 4: HOLD SHORT-TERM RENTAL
function calculateSTRScenario() {
    const exitYear = getVal('exit-year');
    const strDailyRate = getVal('str-daily-rate');
    const strOccupancy = getVal('str-occupancy') / 100;
    const strCleaning = getVal('str-cleaning');
    const strAvgNights = getVal('str-avg-nights');
    const strMgmtFee = getVal('str-mgmt-fee') / 100;
    const strUtilities = getVal('str-utilities');
    const loanAmount = getVal('loan-amount');
    const interestRate = getVal('interest-rate');
    const loanTerm = getVal('loan-term');
    const totalEquity = getVal('total-equity');
    const appreciationRate = getVal('appreciation-rate') / 100;
    const initialValue = getVal('final-appraisal');

    // Calculate STR revenue
    const occupiedNights = 365 * strOccupancy;
    const numBookings = occupiedNights / strAvgNights;
    const annualRevenue = (occupiedNights * strDailyRate) + (numBookings * strCleaning);
    const annualRevenueAfterMgmt = annualRevenue * (1 - strMgmtFee);

    const annualHoldingCosts = getVal('property-tax') + getVal('insurance') +
                              getVal('maintenance') + getVal('hoa') + strUtilities;
    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
    const annualDebtService = monthlyPayment * 12;

    // Build cash flow array
    const cashFlows = [-totalEquity];

    let totalCashFlow = 0;
    const firstYearCashFlow = annualRevenueAfterMgmt - annualDebtService - annualHoldingCosts;

    for (let year = 1; year <= exitYear; year++) {
        const yearCashFlow = annualRevenueAfterMgmt - annualDebtService - annualHoldingCosts;
        cashFlows.push(yearCashFlow);
        totalCashFlow += yearCashFlow;
    }

    // Equity growth
    const futureValue = initialValue * Math.pow(1 + appreciationRate, exitYear);
    const loanBalance = calculateLoanBalance(loanAmount, interestRate, loanTerm, exitYear);
    const equityGrowth = futureValue - loanBalance - totalEquity;

    const irr = calculateIRR(cashFlows);

    return {
        monthlyCashFlow: firstYearCashFlow / 12,
        annualIncome: firstYearCashFlow,
        totalCashFlow,
        equityGrowth,
        irr
    };
}

// Main calculate function
function calculate() {
    const sellResults = calculateSellScenario();
    const refiResults = calculateRefiScenario();
    const ltrResults = calculateLTRScenario();
    const strResults = calculateSTRScenario();

    // Update Sell scenario
    document.getElementById('sell-exit-year').textContent = `Year ${sellResults.exitYear}`;
    setVal('sell-price', sellResults.salePrice);
    setVal('sell-proceeds', sellResults.netProceeds);
    setVal('sell-profit', sellResults.totalProfit);
    document.getElementById('sell-irr').textContent = formatPercent(sellResults.irr);

    // Update Refi scenario
    document.getElementById('refi-year-display').textContent = `Year ${refiResults.refiYear}`;
    setVal('refi-cashout', refiResults.cashOut);
    setVal('refi-payment', refiResults.newPayment);
    setVal('refi-return', refiResults.totalReturn);
    document.getElementById('refi-irr').textContent = formatPercent(refiResults.irr);

    // Update LTR scenario
    setVal('ltr-cashflow', ltrResults.monthlyCashFlow);
    setVal('ltr-annual', ltrResults.annualIncome);
    setVal('ltr-total-cash', ltrResults.totalCashFlow);
    setVal('ltr-equity', ltrResults.equityGrowth);
    document.getElementById('ltr-irr').textContent = formatPercent(ltrResults.irr);

    // Update STR scenario
    setVal('str-cashflow', strResults.monthlyCashFlow);
    setVal('str-annual', strResults.annualIncome);
    setVal('str-total-cash', strResults.totalCashFlow);
    setVal('str-equity', strResults.equityGrowth);
    document.getElementById('str-irr').textContent = formatPercent(strResults.irr);

    // Generate recommendation
    const recommendation = generateRecommendation(sellResults, refiResults, ltrResults, strResults);
    document.getElementById('recommendation').innerHTML = recommendation;

    // Generate cash flow timeline
    generateCashFlowTimeline();

    // Switch to results tab
    switchTab('results');
}

// Generate recommendation based on IRR comparison
function generateRecommendation(sell, refi, ltr, str) {
    const scenarios = [
        { name: 'Sell', irr: sell.irr, profit: sell.totalProfit },
        { name: 'Refi & Hold LTR', irr: refi.irr, profit: refi.totalReturn },
        { name: 'Hold LTR', irr: ltr.irr, profit: ltr.totalCashFlow + ltr.equityGrowth },
        { name: 'Hold STR', irr: str.irr, profit: str.totalCashFlow + str.equityGrowth }
    ];

    // Sort by IRR
    scenarios.sort((a, b) => b.irr - a.irr);

    let recommendation = `<h3>📊 Best Strategy: ${scenarios[0].name}</h3>`;
    recommendation += `<p><strong>Highest IRR: ${formatPercent(scenarios[0].irr)}</strong></p>`;
    recommendation += `<p>Total Return: ${formatCurrency(scenarios[0].profit)}</p><br>`;

    recommendation += `<h4>All Scenarios Ranked by IRR:</h4><ol>`;
    scenarios.forEach(s => {
        recommendation += `<li><strong>${s.name}</strong>: ${formatPercent(s.irr)} IRR | ${formatCurrency(s.profit)} return</li>`;
    });
    recommendation += `</ol>`;

    // Add insights
    recommendation += `<br><h4>💡 Insights:</h4><ul>`;

    if (str.irr > ltr.irr) {
        recommendation += `<li>Short-term rental generates ${formatPercent(str.irr - ltr.irr)} higher IRR than long-term rental</li>`;
    } else {
        recommendation += `<li>Long-term rental is more stable with ${formatPercent(ltr.irr - str.irr)} higher IRR than STR</li>`;
    }

    if (sell.irr > 15) {
        recommendation += `<li>Selling shows strong returns (${formatPercent(sell.irr)} IRR) - consider market timing</li>`;
    }

    if (refi.cashOut > 100000) {
        recommendation += `<li>Refinance could unlock ${formatCurrency(refi.cashOut)} in tax-free equity</li>`;
    }

    recommendation += `</ul>`;

    return recommendation;
}

// Generate year-by-year cash flow timeline
function generateCashFlowTimeline() {
    const exitYear = getVal('exit-year');
    const ltrMonthlyRent = getVal('ltr-monthly-rent');
    const ltrVacancy = getVal('ltr-vacancy') / 100;
    const ltrMgmtFee = getVal('ltr-mgmt-fee') / 100;
    const ltrRentGrowth = getVal('ltr-rent-growth') / 100;

    const loanAmount = getVal('loan-amount');
    const interestRate = getVal('interest-rate');
    const loanTerm = getVal('loan-term');

    const annualHoldingCosts = getVal('property-tax') + getVal('insurance') +
                              getVal('maintenance') + getVal('hoa');
    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
    const annualDebtService = monthlyPayment * 12;

    let html = '<table style="width: 100%; border-collapse: collapse;">';
    html += '<thead><tr style="background: #f1f5f9;"><th style="padding: 0.75rem; text-align: left;">Year</th>';
    html += '<th style="padding: 0.75rem; text-align: right;">Rental Income</th>';
    html += '<th style="padding: 0.75rem; text-align: right;">Expenses</th>';
    html += '<th style="padding: 0.75rem; text-align: right;">Debt Service</th>';
    html += '<th style="padding: 0.75rem; text-align: right;">Net Cash Flow</th></tr></thead><tbody>';

    for (let year = 1; year <= Math.min(exitYear, 10); year++) {
        let annualRent = ltrMonthlyRent * 12 * Math.pow(1 + ltrRentGrowth, year - 1);
        annualRent *= (1 - ltrVacancy);
        annualRent *= (1 - ltrMgmtFee);

        const netCashFlow = annualRent - annualDebtService - annualHoldingCosts;
        const rowColor = netCashFlow >= 0 ? '#ecfdf5' : '#fef2f2';

        html += `<tr style="border-bottom: 1px solid #e5e7eb; background: ${rowColor}">`;
        html += `<td style="padding: 0.75rem;">${year}</td>`;
        html += `<td style="padding: 0.75rem; text-align: right;">${formatCurrency(annualRent)}</td>`;
        html += `<td style="padding: 0.75rem; text-align: right;">${formatCurrency(annualHoldingCosts)}</td>`;
        html += `<td style="padding: 0.75rem; text-align: right;">${formatCurrency(annualDebtService)}</td>`;
        html += `<td style="padding: 0.75rem; text-align: right; font-weight: 600;">${formatCurrency(netCashFlow)}</td>`;
        html += '</tr>';
    }

    html += '</tbody></table>';

    document.getElementById('cashflow-timeline').innerHTML = html;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    // Handle cap rate toggle
    const useCapRateCheckbox = document.getElementById('use-cap-rate');
    const capRateField = document.getElementById('cap-rate-field');

    if (useCapRateCheckbox && capRateField) {
        useCapRateCheckbox.addEventListener('change', function() {
            capRateField.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Run initial calculation
    calculate();
});
