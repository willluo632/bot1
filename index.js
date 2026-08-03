const {
  Client, GatewayIntentBits, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  REST, Routes, SlashCommandBuilder
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

// ─── Question Bank ────────────────────────────────────────────────────────────
const QUESTIONS = [
  // Stoichiometry
  { topic: 'Stoichiometry', q: 'How many grams of CO₂ are produced when 44.0 g of propane (C₃H₈) is completely combusted? (Molar masses: C=12, H=1, O=16)', choices: ['88.0 g', '132 g', '176 g', '44.0 g'], answer: 1, explanation: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. 44 g C₃H₈ = 1 mol → 3 mol CO₂ = 132 g.' },
  { topic: 'Stoichiometry', q: 'A solution is prepared by dissolving 5.85 g of NaCl (MW = 58.5 g/mol) in enough water to make 500 mL of solution. What is the molarity?', choices: ['0.100 M', '0.200 M', '0.400 M', '1.00 M'], answer: 1, explanation: 'moles NaCl = 5.85/58.5 = 0.100 mol. M = 0.100/0.500 = 0.200 M.' },
  { topic: 'Stoichiometry', q: 'In the reaction 2Al + 3Cl₂ → 2AlCl₃, if 2.70 g of Al (MW=27) reacts with excess Cl₂, how many moles of AlCl₃ are produced?', choices: ['0.0500 mol', '0.100 mol', '0.150 mol', '0.200 mol'], answer: 1, explanation: '2.70/27 = 0.100 mol Al. 1:1 molar ratio → 0.100 mol AlCl₃.' },
  { topic: 'Stoichiometry', q: 'What volume of 0.500 M H₂SO₄ is needed to neutralize 100 mL of 1.00 M NaOH? (H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O)', choices: ['25.0 mL', '50.0 mL', '100 mL', '200 mL'], answer: 2, explanation: 'moles NaOH = 0.100 mol → need 0.0500 mol H₂SO₄ → V = 0.0500/0.500 = 0.100 L = 100 mL.' },
  { topic: 'Stoichiometry', q: 'A compound is 40.0% C, 6.67% H, and 53.3% O by mass. What is its empirical formula?', choices: ['CH₂O', 'C₂H₄O₂', 'CHO', 'C₂H₂O'], answer: 0, explanation: 'C:40/12=3.33, H:6.67/1=6.67, O:53.3/16=3.33 → ratio 1:2:1 → CH₂O.' },
  { topic: 'Stoichiometry', q: 'What is the percent yield if 4.50 g of product is obtained when the theoretical yield is 6.00 g?', choices: ['55.0%', '65.0%', '75.0%', '85.0%'], answer: 2, explanation: 'Percent yield = (4.50/6.00) × 100 = 75.0%.' },
  { topic: 'Stoichiometry', q: 'How many molecules are in 2.00 mol of water? (Avogadro\'s number = 6.022 × 10²³)', choices: ['3.01 × 10²³', '6.02 × 10²³', '1.20 × 10²⁴', '2.41 × 10²⁴'], answer: 2, explanation: '2.00 mol × 6.022 × 10²³ = 1.204 × 10²⁴ molecules.' },
  { topic: 'Stoichiometry', q: 'How many grams of CO₂ are produced when 44.0 g of propane (C₃H₈) is completely combusted? (Molar masses: C=12, H=1, O=16)', choices: ['88.0 g', '132 g', '176 g', '44.0 g'], answer: 1, explanation: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. 44 g C₃H₈ = 1 mol → 3 mol CO₂ = 132 g.' },
  { topic: 'Stoichiometry', q: 'A solution is prepared by dissolving 5.85 g of NaCl (MW = 58.5 g/mol) in enough water to make 500 mL of solution. What is the molarity?', choices: ['0.100 M', '0.200 M', '0.400 M', '1.00 M'], answer: 1, explanation: 'moles NaCl = 5.85/58.5 = 0.100 mol. M = 0.100/0.500 = 0.200 M.' },
  { topic: 'Stoichiometry', q: 'What is the empirical formula of a compound that contains 40.0% C, 6.7% H, and 53.3% O by mass?', choices: ['CH₂O', 'C₂H₄O₂', 'CHO', 'C₂H₂O'], answer: 0, explanation: 'Moles: C = 40/12 = 3.33, H = 6.7/1 = 6.7, O = 53.3/16 = 3.33. Ratio C:H:O is 1:2:1, giving CH₂O.' },
  { topic: 'Stoichiometry', q: 'If 10.0 moles of H₂ react with 3.0 moles of O₂ to form water, which reagent is limiting and how many moles of H₂O are formed?', choices: ['H₂ is limiting; 10.0 mol H₂O', 'O₂ is limiting; 6.0 mol H₂O', 'O₂ is limiting; 3.0 mol H₂O', 'H₂ is limiting; 5.0 mol H₂O'], answer: 1, explanation: '2H₂ + O₂ → 2H₂O. 3 mol O₂ needs 6 mol H₂. Oxygen is limiting; 3 mol O₂ yields 6 mol H₂O.' },
  { topic: 'Stoichiometry', q: 'What volume of 0.50 M NaOH is required to completely neutralize 25.0 mL of 0.20 M H₂SO₄?', choices: ['10.0 mL', '20.0 mL', '25.0 mL', '50.0 mL'], answer: 1, explanation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O. Moles H⁺ = 0.025 L × 0.20 M × 2 = 0.010 mol. V_NaOH = 0.010 / 0.50 = 0.020 L = 20.0 mL.' },
  { topic: 'Stoichiometry', q: 'What is the molar mass of calcium nitrate, Ca(NO₃)₂? (Ca=40.08, N=14.01, O=16.00)', choices: ['102.10 g/mol', '164.10 g/mol', '132.09 g/mol', '204.10 g/mol'], answer: 1, explanation: '40.08 + 2(14.01 + 3 × 16.00) = 40.08 + 2(62.01) = 164.10 g/mol.' },
  { topic: 'Stoichiometry', q: 'How many molecules are in 2.5 moles of H₂O?', choices: ['1.51 × 10²⁴', '6.02 × 10²³', '2.41 × 10²³', '3.01 × 10²⁴'], answer: 0, explanation: 'Molecules = 2.5 mol × 6.022 × 10²³ molecules/mol = 1.51 × 10²⁴ molecules.' },
  { topic: 'Stoichiometry', q: 'How many grams of O₂ are required to react completely with 54.0 g of Al? (4Al + 3O₂ → 2Al₂O₃; Al=27, O=16)', choices: ['32.0 g', '48.0 g', '96.0 g', '144 g'], answer: 1, explanation: 'Moles Al = 54/27 = 2 mol. Moles O₂ required = 2 mol Al × (3 mol O₂ / 4 mol Al) = 1.5 mol O₂. Mass O₂ = 1.5 × 32 = 48.0 g.' },
  { topic: 'Stoichiometry', q: 'If the theoretical yield of a reaction is 25.0 g and the actual yield is 20.0 g, what is the percent yield?', choices: ['80.0%', '75.0%', '125%', '20.0%'], answer: 0, explanation: 'Percent yield = (Actual / Theoretical) × 100% = (20.0 / 25.0) × 100% = 80.0%.' },
  { topic: 'Stoichiometry', q: 'What volume of concentrated 12.0 M HCl is needed to prepare 300 mL of 2.00 M HCl?', choices: ['50.0 mL', '25.0 mL', '60.0 mL', '75.0 mL'], answer: 0, explanation: 'M₁V₁ = M₂V₂ → (12.0 M)V₁ = (2.00 M)(300 mL) → V₁ = 600 / 12.0 = 50.0 mL.' },
  { topic: 'Stoichiometry', q: 'What volume of N₂ gas at STP is produced from the decomposition of 2.0 moles of NaN₃? (2NaN₃ → 2Na + 3N₂)', choices: ['22.4 L', '44.8 L', '67.2 L', '11.2 L'], answer: 2, explanation: '2 mol NaN₃ produces 3 mol N₂. At STP, 1 mol gas = 22.4 L. 3 mol × 22.4 L/mol = 67.2 L.' },
  { topic: 'Stoichiometry', q: 'What is the mass percent of oxygen in pure water (H₂O)? (H=1.01, O=16.00)', choices: ['11.2%', '33.3%', '66.7%', '88.8%'], answer: 3, explanation: 'Molar mass H₂O = 18.02 g/mol. Mass % O = (16.00 / 18.02) × 100% = 88.8%.' },
  { topic: 'Stoichiometry', q: 'A compound has an empirical formula of CH₂ and a molar mass of 56 g/mol. What is its molecular formula?', choices: ['C₂H₄', 'C₃H₆', 'C₄H₈', 'C₅H₁₀'], answer: 2, explanation: 'Empirical mass of CH₂ = 14 g/mol. Ratio = 56 / 14 = 4. Molecular formula = (CH₂)₄ = C₄H₈.' },
  { topic: 'Stoichiometry', q: 'How many total atoms are in 0.50 moles of ammonia (NH₃)?', choices: ['6.02 × 10²³', '1.20 × 10²⁴', '3.01 × 10²³', '2.41 × 10²⁴'], answer: 1, explanation: '1 mol NH₃ contains 4 mol atoms. 0.50 mol NH₃ contains 2.0 mol atoms = 2.0 × 6.022 × 10²³ = 1.20 × 10²⁴ atoms.' },
  { topic: 'Stoichiometry', q: 'What mass of KBr (MW = 119 g/mol) is needed to prepare 250 mL of a 0.40 M solution?', choices: ['11.9 g', '23.8 g', '47.6 g', '5.95 g'], answer: 0, explanation: 'Moles = 0.250 L × 0.40 M = 0.10 mol. Mass = 0.10 mol × 119 g/mol = 11.9 g.' },
  { topic: 'Stoichiometry', q: 'How many moles of Fe₂O₃ are produced when 4.0 moles of Fe react with excess O₂? (4Fe + 3O₂ → 2Fe₂O₃)', choices: ['1.0 mol', '2.0 mol', '4.0 mol', '8.0 mol'], answer: 1, explanation: 'Mole ratio Fe to Fe₂O₃ is 4:2 = 2:1. 4.0 mol Fe yields 2.0 mol Fe₂O₃.' },
  { topic: 'Stoichiometry', q: 'What is the percent composition by mass of carbon in methane (CH₄)? (C=12.01, H=1.01)', choices: ['25.0%', '74.9%', '80.0%', '85.7%'], answer: 1, explanation: 'Molar mass = 16.05 g/mol. % C = (12.01 / 16.05) × 100% = 74.9%.' },
  { topic: 'Stoichiometry', q: 'In the reaction 2Al + 3Cl₂ → 2AlCl₃, how many moles of Cl₂ are needed to react completely with 6.0 moles of Al?', choices: ['4.0 mol', '6.0 mol', '9.0 mol', '12.0 mol'], answer: 2, explanation: 'Moles Cl₂ = 6.0 mol Al × (3 mol Cl₂ / 2 mol Al) = 9.0 mol.' },
  { topic: 'Stoichiometry', q: 'If 4.0 g of H₂ gas reacts with 32.0 g of O₂ gas, what is the maximum mass of H₂O formed?', choices: ['18.0 g', '36.0 g', '9.0 g', '72.0 g'], answer: 1, explanation: 'Moles H₂ = 2, moles O₂ = 1. Stoichiometry 2H₂ + O₂ → 2H₂O shows exact stoichiometric amounts. 2 mol H₂O formed = 36.0 g.' },
  { topic: 'Stoichiometry', q: 'What mass of BaSO₄ (MW = 233.4 g/mol) precipitates when excess BaCl₂ is added to 100 mL of 0.50 M Na₂SO₄?', choices: ['11.67 g', '23.34 g', '5.83 g', '1.17 g'], answer: 0, explanation: 'Moles SO₄²⁻ = 0.100 L × 0.50 M = 0.050 mol. Mass BaSO₄ = 0.050 mol × 233.4 g/mol = 11.67 g.' },
  { topic: 'Stoichiometry', q: 'What is the molality of a solution containing 10.0 g of NaOH (MW = 40.0 g/mol) in 500 g of water?', choices: ['0.25 m', '0.50 m', '1.00 m', '2.00 m'], answer: 1, explanation: 'Moles NaOH = 10.0 / 40.0 = 0.25 mol. kg solvent = 0.500 kg. Molality = 0.25 / 0.500 = 0.50 m.' },
  { topic: 'Stoichiometry', q: 'When 2.0 mol of KClO₃ decomposes into KCl and O₂, how many liters of O₂ gas are collected at STP?', choices: ['22.4 L', '33.6 L', '67.2 L', '44.8 L'], answer: 2, explanation: '2KClO₃ → 2KCl + 3O₂. 2 mol KClO₃ gives 3 mol O₂. Volume = 3 mol × 22.4 L/mol = 67.2 L.' },
  { topic: 'Stoichiometry', q: 'How many moles of sulfate ions (SO₄²⁻) are present in 250 mL of 0.20 M Al₂(SO₄)₃ solution?', choices: ['0.05 mol', '0.10 mol', '0.15 mol', '0.30 mol'], answer: 2, explanation: 'Moles Al₂(SO₄)₃ = 0.250 L × 0.20 M = 0.050 mol. Each unit contains 3 SO₄²⁻ ions → 0.050 × 3 = 0.15 mol.' },
  { topic: 'Stoichiometry', q: 'A 2.00 g sample of a hydrate CuSO₄·nH₂O is heated, leaving 1.28 g of anhydrous CuSO₄ (MW = 159.6 g/mol). What is n?', choices: ['2', '5', '7', '10'], answer: 1, explanation: 'Mass H₂O lost = 0.72 g. Moles H₂O = 0.72 / 18 = 0.040 mol. Moles CuSO₄ = 1.28 / 159.6 = 0.0080 mol. Ratio = 0.040 / 0.0080 = 5.' },
  { topic: 'Stoichiometry', q: 'How many chloride ions (Cl⁻) are in 1.00 L of 0.50 M CaCl₂ solution?', choices: ['3.01 × 10²³', '6.02 × 10²³', '1.20 × 10²⁴', '2.41 × 10²⁴'], answer: 1, explanation: 'Moles CaCl₂ = 0.50 mol. Moles Cl⁻ = 2 × 0.50 = 1.00 mol. Number of Cl⁻ ions = 6.02 × 10²³.' },
  { topic: 'Stoichiometry', q: 'What is the empirical formula of a oxide of phosphorus containing 43.6% P and 56.4% O by mass? (P=31, O=16)', choices: ['PO₂', 'P₂O₃', 'P₂O₅', 'PO₃'], answer: 2, explanation: 'Moles: P = 43.6/31 = 1.407, O = 56.4/16 = 3.525. Ratio O/P = 2.5 → 2:5 ratio gives P₂O₅.' },
  { topic: 'Stoichiometry', q: 'If 50.0 mL of 1.0 M HCl is mixed with 50.0 mL of 1.0 M NaOH, what is the concentration of NaCl in the final mixture?', choices: ['1.0 M', '0.50 M', '0.25 M', '2.0 M'], answer: 1, explanation: 'Moles NaCl formed = 0.050 L × 1.0 M = 0.050 mol. Total final volume = 100 mL = 0.100 L. M = 0.050 / 0.100 = 0.50 M.' },
  { topic: 'Stoichiometry', q: 'How many grams of Fe are produced from 160 g of Fe₂O₃ reacted with excess CO? (Fe₂O₃ + 3CO → 2Fe + 3CO₂; MW Fe₂O₃ = 160 g/mol, Fe = 56 g/mol)', choices: ['56 g', '112 g', '160 g', '224 g'], answer: 1, explanation: '160 g Fe₂O₃ = 1 mol Fe₂O₃, producing 2 mol Fe. Mass Fe = 2 × 56 = 112 g.' },
  { topic: 'Stoichiometry', q: 'What volume of pure ethanol (density = 0.789 g/mL) contains 39.45 g of ethanol?', choices: ['31.1 mL', '50.0 mL', '62.6 mL', '40.0 mL'], answer: 1, explanation: 'Volume = mass / density = 39.45 g / 0.789 g/mL = 50.0 mL.' },
  { topic: 'Stoichiometry', q: 'In the neutralization reaction H₃PO₄ + 3NaOH → Na₃PO₄ + 3H₂O, how many moles of NaOH are needed for 0.40 mol of H₃PO₄?', choices: ['0.40 mol', '0.80 mol', '1.20 mol', '1.60 mol'], answer: 2, explanation: 'Mole ratio is 1 H₃PO₄ : 3 NaOH. Moles NaOH = 0.40 × 3 = 1.20 mol.' },
  { topic: 'Stoichiometry', q: 'If 12.0 g of C reacts with 16.0 g of O₂ to produce CO, what is the limiting reactant and how much CO is formed? (2C + O₂ → 2CO)', choices: ['C is limiting; 28.0 g CO', 'O₂ is limiting; 28.0 g CO', 'O₂ is limiting; 56.0 g CO', 'C is limiting; 14.0 g CO'], answer: 1, explanation: 'Moles C = 12/12 = 1.0; Moles O₂ = 16/32 = 0.5. 0.5 mol O₂ reacts with 1.0 mol C. Both are present in exact stoichiometric proportions! Yield of CO = 1.0 mol = 28.0 g (O₂ limits max CO if O₂ runs out).' },
  { topic: 'Stoichiometry', q: 'What is the percent by mass of water in copper(II) sulfate pentahydrate, CuSO₄·5H₂O? (MW CuSO₄=159.6, H₂O=18.0)', choices: ['36.1%', '25.0%', '45.0%', '55.8%'], answer: 0, explanation: 'Total MW = 159.6 + 5(18.0) = 249.6 g/mol. Mass H₂O = 90.0 g. Mass % = (90.0 / 249.6) × 100% = 36.1%.' },
  { topic: 'Stoichiometry', q: 'What volume of 3.0 M H₂SO₄ is needed to yield 0.15 moles of H⁺ ions?', choices: ['25 mL', '50 mL', '100 mL', '150 mL'], answer: 0, explanation: 'H₂SO₄ produces 2 H⁺ per mole. So 0.15 mol H⁺ requires 0.075 mol H₂SO₄. V = 0.075 / 3.0 = 0.025 L = 25 mL.' },
  { topic: 'Stoichiometry', q: 'How many total ions are produced when 1 mole of (NH₄)₂SO₄ completely dissociates in water?', choices: ['6.02 × 10²³', '1.20 × 10²⁴', '1.81 × 10²⁴', '2.41 × 10²⁴'], answer: 2, explanation: '(NH₄)₂SO₄ dissociates into 2 NH₄⁺ and 1 SO₄²⁻ (3 ions total). 3 × 6.022 × 10²³ = 1.81 × 10²⁴ ions.' },
  { topic: 'Stoichiometry', q: 'What is the mass of 3.01 × 10²³ atoms of gold (Au, MW = 197 g/mol)?', choices: ['98.5 g', '197 g', '394 g', '49.25 g'], answer: 0, explanation: 'Moles Au = (3.01 × 10²³) / (6.022 × 10²³) = 0.50 mol. Mass = 0.50 mol × 197 g/mol = 98.5 g.' },
  { topic: 'Stoichiometry', q: 'An unknown gas has a density of 1.43 g/L at STP. What is its molar mass?', choices: ['16.0 g/mol', '28.0 g/mol', '32.0 g/mol', '44.0 g/mol'], answer: 2, explanation: 'Molar mass at STP = density × 22.4 L/mol = 1.43 g/L × 22.4 L/mol = 32.0 g/mol (O₂).' },
  { topic: 'Stoichiometry', q: 'Reaction yield calculation: 10.0 g of CaCO₃ decomposes to yield 4.40 g of CO₂. What is the percent yield? (CaCO₃ → CaO + CO₂; MW CaCO₃=100, CO₂=44)', choices: ['50.0%', '88.0%', '100%', '44.0%'], answer: 1, explanation: '10 g CaCO₃ = 0.10 mol → Theoretical CO₂ = 0.10 mol = 4.40 g. Actual = 4.40 g. Percent yield = (4.40 / 4.40) × 100% = 100%.' },
  { topic: 'Stoichiometry', q: 'How many grams of glucose (C₆H₁₂O₆, MW = 180 g/mol) are required to make 100 mL of a 0.50 M solution?', choices: ['9.0 g', '18 g', '90 g', '4.5 g'], answer: 0, explanation: 'Moles = 0.100 L × 0.50 M = 0.050 mol. Mass = 0.050 × 180 = 9.0 g.' },
  { topic: 'Stoichiometry', q: 'Which compound contains the highest mass percentage of nitrogen?', choices: ['NH₃ (MW=17)', 'NO₂ (MW=46)', 'N₂O (MW=44)', 'NH₄NO₃ (MW=80)'], answer: 0, explanation: 'NH₃ has 14/17 = 82.4% N. N₂O has 28/44 = 63.6%. NH₄NO₃ has 28/80 = 35.0%. NH₃ is highest.' },
  { topic: 'Stoichiometry', q: 'What is the mole fraction of NaCl in a solution made by dissolving 1 mol NaCl in 9 mol H₂O?', choices: ['0.10', '0.11', '0.90', '0.01'], answer: 0, explanation: 'Mole fraction χ_NaCl = moles NaCl / total moles = 1 / (1 + 9) = 1/10 = 0.10.' },
  { topic: 'Stoichiometry', q: 'What volume of 0.100 M AgNO₃ is needed to react completely with 20.0 mL of 0.050 M MgCl₂? (2AgNO₃ + MgCl₂ → 2AgCl + Mg(NO₃)₂)', choices: ['10.0 mL', '20.0 mL', '40.0 mL', '5.0 mL'], answer: 1, explanation: 'Moles MgCl₂ = 0.020 L × 0.050 M = 0.0010 mol. Required AgNO₃ = 0.0020 mol. V = 0.0020 / 0.100 = 0.020 L = 20.0 mL.' },
  { topic: 'Stoichiometry', q: 'If a hydrocarbon combustion yields 0.88 g CO₂ and 0.36 g H₂O, what is its empirical formula?', choices: ['CH', 'CH₂', 'CH₃', 'C₂H₅'], answer: 0, explanation: 'Moles C = 0.88/44 = 0.02 mol. Moles H = 2 × (0.36/18) = 0.04 mol... Wait, ratio C:H is 0.02:0.04 = 1:2, so CH₂.' },
  { topic: 'Stoichiometry', q: 'How many liters of O₂ gas at STP are required to react completely with 2.0 moles of CO to form CO₂?', choices: ['11.2 L', '22.4 L', '44.8 L', '5.6 L'], answer: 1, explanation: '2CO + O₂ → 2CO₂. 2.0 mol CO requires 1.0 mol O₂. At STP, 1 mol O₂ = 22.4 L.' },
  { topic: 'Stoichiometry', q: 'What is the mass of one single molecule of carbon dioxide (CO₂)? (Avogadro constant = 6.02 × 10²³ mol⁻¹)', choices: ['7.31 × 10⁻²³ g', '44.0 g', '2.65 × 10⁻²³ g', '1.37 × 10⁻²² g'], answer: 0, explanation: 'Mass of one molecule = 44.0 g/mol / (6.022 × 10²³) = 7.31 × 10⁻²³ g.' },
  { topic: 'Stoichiometry', q: 'In the Haber process, N₂ + 3H₂ → 2NH₃, if 14 g N₂ reacts with 6 g H₂, what is the maximum mass of NH₃ produced? (N=14, H=1)', choices: ['17 g', '34 g', '20 g', '10 g'], answer: 0, explanation: 'Moles N₂ = 14/28 = 0.5. Moles H₂ = 6/2 = 3.0. N₂ is limiting (0.5 mol needs 1.5 mol H₂). 0.5 mol N₂ yields 1.0 mol NH₃ = 17 g.' },
  { topic: 'Stoichiometry', q: 'A solution is made by mixing 200 mL of 0.50 M HCl and 300 mL of 0.20 M HCl. What is the final molarity?', choices: ['0.32 M', '0.35 M', '0.70 M', '0.28 M'], answer: 0, explanation: 'Total moles = (0.200 × 0.50) + (0.300 × 0.20) = 0.10 + 0.06 = 0.16 mol. Total volume = 0.500 L. M = 0.16 / 0.500 = 0.32 M.' },
  { topic: 'Stoichiometry', q: 'What mass of Na (MW = 23 g/mol) reacts with excess water to produce 11.2 L of H₂ gas at STP? (2Na + 2H₂O → 2NaOH + H₂)', choices: ['11.5 g', '23.0 g', '46.0 g', '5.75 g'], answer: 1, explanation: 'Moles H₂ = 11.2 / 22.4 = 0.50 mol. Moles Na needed = 2 × 0.50 = 1.0 mol = 23.0 g.' },
  { topic: 'Stoichiometry', q: 'How many grams of solute are present in 50.0 g of a 10.0% by mass aqueous NaCl solution?', choices: ['0.50 g', '5.0 g', '10.0 g', '45.0 g'], answer: 1, explanation: 'Mass of solute = mass of solution × mass % = 50.0 g × 0.100 = 5.0 g.' },
  { topic: 'Stoichiometry', q: 'What is the volume strength of 1 M H₂O₂ solution if 2H₂O₂ → 2H₂O + O₂ at STP?', choices: ['5.6 V', '11.2 V', '22.4 V', '2.8 V'], answer: 1, explanation: '1 L of 1 M H₂O₂ contains 1 mol H₂O₂, producing 0.5 mol O₂ = 11.2 L of O₂ at STP. Hence 11.2 volume.' },
  { topic: 'Stoichiometry', q: 'How many moles of hydrogen atoms are contained in 0.25 moles of Ca(OH)₂?', choices: ['0.25 mol', '0.50 mol', '1.00 mol', '0.125 mol'], answer: 1, explanation: 'Each mole of Ca(OH)₂ contains 2 moles of H atoms. Moles H = 0.25 × 2 = 0.50 mol.' },

  // Descriptive Chemistry
  { topic: 'Descriptive Chemistry', q: 'Which of the following gases turns limewater milky white?', choices: ['SO₂', 'CO₂', 'NH₃', 'HCl'], answer: 1, explanation: 'CO₂ + Ca(OH)₂ → CaCO₃ (white precipitate) + H₂O.' },
  { topic: 'Descriptive Chemistry', q: 'Which flame color is associated with sodium ions?', choices: ['Red', 'Violet', 'Yellow', 'Green'], answer: 2, explanation: 'Sodium produces a characteristic bright yellow flame at 589 nm.' },
  { topic: 'Descriptive Chemistry', q: 'A white solid dissolves in water to give pH > 7. The solid is most likely:', choices: ['NaCl', 'Na₂CO₃', 'NH₄Cl', 'AlCl₃'], answer: 1, explanation: 'Na₂CO₃ is the salt of a strong base and weak acid; it hydrolyzes to give a basic solution.' },
  { topic: 'Descriptive Chemistry', q: 'Which halogen exists as a liquid at room temperature (25°C)?', choices: ['F₂', 'Cl₂', 'Br₂', 'I₂'], answer: 2, explanation: 'Bromine (Br₂) is the only halogen that is liquid at standard room temperature.' },
  { topic: 'Descriptive Chemistry', q: 'Which reagent is used to test for the presence of starch?', choices: ['Benedict\'s solution', 'Iodine solution', 'Biuret reagent', 'Fehling\'s solution'], answer: 1, explanation: 'Iodine turns dark blue-black in the presence of starch due to triiodide intercalation in the amylose helix.' },
{ topic: 'Descriptive Chemistry', q: 'Which alkali metal produces a characteristic crimson/red flame color in a flame test?', choices: ['Sodium', 'Potassium', 'Lithium', 'Barium'], answer: 2, explanation: 'Lithium salts give off a vibrant crimson red flame color.' },
  { topic: 'Descriptive Chemistry', q: 'Which gas is evolved when dilute hydrochloric acid is added to sodium carbonate?', choices: ['Oxygen', 'Carbon dioxide', 'Hydrogen', 'Chlorine'], answer: 1, explanation: 'Carbonates react with acids to produce salt, water, and carbon dioxide gas (CO₂).' },
  { topic: 'Descriptive Chemistry', q: 'Which transition metal ion forms a deep blue complex solution when excess aqueous ammonia is added?', choices: ['Fe³⁺', 'Cu²⁺', 'Ni²⁺', 'Zn²⁺'], answer: 1, explanation: 'Copper(II) ions react with excess ammonia to form the tetraamminecopper(II) complex, [Cu(NH₃)₄]²⁺, which is deep blue.' },
  { topic: 'Descriptive Chemistry', q: 'Which halogen exists as a reddish-brown liquid at room temperature and standard pressure?', choices: ['Fluorine', 'Chlorine', 'Bromine', 'Iodine'], answer: 2, explanation: 'Bromine (Br₂) is one of only two elements on the periodic table that are liquid at room temperature.' },
  { topic: 'Descriptive Chemistry', q: 'What precipitate forms when aqueous solutions of silver nitrate and potassium chloride are mixed?', choices: ['AgCl (White)', 'AgCl (Yellow)', 'KNO₃ (White)', 'Ag₂O (Black)'], answer: 0, explanation: 'Silver chloride (AgCl) precipitates out as an insoluble white solid.' },
{ topic: 'Descriptive Chemistry', q: 'Which alkali metal reacts most violently with cold water?', choices: ['Lithium', 'Sodium', 'Potassium', 'Cesium'], answer: 3, explanation: 'Reactivity of Group 1 alkali metals increases down the group, making Cesium the most reactive listed.' },
  { topic: 'Descriptive Chemistry', q: 'What color flame is produced by sodium salts in a flame test?', choices: ['Lilac', 'Yellow-Orange', 'Brick Red', 'Apple Green'], answer: 1, explanation: 'Sodium compounds produce an intense yellow-orange emission flame.' },
  { topic: 'Descriptive Chemistry', q: 'Which gas turns damp red litmus paper blue?', choices: ['Ammonia', 'Sulfur dioxide', 'Carbon dioxide', 'Chlorine'], answer: 0, explanation: 'Ammonia (NH₃) is a basic gas that reacts with water on damp litmus paper to form OH⁻ ions, turning it blue.' },
  { topic: 'Descriptive Chemistry', q: 'Which halogen sublimes directly from a dark purple solid into a violet gas upon heating?', choices: ['Fluorine', 'Chlorine', 'Bromine', 'Iodine'], answer: 3, explanation: 'Iodine (I₂) readily undergoes sublimation at atmospheric pressure to form a characteristic violet gas.' },
  { topic: 'Descriptive Chemistry', q: 'What precipitate forms when aqueous sodium hydroxide is added to an aqueous solution of Iron(III) nitrate?', choices: ['White precipitate', 'Brown/Reddish-brown precipitate', 'Blue precipitate', 'Green precipitate'], answer: 1, explanation: 'Fe³⁺ forms rust-brown iron(III) hydroxide, Fe(OH)₃, precipitate in basic conditions.' },
  { topic: 'Descriptive Chemistry', q: 'Which transition metal complex ion is famously known for having a bright yellow color in aqueous solution?', choices: ['[Fe(H₂O)₆]³⁺', 'Chromate (CrO₄²⁻)', 'Dichromate (Cr₂O₇²⁻)', 'Permanganate (MnO₄⁻)'], answer: 1, explanation: 'Aqueous chromate ions (CrO₄²⁻) are bright yellow, while dichromate ions (Cr₂O₇²⁻) are orange.' },
  { topic: 'Descriptive Chemistry', q: 'Which noble gas is commonly used in discharge tubes to produce an orange-red light?', choices: ['Helium', 'Neon', 'Argon', 'Krypton'], answer: 1, explanation: 'Neon gas glows bright orange-red when an electric current passes through it.' },
  { topic: 'Descriptive Chemistry', q: 'Which reagent can be used to distinguish between a chloride and an iodide ion in aqueous solution?', choices: ['Aqueous AgNO₃ followed by NH₃', 'Aqueous NaOH', 'Dilute HCl', 'Barium chloride'], answer: 0, explanation: 'AgCl is a white ppt soluble in dilute NH₃; AgI is a pale yellow ppt insoluble in concentrated NH₃.' },
  { topic: 'Descriptive Chemistry', q: 'Which oxide is amphoteric (reacts with both strong acids and strong bases)?', choices: ['CaO', 'Na₂O', 'Al₂O₃', 'SO₂'], answer: 2, explanation: 'Aluminum oxide (Al₂O₃) displays both acidic and basic properties.' },
  { topic: 'Descriptive Chemistry', q: 'What is the characteristic color of aqueous potassium permanganate (KMnO₄)?', choices: ['Deep Purple', 'Green', 'Orange', 'Yellow'], answer: 0, explanation: 'Permanganate ions (MnO₄⁻) absorb green light strongly, giving solutions an intense purple color.' },
  { topic: 'Descriptive Chemistry', q: 'Which alkaline earth metal produces a distinctive apple-green color in a flame test?', choices: ['Calcium', 'Strontium', 'Barium', 'Magnesium'], answer: 2, explanation: 'Barium produces a pale apple-green flame.' },
  { topic: 'Descriptive Chemistry', q: 'What gas is produced when zinc metal reacts with dilute sulfuric acid?', choices: ['Oxygen', 'Sulfur dioxide', 'Hydrogen', 'Hydrogen sulfide'], answer: 2, explanation: 'Active metals react with dilute mineral acids via single replacement to produce hydrogen gas (H₂).' },
  { topic: 'Descriptive Chemistry', q: 'Which nonmetal oxide is primarily responsible for acid rain formation alongside sulfur dioxide?', choices: ['NO₂', 'CO', 'N₂O', 'SiO₂'], answer: 0, explanation: 'Nitrogen dioxide (NO₂) reacts with atmospheric moisture to form nitric acid (HNO₃), causing acid rain.' },
  { topic: 'Descriptive Chemistry', q: 'Which gas bleaches damp litmus paper white after initially turning it slightly red?', choices: ['Ammonia', 'Chlorine', 'Carbon monoxide', 'Methane'], answer: 1, explanation: 'Chlorine gas acts as a strong oxidizing bleach due to HOCl formation in damp conditions.' },
  { topic: 'Descriptive Chemistry', q: 'What is observed when hydrogen sulfide gas (H₂S) is bubbled through aqueous lead(II) nitrate?', choices: ['White precipitate', 'Black precipitate', 'Yellow precipitate', 'No visible change'], answer: 1, explanation: 'Lead sulfide (PbS) forms as a insoluble black precipitate.' },
  { topic: 'Descriptive Chemistry', q: 'Which metal forms a protective oxide layer that prevents it from corroding rapidly in air (passivation)?', choices: ['Iron', 'Sodium', 'Aluminum', 'Calcium'], answer: 2, explanation: 'Aluminum instantly forms a durable layer of Al₂O₃ that shields the bulk metal below.' },
  { topic: 'Descriptive Chemistry', q: 'Which alkali metal salt gives a lilac flame test color when observed directly?', choices: ['Lithium', 'Sodium', 'Potassium', 'Calcium'], answer: 2, explanation: 'Potassium compounds impart a pale violet/lilac color to a flame.' },
  { topic: 'Descriptive Chemistry', q: 'What color is sulfur in its elemental form under ambient conditions?', choices: ['Red', 'Yellow', 'Black', 'White'], answer: 1, explanation: 'Elemental sulfur (S₈) exists naturally as a bright yellow crystalline solid.' },
  { topic: 'Descriptive Chemistry', q: 'Which transition metal ion forms a blood-red complex with thiocyanate ions (SCN⁻)?', choices: ['Fe³⁺', 'Cu²⁺', 'Co²⁺', 'Cr³⁺'], answer: 0, explanation: 'Fe³⁺ reacts with SCN⁻ to yield the characteristic blood-red [Fe(SCN)]²⁺ complex.' },
  { topic: 'Descriptive Chemistry', q: 'Which gas has a pungent odor characteristic of rotten eggs?', choices: ['Sulfur dioxide', 'Hydrogen sulfide', 'Ammonia', 'Phosphine'], answer: 1, explanation: 'Hydrogen sulfide (H₂S) is well-known for its distinct rotten-egg smell.' },
  { topic: 'Descriptive Chemistry', q: 'What solid precipitate forms when BaCl₂ is added to a solution containing sulfate (SO₄²⁻) ions?', choices: ['BaSO₄ (White)', 'BaSO₄ (Yellow)', 'BaCl₂ (White)', 'Ba(OH)₂ (White)'], answer: 0, explanation: 'Barium sulfate (BaSO₄) is insoluble in water and forms a fine white precipitate.' },
  { topic: 'Descriptive Chemistry', q: 'What color is copper(II) sulfate in its anhydrous form (CuSO₄)?', choices: ['Deep Blue', 'Light Green', 'White', 'Black'], answer: 2, explanation: 'Anhydrous CuSO₄ is white; it turns blue upon hydration to CuSO₄·5H₂O.' },
  { topic: 'Descriptive Chemistry', q: 'Which transition metal ion forms a pink solution when hexaaqua hydrated, but turns blue in concentrated HCl?', choices: ['Co²⁺', 'Ni²⁺', 'Fe²⁺', 'Mn²⁺'], answer: 0, explanation: '[Co(H₂O)₆]²⁺ is pink, while the tetrachlorocobaltate(II) complex [CoCl₄]²⁻ is blue.' },
  { topic: 'Descriptive Chemistry', q: 'Which oxide of carbon is toxic, colorless, odorless, and binds strongly to hemoglobin?', choices: ['CO₂', 'CO', 'C₃O₂', 'CO₃'], answer: 1, explanation: 'Carbon monoxide (CO) binds to hemoglobin with high affinity, preventing oxygen transport.' },
  { topic: 'Descriptive Chemistry', q: 'Which halogen is a pale yellow-green gas at room temperature?', choices: ['Fluorine', 'Chlorine', 'Bromine', 'Iodine'], answer: 1, explanation: 'Chlorine is a yellowish-green gas (Fluorine is pale yellow, Bromine is reddish-brown liquid).' },
  { topic: 'Descriptive Chemistry', q: 'What is observed when concentrated nitric acid is added to copper metal?', choices: ['Colorless H₂ gas evolved', 'Brown NO₂ gas evolved', 'White precipitate formed', 'No reaction occurs'], answer: 1, explanation: 'Concentrated HNO₃ oxidizes copper metal, liberating dense brown nitrogen dioxide (NO₂) gas.' },
  { topic: 'Descriptive Chemistry', q: 'Which Group 2 element does NOT react with cold water or steam easily due to a strong oxide film?', choices: ['Beryllium', 'Magnesium', 'Calcium', 'Barium'], answer: 0, explanation: 'Beryllium (Be) is inert toward water even at high temperatures due to its high covalent character and oxide layer.' },
  { topic: 'Descriptive Chemistry', q: 'What gas causes limewater (aqueous Ca(OH)₂) to turn cloudy or milky?', choices: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Sulfur dioxide'], answer: 1, explanation: 'CO₂ reacts with Ca(OH)₂ to form insoluble white calcium carbonate (CaCO₃) precipitate.' },
  { topic: 'Descriptive Chemistry', q: 'Which element exhibits allotropy as diamond and graphite?', choices: ['Phosphorus', 'Sulfur', 'Carbon', 'Silicon'], answer: 2, explanation: 'Diamond and graphite are well-known crystalline allotropes of pure carbon.' },
  { topic: 'Descriptive Chemistry', q: 'Which halogen salt yields a yellow precipitate with AgNO₃ that is insoluble in aqueous NH₃?', choices: ['Fluoride', 'Chloride', 'Bromide', 'Iodide'], answer: 3, explanation: 'Silver iodide (AgI) is a bright pale-yellow solid that does not dissolve in aqueous ammonia.' },
  { topic: 'Descriptive Chemistry', q: 'What flame test color is given off by calcium compounds?', choices: ['Brick Red', 'Crimson Red', 'Lilac', 'Green'], answer: 0, explanation: 'Calcium salts impart a characteristic brick-red / orange-red color to a flame.' },
  { topic: 'Descriptive Chemistry', q: 'Which phosphorus allotrope spontaneously catches fire in air and must be stored under water?', choices: ['Red phosphorus', 'White phosphorus', 'Black phosphorus', 'Violet phosphorus'], answer: 1, explanation: 'White phosphorus (P₄) is highly reactive and pyrophoric in air.' },
  { topic: 'Descriptive Chemistry', q: 'Which transition metal compound is commonly used as a heterogeneous catalyst in the Haber process?', choices: ['Iron (Fe)', 'Platinum (Pt)', 'Nickel (Ni)', 'Vanadium(V) oxide'], answer: 0, explanation: 'Finely divided iron with promoters is used to catalyze N₂ + 3H₂ ⇌ 2NH₃.' },
  { topic: 'Descriptive Chemistry', q: 'What is the color of aqueous nickel(II) solutions such as NiSO₄?', choices: ['Blue', 'Green', 'Yellow', 'Pink'], answer: 1, explanation: 'Aqueous Ni²⁺ ions form the hexaaquanickel(II) complex, which is characteristic green.' },
  { topic: 'Descriptive Chemistry', q: 'Which gas is evolved at the anode during the electrolysis of concentrated aqueous NaCl (brine)?', choices: ['Hydrogen', 'Oxygen', 'Chlorine', 'Sodium vapor'], answer: 2, explanation: 'Chloride ions are oxidized preferentially over water at high concentrations, yielding Cl₂ gas.' },
  { topic: 'Descriptive Chemistry', q: 'Which metal is liquid at standard room temperature and pressure?', choices: ['Gallium', 'Mercury', 'Cesium', 'Bromine'], answer: 1, explanation: 'Mercury (Hg) is the only metallic element that is liquid at room temperature (25 °C).' },
  { topic: 'Descriptive Chemistry', q: 'What color change occurs when acidified K₂Cr₂O₇ acts as an oxidizing agent?', choices: ['Orange to Green', 'Green to Orange', 'Purple to Colorless', 'Yellow to Blue'], answer: 0, explanation: 'Dichromate (Cr₂O₇²⁻, orange) is reduced to Cr³⁺, which is green.' },
  { topic: 'Descriptive Chemistry', q: 'Which nonmetal solid has a distinctive dark grey metallic luster and conducts electricity slightly?', choices: ['Sulfur', 'Graphite / Carbon', 'Phosphorus', 'Selenium'], answer: 1, explanation: 'Graphite features delocalized π-electrons along its layers, giving it metallic luster and electrical conductivity.' },
  { topic: 'Descriptive Chemistry', q: 'What precipitate forms when aqueous ammonia is added to a solution containing Al³⁺ ions?', choices: ['White gelatinous precipitate', 'Blue precipitate', 'Green precipitate', 'No precipitate'], answer: 0, explanation: 'Al³⁺ forms a gelatinous white precipitate of aluminum hydroxide, Al(OH)₃.' },
  { topic: 'Descriptive Chemistry', q: 'Which gas turns brown when exposed to air due to reaction with oxygen?', choices: ['Nitric oxide (NO)', 'Nitrogen dioxide (NO₂)', 'Nitrous oxide (N₂O)', 'Ammonia (NH₃)'], answer: 0, explanation: 'Colorless NO gas rapidly reacts with O₂ in air to form brown NO₂ gas.' },
  { topic: 'Descriptive Chemistry', q: 'Which metal reacts vigorously with steam to produce hydrogen gas, but very slowly with cold water?', choices: ['Sodium', 'Magnesium', 'Potassium', 'Calcium'], answer: 1, explanation: 'Mg reacts slowly with cold water, but rapidly with steam to yield MgO and H₂.' },
  { topic: 'Descriptive Chemistry', q: 'What color is liquid oxygen?', choices: ['Colorless', 'Pale Blue', 'Pale Green', 'Yellow'], answer: 1, explanation: 'Liquid oxygen is pale blue due to paramagnetic absorption properties.' },
  { topic: 'Descriptive Chemistry', q: 'Which gas is produced when potassium chlorate (KClO₃) is heated in the presence of MnO₂?', choices: ['Chlorine', 'Oxygen', 'Carbon dioxide', 'Hydrogen'], answer: 1, explanation: 'Thermal decomposition of KClO₃ using MnO₂ catalyst yields oxygen gas (O₂).' },
  { topic: 'Descriptive Chemistry', q: 'Which Group 1 element forms a normal oxide (M₂O) predominantly rather than peroxides or superoxides when burned in oxygen?', choices: ['Lithium', 'Sodium', 'Potassium', 'Rubidium'], answer: 0, explanation: 'Due to its small ionic radius, Lithium forms the normal oxide Li₂O when burned in air.' },
  { topic: 'Descriptive Chemistry', q: 'What observation confirms the presence of carbonate ions when acid is added?', choices: ['Effervescence of a gas that turns limewater cloudy', 'Pungent smelling gas', 'Formation of a yellow precipitate', 'Solution turning deep blue'], answer: 0, explanation: 'Acid + carbonate yields CO₂ gas (effervescence), which precipitates CaCO₃ in limewater.' },

  // States of Matter
  { topic: 'States of Matter', q: 'At STP, which gas would deviate most from ideal behavior?', choices: ['H₂', 'He', 'NH₃', 'N₂'], answer: 2, explanation: 'NH₃ has strong hydrogen bonding and a large dipole moment, causing the greatest deviation from ideal behavior.' },
  { topic: 'States of Matter', q: 'A gas at 27°C and 1.0 atm occupies 2.0 L. What volume will it occupy at 127°C and 1.0 atm?', choices: ['1.5 L', '2.67 L', '3.0 L', '4.0 L'], answer: 1, explanation: 'Charles\'s Law: V₂ = 2.0 × (400/300) = 2.67 L.' },
  { topic: 'States of Matter', q: 'Which intermolecular force explains the unusually high boiling point of water compared to H₂S?', choices: ['London dispersion forces', 'Dipole-dipole interactions', 'Hydrogen bonding', 'Ion-dipole forces'], answer: 2, explanation: 'Water forms extensive O–H···O hydrogen bonds, dramatically raising its boiling point.' },
  { topic: 'States of Matter', q: 'Which solid has the highest melting point?', choices: ['NaCl', 'CO₂', 'SiO₂', 'I₂'], answer: 2, explanation: 'SiO₂ is a covalent network solid with continuous Si–O bonds throughout, melting at ~1700°C.' },
  { topic: 'States of Matter', q: 'According to kinetic molecular theory, which is true at higher temperatures?', choices: ['Gas molecules move slower on average', 'The speed distribution narrows', 'Average kinetic energy of molecules increases', 'Molecules spend more time in collisions'], answer: 2, explanation: 'KE_avg = (3/2)kT; average kinetic energy is directly proportional to absolute temperature.' },
{ topic: 'States of Matter', q: 'Under which conditions do real gases deviate most from ideal gas behavior?', choices: ['High temperature and low pressure', 'Low temperature and high pressure', 'High temperature and high pressure', 'Low temperature and low pressure'], answer: 1, explanation: 'Low temperatures slow down molecules (intermolecular forces matter more), and high pressure forces them close together (particle volume matters).' },
  { topic: 'States of Matter', q: 'Which type of solid typically exhibits high melting points, brittleness, and electrical conductivity only when molten or dissolved?', choices: ['Metallic solid', 'Covalent network solid', 'Ionic solid', 'Molecular solid'], answer: 2, explanation: 'Ionic solids have strong electrostatic forces, causing high melting points, and require mobile ions (liquid/solution) to conduct electricity.' },
  { topic: 'States of Matter', q: 'A sample of gas occupies 2.0 L at 300 K. What will its volume be at 600 K if pressure remains constant?', choices: ['1.0 L', '2.0 L', '4.0 L', '8.0 L'], answer: 2, explanation: 'By Charles’s Law (V₁/T₁ = V₂/T₂), doubling absolute temperature doubles the volume.' },
  { topic: 'States of Matter', q: 'Which intermolecular force is primary responsible for the high boiling point of water relative to hydrogen sulfide (H₂S)?', choices: ['Dipole-dipole forces', 'London dispersion forces', 'Hydrogen bonding', 'Ion-dipole forces'], answer: 2, explanation: 'Hydrogen bonds formed between O and H atoms are significantly stronger than the dipole-dipole forces in H₂S.' },
  { topic: 'States of Matter', q: 'What happens to the vapor pressure of a liquid as its temperature increases?', choices: ['It decreases exponentially', 'It remains constant', 'It increases', 'It drops to zero'], answer: 2, explanation: 'Higher temperatures increase the kinetic energy of liquid molecules, allowing more to escape into the vapor phase.' },

  // ==================== THERMODYNAMICS ====================

  // Thermodynamics
  { topic: 'Thermodynamics', q: 'Which process has a negative ΔS?', choices: ['Melting of ice', 'Dissolving NH₄NO₃ in water', 'Condensation of steam to liquid water', 'Sublimation of dry ice'], answer: 2, explanation: 'Gas → liquid greatly reduces molecular freedom; ΔS < 0.' },
  { topic: 'Thermodynamics', q: 'A reaction has ΔH = −100 kJ/mol and ΔS = −200 J/(mol·K). Above what temperature is it non-spontaneous?', choices: ['200 K', '300 K', '500 K', '750 K'], answer: 2, explanation: 'ΔG = 0 when T = ΔH/ΔS = 100000/200 = 500 K. Above 500 K, ΔG > 0 (non-spontaneous).' },
  { topic: 'Thermodynamics', q: 'Using Hess\'s Law: A→B ΔH=+50 kJ; B→C ΔH=−80 kJ. What is ΔH for A→C?', choices: ['+130 kJ', '−130 kJ', '−30 kJ', '+30 kJ'], answer: 2, explanation: 'ΔH(A→C) = +50 + (−80) = −30 kJ.' },
  { topic: 'Thermodynamics', q: 'How much heat is needed to raise 50.0 g of water from 20.0°C to 80.0°C? (c = 4.18 J/g·°C)', choices: ['8.36 kJ', '12.54 kJ', '16.72 kJ', '4.18 kJ'], answer: 1, explanation: 'q = mcΔT = 50.0 × 4.18 × 60.0 = 12,540 J = 12.54 kJ.' },
  { topic: 'Thermodynamics', q: 'A spontaneous exothermic reaction with ΔS > 0 is spontaneous:', choices: ['Only at high temperatures', 'Only at low temperatures', 'At all temperatures', 'Never'], answer: 2, explanation: 'When ΔH < 0 and ΔS > 0, ΔG = ΔH − TΔS is always negative.' },
  { topic: 'Thermodynamics', q: 'For N₂(g) + 3H₂(g) → 2NH₃(g), which is true about ΔS?', choices: ['ΔS > 0 because bonds form', 'ΔS < 0 because 4 mol gas → 2 mol gas', 'ΔS = 0 because no phase change', 'ΔS > 0 because temperature rises'], answer: 1, explanation: 'Fewer moles of gas means less disorder; ΔS < 0.' },
{ topic: 'Thermodynamics', q: 'A process is always spontaneous at all temperatures under which of the following enthalpy and entropy conditions?', choices: ['ΔH > 0 and ΔS > 0', 'ΔH < 0 and ΔS > 0', 'ΔH < 0 and ΔS < 0', 'ΔH > 0 and ΔS < 0'], answer: 1, explanation: 'ΔG = ΔH - TΔS. If ΔH is negative and ΔS is positive, ΔG is always negative regardless of temperature.' },
  { topic: 'Thermodynamics', q: 'What is the change in internal energy (ΔU) of a system that absorbs 50 J of heat and does 20 J of work on the surroundings?', choices: ['+70 J', '+30 J', '-30 J', '-70 J'], answer: 1, explanation: 'ΔU = q + w. Heat absorbed (q) = +50 J, work done by system (w) = -20 J. ΔU = 50 - 20 = +30 J.' },
  { topic: 'Thermodynamics', q: 'Which law of thermodynamics states that the entropy of a pure, perfectly crystalline substance at absolute zero is zero?', choices: ['Zeroth Law', 'First Law', 'Second Law', 'Third Law'], answer: 3, explanation: 'The Third Law of Thermodynamics defines absolute entropy relative to a perfect crystal at 0 K.' },
  { topic: 'Thermodynamics', q: 'In an endothermic reaction at constant pressure, what is the sign of ΔH?', choices: ['Positive', 'Negative', 'Zero', 'Cannot be determined'], answer: 0, explanation: 'Endothermic processes absorb heat from surroundings, so ΔH > 0.' },
  { topic: 'Thermodynamics', q: 'Which phase transition is accompanied by a positive change in entropy (ΔS > 0)?', choices: ['Condensation', 'Freezing', 'Sublimation', 'Deposition'], answer: 2, explanation: 'Sublimation converts a ordered solid directly into a highly disordered gas, increasing entropy.' },

  // Kinetics
  { topic: 'Kinetics', q: 'For a first-order reaction, if the initial concentration doubles, the initial rate:', choices: ['Stays the same', 'Doubles', 'Quadruples', 'Increases 8×'], answer: 1, explanation: 'rate = k[A]; doubling [A] doubles the rate.' },
  { topic: 'Kinetics', q: 'The half-life of a first-order reaction is 20 minutes. What fraction remains after 60 minutes?', choices: ['1/2', '1/4', '1/6', '1/8'], answer: 3, explanation: '60 min = 3 half-lives; (1/2)³ = 1/8.' },
  { topic: 'Kinetics', q: 'Increasing temperature increases the rate constant primarily because:', choices: ['More molecules exceed the activation energy', 'Activation energy decreases', 'The frequency factor A decreases', 'The equilibrium constant increases'], answer: 0, explanation: 'Higher T shifts the Maxwell-Boltzmann distribution so more molecules have energy ≥ E_a.' },
  { topic: 'Kinetics', q: 'Which statement about a catalyst is correct?', choices: ['It increases activation energy', 'It is consumed in the reaction', 'It provides a lower-energy pathway', 'It changes ΔH of reaction'], answer: 2, explanation: 'A catalyst lowers E_a by providing an alternative mechanism; it is not consumed and does not change ΔH.' },
  { topic: 'Kinetics', q: 'For rate = k[A]²[B]: if [A] is halved and [B] is doubled, the rate:', choices: ['Doubles', 'Halves', 'Stays the same', 'Quadruples'], answer: 1, explanation: 'New rate = k(A/2)²(2B) = (1/4)(2)k[A]²[B] = (1/2) rate. Rate is halved.' },
  { topic: 'Kinetics', q: 'The rate-determining step of a mechanism is:', choices: ['Always the first step', 'The step with lowest activation energy', 'The slowest step', 'The step producing the most product'], answer: 2, explanation: 'The slowest step controls the overall rate — it is the bottleneck of the mechanism.' },
{ topic: 'Kinetics', q: 'If doubling the concentration of reactant A quadruples the initial reaction rate, what is the order of reaction with respect to A?', choices: ['Zero order', 'First order', 'Second order', 'Third order'], answer: 2, explanation: 'Rate ∝ [A]ⁿ. Since 2ⁿ = 4, n must equal 2.' },
  { topic: 'Kinetics', q: 'How does adding a catalyst increase the rate of a chemical reaction?', choices: ['By increasing the kinetic energy of reactants', 'By decreasing the enthalpy change (ΔH)', 'By lowering the activation energy', 'By increasing the collision frequency only'], answer: 2, explanation: 'A catalyst provides an alternative pathway with a lower activation energy (Eₐ).' },
  { topic: 'Kinetics', q: 'What are the units for the rate constant k in a first-order reaction?', choices: ['M/s', 's⁻¹', 'M⁻¹s⁻¹', 'M⁻²s⁻¹'], answer: 1, explanation: 'For a first-order reaction, Rate = k[A]. Thus, k = Rate / [A] = (M/s) / M = s⁻¹.' },
  { topic: 'Kinetics', q: 'The half-life of a first-order reaction is 20 minutes. What fraction of reactant remains after 60 minutes?', choices: ['1/2', '1/4', '1/8', '1/16'], answer: 2, explanation: '60 minutes equals 3 half-lives. Remaining fraction = (1/2)³ = 1/8.' },
  { topic: 'Kinetics', q: 'According to collision theory, which factor does NOT directly determine whether a molecular collision leads to a reaction?', choices: ['Collision energy', 'Molecular orientation', 'Solvent polarity', 'Frequency of collisions'], answer: 2, explanation: 'Reaction success depends on collisions occurring with sufficient energy (Ea) and correct steric orientation.' },

  // Equilibrium
  { topic: 'Equilibrium', q: 'For PCl₃(g) + Cl₂(g) ⇌ PCl₅(g), increasing pressure will:', choices: ['Shift equilibrium right (toward PCl₅)', 'Shift equilibrium left', 'Have no effect because Kp is constant', 'Shift right only if ΔH < 0'], answer: 0, explanation: 'Increasing pressure favors fewer moles of gas. 2 mol → 1 mol, so equilibrium shifts right.' },
  { topic: 'Equilibrium', q: 'The Ka of acetic acid is 1.8 × 10⁻⁵. What is its pKa?', choices: ['3.74', '4.74', '5.74', '6.74'], answer: 1, explanation: 'pKa = −log(1.8 × 10⁻⁵) = 4.74.' },
  { topic: 'Equilibrium', q: 'Which change does NOT shift the equilibrium for N₂ + 3H₂ ⇌ 2NH₃?', choices: ['Adding a catalyst', 'Increasing temperature', 'Increasing pressure', 'Adding more N₂'], answer: 0, explanation: 'A catalyst speeds both forward and reverse reactions equally; it does not shift the equilibrium position.' },
  { topic: 'Equilibrium', q: 'Ksp of AgCl = 1.8 × 10⁻¹⁰. What is its molar solubility in pure water?', choices: ['1.8 × 10⁻⁵ M', '1.34 × 10⁻⁵ M', '3.6 × 10⁻¹⁰ M', '9.0 × 10⁻⁶ M'], answer: 1, explanation: 'Ksp = s² → s = √(1.8 × 10⁻¹⁰) = 1.34 × 10⁻⁵ M.' },
  { topic: 'Equilibrium', q: 'The relationship between ΔG° and K is:', choices: ['ΔG° = RT ln K', 'ΔG° = −RT ln K', 'ΔG° = −nFE°', 'ΔG° = ΔH° − TΔS°'], answer: 1, explanation: 'ΔG° = −RT ln K. When K > 1, ΔG° < 0 (products favored).' },
  { topic: 'Equilibrium', q: 'A buffer resists pH changes because it contains:', choices: ['A strong acid and its conjugate base', 'A weak acid and its conjugate base in comparable amounts', 'A large excess of strong base', 'Only water and a neutral salt'], answer: 1, explanation: 'A weak acid/conjugate base pair neutralizes added acid or base, keeping pH relatively constant.' },
  { topic: 'Equilibrium', q: 'What is the pH of 0.010 M HCl?', choices: ['1', '2', '3', '4'], answer: 1, explanation: 'HCl fully dissociates: [H⁺] = 0.010 M = 10⁻². pH = 2.' },
  { topic: 'Equilibrium', q: 'According to the Lewis definition, an acid is:', choices: ['A proton donor', 'A hydroxide donor', 'An electron pair acceptor', 'An electron pair donor'], answer: 2, explanation: 'Lewis acids accept electron pairs. This is broader than the Brønsted-Lowry definition.' },
  { topic: 'Equilibrium', q: 'Which is the strongest acid?', choices: ['HF (Ka=6.8×10⁻⁴)', 'HCN (Ka=6.2×10⁻¹⁰)', 'CH₃COOH (Ka=1.8×10⁻⁵)', 'H₂CO₃ (Ka=4.3×10⁻⁷)'], answer: 0, explanation: 'Larger Ka = stronger acid. HF has Ka = 6.8 × 10⁻⁴, the largest value listed.' },
{ topic: 'Equilibrium', q: 'For the endothermic reaction N₂O₄(g) ⇌ 2NO₂(g), which change will shift the equilibrium to favor product formation?', choices: ['Increasing the pressure', 'Decreasing the temperature', 'Increasing the temperature', 'Removing N₂O₄ gas'], answer: 2, explanation: 'Increasing temperature favors the endothermic direction to absorb heat, shifting equilibrium right toward NO₂.' },
  { topic: 'Equilibrium', q: 'What is the pH of a 0.01 M aqueous solution of strong acid HCl?', choices: ['1.0', '2.0', '7.0', '12.0'], answer: 1, explanation: '[H⁺] = 0.01 M = 10⁻² M. pH = -log(10⁻²) = 2.0.' },
  { topic: 'Equilibrium', q: 'What is the solubility product expression (Ksp) for silver chromate, Ag₂CrO₄?', choices: ['[Ag⁺][CrO₄²⁻]', '[Ag⁺]²[CrO₄²⁻]', '[Ag⁺][CrO₄²⁻]²', '[2Ag⁺][CrO₄²⁻]'], answer: 1, explanation: 'Ag₂CrO₄(s) ⇌ 2Ag⁺(aq) + CrO₄²⁻(aq). Ksp = [Ag⁺]²[CrO₄²⁻].' },
  { topic: 'Equilibrium', q: 'If Keq >> 1 for a general reaction, what does this indicate about the equilibrium position?', choices: ['Reactants are strongly favored', 'Products are strongly favored', 'The reaction rate is extremely fast', 'The reaction rate is extremely slow'], answer: 1, explanation: 'A large equilibrium constant Keq indicates that products predominate at equilibrium.' },
  { topic: 'Equilibrium', q: 'Which pair of compounds forms a buffer solution when dissolved together in water?', choices: ['HCl and NaCl', 'CH₃COOH and CH₃COONa', 'NaOH and NaCl', 'HNO₃ and KNO₃'], answer: 1, explanation: 'A buffer consists of a weak acid (CH₃COOH) and its conjugate base (CH₃COO⁻).' },

  // Electrochemistry
  { topic: 'Electrochemistry', q: 'In an electrochemical cell, oxidation occurs at the:', choices: ['Cathode in galvanic cells only', 'Anode in both galvanic and electrolytic cells', 'Cathode in both cell types', 'Anode in electrolytic cells only'], answer: 1, explanation: 'Oxidation always occurs at the anode, in both galvanic and electrolytic cells.' },
  { topic: 'Electrochemistry', q: 'E°(Zn²⁺/Zn) = −0.76 V; E°(Cu²⁺/Cu) = +0.34 V. What is E°cell for a Zn-Cu galvanic cell?', choices: ['−1.10 V', '+0.42 V', '+1.10 V', '−0.42 V'], answer: 2, explanation: 'E°cell = E°cathode − E°anode = 0.34 − (−0.76) = +1.10 V.' },
  { topic: 'Electrochemistry', q: 'The Nernst equation accounts for the effect of:', choices: ['Temperature only', 'Concentration only', 'Both temperature and concentration', 'Pressure only'], answer: 2, explanation: 'E = E° − (RT/nF)lnQ includes both temperature (T) and concentration (via Q).' },
  { topic: 'Electrochemistry', q: 'How many moles of electrons are transferred when 1 mol Cr²⁺ is oxidized to Cr³⁺?', choices: ['1 mol e⁻', '2 mol e⁻', '3 mol e⁻', '6 mol e⁻'], answer: 0, explanation: 'Cr²⁺ → Cr³⁺ + 1e⁻; each Cr loses 1 electron.' },
  { topic: 'Electrochemistry', q: 'What is deposited at the cathode when aqueous CuSO₄ is electrolyzed?', choices: ['Oxygen gas', 'Sulfur', 'Copper metal', 'Hydrogen gas'], answer: 2, explanation: 'Cu²⁺ + 2e⁻ → Cu(s). Copper metal plates out at the cathode.' },
{ topic: 'Electrochemistry', q: 'In any electrochemical cell, oxidation always occurs at which electrode?', choices: ['Anode', 'Cathode', 'Salt bridge', 'Voltmeter'], answer: 0, explanation: 'Oxidation takes place at the Anode (An Ox), while reduction takes place at the Cathode (Red Cat).' },
  { topic: 'Electrochemistry', q: 'If E°cell for a galvanic cell is positive, what can be inferred about ΔG° and the equilibrium constant K?', choices: ['ΔG° > 0 and K < 1', 'ΔG° < 0 and K > 1', 'ΔG° < 0 and K < 1', 'ΔG° > 0 and K > 1'], answer: 1, explanation: 'A positive E°cell means the reaction is thermodynamically spontaneous, meaning ΔG° is negative and K is greater than 1.' },
  { topic: 'Electrochemistry', q: 'What is the primary function of a salt bridge in a galvanic cell?', choices: ['To supply electrons to the cathode', 'To prevent chemical reactions', 'To maintain electrical neutrality by allowing ion migration', 'To increase the standard potential'], answer: 2, explanation: 'The salt bridge allows cations and anions to migrate to balance charge accumulation in half-cells.' },
  { topic: 'Electrochemistry', q: 'In the electrolysis of molten NaCl, what product is formed at the cathode?', choices: ['Chlorine gas (Cl₂)', 'Sodium metal (Na)', 'Hydrogen gas (H₂)', 'Oxygen gas (O₂)'], answer: 1, explanation: 'At the cathode, reduction occurs: Na⁺ + e⁻ → Na(l).' },
  { topic: 'Electrochemistry', q: 'What is the oxidation state of chromium in dichromate, Cr₂O₇²⁻?', choices: ['+3', '+5', '+6', '+7'], answer: 2, explanation: '2(Cr) + 7(-2) = -2 → 2(Cr) - 14 = -2 → 2(Cr) = +12 → Cr = +6.' },

  // Atomic Structure
  { topic: 'Atomic Structure', q: 'Which electron configuration represents an excited state of carbon?', choices: ['1s²2s²2p²', '1s²2s²2p¹3s¹', '1s²2s¹2p³', '1s²2p⁴'], answer: 1, explanation: 'Ground state C = 1s²2s²2p². Having an electron in 3s is an excited state.' },
  { topic: 'Atomic Structure', q: 'Which element has the highest first ionization energy?', choices: ['Na', 'Cl', 'Ar', 'K'], answer: 2, explanation: 'Argon has a full valence shell and the highest first ionization energy of these elements.' },
  { topic: 'Atomic Structure', q: 'Which correctly orders increasing atomic radius?', choices: ['F < O < N < C', 'C < N < O < F', 'Na < Mg < Al < Si', 'F < Cl < Br < I'], answer: 3, explanation: 'Atomic radius increases down a group as electrons fill higher shells: F < Cl < Br < I.' },
  { topic: 'Atomic Structure', q: 'The de Broglie wavelength λ = h/p, so it is inversely proportional to:', choices: ['Charge', 'Momentum', 'Potential energy', 'Atomic number'], answer: 1, explanation: 'λ = h/p; wavelength is inversely proportional to momentum (mass × velocity).' },
  { topic: 'Atomic Structure', q: '²³⁸₉₂U undergoes alpha decay. What is the product?', choices: ['²³⁴₉₀Th', '²³⁸₉₃Np', '²³⁴₉₁Pa', '²³⁶₉₀Th'], answer: 0, explanation: 'Alpha decay: A decreases by 4, Z by 2. 238−4=234, 92−2=90 → ²³⁴₉₀Th.' },
  { topic: 'Atomic Structure', q: 'Which quantum number describes the shape of an orbital?', choices: ['Principal (n)', 'Angular momentum (l)', 'Magnetic (mₗ)', 'Spin (mₛ)'], answer: 1, explanation: 'l determines shape: 0=s, 1=p, 2=d, 3=f.' },
{ topic: 'Atomic Structure', q: 'What is the maximum number of electrons that can occupy an f subshell?', choices: ['2', '6', '10', '14'], answer: 3, explanation: 'An f subshell contains 7 orbitals, each holding a maximum of 2 electrons (7 × 2 = 14).' },
  { topic: 'Atomic Structure', q: 'Which set of quantum numbers (n, l, mₗ, m⛛) is invalid?', choices: ['(3, 2, -1, +1/2)', '(2, 1, 0, -1/2)', '(1, 1, 0, +1/2)', '(4, 0, 0, -1/2)'], answer: 2, explanation: 'For n = 1, the angular momentum quantum number l can only be 0 (l ranges from 0 to n-1).' },
  { topic: 'Atomic Structure', q: 'Which rule states that orbitals of equal energy are each occupied by one electron before any orbital is doubly occupied?', choices: ['Pauli Exclusion Principle', 'Hund’s Rule', 'Aufbau Principle', 'Heisenberg Uncertainty Principle'], answer: 1, explanation: 'Hund’s rule requires single occupancy with parallel spins before pairing electrons in degenerate orbitals.' },
  { topic: 'Atomic Structure', q: 'What is the ground-state electron configuration of a neutral Iron atom (Fe, Z=26)?', choices: ['[Ar] 4s² 3d⁶', '[Ar] 4s¹ 3d⁷', '[Ar] 3d⁸', '[Ar] 4s² 3d⁵'], answer: 0, explanation: 'Ar has 18 electrons. Adding 4s² (2) and 3d⁶ (6) gives a total atomic number of 26.' },
  { topic: 'Atomic Structure', q: 'Which trend generally increases across a period (left to right) on the periodic table?', choices: ['Atomic radius', 'Metallic character', 'First ionization energy', 'Ionic radius for cations'], answer: 2, explanation: 'Effective nuclear charge increases across a period, holding electrons tighter and increasing ionization energy.' },

  // Bonding
  { topic: 'Bonding', q: 'What is the electron geometry of SF₄?', choices: ['Tetrahedral', 'Trigonal bipyramidal', 'Octahedral', 'Seesaw'], answer: 1, explanation: 'SF₄ has 4 bonding pairs + 1 lone pair = 5 electron groups → trigonal bipyramidal electron geometry.' },
  { topic: 'Bonding', q: 'Which molecule is polar?', choices: ['BF₃', 'CCl₄', 'SF₆', 'CHCl₃'], answer: 3, explanation: 'CHCl₃ has an asymmetric arrangement of Cl atoms, giving a net dipole moment. The others are symmetric.' },
  { topic: 'Bonding', q: 'In MO theory, which species has the highest bond order?', choices: ['O₂', 'O₂⁺', 'O₂⁻', 'O₂²⁻'], answer: 1, explanation: 'Bond orders: O₂=2, O₂⁺=2.5, O₂⁻=1.5, O₂²⁻=1. O₂⁺ is highest.' },
  { topic: 'Bonding', q: 'What hybridization do carbon atoms in benzene exhibit?', choices: ['sp', 'sp²', 'sp³', 'sp³d'], answer: 1, explanation: 'Each C forms 3 sigma bonds (sp²), with remaining p orbitals forming the delocalized π system.' },
  { topic: 'Bonding', q: 'What is the formal charge on N in NO₃⁻ (one double bond, two single bonds to O)?', choices: ['+1', '0', '−1', '+2'], answer: 0, explanation: 'Formal charge = 5 − 0 − (8/2) = +1.' },
  { topic: 'Bonding', q: 'Which has the shortest bond length?', choices: ['C–C single bond', 'C=C double bond', 'C≡C triple bond', 'C–H bond'], answer: 2, explanation: 'Higher bond order → shorter bond. C≡C (~120 pm) < C=C (~134 pm) < C–C (~154 pm).' },
{ topic: 'Bonding', q: 'What is the molecular geometry of sulfur hexafluoride (SF₆)?', choices: ['Trigonal bipyramidal', 'Tetrahedral', 'Octahedral', 'Square planar'], answer: 2, explanation: 'SF₆ has 6 bonding pairs and 0 lone pairs around the central sulfur atom, resulting in an octahedral shape.' },
  { topic: 'Bonding', q: 'What is the hybridization of the central carbon atom in carbon dioxide (CO₂)?', choices: ['sp', 'sp²', 'sp³', 'sp³d'], answer: 0, explanation: 'CO₂ has two double bonds around the central C atom (2 electron domains), corresponding to sp hybridization.' },
  { topic: 'Bonding', q: 'According to VSEPR theory, what is the bond angle in a molecule with a ideal tetrahedral geometry like CH₄?', choices: ['90°', '104.5°', '109.5°', '120°'], answer: 2, explanation: 'Four bonding domains spread out in 3D space yield a bond angle of 109.5°.' },
  { topic: 'Bonding', q: 'How many sigma (σ) and pi (π) bonds are present in a molecule of ethyne (C₂H₂)?', choices: ['3 σ and 2 π', '2 σ and 3 π', '5 σ and 0 π', '1 σ and 2 π'], answer: 0, explanation: 'H-C≡C-H contains two single C-H bonds (2σ) and one triple C≡C bond (1σ + 2π), totaling 3σ and 2π bonds.' },
  { topic: 'Bonding', q: 'Which of the following bonds is the most polar?', choices: ['C-H', 'N-H', 'O-H', 'F-H'], answer: 3, explanation: 'Fluorine is the most electronegative element, creating the largest electronegativity difference with Hydrogen.' },

  // Organic Chemistry
  { topic: 'Organic Chemistry', q: 'What is the IUPAC name for CH₃CH₂CH(CH₃)CH₂CH₃?', choices: ['2-methylpentane', '3-methylpentane', '2-ethylbutane', '3-methylhexane'], answer: 1, explanation: 'Longest chain = 5 carbons (pentane); methyl group on C3 → 3-methylpentane.' },
  { topic: 'Organic Chemistry', q: 'Which reaction converts an alkene to a diol?', choices: ['Hydrohalogenation', 'Syn-dihydroxylation with OsO₄', 'Hydrogenation', 'Dehydration'], answer: 1, explanation: 'OsO₄ (or cold KMnO₄) adds two −OH groups syn to give a vicinal diol.' },
  { topic: 'Organic Chemistry', q: 'An ester is formed by the reaction of:', choices: ['An alcohol and a carboxylic acid', 'An aldehyde and a ketone', 'Two alcohols', 'An amine and an aldehyde'], answer: 0, explanation: 'Fischer esterification: R-COOH + R\'-OH ⇌ R-COOR\' + H₂O.' },
  { topic: 'Organic Chemistry', q: 'Correct order of carbocation stability (most → least stable):', choices: ['Tertiary > Secondary > Primary > Methyl', 'Primary > Secondary > Tertiary > Methyl', 'Methyl > Primary > Secondary > Tertiary', 'Secondary > Tertiary > Primary > Methyl'], answer: 0, explanation: 'More alkyl groups donate electron density and stabilize the positive charge.' },
  { topic: 'Organic Chemistry', q: 'Markovnikov\'s rule predicts HBr adds to CH₃CH=CH₂ with Br going to:', choices: ['C1 (terminal carbon)', 'C2 (internal carbon)', 'Both equally', 'Neither; elimination occurs'], answer: 1, explanation: 'H adds to C1 (more H\'s), Br adds to C2, forming 2-bromopropane via the more stable 2° carbocation.' },
  { topic: 'Organic Chemistry', q: 'Which technique is most useful for identifying carbon connectivity in an organic molecule?', choices: ['IR spectroscopy', 'UV-Vis spectroscopy', '¹H NMR spectroscopy', '¹³C NMR spectroscopy'], answer: 3, explanation: '¹³C NMR directly probes each unique carbon environment, mapping carbon connectivity.' },
{ topic: 'Organic Chemistry', q: 'Which functional group is characterized by a carbonyl group bound to a hydroxyl group (-COOH)?', choices: ['Aldehyde', 'Ester', 'Carboxylic acid', 'Ketone'], answer: 2, explanation: 'The -COOH group consists of a carbonyl (C=O) and a hydroxyl (-OH) group, forming a carboxylic acid.' },
  { topic: 'Organic Chemistry', q: 'What is the IUPAC name of the compound CH₃-CH₂-CH(CH₃)-CH₃?', choices: ['2-methylbutane', '3-methylbutane', 'Pentane', '2-methylpropane'], answer: 0, explanation: 'The longest carbon chain has 4 carbons (butane), with a methyl branch on carbon-2 when numbered from the right.' },
  { topic: 'Organic Chemistry', q: 'Which type of reaction converts an alkene into an alkane by adding H₂ gas in the presence of a nickel catalyst?', choices: ['Substitution', 'Addition / Hydrogenation', 'Elimination', 'Oxidation'], answer: 1, explanation: 'Hydrogenation is an addition reaction across the double bond of an alkene.' },
  { topic: 'Organic Chemistry', q: 'Molecules that have the same molecular formula but different structural connectivity are known as:', choices: ['Enantiomers', 'Constitutional / Structural isomers', 'Conformers', 'Diastereomers'], answer: 1, explanation: 'Constitutional isomers share the same molecular formula but differ in how their atoms are connected.' },
  { topic: 'Organic Chemistry', q: 'What is the primary product formed when a secondary alcohol is oxidized by K₂Cr₂O₇?', choices: ['Aldehyde', 'Ketone', 'Carboxylic acid', 'Alkene'], answer: 1, explanation: 'Oxidizing a secondary alcohol converts the -CH(OH)- group into a ketone carbonyl group (-C=O).' }
];

const TOPICS = [...new Set(QUESTIONS.map(q => q.topic))];

// ─── State ────────────────────────────────────────────────────────────────────
const activeGames  = new Map(); // channelId → game state
const leaderboards = new Map(); // guildId   → Map(userId → { points, correct, total })

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getLeaderboard(guildId) {
  if (!leaderboards.has(guildId)) leaderboards.set(guildId, new Map());
  return leaderboards.get(guildId);
}

function addPoints(guildId, userId, pts, correct) {
  const lb  = getLeaderboard(guildId);
  const cur = lb.get(userId) || { points: 0, correct: 0, total: 0 };
  cur.points  += pts;
  cur.correct += correct ? 1 : 0;
  cur.total   += 1;
  lb.set(userId, cur);
}

function pickQuestion(topic, usedIndices) {
  let pool = QUESTIONS.map((q, i) => ({ q, i }));
  if (topic) pool = pool.filter(({ q }) => q.topic.toLowerCase() === topic.toLowerCase());
  const unused = pool.filter(({ i }) => !usedIndices.has(i));
  const source = unused.length > 0 ? unused : pool;
  const { q, i } = source[Math.floor(Math.random() * source.length)];
  return { question: q, index: i };
}

function questionEmbed(q, roundNum, totalRounds) {
  const choices = q.choices.map((c, i) => `**${['A','B','C','D'][i]}.** ${c}`).join('\n');
  return new EmbedBuilder()
    .setTitle(`🧪 Question ${roundNum} of ${totalRounds}`)
    .setDescription(`**Topic:** ${q.topic}\n\n${q.q}\n\n${choices}`)
    .setColor(0x5865f2)
    .setFooter({ text: '⚡ First to buzz in gets to answer! • 30s to buzz • 15s to answer' });
}

function buildBuzzButton(disabled = false) {
  return [new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('buzz')
      .setLabel('⚡  BUZZ IN')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(disabled)
  )];
}

function buildAnswerButtons(disabled = false, correctIdx = null) {
  const labels = ['A', 'B', 'C', 'D'];
  const row = new ActionRowBuilder();
  for (let i = 0; i < 4; i++) {
    let style = ButtonStyle.Primary;
    if (disabled && correctIdx !== null)
      style = i === correctIdx ? ButtonStyle.Success : ButtonStyle.Secondary;
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`answer_${i}`)
        .setLabel(labels[i])
        .setStyle(style)
        .setDisabled(disabled)
    );
  }
  return [row];
}

// ─── Register slash commands ───────────────────────────────────────────────────
async function registerCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName('chem')
      .setDescription('Start a chemistry buzzer game')
      .addIntegerOption(o => o.setName('rounds').setDescription('Number of rounds (1-20, default 5)').setMinValue(1).setMaxValue(20))
      .addStringOption(o => o.setName('topic').setDescription('Filter by topic').addChoices(
        ...TOPICS.map(t => ({ name: t, value: t }))
      )),
    new SlashCommandBuilder()
      .setName('stop')
      .setDescription('Stop the current game'),
    new SlashCommandBuilder()
      .setName('lb')
      .setDescription('Show the server leaderboard'),
    new SlashCommandBuilder()
      .setName('stats')
      .setDescription('Show your stats or another user\'s stats')
      .addUserOption(o => o.setName('user').setDescription('User to check (defaults to you)')),
    new SlashCommandBuilder()
      .setName('resetlb')
      .setDescription('Reset the server leaderboard (admin only)'),
    new SlashCommandBuilder()
      .setName('help')
      .setDescription('Show all bot commands'),
  ].map(c => c.toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  try {
    console.log('Registering slash commands...');
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log('✅ Slash commands registered globally.');
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
}

// ─── Ready ────────────────────────────────────────────────────────────────────
client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setActivity('/chem to play', { type: 'LISTENING' });
  await registerCommands();
});

