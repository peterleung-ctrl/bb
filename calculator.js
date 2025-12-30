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
    return parseFloat(document.getElementById(id).value) || 0;
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

// Calculate monthly payment for a loan
function calculateMonthlyPayment(principal, annualRate, years) {
    if (principal <= 0 || annualRate <= 0) return 0;

    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;

    const monthlyPayment = principal *
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);

    return monthlyPayment;
}

// Calculate construction loan interest (interest-only during construction)
function calculateConstructionInterest(principal, annualRate, months) {
    // Construction loans typically charge interest only on the average outstanding balance
    // Assume funds are drawn evenly over the construction period
    const avgBalance = principal / 2;
    const monthlyRate = annualRate / 100 / 12;
    return avgBalance * monthlyRate * months;
}

// Build cost calculations
function calculateBuildCosts() {
    const data = {
        // Personal finances
        income: getVal('annual-income'),
        downPayment: getVal('down-payment'),
        monthlyDebts: getVal('monthly-debts'),
        interestRate: getVal('interest-rate'),
        loanTerm: getVal('loan-term'),

        // Land
        landCost: getVal('land-cost'),
        landDownPercent: getVal('land-down-payment'),
        landLoanRate: getVal('land-loan-rate'),

        // Construction
        homeSize: getVal('home-size'),
        costPerSqft: getVal('cost-per-sqft'),
        constructionLoanRate: getVal('construction-loan-rate'),
        constructionMonths: getVal('construction-months'),

        // Professional fees
        architectFeePercent: getVal('architect-fee'),
        engineeringFee: getVal('engineering-fee'),
        lightingDesign: getVal('lighting-design'),
        interiorDesign: getVal('interior-design'),
        landscapeDesign: getVal('landscape-design'),
        otherConsultants: getVal('other-consultants'),

        // Permitting & development
        permittingCosts: getVal('permitting-costs'),
        landDevelopment: getVal('land-development'),
        impactFees: getVal('impact-fees'),

        // GC & contingency
        gcFeePercent: getVal('gc-fee'),
        contingencyPercent: getVal('contingency'),

        // Carry costs
        propertyTaxAnnual: getVal('property-taxes-annual'),
        insuranceDuring: getVal('insurance-during'),
        currentRent: getVal('current-rent')
    };

    // Calculate construction costs
    const baseConstructionCost = data.homeSize * data.costPerSqft;
    const architectFee = baseConstructionCost * (data.architectFeePercent / 100);
    const gcFee = baseConstructionCost * (data.gcFeePercent / 100);

    // Total soft costs
    const totalSoftCosts = architectFee + data.engineeringFee + data.lightingDesign +
                          data.interiorDesign + data.landscapeDesign + data.otherConsultants;

    // Total hard costs (construction + GC)
    const totalHardCosts = baseConstructionCost + gcFee;

    // Development costs
    const totalDevelopmentCosts = data.permittingCosts + data.landDevelopment + data.impactFees;

    // Subtotal before contingency
    const subtotal = data.landCost + totalHardCosts + totalSoftCosts + totalDevelopmentCosts;

    // Contingency
    const contingency = subtotal * (data.contingencyPercent / 100);

    // Total project cost
    const totalProjectCost = subtotal + contingency;

    // Construction loan interest
    const constructionLoanAmount = totalHardCosts + totalSoftCosts + totalDevelopmentCosts + contingency;
    const constructionInterest = calculateConstructionInterest(
        constructionLoanAmount,
        data.constructionLoanRate,
        data.constructionMonths
    );

    // Carry costs during construction
    const propertyTaxDuringConstruction = (data.propertyTaxAnnual / 12) * data.constructionMonths;
    const rentDuringConstruction = data.currentRent * data.constructionMonths;
    const totalCarryCosts = constructionInterest + propertyTaxDuringConstruction +
                           data.insuranceDuring + rentDuringConstruction;

    // Total cost including carry costs
    const totalCostWithCarry = totalProjectCost + totalCarryCosts;

    // Land financing
    const landDownPayment = data.landCost * (data.landDownPercent / 100);
    const landLoanAmount = data.landCost - landDownPayment;

    // Final mortgage (convert construction loan to permanent)
    const finalLoanAmount = totalProjectCost - data.downPayment;
    const monthlyPI = calculateMonthlyPayment(finalLoanAmount, data.interestRate, data.loanTerm);

    // Cost per square foot
    const costPerSqft = totalProjectCost / data.homeSize;

    return {
        totalProjectCost,
        totalCostWithCarry,
        downPaymentNeeded: data.downPayment,
        landCost: data.landCost,
        baseConstructionCost,
        architectFee,
        gcFee,
        totalSoftCosts,
        totalHardCosts,
        totalDevelopmentCosts,
        contingency,
        constructionInterest,
        totalCarryCosts,
        finalLoanAmount,
        monthlyPI,
        costPerSqft,
        breakdown: {
            'Land Acquisition': data.landCost,
            'Base Construction': baseConstructionCost,
            'Architect Fees': architectFee,
            'GC Fees': gcFee,
            'Engineering': data.engineeringFee,
            'Lighting Design': data.lightingDesign,
            'Interior Design': data.interiorDesign,
            'Landscape Design': data.landscapeDesign,
            'Other Consultants': data.otherConsultants,
            'Permitting': data.permittingCosts,
            'Land Development': data.landDevelopment,
            'Impact Fees': data.impactFees,
            'Contingency': contingency,
            'Construction Loan Interest': constructionInterest,
            'Property Tax (During Construction)': propertyTaxDuringConstruction,
            'Insurance (During Construction)': data.insuranceDuring,
            'Housing During Construction': rentDuringConstruction
        }
    };
}

