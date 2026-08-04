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
{ topic: 'States of Matter', q: 'Which solid has the highest melting point?', choices: ['NaCl', 'CO₂', 'SiO₂', 'I₂'], answer: 2, explanation: 'SiO₂ is a covalent network solid with continuous Si–O bonds throughout, melting at ~1700°C.' },
  { topic: 'States of Matter', q: 'According to kinetic molecular theory, which is true at higher temperatures?', choices: ['Gas molecules move slower on average', 'The speed distribution narrows', 'Average kinetic energy of molecules increases', 'Molecules spend more time in collisions'], answer: 2, explanation: 'KE_avg = (3/2)kT; average kinetic energy is directly proportional to absolute temperature.' },
  { topic: 'States of Matter', q: 'Under which conditions do real gases deviate most from ideal gas behavior?', choices: ['High temperature and low pressure', 'Low temperature and high pressure', 'High temperature and high pressure', 'Low temperature and low pressure'], answer: 1, explanation: 'Low temperatures slow down molecules (intermolecular forces matter more), and high pressure forces them close together (particle volume matters).' },
  { topic: 'States of Matter', q: 'Which type of solid typically exhibits high melting points and conducts electricity only when molten or dissolved?', choices: ['Molecular solid', 'Ionic solid', 'Covalent network solid', 'Metallic solid'], answer: 1, explanation: 'Ionic solids have mobile ions only when melted or dissolved in water, allowing electrical conduction.' },
  { topic: 'States of Matter', q: 'What volume will 1.00 mol of an ideal gas occupy at STP (0°C and 1.00 atm)?', choices: ['11.2 L', '22.4 L', '24.5 L', '44.8 L'], answer: 1, explanation: 'At STP (273.15 K, 1 atm), 1 mole of an ideal gas occupies 22.4 liters.' },
  { topic: 'States of Matter', q: 'Which intermolecular force is present in ALL molecules, regardless of polarity?', choices: ['Dipole-dipole forces', 'Hydrogen bonding', 'London dispersion forces', 'Ion-dipole forces'], answer: 2, explanation: 'London dispersion forces arise from instantaneous dipole moments in electron clouds present in all species.' },
  { topic: 'States of Matter', q: 'What is the root-mean-square speed (v_rms) ratio of H₂ (MW = 2) to O₂ (MW = 32) gas at the same temperature?', choices: ['1 : 4', '4 : 1', '1 : 16', '16 : 1'], answer: 1, explanation: 'Graham’s law / RMS speed: v ∝ 1/√(MW). √(32/2) = √16 = 4. H₂ moves 4 times faster than O₂.' },
  { topic: 'States of Matter', q: 'Which phase transition represents direct transformation from a gas to a solid without passing through the liquid phase?', choices: ['Sublimation', 'Deposition', 'Condensation', 'Vaporization'], answer: 1, explanation: 'Deposition is the phase change where gas transforms directly into solid.' },
  { topic: 'States of Matter', q: 'What point on a phase diagram represents the unique temperature and pressure at which solid, liquid, and gas phases coexist in equilibrium?', choices: ['Critical point', 'Triple point', 'Boiling point', 'Eutectic point'], answer: 1, explanation: 'The triple point is where all three phase boundary lines intersect.' },
  { topic: 'States of Matter', q: 'Which of the following substances exhibits hydrogen bonding in its liquid state?', choices: ['CH₄', 'H₂S', 'NH₃', 'HCl'], answer: 2, explanation: 'Hydrogen bonding occurs when H is bonded directly to N, O, or F. Ammonia (NH₃) meets this condition.' },
  { topic: 'States of Matter', q: 'According to Boyle’s Law, if the pressure of a fixed amount of gas at constant temperature is tripled, its volume will be:', choices: ['Tripled', 'Reduced to one-third', 'Increased by 3 L', 'Unchanged'], answer: 1, explanation: 'P₁V₁ = P₂V₂. Pressure and volume are inversely proportional at constant temperature.' },
  { topic: 'States of Matter', q: 'What is the pressure exerted by 0.50 mol of gas in a 5.0 L container at 300 K? (R = 0.0821 L·atm/(mol·K))', choices: ['1.23 atm', '2.46 atm', '4.92 atm', '0.61 atm'], answer: 1, explanation: 'P = nRT / V = (0.50 × 0.0821 × 300) / 5.0 = 12.315 / 5.0 = 2.46 atm.' },
  { topic: 'States of Matter', q: 'Which gas parameter is constant along an isotherm on a pressure-volume graph?', choices: ['Volume', 'Pressure', 'Temperature', 'Density'], answer: 2, explanation: 'An isotherm represents a process occurring at constant temperature.' },
  { topic: 'States of Matter', q: 'A mixture contains 2.0 mol He and 3.0 mol Ne at a total pressure of 10.0 atm. What is the partial pressure of He?', choices: ['2.0 atm', '4.0 atm', '6.0 atm', '5.0 atm'], answer: 1, explanation: 'P_He = (n_He / n_total) × P_total = (2 / 5) × 10.0 atm = 4.0 atm.' },
  { topic: 'States of Matter', q: 'Which physical property measures a liquid\'s resistance to flow?', choices: ['Surface tension', 'Viscosity', 'Vapor pressure', 'Capillarity'], answer: 1, explanation: 'Viscosity is a fluid’s resistance to gradual deformation or flow.' },
  { topic: 'States of Matter', q: 'Why does water expand when it freezes into ice?', choices: ['Molecules move faster', 'Hydrogen bonds form an open hexagonal lattice', 'Covalent O-H bonds elongate', 'Air molecules dissolve into the lattice'], answer: 1, explanation: 'Ice forms an open crystalline hexagonal network held by hydrogen bonds, creating empty space and decreasing density.' },
  { topic: 'States of Matter', q: 'What happens to the vapor pressure of a liquid as temperature increases?', choices: ['It decreases exponentially', 'It remains constant', 'It increases non-linearly', 'It drops to zero'], answer: 2, explanation: 'Vapor pressure increases exponentially with temperature according to the Clausius-Clapeyron equation.' },
  { topic: 'States of Matter', q: 'In the van der Waals equation (P + a(n/V)²)(V - nb) = nRT, what does the parameter \'a\' account for?', choices: ['Molecular volume', 'Intermolecular attractive forces', 'Particle collisions', 'Kinetic energy distribution'], answer: 1, explanation: '\'a\' corrects for attractive forces between gas particles; \'b\' corrects for finite molecular volume.' },
  { topic: 'States of Matter', q: 'Which substance forms a metallic crystal lattice held together by delocalized electrons?', choices: ['Diamond', 'Copper (Cu)', 'Quartz (SiO₂)', 'Ice (H₂O)'], answer: 1, explanation: 'Copper is a metal with metal cations surrounded by a sea of delocalized electrons.' },
  { topic: 'States of Matter', q: 'When a liquid reaches its normal boiling point, its vapor pressure equals:', choices: ['0.5 atm', '1.0 atm', '2.0 atm', 'The critical pressure'], answer: 1, explanation: 'Normal boiling point is defined as the temperature at which vapor pressure equals standard atmospheric pressure (1 atm).' },
  { topic: 'States of Matter', q: 'Which factor increases the rate of effusion of a gas through a tiny pinhole?', choices: ['Higher molar mass', 'Lower temperature', 'Lower molar mass', 'Higher pressure only'], answer: 2, explanation: 'Rate of effusion is inversely proportional to the square root of molar mass (Graham\'s Law); lighter gases effuse faster.' },
  { topic: 'States of Matter', q: 'Which type of crystalline solid is diamond?', choices: ['Molecular', 'Ionic', 'Metallic', 'Covalent network'], answer: 3, explanation: 'Diamond consists of carbon atoms covalently bonded in a 3D tetrahedral network.' },
  { topic: 'States of Matter', q: 'What is the term for a liquid\'s tendency to minimize its surface area due to cohesive forces?', choices: ['Viscosity', 'Adhesion', 'Surface tension', 'Vapor pressure'], answer: 2, explanation: 'Surface tension results from inward cohesive forces pulling surface molecules together.' },
  { topic: 'States of Matter', q: 'If the kelvin temperature of a gas sample in a rigid container is doubled, the pressure will:', choices: ['Double', 'Halve', 'Quadruple', 'Remain constant'], answer: 0, explanation: 'Gay-Lussac’s Law (P ∝ T at constant volume): doubling absolute temperature doubles pressure.' },
  { topic: 'States of Matter', q: 'Beyond which temperature and pressure point can a substance no longer exist as distinct liquid and gas phases?', choices: ['Triple point', 'Boiling point', 'Critical point', 'Melting point'], answer: 2, explanation: 'At conditions beyond the critical point, the substance becomes a supercritical fluid with no phase boundary.' },
  { topic: 'States of Matter', q: 'Which gas has the highest density at STP?', choices: ['CH₄ (16 g/mol)', 'N₂ (28 g/mol)', 'O₂ (32 g/mol)', 'CO₂ (44 g/mol)'], answer: 3, explanation: 'Density = Molar Mass / Molar Volume. Higher molar mass gas has higher density.' },
  { topic: 'States of Matter', q: 'What is the primary intermolecular force between nonpolar carbon tetrachloride (CCl₄) molecules?', choices: ['Dipole-dipole', 'London dispersion forces', 'Hydrogen bonding', 'Ion-dipole'], answer: 1, explanation: 'CCl₄ is nonpolar due to tetrahedral symmetry, so its main intermolecular force is London dispersion.' },
  { topic: 'States of Matter', q: 'An ideal gas sample occupies 4.0 L at 2.0 atm. What volume will it occupy at 0.50 atm if temperature remains constant?', choices: ['8.0 L', '16.0 L', '2.0 L', '1.0 L'], answer: 1, explanation: 'P₁V₁ = P₂V₂ → (2.0)(4.0) = (0.50)V₂ → V₂ = 8.0 / 0.50 = 16.0 L.' },
  { topic: 'States of Matter', q: 'Which property explains why water forms spherical droplets on a wax surface?', choices: ['High viscosity', 'Cohesive forces exceeding adhesive forces', 'Adhesive forces exceeding cohesive forces', 'Low vapor pressure'], answer: 1, explanation: 'Cohesion between water molecules is stronger than adhesion to nonpolar wax, causing water to minimize surface area as spheres.' },
  { topic: 'States of Matter', q: 'How many atoms are contained per unit cell in a Face-Centered Cubic (FCC) lattice?', choices: ['1', '2', '4', '8'], answer: 2, explanation: 'FCC cell = 8 corners × (1/8) + 6 faces × (1/2) = 1 + 3 = 4 atoms.' },
  { topic: 'States of Matter', q: 'How many atoms are contained per unit cell in a Body-Centered Cubic (BCC) lattice?', choices: ['1', '2', '4', '6'], answer: 1, explanation: 'BCC cell = 8 corners × (1/8) + 1 center = 1 + 1 = 2 atoms.' },
  { topic: 'States of Matter', q: 'Which solid lacks a long-range repeating crystalline structure?', choices: ['Quartz crystal', 'Amorphous solid (Glass)', 'Sodium chloride', 'Diamond'], answer: 1, explanation: 'Amorphous solids (like glass or rubber) lack a well-defined long-range ordered crystal lattice.' },
  { topic: 'States of Matter', q: 'What volume of oxygen gas (O₂) at STP contains 3.01 × 10²³ molecules?', choices: ['5.6 L', '11.2 L', '22.4 L', '44.8 L'], answer: 1, explanation: '3.01 × 10²³ molecules = 0.50 moles. At STP, 0.50 mol × 22.4 L/mol = 11.2 L.' },
  { topic: 'States of Matter', q: 'Which equation expresses Dalton\'s Law of Partial Pressures for a mixture of non-reacting gases?', choices: ['P_total = P₁ + P₂ + P₃ + ...', 'PV = nRT', 'P₁V₁ = P₂V₂', 'V₁/T₁ = V₂/T₂'], answer: 0, explanation: 'Dalton\'s Law states that total pressure is the sum of individual partial pressures.' },
  { topic: 'States of Matter', q: 'What is the dominant intermolecular force in liquid acetone, (CH₃)₂CO?', choices: ['London dispersion only', 'Dipole-dipole interactions', 'Hydrogen bonding', 'Ionic bonding'], answer: 1, explanation: 'Acetone has a polar carbonyl group (C=O) but no H attached directly to O, so it is dominated by dipole-dipole forces.' },
  { topic: 'States of Matter', q: 'Why does boiling point increase down the noble gas group (He < Ne < Ar < Kr < Xe)?', choices: ['Increasing electronegativity', 'Increasing polarizability and London dispersion forces', 'Decreasing atomic mass', 'Formation of transient ionic bonds'], answer: 1, explanation: 'Larger electron clouds are more polarizable, strengthening dispersion forces and raising boiling points.' },
  { topic: 'States of Matter', q: 'Which curve on a Maxwell-Boltzmann speed distribution represents gas molecules at the HIGHEST temperature?', choices: ['Tallest and narrowest peak on the left', 'Broadest and lowest peak shifted to the right', 'Symmetrical narrow peak in the middle', 'Sharp peak at zero velocity'], answer: 1, explanation: 'At higher temperatures, average speed increases (peak shifts right) and speed distribution spreads out (lower height).' },
  { topic: 'States of Matter', q: 'Which gas deviates LEAST from ideal gas behavior under standard conditions?', choices: ['Helium (He)', 'Water vapor (H₂O)', 'Ammonia (NH₃)', 'Sulfur dioxide (SO₂)'], answer: 0, explanation: 'Helium is small, monatomic, and nonpolar with extremely weak dispersion forces, making it closest to an ideal gas.' },
  { topic: 'States of Matter', q: 'What is the coordinate number of an atom in a Simple Cubic lattice?', choices: ['4', '6', '8', '12'], answer: 1, explanation: 'In a simple cubic cell, each atom touches 6 nearest neighbors.' },
  { topic: 'States of Matter', q: 'What is the packing efficiency of a Face-Centered Cubic (FCC) / Cubic Close-Packed (CCP) lattice?', choices: ['52%', '68%', '74%', '92%'], answer: 2, explanation: 'FCC/CCP structures achieve maximum close-packing with 74% volume efficiency.' },
  { topic: 'States of Matter', q: 'If 2.0 L of gas at 300 K is heated to 600 K at constant pressure, what is the new volume?', choices: ['1.0 L', '2.0 L', '4.0 L', '8.0 L'], answer: 2, explanation: 'Charles’s Law (V₁/T₁ = V₂/T₂): 2.0 / 300 = V₂ / 600 → V₂ = 4.0 L.' },
  { topic: 'States of Matter', q: 'What type of solid is solid iodine (I₂)?', choices: ['Ionic solid', 'Covalent network solid', 'Molecular solid', 'Metallic solid'], answer: 2, explanation: 'Iodine consists of discrete I₂ molecules held in a solid lattice by dispersion forces (molecular solid).' },
  { topic: 'States of Matter', q: 'Which process describes a gas expanding into a vacuum with no external pressure resisting it?', choices: ['Effusion', 'Free expansion', 'Isothermal compression', 'Adiabatic condensation'], answer: 1, explanation: 'Free expansion occurs when gas expands against zero external pressure (w = 0).' },
  { topic: 'States of Matter', q: 'Which liquid will have the HIGHEST surface tension at room temperature?', choices: ['Pentane (C₅H₁₂)', 'Ethanol (C₂H₅OH)', 'Water (H₂O)', 'Diethyl ether ((C₂H₅)₂O)'], answer: 2, explanation: 'Water has a dense network of strong hydrogen bonds, resulting in exceptionally high surface tension.' },
  { topic: 'States of Matter', q: 'What phase change occurs when solid dry ice (CO₂) turns directly into gas at room temperature?', choices: ['Evaporation', 'Sublimation', 'Melting', 'Deposition'], answer: 1, explanation: 'CO₂ sublimes directly from solid to gas at 1 atm pressure because its triple point is above 1 atm.' },
  { topic: 'States of Matter', q: 'In a capillary tube made of glass, water forms a concave meniscus because:', choices: ['Adhesive forces (water-glass) exceed cohesive forces (water-water)', 'Cohesive forces exceed adhesive forces', 'Surface tension is zero', 'Gravity pushes water up the walls'], answer: 0, explanation: 'Polar water molecules adhere strongly to hydrophilic silicon dioxide glass, pulling edges upward into a concave meniscus.' },
  { topic: 'States of Matter', q: 'Which property of a gas is directly proportional to its absolute temperature in Kelvins?', choices: ['Volume at constant P and n', 'Density at constant P', 'Molar mass', 'Intermolecular attraction'], answer: 0, explanation: 'By Charles\'s Law, V ∝ T at constant pressure and amount of gas.' },
  { topic: 'States of Matter', q: 'What is the density of N₂ gas at 1.00 atm and 273 K? (R = 0.0821 L·atm/(mol·K), MW N₂ = 28.0 g/mol)', choices: ['1.25 g/L', '2.50 g/L', '0.625 g/L', '2.80 g/L'], answer: 0, explanation: 'd = (P × MW) / (R × T) = (1.00 × 28.0) / (0.0821 × 273) = 28.0 / 22.41 = 1.25 g/L.' },
  { topic: 'States of Matter', q: 'Which law states that equal volumes of gases at the same temperature and pressure contain equal numbers of molecules?', choices: ['Boyle\'s Law', 'Charles\'s Law', 'Avogadro\'s Law', 'Dalton\'s Law'], answer: 2, explanation: 'Avogadro\'s Law posits V ∝ n under identical temperature and pressure conditions.' },
  { topic: 'States of Matter', q: 'How does increasing external atmospheric pressure affect the boiling point of a liquid?', choices: ['Decreases boiling point', 'Increases boiling point', 'Does not affect boiling point', 'Causes instant freezing'], answer: 1, explanation: 'Higher external pressure requires higher temperature for vapor pressure to equal external pressure, raising the boiling point.' },

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
{ topic: 'Thermodynamics', q: 'Which phase transition is accompanied by a positive change in entropy (ΔS > 0)?', choices: ['Condensation', 'Freezing', 'Sublimation', 'Deposition'], answer: 2, explanation: 'Sublimation converts an ordered solid directly into a highly disordered gas, increasing entropy.' },
  { topic: 'Thermodynamics', q: 'In an endothermic reaction at constant pressure, what is the sign of ΔH?', choices: ['Positive', 'Negative', 'Zero', 'Cannot be determined'], answer: 0, explanation: 'Endothermic processes absorb heat from the surroundings, so ΔH > 0.' },
  { topic: 'Thermodynamics', q: 'Which law of thermodynamics states that the entropy of a pure, perfectly crystalline substance at absolute zero is zero?', choices: ['Zeroth Law', 'First Law', 'Second Law', 'Third Law'], answer: 3, explanation: 'The Third Law of Thermodynamics defines absolute entropy relative to a perfect crystal at 0 K.' },
  { topic: 'Thermodynamics', q: 'What is the change in internal energy (ΔU) of a system that absorbs 50 J of heat and does 20 J of work on the surroundings?', choices: ['+70 J', '+30 J', '-30 J', '-70 J'], answer: 1, explanation: 'ΔU = q + w. Heat absorbed (q) = +50 J, work done by system (w) = -20 J. ΔU = 50 - 20 = +30 J.' },
  { topic: 'Thermodynamics', q: 'Under what conditions is a reaction always spontaneous regardless of temperature?', choices: ['ΔH < 0 and ΔS > 0', 'ΔH > 0 and ΔS < 0', 'ΔH < 0 and ΔS < 0', 'ΔH > 0 and ΔS > 0'], answer: 0, explanation: 'ΔG = ΔH - TΔS. If ΔH is negative and ΔS is positive, ΔG is always negative regardless of temperature.' },
  { topic: 'Thermodynamics', q: 'How much heat is needed to raise 50.0 g of water from 20.0°C to 80.0°C? (c = 4.18 J/g·°C)', choices: ['8.36 kJ', '12.54 kJ', '16.72 kJ', '4.18 kJ'], answer: 1, explanation: 'q = mcΔT = 50.0 g × 4.18 J/g·°C × 60.0°C = 12,540 J = 12.54 kJ.' },
  { topic: 'Thermodynamics', q: 'Using Hess\'s Law: A → B (ΔH = +50 kJ) and B → C (ΔH = −80 kJ). What is ΔH for A → C?', choices: ['+130 kJ', '−130 kJ', '−30 kJ', '+30 kJ'], answer: 2, explanation: 'ΔH(A → C) = +50 kJ + (−80 kJ) = −30 kJ.' },
  { topic: 'Thermodynamics', q: 'A reaction has ΔH = −100 kJ/mol and ΔS = −200 J/(mol·K). Above what temperature is it non-spontaneous?', choices: ['200 K', '300 K', '500 K', '750 K'], answer: 2, explanation: 'ΔG = 0 when T = ΔH/ΔS = 100,000 / 200 = 500 K. Above 500 K, ΔG > 0 (non-spontaneous).' },
  { topic: 'Thermodynamics', q: 'Which process has a negative change in entropy (ΔS < 0)?', choices: ['Melting of ice', 'Dissolving NH₄NO₃ in water', 'Condensation of steam to liquid water', 'Sublimation of dry ice'], answer: 2, explanation: 'Gas → liquid transitions greatly reduce spatial freedom and microstates; hence ΔS < 0.' },
  { topic: 'Thermodynamics', q: 'Which physical quantity represents a state function?', choices: ['Heat (q)', 'Work (w)', 'Enthalpy (H)', 'Path dependent distance'], answer: 2, explanation: 'Enthalpy is a state function depending only on initial and final states, whereas heat and work depend on path.' },
  { topic: 'Thermodynamics', q: 'What is the relationship between ΔG° and the equilibrium constant K?', choices: ['ΔG° = −RT ln K', 'ΔG° = RT ln K', 'ΔG° = −nFE°', 'ΔG° = ΔH° / K'], answer: 0, explanation: 'Standard Gibbs free energy change relates to equilibrium constant by ΔG° = −RT ln K.' },
  { topic: 'Thermodynamics', q: 'For a process occurring at constant pressure, heat exchanged (q_p) is equal to:', choices: ['Change in internal energy (ΔU)', 'Change in enthalpy (ΔH)', 'Change in entropy (ΔS)', 'Work done (w)'], answer: 1, explanation: 'By definition, enthalpy change ΔH equals heat flow at constant pressure (q_p).' },
  { topic: 'Thermodynamics', q: 'An ideal gas expands isothermally against constant external pressure. What is true about ΔU?', choices: ['ΔU > 0', 'ΔU < 0', 'ΔU = 0', 'ΔU = q + w = 0 always'], answer: 2, explanation: 'Internal energy of an ideal gas depends solely on temperature. For an isothermal process (ΔT = 0), ΔU = 0.' },
  { topic: 'Thermodynamics', q: 'Which reaction condition guarantees a non-spontaneous process at all temperatures?', choices: ['ΔH > 0 and ΔS < 0', 'ΔH < 0 and ΔS > 0', 'ΔH < 0 and ΔS < 0', 'ΔH > 0 and ΔS > 0'], answer: 0, explanation: 'If ΔH is positive and ΔS is negative, ΔG = ΔH - TΔS is always positive (+), so the reaction is never spontaneous.' },
  { topic: 'Thermodynamics', q: 'In a bomb calorimeter, the volume is kept constant. The heat measured (q_v) corresponds to:', choices: ['Enthalpy change (ΔH)', 'Internal energy change (ΔU)', 'Free energy change (ΔG)', 'Entropy change (ΔS)'], answer: 1, explanation: 'At constant volume, no expansion work is done (w = 0), so q_v = ΔU.' },
  { topic: 'Thermodynamics', q: 'What is standard molar enthalpy of formation (ΔH°_f) for an element in its standard state?', choices: ['1.0 kJ/mol', '0.0 kJ/mol', 'Dependent on temperature only', 'Negative'], answer: 1, explanation: 'By convention, ΔH°_f for any pure element in its most stable standard form (e.g., O₂(g), C(graphite)) is zero.' },
  { topic: 'Thermodynamics', q: 'According to the Second Law of Thermodynamics, for any spontaneous process, the total entropy of the universe:', choices: ['Decreases', 'Remains constant', 'Increases', 'Reaches zero'], answer: 2, explanation: 'The Second Law states that ΔS_univ = ΔS_sys + ΔS_surr > 0 for all spontaneous processes.' },
  { topic: 'Thermodynamics', q: 'Which statement correctly describes an adiabatic process?', choices: ['No heat is transferred (q = 0)', 'Temperature remains constant (ΔT = 0)', 'Pressure remains constant (ΔP = 0)', 'No work is done (w = 0)'], answer: 0, explanation: 'An adiabatic process is one where no thermal energy enters or leaves the system (q = 0).' },
  { topic: 'Thermodynamics', q: 'If K > 1 at 298 K, what must be true about the standard Gibbs free energy change ΔG°?', choices: ['ΔG° > 0', 'ΔG° = 0', 'ΔG° < 0', 'ΔG° = ΔH°'], answer: 2, explanation: 'Since ΔG° = −RT ln K, if K > 1, ln K is positive, making ΔG° negative (spontaneous under standard conditions).' },
  { topic: 'Thermodynamics', q: 'Estimate ΔH for the reaction H₂ + Cl₂ → 2HCl given bond energies: H-H = 436 kJ/mol, Cl-Cl = 242 kJ/mol, H-Cl = 431 kJ/mol.', choices: ['−184 kJ', '+184 kJ', −247 kJ', '+247 kJ'], answer: 0, explanation: 'ΔH = (bonds broken) − (bonds formed) = (436 + 242) − 2(431) = 678 − 862 = −184 kJ.' },
  { topic: 'Thermodynamics', q: 'What is the standard enthalpy change for a reaction given ΔH°_f values: Reactants = +120 kJ/mol, Products = −250 kJ/mol?', choices: ['−370 kJ/mol', '+370 kJ/mol', '−130 kJ/mol', '+130 kJ/mol'], answer: 0, explanation: 'ΔH°_rxn = ∑ ΔH°_f(products) − ∑ ΔH°_f(reactants) = −250 − (+120) = −370 kJ/mol.' },
  { topic: 'Thermodynamics', q: 'An intensive thermodynamic property is one that:', choices: ['Depends on system size/mass', 'Is independent of system size/mass', 'Is always measured in Joules', 'Is equal to zero at equilibrium'], answer: 1, explanation: 'Intensive properties (e.g., temperature, density, molar mass) do not depend on the amount of substance.' },
  { topic: 'Thermodynamics', q: 'Which of the following is an extensive property?', choices: ['Temperature', 'Density', 'Enthalpy', 'Pressure'], answer: 2, explanation: 'Enthalpy depends directly on the amount of material present, making it an extensive property.' },
  { topic: 'Thermodynamics', q: 'When water boils at 100°C under 1 atm pressure, the phase change is at equilibrium. What is ΔG?', choices: ['Positive', 'Negative', 'Zero', 'Infinite'], answer: 2, explanation: 'At a normal transition temperature during phase equilibrium, ΔG = 0.' },
  { topic: 'Thermodynamics', q: 'Which equation correctly calculates entropy change of surroundings (ΔS_surr) at constant temperature and pressure?', choices: ['ΔS_surr = −ΔH_sys / T', 'ΔS_surr = ΔH_sys / T', 'ΔS_surr = ΔG / T', 'ΔS_surr = q_sys × T'], answer: 0, explanation: 'Heat lost by system is absorbed by surroundings (q_surr = −ΔH_sys), so ΔS_surr = −ΔH_sys / T.' },
  { topic: 'Thermodynamics', q: 'What happens to the spontaneity of an endothermic reaction with positive ΔS as temperature increases?', choices: ['Becomes less spontaneous', 'Becomes more spontaneous', 'Spontaneity remains unchanged', 'It explodes'], answer: 1, explanation: 'ΔG = ΔH - TΔS. With ΔH > 0 and ΔS > 0, increasing T makes the −TΔS term more negative, driving ΔG < 0.' },
  { topic: 'Thermodynamics', q: 'What unit is standard molar entropy usually reported in?', choices: ['kJ/mol', 'J/(mol·K)', 'J/mol', 'kJ/(g·°C)'], answer: 1, explanation: 'Entropy values are comparatively small and measured in Joules per mole per Kelvin (J/(mol·K)).' },
  { topic: 'Thermodynamics', q: 'How much work is done when a gas expands from 1.0 L to 3.0 L against a constant pressure of 2.0 atm? (1 L·atm = 101.3 J)', choices: ['−405 J', '+405 J', '−202.6 J', '+202.6 J'], answer: 0, explanation: 'w = −P_ext ΔV = −(2.0 atm)(2.0 L) = −4.0 L·atm = −4.0 × 101.3 J = −405.2 J.' },
  { topic: 'Thermodynamics', q: 'Which process is exothermic?', choices: ['Ice melting', 'Water evaporating', 'Steam condensing', 'Solid NH₄Cl dissolving in water (cooling solution)'], answer: 2, explanation: 'Condensation releases latent heat of vaporization into surroundings, making it exothermic (ΔH < 0).' },
  { topic: 'Thermodynamics', q: 'In an isolated system, which quantity must remain constant during any process?', choices: ['Pressure', 'Entropy', 'Total energy', 'Temperature'], answer: 2, explanation: 'An isolated system exchanges neither mass nor energy with surroundings; total energy is conserved (First Law).' },
  { topic: 'Thermodynamics', q: 'What is the specific heat capacity of a 20.0 g metal sample that absorbs 100 J of heat when warming from 20°C to 30°C?', choices: ['0.50 J/(g·°C)', '1.00 J/(g·°C)', '2.00 J/(g·°C)', '0.25 J/(g·°C)'], answer: 0, explanation: 'c = q / (m ΔT) = 100 J / (20.0 g × 10°C) = 100 / 200 = 0.50 J/(g·°C).' },
  { topic: 'Thermodynamics', q: 'Which state of water has the highest absolute standard molar entropy (S°)?', choices: ['H₂O(s)', 'H₂O(l)', 'H₂O(g)', 'All are identical'], answer: 2, explanation: 'Gaseous water has the greatest degree of molecular disorder and accessible microstates.' },
  { topic: 'Thermodynamics', q: 'The Zeroth Law of Thermodynamics establishes the foundation for measuring which property?', choices: ['Work', 'Entropy', 'Temperature', 'Internal energy'], answer: 2, explanation: 'The Zeroth Law defines thermal equilibrium and serves as the physical basis for temperature measurement.' },
  { topic: 'Thermodynamics', q: 'What is ΔH for a reversible process carried out isothermally and adiabatically?', choices: ['Positive', 'Negative', 'Zero', 'Infinite'], answer: 2, explanation: 'For ideal gas, isothermal means ΔT = 0, so internal energy and enthalpy changes are zero.' },
  { topic: 'Thermodynamics', q: 'If ΔG° for a reaction is 0 kJ/mol, what is the equilibrium constant K?', choices: ['0', '1', '10', 'Infinity'], answer: 1, explanation: 'ΔG° = −RT ln K = 0 → ln K = 0 → K = e⁰ = 1.' },
  { topic: 'Thermodynamics', q: 'Which statement correctly compares specific heat capacity (c) and heat capacity (C)?', choices: ['c is extensive; C is intensive', 'c is intensive; C is extensive', 'Both are intensive', 'Both are extensive'], answer: 1, explanation: 'Specific heat capacity (c) is per unit mass (intensive); heat capacity (C = m·c) depends on mass (extensive).' },
  { topic: 'Thermodynamics', q: 'For a cyclic process returning a system to its exact initial state, what is the overall change in internal energy (ΔU_cycle)?', choices: ['> 0', '< 0', '= 0', 'Depends on path'], answer: 2, explanation: 'Because internal energy is a state function, returning to the starting state means ΔU_cycle = 0.' },
  { topic: 'Thermodynamics', q: 'What is the sign of ΔS for the reaction: 2SO₂(g) + O₂(g) → 2SO₃(g)?', choices: ['Positive', 'Negative', 'Zero', 'Cannot be predicted'], answer: 1, explanation: '3 moles of gas react to form 2 moles of gas. A net decrease in gaseous moles results in ΔS < 0.' },
  { topic: 'Thermodynamics', q: 'In a coffee-cup calorimeter operated at constant atmospheric pressure, the heat measured directly equals:', choices: ['ΔU', 'ΔH', 'ΔG', 'w'], answer: 1, explanation: 'Coffee-cup calorimeters operate under constant atmospheric pressure; therefore, q_p = ΔH.' },
  { topic: 'Thermodynamics', q: 'The standard enthalpy of combustion (ΔH°_c) is defined for how many moles of fuel burned?', choices: ['1 mole', '2 moles', 'Avogadro\'s number of moles', 'Any arbitrary amount'], answer: 0, explanation: 'Standard enthalpy of combustion is normalized per 1 mole of fuel completely oxidized.' },
  { topic: 'Thermodynamics', q: 'Which thermodynamic term describes a reaction that absorbs heat from its surroundings?', choices: ['Exothermic', 'Endothermic', 'Endergonic', 'Exergonic'], answer: 1, explanation: 'Endothermic refers specifically to thermal energy (heat) absorption (ΔH > 0).' },
  { topic: 'Thermodynamics', q: 'Which thermodynamic term describes a process with ΔG < 0?', choices: ['Exothermic', 'Endothermic', 'Endergonic', 'Exergonic'], answer: 3, explanation: 'Exergonic describes a process that releases free energy and occurs spontaneously (ΔG < 0).' },
  { topic: 'Thermodynamics', q: 'What is the value of ΔH° for the reaction 2H₂O(l) → 2H₂(g) + O₂(g) if ΔH°_f of H₂O(l) is −286 kJ/mol?', choices: ['−572 kJ', '+572 kJ', '+286 kJ', '−286 kJ'], answer: 1, explanation: 'Reversing decomposition gives 2 × (+286 kJ/mol) = +572 kJ.' },
  { topic: 'Thermodynamics', q: 'For an endothermic reaction to be spontaneous, which condition must hold?', choices: ['ΔS < 0 and T is low', 'TΔS > ΔH', 'ΔS = 0', 'TΔS < ΔH'], answer: 1, explanation: 'Since ΔG = ΔH - TΔS, for ΔH > 0 to yield ΔG < 0, the term TΔS must exceed ΔH.' },
  { topic: 'Thermodynamics', q: 'What is the temperature in Kelvin at which liquid water and steam are in equilibrium under 1 atm pressure?', choices: ['0 K', '273.15 K', '373.15 K', '100 K'], answer: 2, explanation: 'Water boils at 100°C = 373.15 K under 1 atm pressure.' },
  { topic: 'Thermodynamics', q: 'Calculate ΔS_surr for an exothermic reaction with ΔH = −60 kJ at 300 K.', choices: ['+200 J/K', '−200 J/K', '+0.2 J/K', '−0.2 J/K'], answer: 0, explanation: 'ΔS_surr = −ΔH/T = −(−60,000 J) / 300 K = +200 J/K.' },
  { topic: 'Thermodynamics', q: 'In a reversible isothermal expansion of an ideal gas, how are heat (q) and work (w) related?', choices: ['q = w', 'q = −w', 'q = 0', 'w = 0'], answer: 1, explanation: 'Isothermal ideal gas has ΔU = 0 = q + w, implying q = −w.' },
  { topic: 'Thermodynamics', q: 'If a process is spontaneous in the forward direction, what is true for the reverse process?', choices: ['Also spontaneous', 'Non-spontaneous', 'At equilibrium', 'Exothermic'], answer: 1, explanation: 'If forward ΔG < 0, then reverse ΔG > 0, making the reverse process non-spontaneous.' },
  { topic: 'Thermodynamics', q: 'Which parameter determines whether a chemical reaction is thermodynamically favorable at constant T and P?', choices: ['ΔH', 'ΔS', 'ΔG', 'Activation energy (Ea)'], answer: 2, explanation: 'Gibbs free energy change (ΔG) dictates thermodynamic favorability at constant temperature and pressure.' },
  { topic: 'Thermodynamics', q: 'What is the enthalpy change for freezing 1 mole of water at 0°C if ΔH_fusion = +6.01 kJ/mol?', choices: ['+6.01 kJ/mol', '−6.01 kJ/mol', '0 kJ/mol', '+12.02 kJ/mol'], answer: 1, explanation: 'Freezing is the exact reverse phase change of melting (fusion), so ΔH_freezing = −ΔH_fusion = −6.01 kJ/mol.' },

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
{ topic: 'Kinetics', q: 'What are the units of the rate constant (k) for a first-order reaction?', choices: ['s⁻¹', 'M⁻¹·s⁻¹', 'M·s⁻¹', 'M⁻²·s⁻¹'], answer: 0, explanation: 'For a first-order reaction, Rate = k[A]. Thus, k = Rate/[A] = (M/s)/M = s⁻¹.' },
  { topic: 'Kinetics', q: 'What is the half-life expression (t_1/2) for a first-order reaction?', choices: ['t_1/2 = 0.693 / k', 't_1/2 = 1 / (k[A]₀)', 't_1/2 = [A]₀ / (2k)', 't_1/2 = k / 0.693'], answer: 0, explanation: 'For a first-order process, t_1/2 = ln(2)/k ≈ 0.693 / k, which is independent of initial concentration.' },
  { topic: 'Kinetics', q: 'How does a catalyst increase the rate of a chemical reaction?', choices: ['Increases activation energy', 'Lowers activation energy by providing an alternative pathway', 'Increases enthalpy change (ΔH)', 'Decreases temperature of the system'], answer: 1, explanation: 'A catalyst speeds up a reaction by offering a lower activation energy pathway.' },
  { topic: 'Kinetics', q: 'In the rate law Rate = k[A]²[B], what is the overall reaction order?', choices: ['1st order', '2nd order', '3rd order', '0 order'], answer: 2, explanation: 'Overall order is the sum of exponents: 2 (for A) + 1 (for B) = 3.' },
  { topic: 'Kinetics', q: 'A linear plot of ln[A] versus time indicates that the reaction is:', choices: ['Zero-order', 'First-order', 'Second-order', 'Third-order'], answer: 1, explanation: 'The integrated rate law for a first-order reaction is ln[A]_t = -kt + ln[A]₀, yielding a straight line with slope -k.' },
  { topic: 'Kinetics', q: 'A linear plot of 1/[A] versus time indicates that the reaction is:', choices: ['Zero-order', 'First-order', 'Second-order', 'Fractional-order'], answer: 2, explanation: 'The integrated rate law for second-order kinetics is 1/[A]_t = kt + 1/[A]₀, yielding a straight line with slope +k.' },
  { topic: 'Kinetics', q: 'What happens to the rate constant (k) when temperature increases?', choices: ['Decreases exponentially', 'Remains constant', 'Increases exponentially', 'Drops to zero'], answer: 2, explanation: 'According to the Arrhenius equation (k = A e^(-Ea/RT)), k increases exponentially with temperature.' },
  { topic: 'Kinetics', q: 'What is the rate-determining step in a multi-step reaction mechanism?', choices: ['The first step', 'The last step', 'The slowest step', 'The fastest step'], answer: 2, explanation: 'The slowest step acts as the bottleneck and determines the overall reaction rate.' },
  { topic: 'Kinetics', q: 'For the reaction 2A + B → C, if the rate of disappearance of A is 0.40 M/s, what is the rate of disappearance of B?', choices: ['0.40 M/s', '0.20 M/s', '0.80 M/s', '0.10 M/s'], answer: 1, explanation: 'Rate = -(1/2)Δ[A]/Δt = -Δ[B]/Δt. Thus, rate of B loss = (1/2)(0.40 M/s) = 0.20 M/s.' },
  { topic: 'Kinetics', q: 'In collision theory, what two criteria must molecules meet during a collision to react?', choices: ['Sufficient energy and correct orientation', 'High pressure and low volume', 'Same charge and large size', 'High density and zero temperature'], answer: 0, explanation: 'Molecules must collide with energy ≥ activation energy (Ea) and with appropriate molecular orientation.' },
  { topic: 'Kinetics', q: 'What is a reaction intermediate?', choices: ['A species formed in an early step and consumed in a later step', 'A species present at the start and end unchanged', 'The highest energy point on a reaction profile', 'The final product of a chemical process'], answer: 0, explanation: 'Intermediates are generated during elementary steps and subsequently consumed before final product formation.' },
  { topic: 'Kinetics', q: 'Which statement accurately describes an activated complex (transition state)?', choices: ['Stable substance that can be isolated', 'High-energy, transient arrangement of atoms at the peak of the energy barrier', 'A substance that speeds up a reaction without being consumed', 'A long-lived intermediate'], answer: 1, explanation: 'The transition state is a short-lived peak energy configuration where bonds are breaking and forming.' },
  { topic: 'Kinetics', q: 'If doubling [A] quadruples the reaction rate, what is the order with respect to A?', choices: ['0', '1', '2', '3'], answer: 2, explanation: 'Rate ∝ [A]^n. 2^n = 4 → n = 2 (second-order).' },
  { topic: 'Kinetics', q: 'What are the units of the rate constant (k) for a zero-order reaction?', choices: ['M·s⁻¹', 's⁻¹', 'M⁻¹·s⁻¹', 'M⁻²·s⁻¹'], answer: 0, explanation: 'For zero-order, Rate = k, so k has the same units as rate: M/s or M·s⁻¹.' },
  { topic: 'Kinetics', q: 'What are the units of the rate constant (k) for a second-order reaction?', choices: ['s⁻¹', 'M·s⁻¹', 'M⁻¹·s⁻¹', 'M⁻²·s⁻¹'], answer: 2, explanation: 'Rate = k[A]² → k = Rate/[A]² = (M/s)/M² = M⁻¹·s⁻¹.' },
  { topic: 'Kinetics', q: 'For a zero-order reaction, what happens to the half-life as the initial reactant concentration increases?', choices: ['Increases', 'Decreases', 'Stays the same', 'Becomes zero'], answer: 0, explanation: 'For zero-order, t_1/2 = [A]₀ / (2k). Thus, half-life is directly proportional to initial concentration [A]₀.' },
  { topic: 'Kinetics', q: 'For a second-order reaction, what happens to the half-life as initial reactant concentration increases?', choices: ['Increases', 'Decreases', 'Stays the same', 'Doubles'], answer: 1, explanation: 'For second-order, t_1/2 = 1 / (k[A]₀). Higher initial concentration results in a shorter half-life.' },
  { topic: 'Kinetics', q: 'A first-order reaction has a rate constant k = 0.0693 min⁻¹. What is its half-life?', choices: ['5 min', '10 min', '15 min', '20 min'], answer: 1, explanation: 't_1/2 = 0.693 / k = 0.693 / 0.0693 min⁻¹ = 10 min.' },
  { topic: 'Kinetics', q: 'In an Arrhenius plot of ln(k) vs 1/T, what does the slope represent?', choices: ['−Ea / R', 'Ea / R', '−Ea', 'ln(A)'], answer: 0, explanation: 'ln(k) = (−Ea/R)(1/T) + ln(A). The slope of the line equals −Ea / R.' },
  { topic: 'Kinetics', q: 'How does adding a catalyst affect the reaction enthalpy change (ΔH)?', choices: ['Increases ΔH', 'Decreases ΔH', 'No effect on ΔH', 'Changes ΔH to zero'], answer: 2, explanation: 'A catalyst changes the kinetic pathway (lowering Ea) but has zero effect on initial/final state enthalpies (ΔH).' },
  { topic: 'Kinetics', q: 'What is the molecularity of an elementary step written as: A + B → C?', choices: ['Unimolecular', 'Bimolecular', 'Termolecular', 'Zero-order'], answer: 1, explanation: 'An elementary step involving two colliding reactant molecules is bimolecular.' },
  { topic: 'Kinetics', q: 'What is the molecularity of an elementary step written as: A → B + C?', choices: ['Unimolecular', 'Bimolecular', 'Termolecular', 'Zero-order'], answer: 0, explanation: 'An elementary step involving a single reactant molecule rearranging/breaking down is unimolecular.' },
  { topic: 'Kinetics', q: 'If a first-order reaction has a half-life of 20 minutes, what fraction of reactant remains after 60 minutes?', choices: ['1/2', '1/4', '1/8', '1/16'], answer: 2, explanation: '60 minutes = 3 half-lives (20 min × 3). Fraction remaining = (1/2)³ = 1/8.' },
  { topic: 'Kinetics', q: 'Which statement correctly differentiates a catalyst from a reaction intermediate?', choices: ['Catalyst is produced then consumed; intermediate is consumed then produced', 'Catalyst is consumed first then regenerated; intermediate is produced then consumed', 'Both are completely consumed in the overall reaction', 'Neither appears in any elementary step'], answer: 1, explanation: 'Catalysts enter early and are reformed in later steps; intermediates are created during early steps and consumed later.' },
  { topic: 'Kinetics', q: 'In the Arrhenius equation k = A·e^(−Ea/RT), what does the pre-exponential factor (A) represent?', choices: ['Frequency of collisions with correct orientation', 'Activation energy barrier', 'Ideal gas constant', 'Equilibrium constant'], answer: 0, explanation: 'A (the frequency factor) accounts for collision frequency and steric/orientation requirements.' },
  { topic: 'Kinetics', q: 'What is the order of an elementary step proportional to?', choices: ['Its stoichiometric coefficients', 'Experimental data only', 'Always zero-order', 'Enthalpy change'], answer: 0, explanation: 'For elementary steps only, rate laws can be written directly using stoichiometric coefficients as orders.' },
  { topic: 'Kinetics', q: 'Which factor does NOT affect the rate constant k of a reaction?', choices: ['Temperature', 'Presence of a catalyst', 'Initial concentration of reactants', 'Activation energy'], answer: 2, explanation: 'Changing initial concentration affects reaction rate, but NOT the intrinsic rate constant k.' },
  { topic: 'Kinetics', q: 'A reaction follows zero-order kinetics. If [A]₀ = 1.0 M and k = 0.05 M/s, what is [A] after 10 seconds?', choices: ['0.50 M', '0.05 M', '0.25 M', '0.75 M'], answer: 0, explanation: '[A]_t = [A]₀ - kt = 1.0 M - (0.05 M/s × 10 s) = 1.0 - 0.50 = 0.50 M.' },
  { topic: 'Kinetics', q: 'Increasing the surface area of a solid reactant increases reaction rate because:', choices: ['It lowers activation energy', 'It increases collision frequency between reactants', 'It increases temperature', 'It changes reaction order'], answer: 1, explanation: 'Exposing more surface area allows more reactant particles to collide per unit time.' },
  { topic: 'Kinetics', q: 'Which curve on a Maxwell-Boltzmann distribution shows a higher percentage of particles exceeding activation energy Ea?', choices: ['Lower temperature curve', 'Higher temperature curve', 'Both have identical percentages', 'Neither curve exceeds Ea'], answer: 1, explanation: 'At higher temperatures, the energy curve broadens to the right, increasing the fraction of molecules with E ≥ Ea.' },
  { topic: 'Kinetics', q: 'What is a heterogeneous catalyst?', choices: ['A catalyst in the same phase as reactants', 'A catalyst in a different phase from reactants', 'A catalyst that slows down reactions', 'An enzyme inside a cell'], answer: 1, explanation: 'Heterogeneous catalysts exist in a different phase (e.g., solid catalytic metal with gaseous reactants).' },
  { topic: 'Kinetics', q: 'Under what condition can a second-order reaction be treated as a pseudo-first-order reaction?', choices: ['When one reactant is present in large excess', 'When temperature is zero', 'When activation energy is zero', 'When product concentrations are zero'], answer: 0, explanation: 'If reactant B is in vast excess, [B] remains essentially constant, merging into k\' = k[B] for pseudo-first-order behavior.' },
  { topic: 'Kinetics', q: 'In Beer-Lambert law (A = εlc) used in kinetic spectrophotometry, what does ε represent?', choices: ['Absorbance', 'Path length', 'Molar absorptivity constant', 'Concentration'], answer: 2, explanation: 'ε is the molar absorptivity (extinction coefficient), dependent on solute and wavelength.' },
  { topic: 'Kinetics', q: 'If activation energy Ea for forward reaction is 50 kJ and ΔH = −20 kJ, what is Ea for the reverse reaction?', choices: ['30 kJ', '50 kJ', '70 kJ', '20 kJ'], answer: 2, explanation: 'Ea(reverse) = Ea(forward) - ΔH = 50 - (-20) = 70 kJ.' },
  { topic: 'Kinetics', q: 'For an endothermic reaction with Ea(forward) = 80 kJ and ΔH = +30 kJ, what is Ea for reverse reaction?', choices: ['50 kJ', '110 kJ', '80 kJ', '30 kJ'], answer: 0, explanation: 'Ea(reverse) = Ea(forward) - ΔH = 80 - 30 = 50 kJ.' },
  { topic: 'Kinetics', q: 'Which method measures reaction rate at time t = 0 immediately after mixing reactants?', choices: ['Integrated rate method', 'Method of initial rates', 'Half-life method', 'Equilibrium method'], answer: 1, explanation: 'The method of initial rates determines orders by measuring initial velocities before product interference occurs.' },
  { topic: 'Kinetics', q: 'Biological catalysts that accelerate biochemical reactions are called:', choices: ['Inhibitors', 'Substrates', 'Enzymes', 'Intermediates'], answer: 2, explanation: 'Enzymes are protein macromolecules functioning as biological catalysts.' },
  { topic: 'Kinetics', q: 'What happens to reaction rate when reactant concentration is increased in a zero-order reaction?', choices: ['Rate increases linearly', 'Rate quadruples', 'Rate remains unchanged', 'Rate drops to zero'], answer: 2, explanation: 'For zero-order, Rate = k[A]⁰ = k; changing reactant concentration has no effect on rate.' },
  { topic: 'Kinetics', q: 'What is the overall reaction order for Rate = k[A]⁰.⁵[B]¹.⁵?', choices: ['1st order', '2nd order', '3rd order', '0.5 order'], answer: 1, explanation: 'Sum of orders = 0.5 + 1.5 = 2.0 (second-order overall).' },
  { topic: 'Kinetics', q: 'What is the mathematical form of the integrated rate law for a zero-order reaction?', choices: ['[A]_t = -kt + [A]₀', 'ln[A]_t = -kt + ln[A]₀', '1/[A]_t = kt + 1/[A]₀', '[A]_t = [A]₀ e^(-kt)'], answer: 0, explanation: 'Zero-order integrated rate law is linear in [A]: [A]_t = -kt + [A]₀.' },
  { topic: 'Kinetics', q: 'A substance decomposes via first-order kinetics with k = 0.10 s⁻¹. How long does it take for concentration to drop to 25% of initial value?', choices: ['6.93 s', '13.86 s', '20.0 s', '3.47 s'], answer: 1, explanation: '25% remaining corresponds to 2 half-lives. t_1/2 = 0.693 / 0.10 = 6.93 s. Total time = 2 × 6.93 s = 13.86 s.' },
  { topic: 'Kinetics', q: 'Which model assumes gas-phase reactant molecules are rigid spheres that must collide with proper geometry and energy to react?', choices: ['Transition State Theory', 'Collision Theory', 'Crystal Field Theory', 'Valence Bond Theory'], answer: 1, explanation: 'Collision Theory models reaction rates based on collision frequency, energy, and orientation.' },
  { topic: 'Kinetics', q: 'Why do elementary termolecular steps rarely occur in chemical reaction mechanisms?', choices: ['Termolecular steps require too much activation energy', 'Simultaneous three-body collisions with proper orientation are extremely improbable', 'Termolecular steps violate conservation of mass', 'They only occur at absolute zero'], answer: 1, explanation: 'The probability of three molecules colliding simultaneously with correct orientation and sufficient energy is extremely low.' },
  { topic: 'Kinetics', q: 'What effect does a substance called a chemical inhibitor have on a reaction?', choices: ['Increases rate', 'Decreases rate or halts reaction', 'Lowers activation energy', 'Increases equilibrium constant'], answer: 1, explanation: 'Inhibitors decrease reaction rates by deactivating catalysts or tying up reactive intermediates.' },
  { topic: 'Kinetics', q: 'If temperature increases by 10°C, a general rule of thumb for many room-temperature reactions is that the rate roughly:', choices: ['Halves', 'Doubles', 'Quadruples', 'Remains unchanged'], answer: 1, explanation: 'A common kinetic rule of thumb is that rate approximately doubles for every 10°C rise in temperature.' },
  { topic: 'Kinetics', q: 'If a reaction rate is expressed as Rate = −d[A]/dt = d[B]/dt = (1/2)d[C]/dt, what is the balanced reaction equation?', choices: ['A → B + 2C', 'A + B → 2C', '2A → B + C', 'A → 2B + C'], answer: 0, explanation: 'Stoichiometric relations show 1 mole A lost gives 1 mole B and 2 moles C formed: A → B + 2C.' },
  { topic: 'Kinetics', q: 'Which statement is true regarding activation energy Ea?', choices: ['Ea is always negative', 'Higher Ea values lead to faster reaction rates', 'Higher Ea values lead to slower reaction rates', 'Ea changes with reactant concentration'], answer: 2, explanation: 'A higher energy barrier (Ea) means fewer molecules possess enough energy to react, slowing the rate.' },
  { topic: 'Kinetics', q: 'What is a homogeneous catalyst?', choices: ['A catalyst present in the same physical phase as reactants', 'A catalyst in a solid state mixed with liquid', 'A catalyst that changes into products', 'An insoluble mineral powder'], answer: 0, explanation: 'Homogeneous catalysts exist in the same phase (e.g., all liquid or all gas) as the reacting species.' },
  { topic: 'Kinetics', q: 'In an endothermic reaction, the energy of the activated complex is:', choices: ['Lower than reactants and products', 'Higher than both reactants and products', 'Equal to reactants', 'Equal to products'], answer: 1, explanation: 'The activated complex represents the peak potential energy along the reaction coordinate, higher than both reactants and products.' },
  { topic: 'Kinetics', q: 'If a first-order reaction is 75% complete in 40 minutes, what is its half-life?', choices: ['10 min', '20 min', '30 min', '40 min'], answer: 1, explanation: '75% complete leaves 25% remaining, which equals 2 half-lives. 2 × t_1/2 = 40 min → t_1/2 = 20 min.' },

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
{ topic: 'Equilibrium', q: 'When a chemical system reaches dynamic equilibrium, what is true about the forward and reverse reaction rates?', choices: ['Forward rate is greater than reverse rate', 'Reverse rate is greater than forward rate', 'Forward rate equals reverse rate', 'Both rates equal zero'], answer: 2, explanation: 'Dynamic equilibrium is reached when the rates of the forward and reverse reactions become equal.' },
  { topic: 'Equilibrium', q: 'What happens to reactant and product concentrations at chemical equilibrium?', choices: ['They continuously fluctuate', 'They remain constant over time', 'They become equal to each other', 'They drop to zero'], answer: 1, explanation: 'Because forward and reverse reaction rates are equal, concentrations remain constant.' },
  { topic: 'Equilibrium', q: 'Write the equilibrium constant expression (K_c) for: N₂(g) + 3H₂(g) ⇌ 2NH₃(g).', choices: ['K_c = [NH₃]² / ([N₂][H₂]³)', 'K_c = ([N₂][H₂]³) / [NH₃]²', 'K_c = [NH₃] / ([N₂][H₂])', 'K_c = 2[NH₃] / ([N₂] + 3[H₂])'], answer: 0, explanation: 'K_c is products raised to their coefficients divided by reactants raised to their coefficients: [NH₃]² / ([N₂][H₂]³).' },
  { topic: 'Equilibrium', q: 'Which phase(s) are omitted from equilibrium constant expressions?', choices: ['Gases and aqueous solutions', 'Pure solids and pure liquids', 'Aqueous solutions only', 'Gases only'], answer: 1, explanation: 'Pure solids (s) and pure liquids (l) have constant concentrations and are excluded from K expressions.' },
  { topic: 'Equilibrium', q: 'If K_c >> 1 for a reaction at equilibrium, what does this indicate?', choices: ['Reactants predominate at equilibrium', 'Products predominate at equilibrium', 'Equilibrium favors neither side', 'The reaction proceeds very slowly'], answer: 1, explanation: 'A large K value (K >> 1) indicates that products are favored heavily at equilibrium.' },
  { topic: 'Equilibrium', q: 'If K_c << 1 for a reaction, what does this indicate?', choices: ['Products predominate at equilibrium', 'Reactants predominate at equilibrium', 'Reaction goes to completion', 'Reaction rate is zero'], answer: 1, explanation: 'A small K value (K << 1) indicates that reactants are favored heavily at equilibrium.' },
  { topic: 'Equilibrium', q: 'According to Le Chatelier\'s principle, adding more reactant to a system at equilibrium will shift equilibrium:', choices: ['To the left (towards reactants)', 'To the right (towards products)', 'No shift occurs', 'To decrease temperature'], answer: 1, explanation: 'Adding reactant relieves stress by consuming the added species, shifting the position right toward products.' },
  { topic: 'Equilibrium', q: 'For an endothermic reaction (ΔH > 0), what happens to K_c when temperature increases?', choices: ['K_c increases', 'K_c decreases', 'K_c remains constant', 'K_c drops to zero'], answer: 0, explanation: 'Heat acts like a reactant in endothermic processes. Increasing T shifts equilibrium right, increasing product/reactant ratio (K_c).' },
  { topic: 'Equilibrium', q: 'For an exothermic reaction (ΔH < 0), what happens to K_c when temperature increases?', choices: ['K_c increases', 'K_c decreases', 'K_c remains unchanged', 'K_c doubles'], answer: 1, explanation: 'Heat acts like a product in exothermic processes. Raising T shifts equilibrium left, reducing K_c.' },
  { topic: 'Equilibrium', q: 'What is the relationship between K_p and K_c for gas-phase reactions?', choices: ['K_p = K_c (RT)^Δn', 'K_p = K_c / (RT)^Δn', 'K_p = K_c + RTΔn', 'K_p = K_c × R / T'], answer: 0, explanation: 'K_p = K_c(RT)^Δn, where Δn = (moles gaseous products) − (moles gaseous reactants).' },
  { topic: 'Equilibrium', q: 'In the equation K_p = K_c (RT)^Δn, under what condition does K_p equal K_c?', choices: ['When Δn = 1', 'When Δn = 0', 'When T = 0 K', 'When P = 1 atm'], answer: 1, explanation: 'When Δn = 0 (equal moles of gas on both sides), (RT)⁰ = 1, so K_p = K_c.' },
  { topic: 'Equilibrium', q: 'What happens to a gas-phase equilibrium if volume is DECREASED (pressure increased)?', choices: ['Shifts toward the side with MORE gas moles', 'Shifts toward the side with FEWER gas moles', 'No shift occurs regardless of gas moles', 'Temperature drops instantly'], answer: 1, explanation: 'Decreasing volume increases total pressure; equilibrium shifts toward fewer gas moles to relieve pressure.' },
  { topic: 'Equilibrium', q: 'If the reaction A ⇌ B has K_c = 4, what is K_c for the reverse reaction B ⇌ A?', choices: ['-4', '0.25', '2', '16'], answer: 1, explanation: 'Reversing a chemical reaction inverts its equilibrium constant: K_rev = 1 / K_fwd = 1 / 4 = 0.25.' },
  { topic: 'Equilibrium', q: 'If a reaction is multiplied by a coefficient of 2 (2A ⇌ 2B), its new equilibrium constant K\' is:', choices: ['2 × K', 'K / 2', 'K²', '√K'], answer: 2, explanation: 'Multiplying a reaction equation by a constant factor n raises K to the nth power: K\' = Kⁿ.' },
  { topic: 'Equilibrium', q: 'How does adding a catalyst affect a reaction at chemical equilibrium?', choices: ['Shifts equilibrium toward products', 'Shifts equilibrium toward reactants', 'Increases the value of K_c', 'Increases reaction rates equally, leaving equilibrium position unchanged'], answer: 3, explanation: 'A catalyst speeds up forward and reverse reactions equally without altering equilibrium concentrations or K.' },
  { topic: 'Equilibrium', q: 'What is the reaction quotient Q used for?', choices: ['Measuring enthalpy changes', 'Determining direction a non-equilibrium mixture will shift to reach equilibrium', 'Calculating reaction order', 'Determining activation energy'], answer: 1, explanation: 'Q evaluates current concentration ratios to predict which way a system shifts relative to K.' },
  { topic: 'Equilibrium', q: 'If Q < K, in which direction will the reaction proceed to achieve equilibrium?', choices: ['To the left (toward reactants)', 'To the right (toward products)', 'System is already at equilibrium', 'No reaction can occur'], answer: 1, explanation: 'If Q < K, product concentrations are too low relative to reactants, so the reaction shifts right.' },
  { topic: 'Equilibrium', q: 'If Q > K, in which direction will the reaction shift to achieve equilibrium?', choices: ['To the left (toward reactants)', 'To the right (toward products)', 'System is at equilibrium', 'Reaction stops'], answer: 0, explanation: 'If Q > K, product concentrations are too high relative to reactants, so the system shifts left.' },
  { topic: 'Equilibrium', q: 'When Q = K, what is the status of the reaction system?', choices: ['Reaction is proceeding rapidly to the right', 'Reaction is proceeding rapidly to the left', 'System is at chemical equilibrium', 'Reaction has gone to completion'], answer: 2, explanation: 'When Q equals K, forward and reverse rates are equal and the system is in dynamic equilibrium.' },
  { topic: 'Equilibrium', q: 'For the reaction CaCO₃(s) ⇌ CaO(s) + CO₂(g), what is the correct expression for K_c?', choices: ['K_c = [CaO][CO₂] / [CaCO₃]', 'K_c = [CO₂]', 'K_c = [CaO] / [CaCO₃]', 'K_c = 1 / [CO₂]'], answer: 1, explanation: 'CaCO₃ and CaO are pure solids, so their activities equal 1. Thus, K_c = [CO₂].' },
  { topic: 'Equilibrium', q: 'In the Haber process N₂(g) + 3H₂(g) ⇌ 2NH₃(g) (exothermic), how can NH₃ yield be maximized?', choices: ['High temperature and low pressure', 'Low temperature and high pressure', 'High temperature and high pressure', 'Low temperature and low pressure'], answer: 1, explanation: 'Exothermic (favors lower T) and goes from 4 mol gas to 2 mol gas (favors high P).' },
  { topic: 'Equilibrium', q: 'What effect does adding an inert gas (like Argon) at constant volume have on equilibrium?', choices: ['Shifts toward products', 'Shifts toward reactants', 'No effect on equilibrium position', 'Doubles K_c'], answer: 2, explanation: 'Adding inert gas at constant volume increases total pressure but does not alter partial pressures of reactants/products.' },
  { topic: 'Equilibrium', q: 'If reaction 1 has K₁ and reaction 2 has K₂, what is K₃ for the combined reaction (reaction 1 + reaction 2)?', choices: ['K₃ = K₁ + K₂', 'K₃ = K₁ × K₂', 'K₃ = K₁ / K₂', 'K₃ = K₁ − K₂'], answer: 1, explanation: 'When adding chemical equations together, their equilibrium constants are multiplied.' },
  { topic: 'Equilibrium', q: 'For N₂O₄(g) ⇌ 2NO₂(g), Δn for gaseous species equals:', choices: ['0', '1', '2', '−1'], answer: 1, explanation: 'Δn = moles gaseous products − moles gaseous reactants = 2 − 1 = 1.' },
  { topic: 'Equilibrium', q: 'For 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), if volume is doubled, how will the system respond?', choices: ['Shift right to form more SO₃', 'Shift left to form more SO₂ and O₂', 'No shift', 'K_c will increase'], answer: 1, explanation: 'Doubling volume lowers pressure; system shifts toward side with more gas moles (3 mol left vs 2 mol right).' },
  { topic: 'Equilibrium', q: 'What is the standard Gibbs free energy change ΔG° when K = 1?', choices: ['Positive', 'Negative', 'Zero', 'Infinite'], answer: 2, explanation: 'ΔG° = −RT ln K. Since ln(1) = 0, ΔG° = 0.' },
  { topic: 'Equilibrium', q: 'In an ICE table used for equilibrium calculations, what does ICE stand for?', choices: ['Initial, Concentration, Equilibrium', 'Initial, Change, Equilibrium', 'Internal, Constant, Energy', 'Integrated, Chemical, Equation'], answer: 1, explanation: 'ICE tables track Initial concentration, Change during reaction, and Equilibrium concentration.' },
  { topic: 'Equilibrium', q: 'Which statement is true about homogeneous equilibria?', choices: ['Reactants and products exist in multiple physical phases', 'Reactants and products all exist in a single physical phase', 'Solids are always present', 'Equilibrium cannot be reached'], answer: 1, explanation: 'A homogeneous equilibrium involves reactants and products all in one single phase (e.g., all gas or all liquid).' },
  { topic: 'Equilibrium', q: 'Which statement is true about heterogeneous equilibria?', choices: ['All species are gases', 'Reactants and products are in more than one physical phase', 'K_c cannot be written', 'No solids or liquids are present'], answer: 1, explanation: 'Heterogeneous equilibria involve species in different phases (e.g., solid and gas).' },
  { topic: 'Equilibrium', q: 'For H₂(g) + I₂(g) ⇌ 2HI(g), what is the relationship between K_p and K_c?', choices: ['K_p = K_c(RT)', 'K_p = K_c', 'K_p = K_c / (RT)', 'K_p = K_c(RT)²'], answer: 1, explanation: 'Δn = 2 − (1 + 1) = 0. Therefore, K_p = K_c(RT)⁰ = K_c.' },
  { topic: 'Equilibrium', q: 'What happens to the concentration of a pure solid reactant if more solid is added to an equilibrium mixture?', choices: ['Concentration increases', 'Concentration decreases', 'Effective concentration remains constant', 'Solid completely dissolves'], answer: 2, explanation: 'The effective concentration/activity of a pure solid is constant regardless of quantity.' },
  { topic: 'Equilibrium', q: 'When calculating equilibrium concentrations, when is the approximation x ≈ 0 valid?', choices: ['When K is very large (> 10³)', 'When K is very small (< 10⁻⁴) and initial concentration is reasonably large', 'Always', 'Never'], answer: 1, explanation: 'When K is tiny, reaction extent x is minimal compared to initial concentration, making [A]₀ - x ≈ [A]₀.' },
  { topic: 'Equilibrium', q: 'In the endothermic reaction N₂O₄(g) (colorless) ⇌ 2NO₂(g) (brown), cooling the container will:', choices: ['Turn the mixture darker brown', 'Turn the mixture lighter/colorless', 'Have no effect on color', 'Precipitate solid nitrogen'], answer: 1, explanation: 'Cooling shifts endothermic equilibrium left toward N₂O₄, reducing brown NO₂ gas.' },
  { topic: 'Equilibrium', q: 'What units are traditionally used for partial pressures when evaluating K_p in standard atmospheric units?', choices: ['Pascal', 'Atmospheres (atm) or Bar', 'Torr only', 'PSI'], answer: 1, explanation: 'Standard state partial pressures in K_p calculations use atmospheres (atm) or bar.' },
  { topic: 'Equilibrium', q: 'For A(g) + B(g) ⇌ C(g), if initial pressures are P_A = 1 atm, P_B = 1 atm, P_C = 0, and at equilibrium P_C = 0.4 atm, what is K_p?', choices: ['0.40', '1.11', '0.25', '2.50'], answer: 1, explanation: 'P_A = 1 - 0.4 = 0.6; P_B = 1 - 0.4 = 0.6; P_C = 0.4. K_p = 0.4 / (0.6 × 0.6) = 0.4 / 0.36 = 1.11.' },
  { topic: 'Equilibrium', q: 'If ΔG° for a reaction is negative, what can be said about K?', choices: ['K < 1', 'K = 0', 'K > 1', 'K = -1'], answer: 2, explanation: 'ΔG° = −RT ln K. Negative ΔG° means ln K > 0, so K > 1.' },
  { topic: 'Equilibrium', q: 'Removing a product continuously from a reacting equilibrium system will cause:', choices: ['Reaction to stop', 'Reaction to continuously produce more product', 'Equilibrium constant to decrease', 'Reverse reaction to accelerate'], answer: 1, explanation: 'According to Le Chatelier\'s principle, removing product continually drives forward reaction toward completion.' },
  { topic: 'Equilibrium', q: 'Which factor is the ONLY one capable of changing the numerical value of the equilibrium constant K?', choices: ['Pressure', 'Volume', 'Concentration', 'Temperature'], answer: 3, explanation: 'Only temperature changes the numerical value of the equilibrium constant K.' },
  { topic: 'Equilibrium', q: 'If K = 10⁵ for a reaction, the reaction can be described as:', choices: ['Barely proceeding', 'Proceeding nearly to completion', 'Non-spontaneous', 'Slower than reverse reaction'], answer: 1, explanation: 'A large K value means products dominate overwhelmingly at equilibrium.' },
  { topic: 'Equilibrium', q: 'For 2A(g) ⇌ B(g) + C(g), initial [A] = 1.0 M. At equilibrium, [B] = 0.2 M. What is K_c?', choices: ['0.11', '0.20', '0.04', '0.44'], answer: 0, explanation: 'If [B] = 0.2 M, then [C] = 0.2 M and [A] decreased by 2(0.2) = 0.4 M to 0.6 M. K_c = (0.2 × 0.2) / (0.6)² = 0.04 / 0.36 = 0.11.' },
  { topic: 'Equilibrium', q: 'In a saturated solution with undissolved solute, what type of equilibrium exists?', choices: ['Thermal equilibrium', 'Solubility equilibrium', 'Phase transition equilibrium', 'Nuclear equilibrium'], answer: 1, explanation: 'Saturated solutions with solid excess exhibit dynamic solubility equilibrium between dissolved and solid states.' },
  { topic: 'Equilibrium', q: 'How does increasing container volume affect the equilibrium: C(s) + CO₂(g) ⇌ 2CO(g)?', choices: ['Shifts left', 'Shifts right', 'No effect', 'K_c increases'], answer: 1, explanation: 'Increasing volume lowers total pressure. Equilibrium shifts right toward 2 moles gas vs 1 mole gas.' },
  { topic: 'Equilibrium', q: 'If the equilibrium reaction 2NO(g) + O₂(g) ⇌ 2NO₂(g) is written as NO(g) + 0.5O₂(g) ⇌ NO₂(g), its new constant K\' is:', choices: ['K / 2', '√K', 'K²', '2K'], answer: 1, explanation: 'Halving reaction coefficients results in K\' = K^(1/2) = √K.' },
  { topic: 'Equilibrium', q: 'What happens to Q during a reaction that starts with pure reactants and proceeds toward products?', choices: ['Q increases from 0 toward K', 'Q decreases from infinity toward K', 'Q remains constant', 'Q becomes negative'], answer: 0, explanation: 'Initially Q = 0 (no products). As products form and reactants drop, Q increases until reaching K.' },
  { topic: 'Equilibrium', q: 'In an exothermic equilibrium reaction, decreasing temperature shifts equilibrium:', choices: ['Right toward products', 'Left toward reactants', 'Does not shift', 'Stops reaction'], answer: 0, explanation: 'Exothermic reactions release heat (product). Removing heat (lowering T) drives equilibrium right to replace heat.' },
  { topic: 'Equilibrium', q: 'If a reaction is non-spontaneous under standard conditions (ΔG° > 0), what is true about K?', choices: ['K > 1', 'K < 1', 'K = 1', 'K = 0'], answer: 1, explanation: 'ΔG° > 0 implies ln K < 0, meaning K < 1 (reactants favored).' },
  { topic: 'Equilibrium', q: 'Which expression relates standard cell potential E°_cell to equilibrium constant K?', choices: ['E°_cell = (RT / nF) ln K', 'E°_cell = −nFE°', 'E°_cell = RT ln K', 'E°_cell = nF / (RT ln K)'], answer: 0, explanation: 'At equilibrium ΔG° = −nFE°_cell = −RT ln K → E°_cell = (RT / nF) ln K.' },
  { topic: 'Equilibrium', q: 'What is the impact of adding a liquid solvent (dilution) on an aqueous equilibrium with more product ions than reactant ions?', choices: ['Shifts toward side with more dissolved species', 'Shifts toward side with fewer dissolved species', 'No shift', 'Temperature increases'], answer: 0, explanation: 'Dilution lowers concentrations; equilibrium shifts toward the side producing more dissolved species to compensate.' },
  { topic: 'Equilibrium', q: 'If K_c = 4.0 for A ⇌ B, and a container has [A] = 0.5 M and [B] = 1.0 M, what is Q and which way will it shift?', choices: ['Q = 2.0; shifts right', 'Q = 2.0; shifts left', 'Q = 0.5; shifts right', 'Q = 4.0; at equilibrium'], answer: 0, explanation: 'Q = [B]/[A] = 1.0 / 0.5 = 2.0. Since Q (2.0) < K (4.0), system shifts right toward products.' },
  { topic: 'Equilibrium', q: 'In the Van \'t Hoff equation, a plot of ln(K) vs 1/T yields a slope of:', choices: ['−ΔH° / R', 'ΔH° / R', '−ΔS° / R', 'ΔG° / RT'], answer: 0, explanation: 'Van \'t Hoff equation: ln(K) = (−ΔH°/R)(1/T) + (ΔS°/R). Slope equals −ΔH° / R.' },

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
{ topic: 'Electrochemistry', q: 'In an electrochemical cell, where does oxidation ALWAYS occur?', choices: ['Anode', 'Cathode', 'Salt bridge', 'External wire'], answer: 0, explanation: 'Oxidation (loss of electrons) always occurs at the anode in both galvanic and electrolytic cells.' },
  { topic: 'Electrochemistry', q: 'In an electrochemical cell, where does reduction ALWAYS occur?', choices: ['Anode', 'Cathode', 'Salt bridge', 'Voltmeter'], answer: 1, explanation: 'Reduction (gain of electrons) always occurs at the cathode in both galvanic and electrolytic cells.' },
  { topic: 'Electrochemistry', q: 'What is the primary function of a salt bridge in a galvanic cell?', choices: ['To transfer electrons between half-cells', 'To maintain electrical neutrality by permitting ion migration', 'To increase the standard cell potential', 'To provide a source of metallic ions'], answer: 1, explanation: 'The salt bridge allows ions to flow between half-cells to prevent charge buildup and complete the circuit.' },
  { topic: 'Electrochemistry', q: 'In a standard galvanic (voltaic) cell, electrons flow through the external wire from:', choices: ['Cathode to Anode', 'Anode to Cathode', 'Salt bridge to Cathode', 'Cathode to Salt bridge'], answer: 1, explanation: 'Electrons are released by oxidation at the anode and travel through the external circuit to the cathode.' },
  { topic: 'Electrochemistry', q: 'Which equation correctly calculates the standard cell potential (E°_cell)?', choices: ['E°_cell = E°_cathode − E°_anode', 'E°_cell = E°_anode − E°_cathode', 'E°_cell = E°_cathode + E°_anode', 'E°_cell = E°_cathode × E°_anode'], answer: 0, explanation: 'E°_cell is calculated using reduction potentials: E°_cell = E°_cathode(red) − E°_anode(red).' },
  { topic: 'Electrochemistry', q: 'A positive standard cell potential (E°_cell > 0) indicates that the cell reaction is:', choices: ['Spontaneous under standard conditions', 'Non-spontaneous under standard conditions', 'At equilibrium', 'Endothermic'], answer: 0, explanation: 'A positive E°_cell corresponds to a negative ΔG° (ΔG° = −nFE°_cell), indicating spontaneity.' },
  { topic: 'Electrochemistry', q: 'What is the standard reduction potential defined for the Standard Hydrogen Electrode (SHE)?', choices: ['1.00 V', '0.00 V', '−0.76 V', '+0.34 V'], answer: 1, explanation: 'By international convention, the SHE (2H⁺ + 2e⁻ ⇌ H₂) is assigned a standard reduction potential of 0.00 V.' },
  { topic: 'Electrochemistry', q: 'Which equation relates ΔG° to the standard cell potential E°_cell?', choices: ['ΔG° = −nFE°_cell', 'ΔG° = nFE°_cell', 'ΔG° = −RT ln(E°_cell)', 'ΔG° = −nF / E°_cell'], answer: 0, explanation: 'ΔG° = −nFE°_cell, where n is moles of electrons transferred and F is Faraday\'s constant.' },
  { topic: 'Electrochemistry', q: 'What is the value of Faraday\'s constant (F)?', choices: ['8.314 J/(mol·K)', '96,485 C/mol e⁻', '0.0821 L·atm/(mol·K)', '6.022 × 10²³ e⁻'], answer: 1, explanation: 'Faraday\'s constant (F) represents the charge of 1 mole of electrons, approximately 96,485 C/mol e⁻.' },
  { topic: 'Electrochemistry', q: 'Which equation is used to calculate cell potential under non-standard concentration conditions?', choices: ['Arrhenius equation', 'Nernst equation', 'Henderson-Hasselbalch equation', 'Van \'t Hoff equation'], answer: 1, explanation: 'The Nernst equation (E = E° − (RT/nF) ln Q) calculates cell potentials under non-standard conditions.' },
  { topic: 'Electrochemistry', q: 'At 298 K, what is the simplified form of the Nernst equation in base-10 log?', choices: ['E = E° − (0.0592 / n) log Q', 'E = E° + (0.0592 / n) log Q', 'E = E° − (8.314 / n) log Q', 'E = E° − (0.0257 / n) log Q'], answer: 0, explanation: 'At 298 K, (RT/F) × ln(10) ≈ 0.0592 V, yielding E = E° − (0.0592 / n) log Q.' },
  { topic: 'Electrochemistry', q: 'What is the cell potential (E) when a galvanic cell reaches chemical equilibrium?', choices: ['E = E°', 'E = 0.00 V', 'E > 0.00 V', 'E = 1.00 V'], answer: 1, explanation: 'At equilibrium, no net electron transfer occurs, so battery output voltage drops to zero (E = 0.00 V).' },
  { topic: 'Electrochemistry', q: 'How is the equilibrium constant K related to standard cell potential E° at 298 K?', choices: ['log K = nE° / 0.0592', 'log K = 0.0592 / (nE°)', 'ln K = −nFE°', 'K = nFE° / RT'], answer: 0, explanation: 'At equilibrium E = 0 and Q = K. From Nernst: 0 = E° − (0.0592/n) log K → log K = nE° / 0.0592.' },
  { topic: 'Electrochemistry', q: 'In an electrolytic cell, electrical energy is used to drive a reaction that is:', choices: ['Spontaneous (ΔG < 0)', 'Non-spontaneous (ΔG > 0)', 'At equilibrium (ΔG = 0)', 'Exothermic with negative E°'], answer: 1, explanation: 'Electrolysis uses external electrical work to drive a thermodynamically non-spontaneous reaction.' },
  { topic: 'Electrochemistry', q: 'What is the sign of the anode in a GALVANIC cell versus an ELECTROLYTIC cell?', choices: ['Negative in galvanic, Positive in electrolytic', 'Positive in galvanic, Negative in electrolytic', 'Positive in both', 'Negative in both'], answer: 0, explanation: 'In galvanic cells, the anode releases electrons (negative). In electrolytic cells, the anode is attached to the positive terminal of the power supply.' },
  { topic: 'Electrochemistry', q: 'According to Faraday\'s Law of Electrolysis, the mass of substance deposited at an electrode is proportional to:', choices: ['Total electric charge passed (Q = I × t)', 'Volume of the container', 'Temperature only', 'Resistance of external wire'], answer: 0, explanation: 'Mass deposited m = (I × t × MW) / (n × F), which is directly proportional to total electric charge Q = I × t.' },
  { topic: 'Electrochemistry', q: 'How many coulombs of charge are delivered by a current of 2.0 A running for 10 minutes?', choices: ['20 C', '1200 C', '200 C', '120 C'], answer: 1, explanation: 'Q = I × t = 2.0 A × (10 min × 60 s/min) = 2.0 × 600 = 1200 C.' },
  { topic: 'Electrochemistry', q: 'How many moles of electrons are required to electroplate 1 mole of Cu from Cu²⁺(aq)?', choices: ['1 mol', '2 mol', '3 mol', '0.5 mol'], answer: 1, explanation: 'Cu²⁺ + 2e⁻ → Cu(s) requires 2 moles of electrons per 1 mole of copper metal produced.' },
  { topic: 'Electrochemistry', q: 'Which metal is used as a sacrificial anode to prevent iron corrosion (cathodic protection)?', choices: ['Copper (Cu)', 'Gold (Au)', 'Zinc (Zn)', 'Silver (Ag)'], answer: 2, explanation: 'Zinc is more easily oxidized than iron (more negative E°_red), so it corrodes preferentially as a sacrificial anode.' },
  { topic: 'Electrochemistry', q: 'In a concentration cell, two half-cells have identical electrodes and ions but differ in:', choices: ['Temperature', 'Solvent type', 'Ion concentration', 'Electrode length'], answer: 2, explanation: 'Concentration cells derive potential solely from a concentration gradient between half-cell compartments.' },
  { topic: 'Electrochemistry', q: 'In a concentration cell, electron flow occurs from:', choices: ['More concentrated compartment to less concentrated', 'Less concentrated compartment to more concentrated', 'Anode with higher concentration to cathode with lower concentration', 'Equilibrium state directly'], answer: 1, explanation: 'Oxidation occurs in the dilute cell (lower [ion]) to increase [ion]; reduction occurs in the concentrated cell. Electrons flow dilute → concentrated.' },
  { topic: 'Electrochemistry', q: 'Given standard reduction potentials: Zn²⁺/Zn = −0.76 V and Cu²⁺/Cu = +0.34 V, what is E°_cell for a standard Zn-Cu galvanic cell?', choices: ['+1.10 V', '−1.10 V', '+0.42 V', '−0.42 V'], answer: 0, explanation: 'Zn is anode (oxidized), Cu is cathode (reduced). E°_cell = 0.34 − (−0.76) = +1.10 V.' },
  { topic: 'Electrochemistry', q: 'Which species is the STRONGEST oxidizing agent among those listed?', choices: ['F₂ (E°_red = +2.87 V)', 'Li⁺ (E°_red = −3.04 V)', 'Cu²⁺ (E°_red = +0.34 V)', 'H⁺ (E°_red = 0.00 V)'], answer: 0, explanation: 'Species with the highest positive reduction potential (F₂) has the strongest tendency to accept electrons and act as an oxidizing agent.' },
  { topic: 'Electrochemistry', q: 'Which species is the STRONGEST reducing agent among those listed?', choices: ['Li(s) (E°_red of Li⁺ = −3.04 V)', 'F⁻ (E°_red of F₂ = +2.87 V)', 'Na⁺', 'Au(s)'], answer: 0, explanation: 'The element whose ion has the most negative reduction potential (Li⁺/Li) is most easily oxidized and serves as the strongest reducing agent.' },
  { topic: 'Electrochemistry', q: 'What process takes place during the recharging of a secondary (rechargeable) battery?', choices: ['Galvanic spontaneous discharge', 'Electrolytic non-spontaneous conversion using an external power source', 'Nuclear decay', 'Thermal decomposition'], answer: 1, explanation: 'Recharging runs an electrolytic process using external voltage to force electrons in reverse, regenerating chemical reactants.' },
  { topic: 'Electrochemistry', q: 'What type of battery is a non-rechargeable alkaline battery?', choices: ['Primary cell', 'Secondary cell', 'Fuel cell', 'Concentration cell'], answer: 0, explanation: 'Primary cells use irreversible electrochemical reactions and cannot be recharged efficiently or safely.' },
  { topic: 'Electrochemistry', q: 'What unique feature distinguishes a fuel cell from a standard primary or secondary battery?', choices: ['It requires no catalyst', 'Reactants are continuously supplied from an external source', 'It operates with zero cell potential', 'It uses liquid mercury as an electrode'], answer: 1, explanation: 'Fuel cells convert chemical energy to electrical energy continuously as long as fuel (like H₂) and oxidant (like O₂) are supplied.' },
  { topic: 'Electrochemistry', q: 'What is overpotential (overvoltage) in electrolysis?', choices: ['The extra voltage above thermodynamic expectation required to overcome slow electrode kinetics', 'The voltage produced at equilibrium', 'The theoretical cell voltage under standard conditions', 'Voltage loss due to salt bridge resistance'], answer: 0, explanation: 'Overpotential is additional voltage beyond E°_cell needed to drive electrochemically sluggish half-reactions (like gas evolution).' },
  { topic: 'Electrochemistry', q: 'In the electrolysis of aqueous NaCl (chlor-alkali process), what products are formed at the electrodes?', choices: ['Na(s) at cathode and Cl₂(g) at anode', 'H₂(g) at cathode and Cl₂(g) at anode', 'H₂(g) at cathode and O₂(g) at anode', 'Na(s) at cathode and O₂(g) at anode'], answer: 1, explanation: 'In aqueous NaCl, water is easier to reduce than Na⁺ (producing H₂ at cathode), and Cl⁻ is oxidized at anode (producing Cl₂).' },
  { topic: 'Electrochemistry', q: 'In the electrolysis of MOLTEN NaCl, what products form at the cathode and anode?', choices: ['Na(l) at cathode and Cl₂(g) at anode', 'H₂(g) at cathode and O₂(g) at anode', 'Na⁺ at anode and Cl⁻ at cathode', 'NaOH at cathode and HCl at anode'], answer: 0, explanation: 'With no water present, liquid Na⁺ ions are reduced at the cathode to Na(l), and Cl⁻ ions are oxidized at the anode to Cl₂(g).' },
  { topic: 'Electrochemistry', q: 'During the corrosion of iron (rusting), what acts as the cathode half-reaction in moist air?', choices: ['Reduction of O₂ to H₂O (or OH⁻)', 'Oxidation of Fe to Fe²⁺', 'Reduction of Fe³⁺ to Fe(s)', 'Oxidation of H₂O to O₂'], answer: 0, explanation: 'Dissolved oxygen in water droplets undergoes reduction: O₂ + 4H⁺ + 4e⁻ → 2H₂O, while iron oxidizes at the anode.' },
  { topic: 'Electrochemistry', q: 'What happens to the cell potential E of a galvanic cell as the reaction proceeds and approaches equilibrium?', choices: ['E increases continuously', 'E remains constant at E°', 'E decreases towards 0 V', 'E flips its sign'], answer: 2, explanation: 'As reactants convert to products, Q increases, causing E to decrease according to Nernst equation until E = 0.' },
  { topic: 'Electrochemistry', q: 'If the reaction quotient Q > 1 for a galvanic cell, how does the actual potential E compare to E°?', choices: ['E > E°', 'E < E°', 'E = E°', 'E = 0'], answer: 1, explanation: 'By Nernst equation E = E° − (0.0592/n) log Q: if Q > 1, log Q > 0, making E smaller than E°.' },
  { topic: 'Electrochemistry', q: 'If the reaction quotient Q < 1 for a galvanic cell, how does E compare to E°?', choices: ['E > E°', 'E < E°', 'E = E°', 'E = 0'], answer: 0, explanation: 'If Q < 1, log Q < 0, making the subtractive term positive; therefore E > E°.' },
  { topic: 'Electrochemistry', q: 'What current is required to deposit 108 g of Ag (MW = 108 g/mol) from Ag⁺ solution in 96,485 seconds?', choices: ['1.0 A', '2.0 A', '0.5 A', '96.5 A'], answer: 0, explanation: '108 g Ag = 1 mol Ag = 1 mol e⁻ = 96,485 C. I = Q / t = 96,485 C / 96,485 s = 1.0 A.' },
  { topic: 'Electrochemistry', q: 'In line notation for a galvanic cell: Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s), what does the double vertical line (||) represent?', choices: ['Phase boundary', 'Salt bridge', 'External copper wire', 'Platinum electrode'], answer: 1, explanation: 'Single vertical lines (|) represent phase boundaries; double vertical lines (||) represent the salt bridge.' },
  { topic: 'Electrochemistry', q: 'In line cell notation, which electrode is conventionally written on the far LEFT side?', choices: ['Cathode', 'Anode', 'Salt bridge', 'Standard hydrogen electrode'], answer: 1, explanation: 'Cell notation proceeds from left to right: Anode (oxidation) || Cathode (reduction).' },
  { topic: 'Electrochemistry', q: 'Which inert conductor material is commonly used when a half-reaction involves only gases or dissolved ions?', choices: ['Copper (Cu)', 'Platinum (Pt) or Graphite (C)', 'Sodium (Na)', 'Zinc (Zn)'], answer: 1, explanation: 'Inert electrodes like Platinum or Graphite conduct electrons without taking part in chemical reaction changes.' },
  { topic: 'Electrochemistry', q: 'What is the oxidation state of chromium in the dichromate ion (Cr₂O₇²⁻)?', choices: ['+3', '+6', '+7', '+12'], answer: 1, explanation: '2(Cr) + 7(−2) = −2 → 2(Cr) − 14 = −2 → 2(Cr) = +12 → Cr = +6.' },
  { topic: 'Electrochemistry', q: 'What is the oxidation state of manganese in permanganate (MnO₄⁻)?', choices: ['+2', '+4', '+7', '+5'], answer: 2, explanation: 'Mn + 4(−2) = −1 → Mn − 8 = −1 → Mn = +7.' },
  { topic: 'Electrochemistry', q: 'In balancing redox reactions in acidic solution, what species is added to balance oxygen atoms?', choices: ['OH⁻', 'H₂O', 'H₂', 'O₂'], answer: 1, explanation: 'Water molecules (H₂O) are added to balance excess or deficit of oxygen atoms.' },
  { topic: 'Electrochemistry', q: 'In balancing redox reactions in acidic solution, what species is added to balance hydrogen atoms?', choices: ['H⁺ ions', 'H₂ gas', 'OH⁻ ions', 'H₂O'], answer: 0, explanation: 'Hydrogen ions (H⁺) are added to balance hydrogen atoms in acidic media.' },
  { topic: 'Electrochemistry', q: 'How do you convert a redox reaction balanced in acidic solution into a basic solution context?', choices: ['Add OH⁻ to both sides to neutralize all H⁺ into H₂O', 'Remove all water molecules', 'Multiply all coefficients by 2', 'Subtract e⁻ from cathode'], answer: 0, explanation: 'Adding equal amounts of OH⁻ to both sides converts H⁺ into H₂O without changing overall chemical balance.' },
  { topic: 'Electrochemistry', q: 'What reaction occurs at the lead dioxide (PbO₂) cathode during discharge of a lead-acid car battery?', choices: ['PbO₂ + HSO₄⁻ + 3H⁺ + 2e⁻ → PbSO₄ + 2H₂O', 'Pb + HSO₄⁻ → PbSO₄ + H⁺ + 2e⁻', '2H₂O → O₂ + 4H⁺ + 4e⁻', 'Pb²⁺ + 2e⁻ → Pb'], answer: 0, explanation: 'PbO₂ cathode undergoes reduction from Pb(+IV) to Pb(+II) forming lead sulphate (PbSO₄).' },
  { topic: 'Electrochemistry', q: 'Why does the voltage of a lead-acid battery drop as it discharges?', choices: ['Sulfuric acid (electrolyte) is consumed, lowering reactant concentration', 'Lead metal turns into gold', 'Salt bridge dries out', 'Temperature rises above critical point'], answer: 0, explanation: 'Discharge consumes H₂SO₄, reducing aqueous electrolyte concentration and lowering cell potential E.' },
  { topic: 'Electrochemistry', q: 'What is electroplating?', choices: ['Using electrolysis to deposit a thin layer of metal onto a conductive object', 'Melting two metals together to make an alloy', 'Scraping rust off a steel pipe', 'Generating electricity from light'], answer: 0, explanation: 'Electroplating uses electrolytic reduction to coat an object at the cathode with a desired metal layer.' },
  { topic: 'Electrochemistry', q: 'In the electrolysis of water (2H₂O → 2H₂ + O₂), what is the volume ratio of H₂ gas to O₂ gas produced?', choices: ['1 : 1', '2 : 1', '1 : 2', '3 : 1'], answer: 1, explanation: 'Stoichiometry of water decomposition yields 2 moles of H₂ gas for every 1 mole of O₂ gas.' },
  { topic: 'Electrochemistry', q: 'If E°_cell for a reaction is negative (E° < 0), what is true about the equilibrium constant K?', choices: ['K > 1', 'K = 1', 'K < 1', 'K = 0'], answer: 2, explanation: 'Since log K = nE° / 0.0592, a negative E° yields log K < 0, meaning K < 1 (reactants favored).' },
  { topic: 'Electrochemistry', q: 'Multiplying a half-reaction by a stoichiometric factor of 2 does what to its standard reduction potential E°?', choices: ['Doubles E°', 'Halves E°', 'E° remains unchanged', 'Squares E°'], answer: 2, explanation: 'Standard reduction potential E° is an intensive property and does not change when coefficients are scaled.' },
  { topic: 'Electrochemistry', q: 'Which statement accurately describes a secondary cell?', choices: ['It can only be discharged once and thrown away', 'It can be recharged by passing current in the reverse direction', 'It consumes gaseous fuel continuously', 'It operates without an electrolyte'], answer: 1, explanation: 'Secondary cells (e.g., lithium-ion, lead-acid) feature reversible reactions that permit recharging.' },

  // Atomic Structure
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
{ topic: 'Atomic Structure', q: 'Which electron configuration represents an excited state of a carbon atom?', choices: ['1s² 2s² 2p¹ 3s¹', '1s² 2s² 2p²', '1s² 2s² 2p⁶', '1s² 2s¹ 2p³'], answer: 0, explanation: 'Ground state carbon is 1s² 2s² 2p². Promoting a 2p electron to the 3s orbital creates an excited state.' },
  { topic: 'Atomic Structure', q: 'Which element has the highest first ionization energy among the following?', choices: ['Argon', 'Sodium', 'Chlorine', 'Potassium'], answer: 0, explanation: 'Ionization energy increases across a period and decreases down a group. Argon has a full valence shell and highest Z_eff.' },
  { topic: 'Atomic Structure', q: 'Which set of quantum numbers (n, l, m_l, m_s) is NOT allowed?', choices: ['n = 1, l = 1, m_l = 0, m_s = +1/2', 'n = 3, l = 2, m_l = -1, m_s = +1/2', 'n = 2, l = 1, m_l = 0, m_s = -1/2', 'n = 4, l = 0, m_l = 0, m_s = -1/2'], answer: 0, explanation: 'For n = 1, l can only be 0 (l ranges from 0 to n−1).' },
  { topic: 'Atomic Structure', q: 'Which rule states that single electrons with parallel spins must occupy equal-energy orbitals before pairing occurs?', choices: ['Hund\'s Rule', 'Pauli Exclusion Principle', 'Aufbau Principle', 'Heisenberg Uncertainty Principle'], answer: 0, explanation: 'Hund\'s rule requires single occupancy of degenerate orbitals prior to electron pairing.' },
  { topic: 'Atomic Structure', q: 'What is the ground-state electron configuration of a neutral Iron atom (Fe, Z = 26)?', choices: ['[Ar] 4s² 3d⁶', '[Ar] 4s¹ 3d⁷', '[Ar] 3d⁸', '[Ar] 4s² 3d⁵'], answer: 0, explanation: 'Iron has 26 electrons: 18 (from Ar core) + 2 (in 4s) + 6 (in 3d).' },
  { topic: 'Atomic Structure', q: 'Which periodic trend generally increases from left to right across a period and decreases down a group?', choices: ['Electronegativity', 'Atomic radius', 'Metallic character', 'Ionic radius of cations'], answer: 0, explanation: 'Electronegativity increases across a period as nuclear charge increases, and decreases down a group as atomic size increases.' },
  { topic: 'Atomic Structure', q: 'How many unpaired electrons are present in a ground-state gaseous Nitrogen atom (Z = 7)?', choices: ['3', '1', '2', '0'], answer: 0, explanation: 'Nitrogen (1s² 2s² 2p³) has 3 half-filled 2p orbitals, giving 3 unpaired electrons.' },
  { topic: 'Atomic Structure', q: 'What is the electron configuration of the Fe³⁺ ion in its ground state?', choices: ['[Ar] 3d⁵', '[Ar] 4s² 3d³', '[Ar] 4s¹ 3d⁴', '[Ar] 3d⁶'], answer: 0, explanation: 'When transition metals ionize, valence s-electrons are lost first. Fe ([Ar] 4s² 3d⁶) loses two 4s and one 3d electron to yield [Ar] 3d⁵.' },
  { topic: 'Atomic Structure', q: 'In Photoelectron Spectroscopy (PES), peak position on the x-axis corresponds to binding energy. Which peak requires the highest energy to eject an electron from an atom?', choices: ['1s peak', '2s peak', '2p peak', '3s peak'], answer: 0, explanation: 'Core 1s electrons are closest to the nucleus, experience the highest nuclear pull, and have the highest binding energy.' },
  { topic: 'Atomic Structure', q: 'What is the maximum number of electrons that can occupy a 4f subshell?', choices: ['14', '7', '10', '6'], answer: 0, explanation: 'An f subshell (l = 3) has 2l + 1 = 7 orbitals, holding a maximum of 14 electrons.' },
  { topic: 'Atomic Structure', q: 'What species is isoelectronic with the fluoride ion (F⁻)?', choices: ['Neon (Ne)', 'Argon (Ar)', 'Oxygen atom (O)', 'Sodium atom (Na)'], answer: 0, explanation: 'F⁻ has 9 + 1 = 10 electrons, which is identical to neutral Neon (10 electrons).' },
  { topic: 'Atomic Structure', q: 'Which transition in a hydrogen atom emits a photon with the shortest wavelength?', choices: ['n = 3 → n = 1', 'n = 2 → n = 1', 'n = 4 → n = 2', 'n = 3 → n = 2'], answer: 0, explanation: 'Wavelength is inversely proportional to energy (E = hc/λ). The largest energy gap (n = 3 to n = 1) emits the shortest wavelength.' },
  { topic: 'Atomic Structure', q: 'Why is the atomic radius of Fluorine smaller than that of Oxygen?', choices: ['Fluorine has a greater effective nuclear charge (Z_eff) pulling valence electrons closer', 'Fluorine has more electron shells', 'Oxygen has greater electron shielding', 'Oxygen has a filled valence octet'], answer: 0, explanation: 'Across a period, proton count increases while shielding remains roughly constant, raising Z_eff and shrinking atomic radius.' },
  { topic: 'Atomic Structure', q: 'Which isotope has 17 protons, 20 neutrons, and 18 electrons?', choices: ['³⁷Cl⁻', '³⁷Cl', '³⁵Cl⁻', '³⁷Ar'], answer: 0, explanation: 'Z = 17 is Chlorine. Mass number = 17 + 20 = 37. With 18 electrons (1 more than protons), it has a −1 charge: ³⁷Cl⁻.' },
  { topic: 'Atomic Structure', q: 'Calculate the energy of a photon with a frequency of 6.0 × 10¹⁴ Hz. (h = 6.626 × 10⁻³⁴ J·s)', choices: ['3.98 × 10⁻¹⁹ J', '1.10 × 10⁻⁴⁷ J', '4.50 × 10⁻¹⁹ J', '2.00 × 10⁻²⁰ J'], answer: 0, explanation: 'E = hν = (6.626 × 10⁻³⁴ J·s) × (6.0 × 10¹⁴ s⁻¹) = 3.98 × 10⁻¹⁹ J.' },
  { topic: 'Atomic Structure', q: 'Which subshell is filled immediately after the 4s orbital according to the Aufbau principle?', choices: ['3d', '4p', '4d', '5s'], answer: 0, explanation: 'The filling order by increasing energy (n + l rule) goes 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p...' },
  { topic: 'Atomic Structure', q: 'An element has two naturally occurring isotopes: Isotope A (mass = 10.0 amu, 20.0% abundance) and Isotope B (mass = 11.0 amu, 80.0% abundance). What is its average atomic mass?', choices: ['10.8 amu', '10.5 amu', '10.2 amu', '10.9 amu'], answer: 0, explanation: 'Average mass = (0.20 × 10.0) + (0.80 × 11.0) = 2.0 + 8.8 = 10.8 amu.' },
  { topic: 'Atomic Structure', q: 'Which principle states that no two electrons in the same atom can have identical sets of all four quantum numbers?', choices: ['Pauli Exclusion Principle', 'Aufbau Principle', 'Hund\'s Rule', 'Heisenberg Uncertainty Principle'], answer: 0, explanation: 'The Pauli Exclusion Principle dictates that an orbital can hold at most two electrons with opposite spins.' },
  { topic: 'Atomic Structure', q: 'Why does Potassium (K) have a lower first ionization energy than Sodium (Na)?', choices: ['Potassium\'s valence electron is in a higher principal energy level (n=4) and farther from the nucleus', 'Sodium has more core electrons shielding its valence electron', 'Potassium has a higher effective nuclear charge', 'Sodium has a filled d subshell'], answer: 0, explanation: 'As n increases down Group 1, valence electrons reside in higher shells, experiencing greater distance and shielding from the nucleus.' },
  { topic: 'Atomic Structure', q: 'What wavelength of light corresponds to a frequency of 5.0 × 10¹⁴ Hz? (c = 3.0 × 10⁸ m/s)', choices: ['600 nm', '500 nm', '400 nm', '700 nm'], answer: 0, explanation: 'λ = c / ν = (3.0 × 10⁸ m/s) / (5.0 × 10¹⁴ s⁻¹) = 6.0 × 10⁻⁷ m = 600 nm.' },
  { topic: 'Atomic Structure', q: 'Which ion has the SMALLEST ionic radius?', choices: ['Al³⁺', 'Mg²⁺', 'Na⁺', 'F⁻'], answer: 0, explanation: 'All are isoelectronic (10 electrons). Al³⁺ has the highest nuclear charge (Z=13), pulling its electron cloud tightest.' },
  { topic: 'Atomic Structure', q: 'In a PES spectrum of pure Neon (1s² 2s² 2p⁶), how many distinct peaks are observed?', choices: ['3 peaks', '2 peaks', '6 peaks', '1 peak'], answer: 0, explanation: 'Neon has electrons in three distinct energy subshells (1s, 2s, and 2p), producing 3 distinct peaks.' },
  { topic: 'Atomic Structure', q: 'What is the peak height ratio for the 1s, 2s, and 2p subshells in the PES spectrum of Neon (1s² 2s² 2p⁶)?', choices: ['1 : 1 : 3', '1 : 2 : 6', '2 : 2 : 2', '1 : 1 : 1'], answer: 0, explanation: 'Peak height in PES is proportional to the relative number of electrons in that subshell (2 : 2 : 6 simplifies to 1 : 1 : 3).' },
  { topic: 'Atomic Structure', q: 'Which quantum number determines the spatial orientation of an atomic orbital?', choices: ['Magnetic quantum number (m_l)', 'Principal quantum number (n)', 'Angular momentum quantum number (l)', 'Spin quantum number (m_s)'], answer: 0, explanation: 'n = energy level/size, l = orbital shape, m_l = spatial orientation, m_s = spin direction.' },
  { topic: 'Atomic Structure', q: 'What shape corresponds to an atomic orbital with angular momentum quantum number l = 1?', choices: ['Dumbbell (p orbital)', 'Spherical (s orbital)', 'Cloverleaf (d orbital)', 'Complex/double donut (f orbital)'], answer: 0, explanation: 'l = 0 is spherical (s), l = 1 is dumbbell-shaped (p), l = 2 is cloverleaf (d).' },
  { topic: 'Atomic Structure', q: 'Why is the second ionization energy of Sodium (Na) dramatically higher than its first ionization energy?', choices: ['Removing the second electron requires pulling a core electron from a stable, filled n = 2 shell', 'Sodium becomes a noble gas after losing two electrons', 'The effective nuclear charge decreases after removing one electron', 'Second ionization energy involves losing an f-orbital electron'], answer: 0, explanation: 'Na is [Ne] 3s¹. IE₁ removes the 3s electron; IE₂ removes a core 2p electron, which experiences much higher Z_eff.' },
  { topic: 'Atomic Structure', q: 'What is the ground state electron configuration of Copper (Cu, Z = 29)?', choices: ['[Ar] 4s¹ 3d¹⁰', '[Ar] 4s² 3d⁹', '[Ar] 4s⁰ 3d¹¹', '[Ar] 4s² 3d¹⁰'], answer: 0, explanation: 'Copper is an exception to Aufbau filling, promoting a 4s electron to form a completely filled, stable 3d¹⁰ subshell.' },
  { topic: 'Atomic Structure', q: 'What is the total number of orbitals in the n = 3 principal energy level?', choices: ['9', '3', '18', '6'], answer: 0, explanation: 'Total orbitals in shell n = n² = 3² = 9 (one 3s, three 3p, five 3d orbitals).' },
  { topic: 'Atomic Structure', q: 'Which neutral atom in its ground state possesses exactly 4 unpaired electrons?', choices: ['Fe (Z = 26)', 'Cr (Z = 24)', 'Mn (Z = 25)', 'Ni (Z = 28)'], answer: 0, explanation: 'Fe is [Ar] 4s² 3d⁶. The 5 d-orbitals contain one paired set and 4 unpaired single electrons.' },
  { topic: 'Atomic Structure', q: 'Which phenomenon occurs when an electron transitions from a higher energy level to a lower energy level in an atom?', choices: ['A photon of specific energy is emitted', 'A photon of specific energy is absorbed', 'The atomic number increases', 'The nucleus undergoes radioactive decay'], answer: 0, explanation: 'Dropping to a lower energy state releases energy equal to the difference (ΔE = hν) as an emitted photon.' },
  { topic: 'Atomic Structure', q: 'Which element has the highest electronegativity value on the Pauling scale?', choices: ['Fluorine', 'Oxygen', 'Chlorine', 'Francium'], answer: 0, explanation: 'Fluorine is the most electronegative element (3.98 on Pauling scale) due to its small size and high Z_eff.' },
  { topic: 'Atomic Structure', q: 'What is the formal charge on the nitrogen atom in the ammonium ion (NH₄⁺)?', choices: ['+1', '0', '−1', '+2'], answer: 0, explanation: 'Formal charge = valence e⁻ (5) − nonbonding e⁻ (0) − 1/2 bonding e⁻ (4) = +1.' },
  { topic: 'Atomic Structure', q: 'What happens to the effective nuclear charge (Z_eff) experienced by valence electrons as you move left to right across a period?', choices: ['Increases', 'Decreases', 'Remains unchanged', 'Fluctuates randomly'], answer: 0, explanation: 'Proton count increases while core electron shielding stays nearly constant, raising Z_eff across a period.' },
  { topic: 'Atomic Structure', q: 'Which element has a ground state electron configuration ending in 4p³?', choices: ['Arsenic (As)', 'Phosphorus (P)', 'Selenium (Se)', 'Germanium (Ge)'], answer: 0, explanation: 'Arsenic (Z = 33) is in Period 4, Group 15, ending in 4s² 4p³.' },
  { topic: 'Atomic Structure', q: 'Which property of light is directly proportional to photon energy?', choices: ['Frequency', 'Wavelength', 'Amplitude', 'Speed in vacuum'], answer: 0, explanation: 'E = hν shows photon energy E is directly proportional to frequency ν.' },
  { topic: 'Atomic Structure', q: 'In mass spectrometry, what does the x-axis typically represent?', choices: ['Mass-to-charge ratio (m/z)', 'Relative abundance', 'Binding energy in eV', 'Wavelength in nanometers'], answer: 0, explanation: 'Mass spectrometers separate ionized isotopes based on their mass-to-charge ratio (m/z).' },
  { topic: 'Atomic Structure', q: 'Why is the first ionization energy of Oxygen slightly lower than that of Nitrogen, violating the general periodic trend?', choices: ['Oxygen has electron pairing in one of its 2p orbitals, resulting in inter-electronic repulsion', 'Nitrogen has a higher nuclear charge', 'Oxygen has greater electron shielding', 'Nitrogen valence electrons are in a higher energy level'], answer: 0, explanation: 'Nitrogen is 2p³ (half-filled). Oxygen is 2p⁴, where pairing two electrons in one orbital causes mutual repulsion, making removal easier.' },
  { topic: 'Atomic Structure', q: 'Which orbital representation violates the Pauli Exclusion Principle?', choices: ['An orbital containing two electrons with parallel spins (↑↑)', 'An orbital containing two electrons with opposite spins (↑↓)', 'An empty orbital', 'A single electron in an orbital (↑)'], answer: 0, explanation: 'Two electrons in the same orbital must have opposite spins (+1/2 and -1/2) according to Pauli.' },
  { topic: 'Atomic Structure', q: 'How many valence electrons does a neutral Sulfur atom (Z = 16) possess?', choices: ['6', '16', '8', '2'], answer: 0, explanation: 'Sulfur is in Group 16 ([Ne] 3s² 3p⁴), giving it 2 + 4 = 6 valence electrons.' },
  { topic: 'Atomic Structure', q: 'Which noble gas configuration is used as the core abbreviation for Iodine (Z = 53)?', choices: ['[Kr]', '[Ar]', '[Xe]', '[Rn]'], answer: 0, explanation: 'Krypton (Z = 36) is the noble gas preceding Iodine in the periodic table.' },
  { topic: 'Atomic Structure', q: 'What is the maximum number of electrons that can fit into the n = 4 shell?', choices: ['32', '18', '8', '50'], answer: 0, explanation: 'Maximum electron capacity = 2n² = 2(4)² = 32 electrons.' },
  { topic: 'Atomic Structure', q: 'Which species is diamagnetic in its ground state?', choices: ['Zinc atom (Zn)', 'Iron atom (Fe)', 'Oxygen atom (O)', 'Sodium atom (Na)'], answer: 0, explanation: 'Zinc ([Ar] 4s² 3d¹⁰) has all paired electrons, making it diamagnetic.' },
  { topic: 'Atomic Structure', q: 'Which factor primarily explains why atomic radius INCREASES down a group on the periodic table?', choices: ['Addition of principal energy levels (shells) placing valence electrons further from the nucleus', 'Increase in effective nuclear charge', 'Decrease in neutron count', 'Increase in electronegativity'], answer: 0, explanation: 'Each step down a group adds a new electron shell (higher n), increasing the atomic radius.' },
  { topic: 'Atomic Structure', q: 'What type of electromagnetic radiation has higher frequency than visible light?', choices: ['Ultraviolet (UV)', 'Infrared (IR)', 'Microwave', 'Radio waves'], answer: 0, explanation: 'In order of increasing frequency: Radio < Microwave < IR < Visible < UV < X-ray < Gamma.' },
  { topic: 'Atomic Structure', q: 'Which ion is largest in size among O²⁻, F⁻, Na⁺, and Mg²⁺?', choices: ['O²⁻', 'F⁻', 'Na⁺', 'Mg²⁺'], answer: 0, explanation: 'O²⁻ has the smallest nuclear charge (Z=8) among these isoelectronic ions, so its electron cloud is pulled least tightly.' },
  { topic: 'Atomic Structure', q: 'Which subshell does NOT exist in an atom?', choices: ['2d', '1s', '3p', '4f'], answer: 0, explanation: 'For n = 2, angular quantum number l can only be 0 (2s) or 1 (2p). A 2d subshell (l = 2) cannot exist.' },
  { topic: 'Atomic Structure', q: 'What is the correct order of subshell filling up to 4s according to the Aufbau Principle?', choices: ['1s, 2s, 2p, 3s, 3p, 4s', '1s, 2s, 2p, 3s, 3d, 4s', '1s, 2s, 3s, 3p, 4s, 3d', '1s, 2s, 2p, 3s, 3p, 3d'], answer: 0, explanation: 'Subshells fill in order of increasing energy: 1s → 2s → 2p → 3s → 3p → 4s.' },
  { topic: 'Atomic Structure', q: 'Which element has ground-state chemical properties most similar to Calcium (Ca)?', choices: ['Strontium (Sr)', 'Potassium (K)', 'Scandium (Sc)', 'Aluminum (Al)'], answer: 0, explanation: 'Elements in the same group (alkaline earth metals) have identical valence electron configurations and similar chemical properties.' },
  { topic: 'Atomic Structure', q: 'What is the total number of p-electrons in a ground-state Chlorine atom (Z = 17)?', choices: ['11', '5', '6', '17'], answer: 0, explanation: 'Chlorine configuration is 1s² 2s² 2p⁶ 3s² 3p⁵. Total p-electrons = 6 (in 2p) + 5 (in 3p) = 11.' },
  { topic: 'Atomic Structure', q: 'What fundamental discovery was demonstrated by Rutherford\'s gold foil experiment?', choices: ['The atom is mostly empty space with a dense, positively charged nucleus', 'Electrons reside in quantized circular orbits', 'Electrons have wave-particle duality', 'Neutrons exist inside the atomic core'], answer: 0, explanation: 'Alpha particle deflection showed that atomic positive charge and mass are concentrated in a small nucleus.' },
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