// ─── Slash command handler ────────────────────────────────────────────────────
client.on('interactionCreate', async (interaction) => {

  // ── SLASH COMMANDS ──────────────────────────────────────────────────────────
  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;

    // /help
    if (commandName === 'help') {
      return interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle('🧪 Chemistry Buzzer Bot')
        .setColor(0x5865f2)
        .addFields(
          { name: '🎮 Game', value: '`/chem [rounds] [topic]` — Start a buzzer game\n`/stop` — Stop the current game' },
          { name: '🏆 Scores', value: '`/lb` — Server leaderboard\n`/stats [@user]` — View stats\n`/resetlb` — Reset leaderboard (admin)' },
          { name: '📚 Topics', value: TOPICS.join(', ') },
          { name: '⚡ How to play', value: 'A question appears. Click **BUZZ IN** first, then pick A/B/C/D.\n+3 pts correct · −1 pt wrong or timeout' },
        )
      ], ephemeral: true });
    }

    // /stop
    if (commandName === 'stop') {
      const game = activeGames.get(interaction.channelId);
      if (!game) return interaction.reply({ content: 'No game is currently running.', ephemeral: true });
      clearTimeout(game.timeout);
      activeGames.delete(interaction.channelId);
      return interaction.reply({ embeds: [new EmbedBuilder().setTitle('🛑 Game Stopped').setColor(0xed4245).setDescription('The game has been ended.')] });
    }

    // /lb
    if (commandName === 'lb') {
      const lb = getLeaderboard(interaction.guildId);
      if (!lb.size) return interaction.reply({ content: 'No scores yet! Use `/chem` to play.', ephemeral: true });
      const sorted = [...lb.entries()].sort((a, b) => b[1].points - a[1].points).slice(0, 10);
      const medals = ['🥇', '🥈', '🥉'];
      const lines = await Promise.all(sorted.map(async ([uid, data], i) => {
        const user = await client.users.fetch(uid).catch(() => ({ username: 'Unknown' }));
        const acc  = data.total > 0 ? ((data.correct / data.total) * 100).toFixed(1) : '0.0';
        return `${medals[i] || `**${i+1}.**`} **${user.username}** — ${data.points} pts (${acc}% accuracy, ${data.correct}/${data.total})`;
      }));
      return interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle('🏆 Server Leaderboard')
        .setDescription(lines.join('\n'))
        .setColor(0xffd700)
      ]});
    }

    // /stats
    if (commandName === 'stats') {
      const target = interaction.options.getUser('user') || interaction.user;
      const lb     = getLeaderboard(interaction.guildId);
      const data   = lb.get(target.id);
      if (!data) return interaction.reply({ content: `No stats for **${target.username}** yet.`, ephemeral: true });
      const acc = data.total > 0 ? ((data.correct / data.total) * 100).toFixed(1) : '0.0';
      return interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle(`📊 ${target.username}'s Stats`)
        .setColor(0x57f287)
        .addFields(
          { name: 'Points',    value: String(data.points),  inline: true },
          { name: 'Correct',   value: String(data.correct), inline: true },
          { name: 'Attempted', value: String(data.total),   inline: true },
          { name: 'Accuracy',  value: `${acc}%`,            inline: true },
        )
      ]});
    }

    // /resetlb
    if (commandName === 'resetlb') {
      if (!interaction.member.permissions.has('Administrator'))
        return interaction.reply({ content: 'Only admins can reset the leaderboard.', ephemeral: true });
      leaderboards.set(interaction.guildId, new Map());
      return interaction.reply({ embeds: [new EmbedBuilder().setTitle('🗑️ Leaderboard Reset').setColor(0xed4245).setDescription('The server leaderboard has been cleared.')] });
    }

    // /chem
    if (commandName === 'chem') {
      if (activeGames.has(interaction.channelId))
        return interaction.reply({ content: 'A game is already running here! Use `/stop` to end it.', ephemeral: true });

      const rounds = interaction.options.getInteger('rounds') || 5;
      const topic  = interaction.options.getString('topic') || null;

      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle('🧪 Chemistry Buzzer — Get Ready!')
        .setDescription(`**${rounds} rounds** ${topic ? `• Topic: **${topic}**` : '• All topics'}\n\nClick **⚡ BUZZ IN** the moment you know the answer!\n\n**+3 pts** correct · **−1 pt** wrong or timed out`)
        .setColor(0x57f287)
      ]});

      // Initialize game state
      activeGames.set(interaction.channelId, {
        totalRounds: rounds,
        topic,
        guildId: interaction.guildId,
        usedIndices: new Set(),
        // round-specific fields set in startRound
      });

      await new Promise(r => setTimeout(r, 2500));
      startRound(interaction.channel, interaction.channelId, interaction.guildId, 1, rounds, topic, new Set());
    }
    return;
  }

  // ── BUTTON INTERACTIONS ─────────────────────────────────────────────────────
  if (!interaction.isButton()) return;

  const state = activeGames.get(interaction.channelId);
  if (!state) return interaction.reply({ content: 'No active game in this channel.', ephemeral: true });

  // BUZZ IN
  if (interaction.customId === 'buzz') {
    if (state.phase !== 'buzz')
      return interaction.reply({ content: 'Buzzing is closed for this question.', ephemeral: true });
    if (state.buzzedUsers.has(interaction.user.id))
      return interaction.reply({ content: 'You already buzzed in and got it wrong! Wait for the next question.', ephemeral: true });

    clearTimeout(state.timeout);
    state.phase  = 'answer';
    state.buzzer = interaction.user.id;

    await state.buzzMessage.edit({ components: buildBuzzButton(true) }).catch(() => {});

    await interaction.reply({
      embeds: [new EmbedBuilder()
        .setTitle(`⚡ ${interaction.user.username} buzzed in!`)
        .setDescription('Pick your answer below. **15 seconds!**')
        .setColor(0xfee75c)
      ],
      components: buildAnswerButtons(),
    });
    state.answerMessage = await interaction.fetchReply();

    // 15s answer timeout
    state.timeout = setTimeout(() => handleAnswerTimeout(interaction, state), 15000);
    return;
  }

  // ANSWER BUTTONS
  if (interaction.customId.startsWith('answer_')) {
    if (state.phase !== 'answer')
      return interaction.reply({ content: 'Answering is closed.', ephemeral: true });
    if (interaction.user.id !== state.buzzer)
      return interaction.reply({ content: 'Only the person who buzzed in can answer!', ephemeral: true });

    clearTimeout(state.timeout);
    const chosen  = parseInt(interaction.customId.split('_')[1]);
    const correct = chosen === state.q.answer;
    const labels  = ['A', 'B', 'C', 'D'];

    await state.answerMessage?.edit({ components: buildAnswerButtons(true, state.q.answer) }).catch(() => {});

    if (correct) {
      addPoints(state.guildId, interaction.user.id, 3, true);

      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle(`✅ Correct! ${interaction.user.username} +3 pts`)
        .setDescription(`**${labels[chosen]}. ${state.q.choices[chosen]}**\n\n💡 ${state.q.explanation}`)
        .setColor(0x57f287)
      ]});

      await advanceRound(interaction.channel, state, interaction.channelId);

    } else {
      addPoints(state.guildId, interaction.user.id, -1, false);
      state.buzzedUsers.add(interaction.user.id);
      state.phase  = 'buzz';
      state.buzzer = null;

      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle(`❌ Wrong! ${interaction.user.username} −1 pt`)
        .setDescription(`**${labels[chosen]}** is incorrect. Others can still buzz in!`)
        .setColor(0xed4245)
      ]});

      // Re-post question with buzz button for others
      const newMsg = await interaction.channel.send({
        embeds: [questionEmbed(state.q, state.roundNum, state.totalRounds)],
        components: buildBuzzButton(),
      });
      state.buzzMessage = newMsg;

      state.timeout = setTimeout(() => handleBuzzTimeout(interaction.channel, state, interaction.channelId), 20000);
    }
  }
});