// Buy cost calculations
function calculateBuyCosts() {
    const data = {
        income: getVal('annual-income'),
        downPayment: getVal('down-payment'),
        monthlyDebts: getVal('monthly-debts'),
        interestRate: getVal('interest-rate'),
        loanTerm: getVal('loan-term'),

        buyPrice: getVal('buy-price'),
        buySize: getVal('buy-size'),
        closingCostsPercent: getVal('closing-costs'),
        renovationCosts: getVal('renovation-costs'),
        propertyTaxRate: getVal('buy-property-tax-rate'),
        insuranceAnnual: getVal('buy-insurance-annual'),
        hoaMonthly: getVal('buy-hoa'),
        maintenancePercent: getVal('buy-maintenance')
    };

    // Calculate closing costs
    const closingCosts = data.buyPrice * (data.closingCostsPercent / 100);

    // Total purchase cost
    const totalPurchaseCost = data.buyPrice + closingCosts + data.renovationCosts;

    // Loan amount
    const loanAmount = data.buyPrice - data.downPayment;

    // Monthly payment (P&I)
    const monthlyPI = calculateMonthlyPayment(loanAmount, data.interestRate, data.loanTerm);

    // Annual costs
    const propertyTaxAnnual = data.buyPrice * (data.propertyTaxRate / 100);
    const maintenanceAnnual = data.buyPrice * (data.maintenancePercent / 100);

    // Monthly costs
    const propertyTaxMonthly = propertyTaxAnnual / 12;
    const insuranceMonthly = data.insuranceAnnual / 12;
    const maintenanceMonthly = maintenanceAnnual / 12;

    // Total monthly payment
    const totalMonthlyPayment = monthlyPI + propertyTaxMonthly + insuranceMonthly +
                               data.hoaMonthly + maintenanceMonthly;

    // First year total costs
    const firstYearCosts = (monthlyPI * 12) + propertyTaxAnnual + data.insuranceAnnual +
                          (data.hoaMonthly * 12) + maintenanceAnnual + closingCosts +
                          data.renovationCosts;

    // Cost per square foot
    const costPerSqft = totalPurchaseCost / data.buySize;

    return {
        totalPurchaseCost,
        downPaymentNeeded: data.downPayment,
        loanAmount,
        monthlyPI,
        closingCosts,
        propertyTaxAnnual,
        insuranceAnnual: data.insuranceAnnual,
        hoaMonthly: data.hoaMonthly,
        maintenanceAnnual,
        totalMonthlyPayment,
        firstYearCosts,
        costPerSqft
    };
}

