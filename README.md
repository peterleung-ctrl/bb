# Home Affordability Calculator - Buy vs Build

An interactive web-based calculator to help you make an informed decision between buying an existing home or building a custom home. This tool provides comprehensive financial analysis specific to home construction projects.

## Features

### 🏗️ Build Cost Analysis
- **Land Acquisition**: Purchase price, down payment, and land loan terms
- **Construction Costs**: Detailed per-square-foot calculation with customizable loan rates
- **Professional Fees**:
  - Architect fees (percentage-based)
  - Engineering fees
  - Lighting design
  - Interior design
  - Landscape design
  - Other consultants
- **Permitting & Development**:
  - Permitting and approval costs
  - Land development (grading, utilities, driveway)
  - Impact fees
- **General Contractor**: Percentage-based GC fees
- **Contingency**: Customizable percentage for unexpected costs
- **Carry Costs**:
  - Construction loan interest (calculated on average outstanding balance)
  - Property taxes during construction
  - Insurance during construction
  - Current housing costs during build

### 🏡 Buy Option Analysis
- Purchase price and home size
- Closing costs
- Immediate renovation needs
- Property taxes
- Homeowners insurance
- HOA fees
- Annual maintenance costs
- First-year total cost calculation

### 💰 Affordability Analysis
- Maximum affordable home price based on income
- Debt-to-Income (DTI) ratio calculation
- 28/36 rule application (28% front-end, 36% back-end ratios)
- Comparison against recommended lending standards

### 📊 Buy vs Build Comparison
- Side-by-side cost comparison
- Cost per square foot analysis
- Monthly payment calculations
- 5-year cost projection timeline
- Detailed breakdown of all costs
- Smart recommendations based on your financial situation

## How to Use

1. **Open the Calculator**
   - Simply open `index.html` in any modern web browser
   - No installation or dependencies required

2. **Enter Your Information**
   - **Personal Finances Tab**: Enter your income, available down payment, existing debts, and loan terms
   - **Build Costs Tab**: Input all details related to building a home (land, construction, fees, etc.)
   - **Buy Option Tab**: Enter details about the home you're considering purchasing

3. **Calculate & Compare**
   - Click the "Calculate" button to see comprehensive results
   - Review the Results tab for detailed analysis and recommendations

4. **Adjust and Refine**
   - Modify any values to see how changes affect your options
   - Click "Calculate" again to update results
   - Use "Reset to Defaults" to start over

## Understanding the Results

### Build Option Results
- **Total Project Cost**: Complete cost of your build project
- **Down Payment Needed**: Cash required upfront
- **Loan Amount**: Amount to finance
- **Monthly Payment**: Principal and interest only
- **Cost per Sq Ft**: Total cost divided by home size
- **Carry Costs**: Expenses during construction period

### Buy Option Results
- **Total Purchase Cost**: Home price + closing costs + renovations
- **Monthly Payment**: Principal and interest only
- **First Year Total**: All costs in year one including closing, renovations, taxes, insurance, etc.

### Affordability Metrics
- **Maximum Affordable Home**: Based on 28/36 rule and your income
- **DTI Ratio**: Your debt-to-income ratio
  - Below 28%: Excellent
  - 28-36%: Good
  - 36-43%: Acceptable (maximum for most lenders)
  - Above 43%: May have difficulty qualifying

### Recommendations
The calculator provides intelligent recommendations based on:
- Whether each option fits your budget
- DTI ratios for each option
- Cost-effectiveness comparison
- Long-term considerations

## Default Values

The calculator comes pre-loaded with realistic default values:
- Annual Income: $150,000
- Down Payment: $100,000
- Land Cost: $150,000
- Home Size: 2,500 sq ft
- Construction Cost: $200/sq ft
- And many more...

These defaults help you understand how the calculator works and provide a baseline for comparison.

## Construction Loan Interest Calculation

Construction loans work differently from traditional mortgages:
- Interest is calculated on the **average outstanding balance**
- Funds are drawn incrementally as construction progresses
- The calculator assumes even fund distribution over the construction period
- This results in interest on approximately 50% of the total loan amount
- Upon completion, the construction loan converts to a traditional mortgage

## Key Considerations

### Benefits of Building
- ✅ Custom design to your exact specifications
- ✅ New construction with modern systems and efficiency
- ✅ Everything is brand new (warranties included)
- ✅ No immediate repairs or renovations needed
- ✅ Energy-efficient construction reduces long-term costs

### Benefits of Buying
- ✅ Immediate occupancy
- ✅ Established neighborhood
- ✅ Mature landscaping
- ✅ Known condition (with proper inspection)
- ✅ No construction delays or change orders
- ✅ Often includes appliances and window treatments

### Important Notes
- Construction timelines can extend beyond estimates
- Construction costs can exceed budgets (hence contingency)
- Carrying two housing payments during construction is expensive
- Property values may appreciate during construction
- Building allows for customization that may increase resale value

## Cost Breakdown Categories

The calculator tracks 17 different cost categories:
1. Land Acquisition
2. Base Construction
3. Architect Fees
4. GC Fees
5. Engineering
6. Lighting Design
7. Interior Design
8. Landscape Design
9. Other Consultants
10. Permitting
11. Land Development
12. Impact Fees
13. Contingency
14. Construction Loan Interest
15. Property Tax (During Construction)
16. Insurance (During Construction)
17. Housing During Construction

## Browser Compatibility

This calculator works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Privacy

All calculations are performed locally in your browser. No data is sent to any server or stored anywhere. Your financial information remains completely private.

## Technical Details

- **Pure HTML/CSS/JavaScript**: No frameworks or dependencies
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Print-Friendly**: Can be printed for offline reference
- **Accessible**: Follows web accessibility guidelines

## Customization

You can easily customize default values by editing the HTML file:
- Open `index.html` in a text editor
- Find the input field you want to change
- Modify the `value` attribute
- Save and reload in your browser

## Tips for Accurate Results

1. **Get Real Quotes**: Use actual quotes from contractors, architects, and lenders
2. **Include Everything**: Don't forget smaller costs like permits, surveys, and utility connections
3. **Be Conservative**: Use higher estimates for costs and lower estimates for your budget
4. **Account for Delays**: Construction often takes longer than planned
5. **Consider Resale**: Think about which option will better hold value in your market

## Support

This calculator provides estimates for educational and comparison purposes only. For accurate financial planning:
- Consult with a licensed mortgage professional
- Work with experienced contractors and architects
- Get detailed bids before making final decisions
- Consider working with a financial advisor

## License

This project is open source and free to use for personal or commercial purposes.

---

**Disclaimer**: This calculator provides estimates based on the inputs you provide. Actual costs may vary. Always consult with financial professionals, contractors, and real estate experts before making major financial decisions.