// ─── Round management ─────────────────────────────────────────────────────────
async function startRound(channel, channelId, guildId, roundNum, totalRounds, topic, usedIndices) {
  if (!activeGames.has(channelId)) return;

  const { question, index } = pickQuestion(topic, usedIndices);
  usedIndices.add(index);

  const state = {
    q: question,
    roundNum,
    totalRounds,
    topic,
    guildId,
    usedIndices,
    phase: 'buzz',
    buzzer: null,
    buzzedUsers: new Set(),
    buzzMessage: null,
    answerMessage: null,
    timeout: null,
  };
  activeGames.set(channelId, state);

  const msg = await channel.send({
    embeds: [questionEmbed(question, roundNum, totalRounds)],
    components: buildBuzzButton(),
  });
  state.buzzMessage = msg;

  state.timeout = setTimeout(() => handleBuzzTimeout(channel, state, channelId), 30000);
}

async function advanceRound(channel, state, channelId) {
  if (state.roundNum < state.totalRounds) {
    await new Promise(r => setTimeout(r, 3000));
    if (!activeGames.has(channelId)) return; // game was stopped
    startRound(channel, channelId, state.guildId, state.roundNum + 1, state.totalRounds, state.topic, state.usedIndices);
  } else {
    await new Promise(r => setTimeout(r, 1500));
    activeGames.delete(channelId);
    showFinalLeaderboard(channel, state.guildId);
  }
}