// Calculate maximum affordable home
function calculateAffordability() {
    const income = getVal('annual-income');
    const monthlyDebts = getVal('monthly-debts');
    const downPayment = getVal('down-payment');
    const interestRate = getVal('interest-rate');
    const loanTerm = getVal('loan-term');

    // Use 28% front-end ratio and 36% back-end ratio
    const monthlyIncome = income / 12;
    const maxHousingPayment = monthlyIncome * 0.28;
    const maxTotalDebt = monthlyIncome * 0.36;
    const maxHousingWithDebts = maxTotalDebt - monthlyDebts;

    // Use the more conservative limit
    const maxMonthlyPayment = Math.min(maxHousingPayment, maxHousingWithDebts);

    // Calculate maximum loan amount
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    const maxLoan = maxMonthlyPayment *
        (Math.pow(1 + monthlyRate, numPayments) - 1) /
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments));

    // Maximum home price
    const maxHomePrice = maxLoan + downPayment;

    return {
        maxHomePrice,
        maxMonthlyPayment,
        maxHousingPayment,
        maxHousingWithDebts
    };
}

// Calculate DTI ratio
function calculateDTI(monthlyHousingPayment) {
    const monthlyIncome = getVal('annual-income') / 12;
    const monthlyDebts = getVal('monthly-debts');
    const totalMonthlyDebt = monthlyHousingPayment + monthlyDebts;
    return (totalMonthlyDebt / monthlyIncome) * 100;
}

// Generate recommendation
function generateRecommendation(buildResults, buyResults, affordability) {
    const income = getVal('annual-income');
    const recommendations = [];

    const buildDTI = calculateDTI(buildResults.monthlyPI);
    const buyDTI = calculateDTI(buyResults.totalMonthlyPayment);

    // Affordability check
    if (buildResults.totalProjectCost > affordability.maxHomePrice) {
        recommendations.push(`⚠️ <strong>Build option exceeds affordable range</strong> by ${formatCurrency(buildResults.totalProjectCost - affordability.maxHomePrice)}. Consider reducing scope or increasing down payment.`);
    }

    if (buyResults.totalPurchaseCost > affordability.maxHomePrice) {
        recommendations.push(`⚠️ <strong>Buy option exceeds affordable range</strong> by ${formatCurrency(buyResults.totalPurchaseCost - affordability.maxHomePrice)}. Consider a lower-priced home.`);
    }

    // DTI warnings
    if (buildDTI > 43) {
        recommendations.push(`⚠️ Build option DTI of ${formatPercent(buildDTI)} exceeds recommended maximum of 43%. May be difficult to qualify for financing.`);
    }

    if (buyDTI > 43) {
        recommendations.push(`⚠️ Buy option DTI of ${formatPercent(buyDTI)} exceeds recommended maximum of 43%. May be difficult to qualify for financing.`);
    }

    // Cost per square foot comparison
    const costDifference = buildResults.costPerSqft - buyResults.costPerSqft;
    if (Math.abs(costDifference) > 50) {
        if (costDifference > 0) {
            recommendations.push(`💰 Building costs ${formatCurrency(costDifference)} more per sq ft than buying. Consider if customization is worth the premium.`);
        } else {
            recommendations.push(`💰 Building costs ${formatCurrency(Math.abs(costDifference))} less per sq ft than buying. Good value for new construction!`);
        }
    }

    // Total cost comparison
    const totalCostDiff = buildResults.totalCostWithCarry - buyResults.firstYearCosts;
    if (totalCostDiff < 0) {
        recommendations.push(`✅ <strong>Building is more cost-effective</strong> by ${formatCurrency(Math.abs(totalCostDiff))} in first year costs. You'll get a brand new, custom home for less.`);
    } else {
        recommendations.push(`✅ <strong>Buying is more cost-effective</strong> by ${formatCurrency(totalCostDiff)} in first year costs. You can move in immediately without construction delays.`);
    }

    // Long-term considerations
    recommendations.push(`📊 <strong>Long-term considerations:</strong>`);
    recommendations.push(`• Building: New home warranty, lower maintenance costs initially, everything customized to your preferences, energy-efficient construction.`);
    recommendations.push(`• Buying: Immediate occupancy, established neighborhood, mature landscaping, known condition (with inspection).`);

    // Final recommendation
    const buildAffordable = buildResults.totalProjectCost <= affordability.maxHomePrice && buildDTI <= 43;
    const buyAffordable = buyResults.totalPurchaseCost <= affordability.maxHomePrice && buyDTI <= 43;

    if (buildAffordable && !buyAffordable) {
        recommendations.push(`<br><strong style="color: #2563eb;">Recommendation: BUILD</strong> - Building is within your budget while buying exceeds it.`);
    } else if (buyAffordable && !buildAffordable) {
        recommendations.push(`<br><strong style="color: #10b981;">Recommendation: BUY</strong> - Buying is within your budget while building exceeds it.`);
    } else if (buildAffordable && buyAffordable) {
        if (totalCostDiff < -50000) {
            recommendations.push(`<br><strong style="color: #2563eb;">Recommendation: BUILD</strong> - Both options are affordable, but building offers better value and a custom home.`);
        } else if (totalCostDiff > 50000) {
            recommendations.push(`<br><strong style="color: #10b981;">Recommendation: BUY</strong> - Both options are affordable, but buying is more cost-effective and offers immediate occupancy.`);
        } else {
            recommendations.push(`<br><strong style="color: #f59e0b;">Recommendation: PERSONAL CHOICE</strong> - Both options are similarly affordable. Choose based on your preference for customization (build) vs. immediate occupancy (buy).`);
        }
    } else {
        recommendations.push(`<br><strong style="color: #ef4444;">Warning: NEITHER OPTION IS AFFORDABLE</strong> - Both exceed your budget. Consider increasing your down payment, reducing scope, or looking at lower-priced options.`);
    }

    return recommendations.join('<br><br>');
}

// Create 5-year timeline visualization
function createTimelineChart(buildResults, buyResults) {
    const chartHTML = [];

    // Calculate 5-year costs for both options
    const buildMonthly = buildResults.monthlyPI;
    const buyMonthly = buyResults.totalMonthlyPayment;

    const buildAnnual = buildMonthly * 12;
    const buyAnnual = buyMonthly * 12;

    // Add initial costs for year 0
    const buildInitial = buildResults.totalCostWithCarry;
    const buyInitial = buyResults.firstYearCosts;

    const maxCost = Math.max(buildInitial, buyInitial, buildAnnual, buyAnnual);

    // Year 0 (Initial/First Year)
    chartHTML.push(`
        <div class="timeline-row">
            <div class="timeline-label">Year 1</div>
            <div class="timeline-bar-container">
                <div class="timeline-bar build" style="width: ${(buildInitial / maxCost) * 100}%">
                    Build: ${formatCurrency(buildInitial)}
                </div>
            </div>
        </div>
        <div class="timeline-row">
            <div class="timeline-label"></div>
            <div class="timeline-bar-container">
                <div class="timeline-bar buy" style="width: ${(buyInitial / maxCost) * 100}%">
                    Buy: ${formatCurrency(buyInitial)}
                </div>
            </div>
        </div>
    `);

    // Years 2-5
    for (let year = 2; year <= 5; year++) {
        chartHTML.push(`
            <div class="timeline-row">
                <div class="timeline-label">Year ${year}</div>
                <div class="timeline-bar-container">
                    <div class="timeline-bar build" style="width: ${(buildAnnual / maxCost) * 100}%">
                        ${formatCurrency(buildAnnual)}
                    </div>
                </div>
            </div>
            <div class="timeline-row">
                <div class="timeline-label"></div>
                <div class="timeline-bar-container">
                    <div class="timeline-bar buy" style="width: ${(buyAnnual / maxCost) * 100}%">
                        ${formatCurrency(buyAnnual)}
                    </div>
                </div>
            </div>
        `);
    }

    // Cumulative totals
    const buildTotal5Year = buildInitial + (buildAnnual * 4);
    const buyTotal5Year = buyInitial + (buyAnnual * 4);

    chartHTML.push(`
        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 2px solid #e2e8f0;">
            <div class="timeline-row">
                <div class="timeline-label"><strong>5-Year Total</strong></div>
                <div class="timeline-bar-container">
                    <div class="timeline-bar build" style="width: ${(buildTotal5Year / Math.max(buildTotal5Year, buyTotal5Year)) * 100}%">
                        ${formatCurrency(buildTotal5Year)}
                    </div>
                </div>
            </div>
            <div class="timeline-row">
                <div class="timeline-label"></div>
                <div class="timeline-bar-container">
                    <div class="timeline-bar buy" style="width: ${(buyTotal5Year / Math.max(buildTotal5Year, buyTotal5Year)) * 100}%">
                        ${formatCurrency(buyTotal5Year)}
                    </div>
                </div>
            </div>
        </div>
    `);

    return chartHTML.join('');
}