async function handleBuzzTimeout(channel, state, channelId) {
  if (!activeGames.has(channelId) || activeGames.get(channelId).phase !== 'buzz') return;

  await state.buzzMessage?.edit({ components: buildBuzzButton(true) }).catch(() => {});
  await channel.send({ embeds: [new EmbedBuilder()
    .setTitle('⏰ Time\'s Up! No one buzzed in.')
    .setDescription(`The correct answer was **${['A','B','C','D'][state.q.answer]}. ${state.q.choices[state.q.answer]}**\n\n💡 ${state.q.explanation}`)
    .setColor(0xed4245)
  ]});

  await advanceRound(channel, state, channelId);
}

async function handleAnswerTimeout(interaction, state) {
  const channelId = interaction.channelId;
  if (!activeGames.has(channelId) || state.phase !== 'answer') return;

  addPoints(state.guildId, interaction.user.id, -1, false);
  state.buzzedUsers.add(interaction.user.id);
  state.phase  = 'buzz';
  state.buzzer = null;

  await state.answerMessage?.edit({ components: buildAnswerButtons(true, state.q.answer) }).catch(() => {});

  await interaction.channel.send({ embeds: [new EmbedBuilder()
    .setTitle(`⏰ Too slow! ${interaction.user.username} −1 pt`)
    .setDescription('Others can still buzz in!')
    .setColor(0xed4245)
  ]});

  const newMsg = await interaction.channel.send({
    embeds: [questionEmbed(state.q, state.roundNum, state.totalRounds)],
    components: buildBuzzButton(),
  });
  state.buzzMessage = newMsg;
  state.timeout = setTimeout(() => handleBuzzTimeout(interaction.channel, state, channelId), 20000);
}