// Calculate decision metrics and update dashboard
function updateDecisionDashboard(buildResults, affordability) {
    const afterBuildValue = getVal('after-build-value');
    const minEquityPercent = getVal('min-equity-percent');
    const buildDTI = calculateDTI(buildResults.monthlyPI);

    // Calculate equity and profit
    const totalCost = buildResults.totalProjectCost;
    const equity = afterBuildValue - totalCost;
    const equityPercent = (equity / afterBuildValue) * 100;
    const costToValueRatio = (totalCost / afterBuildValue) * 100;

    // Determine decision status
    let decision = 'neutral';
    let statusText = 'CALCULATING...';
    let messageText = 'Enter your details and calculate';
    let riskLevel = 'LOW';
    let dtiSummary = 'DTI within limits';

    // Decision logic thresholds
    const issues = [];
    const warnings = [];

    // Check DTI
    if (buildDTI > 43) {
        issues.push('DTI exceeds 43%');
        riskLevel = 'HIGH';
        dtiSummary = `${formatPercent(buildDTI)} - Too High`;
    } else if (buildDTI > 36) {
        warnings.push('DTI above 36%');
        riskLevel = 'MEDIUM';
        dtiSummary = `${formatPercent(buildDTI)} - Moderate`;
    } else {
        dtiSummary = `${formatPercent(buildDTI)} - Excellent`;
    }

    // Check affordability
    if (totalCost > affordability.maxHomePrice * 1.2) {
        issues.push('Project cost far exceeds budget');
    } else if (totalCost > affordability.maxHomePrice) {
        warnings.push('Project cost exceeds recommended budget');
    }

    // Check equity position
    if (equityPercent < 0) {
        issues.push('Underwater - cost exceeds value');
    } else if (equityPercent < minEquityPercent) {
        warnings.push(`Equity below ${minEquityPercent}% target`);
    }

    // Check cost-to-value ratio
    if (costToValueRatio > 100) {
        issues.push('Building costs more than expected value');
    } else if (costToValueRatio > 90) {
        warnings.push('Building costs close to market value');
    }

    // Determine overall decision
    if (issues.length > 0) {
        decision = 'stop';
        statusText = '🛑 WALK AWAY';
        messageText = issues.join('. ') + '. This project is too risky.';
    } else if (warnings.length > 0) {
        decision = 'caution';
        statusText = '⚠️ SCALE BACK';
        messageText = warnings.join('. ') + '. Consider reducing scope or increasing budget.';
    } else {
        decision = 'go';
        statusText = '✅ MOVE FORWARD';
        messageText = 'All metrics look good. This project appears financially sound.';
    }

    // Update dashboard UI
    const indicator = document.getElementById('decision-indicator');
    indicator.className = 'decision-indicator ' + decision;

    document.getElementById('decision-status').textContent = statusText;
    document.getElementById('decision-message').textContent = messageText;

    // Update metrics
    setVal('equity-amount', equity);
    document.getElementById('equity-percent').textContent = formatPercent(equityPercent) + ' equity';

    setVal('profit-amount', equity);
    document.getElementById('cost-to-value-ratio').textContent = formatPercent(costToValueRatio) + ' cost-to-value';

    document.getElementById('risk-level').textContent = riskLevel;
    document.getElementById('dti-summary').textContent = dtiSummary;
}

// Main calculate function
function calculate() {
    const buildResults = calculateBuildCosts();
    const buyResults = calculateBuyCosts();
    const affordability = calculateAffordability();

    // Update Build Results
    setVal('build-total-cost', buildResults.totalProjectCost);
    setVal('build-down-needed', buildResults.downPaymentNeeded);
    setVal('build-loan-amount', buildResults.finalLoanAmount);
    setVal('build-monthly-pi', buildResults.monthlyPI);
    setVal('build-cost-sqft', buildResults.costPerSqft);
    setVal('build-carry-costs', buildResults.totalCarryCosts);

    // Update Buy Results
    setVal('buy-total-cost', buyResults.totalPurchaseCost);
    setVal('buy-down-needed', buyResults.downPaymentNeeded);
    setVal('buy-loan-amount', buyResults.loanAmount);
    setVal('buy-monthly-pi', buyResults.monthlyPI);
    setVal('buy-cost-sqft', buyResults.costPerSqft);
    setVal('buy-first-year', buyResults.firstYearCosts);

    // Update Affordability
    setVal('max-affordable-build', affordability.maxHomePrice);
    setVal('max-affordable-buy', affordability.maxHomePrice);
    setVal('dti-build', formatPercent(calculateDTI(buildResults.monthlyPI)));
    setVal('dti-buy', formatPercent(calculateDTI(buyResults.totalMonthlyPayment)));

    // Update Breakdown
    let breakdownHTML = '';
    for (const [category, amount] of Object.entries(buildResults.breakdown)) {
        const isHighlight = category.includes('Contingency') || category.includes('Interest');
        breakdownHTML += `
            <div class="breakdown-item ${isHighlight ? 'highlight' : ''}">
                <span>${category}</span>
                <span style="font-weight: 700;">${formatCurrency(amount)}</span>
            </div>
        `;
    }
    document.getElementById('build-breakdown').innerHTML = breakdownHTML;

    // Update Recommendation
    const recommendation = generateRecommendation(buildResults, buyResults, affordability);
    const recommendationBox = document.getElementById('recommendation');
    recommendationBox.innerHTML = recommendation;

    // Set recommendation box style based on content
    const buildDTI = calculateDTI(buildResults.monthlyPI);
    const buyDTI = calculateDTI(buyResults.totalMonthlyPayment);
    if (buildDTI > 43 || buyDTI > 43 ||
        buildResults.totalProjectCost > affordability.maxHomePrice * 1.2 ||
        buyResults.totalPurchaseCost > affordability.maxHomePrice * 1.2) {
        recommendationBox.className = 'recommendation-box danger';
    } else if (buildResults.totalProjectCost > affordability.maxHomePrice ||
               buyResults.totalPurchaseCost > affordability.maxHomePrice) {
        recommendationBox.className = 'recommendation-box warning';
    } else {
        recommendationBox.className = 'recommendation-box';
    }

    // Update Timeline Chart
    document.getElementById('timeline-chart').innerHTML = createTimelineChart(buildResults, buyResults);

    // Update Decision Dashboard
    updateDecisionDashboard(buildResults, affordability);

    // Switch to results tab
    switchTab('results');
}

// Reset form to defaults
function resetForm() {
    if (confirm('Reset all values to defaults?')) {
        location.reload();
    }
}

// Calculate on load with default values
window.addEventListener('load', () => {
    calculate();

    // Add input listeners for real-time updates
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            // Auto-calculate could be enabled here
            // calculate();
        });
    });
});