async function showFinalLeaderboard(channel, guildId) {
  const lb = getLeaderboard(guildId);
  if (!lb.size) {
    return channel.send({ embeds: [new EmbedBuilder().setTitle('🏁 Game Over!').setDescription('No one scored. Use `/chem` to play again!').setColor(0xffd700)] });
  }
  const sorted = [...lb.entries()].sort((a, b) => b[1].points - a[1].points).slice(0, 10);
  const medals = ['🥇', '🥈', '🥉'];
  const lines  = await Promise.all(sorted.map(async ([uid, data], i) => {
    const user = await client.users.fetch(uid).catch(() => ({ username: 'Unknown' }));
    const acc  = data.total > 0 ? ((data.correct / data.total) * 100).toFixed(1) : '0.0';
    return `${medals[i] || `**${i+1}.**`} **${user.username}** — ${data.points} pts (${acc}% accuracy)`;
  }));
  channel.send({ embeds: [new EmbedBuilder()
    .setTitle('🏁 Game Over! — Final Leaderboard')
    .setDescription(lines.join('\n') + '\n\nUse `/chem` to play again!')
    .setColor(0xffd700)
  ]});
}

// ─── Login ────────────────────────────────────────────────────────────────────
const token = process.env.DISCORD_TOKEN;
if (!token) { console.error('❌ Set DISCORD_TOKEN and restart.'); process.exit(1); }
client.login(token);
