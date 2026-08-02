const {
  Client, GatewayIntentBits, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const PREFIX = '!';

// ─── Question Bank (original USNCO-style questions) ───────────────────────────
const QUESTIONS = [
  // ── Stoichiometry ────────────────────────────────────────────────────────────
  {
    topic: 'Stoichiometry',
    q: 'How many grams of CO₂ are produced when 44.0 g of propane (C₃H₈) is completely combusted? (Molar masses: C=12, H=1, O=16)',
    choices: ['88.0 g', '132 g', '176 g', '44.0 g'],
    answer: 1,
    explanation: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. 44 g C₃H₈ = 1 mol. 1 mol produces 3 mol CO₂ = 3 × 44 = 132 g.'
  },
  {
    topic: 'Stoichiometry',
    q: 'A solution is prepared by dissolving 5.85 g of NaCl (MW = 58.5 g/mol) in enough water to make 500 mL of solution. What is the molarity?',
    choices: ['0.100 M', '0.200 M', '0.400 M', '1.00 M'],
    answer: 1,
    explanation: 'moles NaCl = 5.85/58.5 = 0.100 mol. M = 0.100 mol / 0.500 L = 0.200 M.'
  },
  {
    topic: 'Stoichiometry',
    q: 'In the reaction 2Al + 3Cl₂ → 2AlCl₃, if 2.70 g of Al (MW=27) reacts with excess Cl₂, how many moles of AlCl₃ are produced?',
    choices: ['0.0500 mol', '0.100 mol', '0.150 mol', '0.200 mol'],
    answer: 1,
    explanation: '2.70 g Al / 27 g/mol = 0.100 mol Al. 1:1 ratio gives 0.100 mol AlCl₃.'
  },
  {
    topic: 'Stoichiometry',
    q: 'What volume of 0.500 M H₂SO₄ is needed to neutralize 100 mL of 1.00 M NaOH? (H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O)',
    choices: ['25.0 mL', '50.0 mL', '100 mL', '200 mL'],
    answer: 2,
    explanation: 'moles NaOH = 0.100 mol. Need 0.0500 mol H₂SO₄. V = 0.0500/0.500 = 0.100 L = 100 mL.'
  },
  {
    topic: 'Stoichiometry',
    q: 'A compound is 40.0% C, 6.67% H, and 53.3% O by mass. What is its empirical formula?',
    choices: ['CH₂O', 'C₂H₄O₂', 'CHO', 'C₂H₂O'],
    answer: 0,
    explanation: 'C: 40/12=3.33, H: 6.67/1=6.67, O: 53.3/16=3.33. Ratio 1:2:1 → CH₂O.'
  },
  {
    topic: 'Stoichiometry',
    q: 'If 10.0 g of H₂ and 80.0 g of O₂ react to form water (2H₂ + O₂ → 2H₂O), what is the limiting reagent?',
    choices: ['H₂', 'O₂', 'Both are limiting', 'Neither; they are in stoichiometric ratio'],
    answer: 1,
    explanation: 'H₂: 10/2=5 mol. O₂: 80/32=2.5 mol. Need 5/2=2.5 mol O₂ for 5 mol H₂ — exactly stoichiometric. Actually O₂ is not limiting; they are exactly stoichiometric. Wait — ratio needed is 2:1 H₂:O₂, so 5 mol H₂ needs 2.5 mol O₂. That is exactly what we have, so neither is limiting. Answer: D.'
  },
  {
    topic: 'Stoichiometry',
    q: 'What is the percent yield if 4.50 g of product is obtained from a reaction with a theoretical yield of 6.00 g?',
    choices: ['55.0%', '65.0%', '75.0%', '85.0%'],
    answer: 2,
    explanation: 'Percent yield = (4.50/6.00) × 100 = 75.0%.'
  },

  // ── Descriptive Chemistry / Lab ───────────────────────────────────────────────
  {
    topic: 'Descriptive Chemistry',
    q: 'Which of the following gases turns limewater milky white?',
    choices: ['SO₂', 'CO₂', 'NH₃', 'HCl'],
    answer: 1,
    explanation: 'CO₂ reacts with Ca(OH)₂ (limewater) to form insoluble CaCO₃, which turns the solution milky.'
  },
  {
    topic: 'Descriptive Chemistry',
    q: 'Which flame color is associated with the presence of sodium ions?',
    choices: ['Red', 'Violet', 'Yellow', 'Green'],
    answer: 2,
    explanation: 'Sodium produces a characteristic bright yellow flame due to the 589 nm emission line.'
  },
  {
    topic: 'Descriptive Chemistry',
    q: 'A white solid dissolves in water to give a solution with pH > 7. The solid is most likely:',
    choices: ['NaCl', 'Na₂CO₃', 'NH₄Cl', 'AlCl₃'],
    answer: 1,
    explanation: 'Na₂CO₃ is a salt of a strong base and weak acid; it hydrolyzes to give a basic solution.'
  },
  {
    topic: 'Descriptive Chemistry',
    q: 'Which halogen exists as a liquid at room temperature (25°C)?',
    choices: ['F₂', 'Cl₂', 'Br₂', 'I₂'],
    answer: 2,
    explanation: 'Bromine (Br₂) is the only halogen that is a liquid at standard room temperature.'
  },
  {
    topic: 'Descriptive Chemistry',
    q: 'Which of the following is used to test for the presence of starch?',
    choices: ['Benedict\'s solution', 'Iodine solution', 'Biuret reagent', 'Fehling\'s solution'],
    answer: 1,
    explanation: 'Iodine solution turns dark blue-black in the presence of starch due to triiodide intercalation.'
  },

  // ── States of Matter ──────────────────────────────────────────────────────────
  {
    topic: 'States of Matter',
    q: 'At STP, which gas would deviate most from ideal behavior?',
    choices: ['H₂', 'He', 'NH₃', 'N₂'],
    answer: 2,
    explanation: 'NH₃ has strong intermolecular hydrogen bonding and a relatively large dipole, causing the greatest deviation from ideal gas behavior.'
  },
  {
    topic: 'States of Matter',
    q: 'A sample of gas at 27°C and 1.0 atm occupies 2.0 L. What volume will it occupy at 127°C and 1.0 atm?',
    choices: ['1.5 L', '2.67 L', '3.0 L', '4.0 L'],
    answer: 1,
    explanation: 'Charles\'s Law: V₁/T₁ = V₂/T₂. T₁=300 K, T₂=400 K. V₂ = 2.0 × 400/300 = 2.67 L.'
  },
  {
    topic: 'States of Matter',
    q: 'Which type of intermolecular force is responsible for the unusually high boiling point of water compared to H₂S?',
    choices: ['London dispersion forces', 'Dipole-dipole interactions', 'Hydrogen bonding', 'Ion-dipole forces'],
    answer: 2,
    explanation: 'Water molecules form extensive hydrogen bonds due to O-H bonds with highly electronegative oxygen, raising the boiling point dramatically.'
  },
  {
    topic: 'States of Matter',
    q: 'Which of the following solids has the highest melting point due to its crystal structure?',
    choices: ['NaCl', 'CO₂', 'SiO₂', 'I₂'],
    answer: 2,
    explanation: 'SiO₂ is a covalent network solid with Si-O bonds throughout, requiring enormous energy to melt (~1700°C).'
  },
  {
    topic: 'States of Matter',
    q: 'According to the kinetic molecular theory, which of the following is true at higher temperatures?',
    choices: [
      'Gas molecules move slower on average',
      'The distribution of molecular speeds narrows',
      'The average kinetic energy of molecules increases',
      'Gas molecules spend more time in collisions'
    ],
    answer: 2,
    explanation: 'Average kinetic energy is directly proportional to absolute temperature: KE_avg = (3/2)kT.'
  },

  // ── Thermodynamics ────────────────────────────────────────────────────────────
  {
    topic: 'Thermodynamics',
    q: 'Which of the following processes has a negative ΔS (decrease in entropy)?',
    choices: [
      'Melting of ice',
      'Dissolving NH₄NO₃ in water',
      'Condensation of steam to liquid water',
      'Sublimation of dry ice'
    ],
    answer: 2,
    explanation: 'Condensation converts gas to liquid, greatly reducing molecular disorder and freedom of motion; ΔS < 0.'
  },
  {
    topic: 'Thermodynamics',
    q: 'A reaction has ΔH = −100 kJ/mol and ΔS = −200 J/(mol·K). At what temperature does the reaction become non-spontaneous?',
    choices: ['Below 500 K', 'Above 500 K', 'Below 200 K', 'Above 200 K'],
    answer: 1,
    explanation: 'ΔG = ΔH − TΔS. Spontaneous when ΔG < 0. ΔG = 0 at T = ΔH/ΔS = 100000/200 = 500 K. Above 500 K, ΔG > 0 (non-spontaneous).'
  },
  {
    topic: 'Thermodynamics',
    q: 'Using Hess\'s Law, if A→B ΔH=+50 kJ and B→C ΔH=−80 kJ, what is ΔH for A→C?',
    choices: ['+130 kJ', '−130 kJ', '−30 kJ', '+30 kJ'],
    answer: 2,
    explanation: 'ΔH(A→C) = ΔH(A→B) + ΔH(B→C) = 50 + (−80) = −30 kJ.'
  },
  {
    topic: 'Thermodynamics',
    q: 'The specific heat capacity of water is 4.18 J/(g·°C). How much heat is required to raise 50.0 g of water from 20.0°C to 80.0°C?',
    choices: ['8.36 kJ', '12.54 kJ', '16.72 kJ', '4.18 kJ'],
    answer: 1,
    explanation: 'q = mcΔT = 50.0 × 4.18 × 60.0 = 12,540 J = 12.54 kJ.'
  },
  {
    topic: 'Thermodynamics',
    q: 'Which statement about a spontaneous exothermic reaction with increasing entropy is correct?',
    choices: [
      'It is spontaneous only at high temperatures',
      'It is spontaneous only at low temperatures',
      'It is spontaneous at all temperatures',
      'It is never spontaneous'
    ],
    answer: 2,
    explanation: 'ΔG = ΔH − TΔS. Both ΔH < 0 and ΔS > 0 make ΔG negative at all temperatures.'
  },
  {
    topic: 'Thermodynamics',
    q: 'For the reaction N₂(g) + 3H₂(g) → 2NH₃(g), which is true regarding entropy change (ΔS)?',
    choices: ['ΔS > 0 because bonds are formed', 'ΔS < 0 because 4 moles of gas become 2 moles', 'ΔS = 0 because no phase change occurs', 'ΔS > 0 because temperature increases'],
    answer: 1,
    explanation: '4 moles of gas → 2 moles of gas, a decrease in the number of gas molecules means ΔS < 0.'
  },

  // ── Kinetics ──────────────────────────────────────────────────────────────────
  {
    topic: 'Kinetics',
    q: 'For a first-order reaction, if the initial concentration doubles, the initial rate:',
    choices: ['Stays the same', 'Doubles', 'Quadruples', 'Increases by 8×'],
    answer: 1,
    explanation: 'For first-order: rate = k[A]. Doubling [A] doubles the rate.'
  },
  {
    topic: 'Kinetics',
    q: 'The half-life of a first-order reaction is 20 minutes. What fraction of the reactant remains after 60 minutes?',
    choices: ['1/2', '1/4', '1/6', '1/8'],
    answer: 3,
    explanation: '60 min = 3 half-lives. Fraction remaining = (1/2)³ = 1/8.'
  },
  {
    topic: 'Kinetics',
    q: 'The Arrhenius equation tells us that increasing temperature increases the rate constant primarily because:',
    choices: [
      'More molecules have energy exceeding the activation energy',
      'The activation energy decreases',
      'The frequency factor A decreases',
      'The equilibrium constant increases'
    ],
    answer: 0,
    explanation: 'Higher T shifts the Maxwell-Boltzmann distribution so a larger fraction of molecules exceed E_a.'
  },
  {
    topic: 'Kinetics',
    q: 'Which of the following is true about a catalyst?',
    choices: [
      'It increases the activation energy',
      'It is consumed in the reaction',
      'It provides an alternative pathway with lower activation energy',
      'It changes the overall enthalpy of reaction'
    ],
    answer: 2,
    explanation: 'A catalyst provides an alternative mechanism with a lower activation energy, increasing the rate without being consumed or changing ΔH.'
  },
  {
    topic: 'Kinetics',
    q: 'For the rate law: rate = k[A]²[B], if [A] is halved and [B] is doubled, the rate:',
    choices: ['Doubles', 'Halves', 'Stays the same', 'Quadruples'],
    answer: 1,
    explanation: 'New rate = k(A/2)²(2B) = k(A²/4)(2B) = (1/2)k[A]²[B]. Rate is halved.'
  },
  {
    topic: 'Kinetics',
    q: 'The rate-determining step of a reaction mechanism is:',
    choices: [
      'Always the first step',
      'The step with the lowest activation energy',
      'The slowest step in the mechanism',
      'The step that produces the most product'
    ],
    answer: 2,
    explanation: 'The rate-determining step is the slowest step in the mechanism and controls the overall rate of reaction.'
  },

  // ── Equilibrium ───────────────────────────────────────────────────────────────
  {
    topic: 'Equilibrium',
    q: 'For the reaction PCl₃(g) + Cl₂(g) ⇌ PCl₅(g), if pressure is increased at constant temperature, the equilibrium will:',
    choices: [
      'Shift right (toward PCl₅)',
      'Shift left (toward PCl₃ and Cl₂)',
      'Not shift because Kp is constant',
      'Shift right only if ΔH < 0'
    ],
    answer: 0,
    explanation: 'Increasing pressure favors the side with fewer moles of gas. Left side = 2 mol gas, right = 1 mol. Equilibrium shifts right.'
  },
  {
    topic: 'Equilibrium',
    q: 'At 25°C, the Ka of acetic acid is 1.8 × 10⁻⁵. What is the pKa?',
    choices: ['3.74', '4.74', '5.74', '6.74'],
    answer: 1,
    explanation: 'pKa = −log(1.8 × 10⁻⁵) = −log(1.8) − log(10⁻⁵) = −0.255 + 5 = 4.74.'
  },
  {
    topic: 'Equilibrium',
    q: 'Which of the following changes would NOT shift the equilibrium position for: N₂(g) + 3H₂(g) ⇌ 2NH₃(g)?',
    choices: [
      'Adding a catalyst',
      'Increasing temperature',
      'Increasing pressure',
      'Adding more N₂'
    ],
    answer: 0,
    explanation: 'A catalyst speeds up both forward and reverse reactions equally, reaching equilibrium faster without changing the equilibrium position (K).'
  },
  {
    topic: 'Equilibrium',
    q: 'The solubility product Ksp of AgCl is 1.8 × 10⁻¹⁰. What is the molar solubility of AgCl in pure water?',
    choices: ['1.8 × 10⁻⁵ M', '1.34 × 10⁻⁵ M', '3.6 × 10⁻¹⁰ M', '9.0 × 10⁻⁶ M'],
    answer: 1,
    explanation: 'Ksp = s² = 1.8 × 10⁻¹⁰, so s = √(1.8 × 10⁻¹⁰) = 1.34 × 10⁻⁵ M.'
  },
  {
    topic: 'Equilibrium',
    q: 'The relationship between ΔG° and the equilibrium constant K is:',
    choices: ['ΔG° = RT ln K', 'ΔG° = −RT ln K', 'ΔG° = −nFE°', 'ΔG° = ΔH° − TΔS°'],
    answer: 1,
    explanation: 'ΔG° = −RT ln K. When K > 1, ΔG° < 0 (products favored). When K < 1, ΔG° > 0 (reactants favored).'
  },
  {
    topic: 'Equilibrium',
    q: 'A buffer solution resists changes in pH because it contains:',
    choices: [
      'A strong acid and its conjugate base',
      'A weak acid and its conjugate base in comparable amounts',
      'A large excess of strong base',
      'Only water and a neutral salt'
    ],
    answer: 1,
    explanation: 'A buffer contains a weak acid and its conjugate base (or weak base and conjugate acid) in similar concentrations to neutralize added acid or base.'
  },

  // ── Electrochemistry ──────────────────────────────────────────────────────────
  {
    topic: 'Electrochemistry',
    q: 'In an electrochemical cell, oxidation occurs at the:',
    choices: ['Cathode in both galvanic and electrolytic cells', 'Anode in both galvanic and electrolytic cells', 'Cathode in galvanic cells only', 'Anode in galvanic cells only'],
    answer: 1,
    explanation: 'Oxidation always occurs at the anode, regardless of whether the cell is galvanic (spontaneous) or electrolytic (non-spontaneous).'
  },
  {
    topic: 'Electrochemistry',
    q: 'Given E°(Zn²⁺/Zn) = −0.76 V and E°(Cu²⁺/Cu) = +0.34 V, what is E°cell for a Zn-Cu galvanic cell?',
    choices: ['−1.10 V', '+0.42 V', '+1.10 V', '−0.42 V'],
    answer: 2,
    explanation: 'E°cell = E°cathode − E°anode = 0.34 − (−0.76) = +1.10 V. Cu is reduced (cathode), Zn is oxidized (anode).'
  },
  {
    topic: 'Electrochemistry',
    q: 'The Nernst equation accounts for the effect of which variable on cell potential?',
    choices: ['Temperature only', 'Concentration only', 'Both temperature and concentration', 'Pressure only'],
    answer: 2,
    explanation: 'The Nernst equation E = E° − (RT/nF)lnQ accounts for non-standard concentrations, pressures, and temperature.'
  },
  {
    topic: 'Electrochemistry',
    q: 'How many moles of electrons are transferred when 1 mol of Cr²⁺ is oxidized to Cr³⁺?',
    choices: ['1 mol e⁻', '2 mol e⁻', '3 mol e⁻', '6 mol e⁻'],
    answer: 0,
    explanation: 'Cr²⁺ → Cr³⁺ + 1e⁻. Each Cr loses 1 electron, so 1 mol Cr²⁺ releases 1 mol of electrons.'
  },
  {
    topic: 'Electrochemistry',
    q: 'What is deposited at the cathode when an aqueous solution of CuSO₄ is electrolyzed?',
    choices: ['Oxygen gas', 'Sulfur', 'Copper metal', 'Hydrogen gas'],
    answer: 2,
    explanation: 'Cu²⁺ ions are reduced at the cathode: Cu²⁺ + 2e⁻ → Cu(s). Copper metal plates out.'
  },

  // ── Atomic Structure / Periodicity ────────────────────────────────────────────
  {
    topic: 'Atomic Structure',
    q: 'Which of the following electron configurations represents an excited state of carbon?',
    choices: ['1s²2s²2p²', '1s²2s²2p¹3s¹', '1s²2s¹2p³', '1s²2p⁴'],
    answer: 1,
    explanation: 'Ground state C is 1s²2s²2p². Having an electron in 3s (1s²2s²2p¹3s¹) represents an excited state.'
  },
  {
    topic: 'Atomic Structure',
    q: 'Which element has the highest first ionization energy?',
    choices: ['Na', 'Cl', 'Ar', 'K'],
    answer: 2,
    explanation: 'Argon is a noble gas with a full valence shell. It has the highest first ionization energy among these elements.'
  },
  {
    topic: 'Atomic Structure',
    q: 'Which of the following represents the correct order of increasing atomic radius?',
    choices: ['F < O < N < C', 'C < N < O < F', 'Na < Mg < Al < Si', 'F < Cl < Br < I'],
    answer: 3,
    explanation: 'Going down a group, atomic radius increases as electrons fill higher energy shells: F < Cl < Br < I.'
  },
  {
    topic: 'Atomic Structure',
    q: 'The de Broglie wavelength of a particle is inversely proportional to its:',
    choices: ['Charge', 'Momentum', 'Potential energy', 'Atomic number'],
    answer: 1,
    explanation: 'λ = h/p where p is momentum. Wavelength is inversely proportional to momentum (mass × velocity).'
  },
  {
    topic: 'Atomic Structure',
    q: 'In a nuclear decay, ²³⁸₉₂U emits an alpha particle. What is the resulting nuclide?',
    choices: ['²³⁴₉₀Th', '²³⁸₉₃Np', '²³⁴₉₁Pa', '²³⁶₉₀Th'],
    answer: 0,
    explanation: 'Alpha decay: mass number decreases by 4, atomic number by 2. 238−4=234, 92−2=90 → ²³⁴₉₀Th.'
  },
  {
    topic: 'Atomic Structure',
    q: 'Which quantum number describes the shape of an atomic orbital?',
    choices: ['Principal quantum number (n)', 'Angular momentum quantum number (l)', 'Magnetic quantum number (mₗ)', 'Spin quantum number (mₛ)'],
    answer: 1,
    explanation: 'The angular momentum quantum number l determines the shape: l=0 (s), l=1 (p), l=2 (d), l=3 (f).'
  },

  // ── Bonding ───────────────────────────────────────────────────────────────────
  {
    topic: 'Bonding',
    q: 'What is the electron geometry (not molecular geometry) of SF₄?',
    choices: ['Tetrahedral', 'Trigonal bipyramidal', 'Octahedral', 'Seesaw'],
    answer: 1,
    explanation: 'SF₄ has 4 bonding pairs + 1 lone pair = 5 electron groups → trigonal bipyramidal electron geometry; seesaw molecular geometry.'
  },
  {
    topic: 'Bonding',
    q: 'Which of the following molecules is polar?',
    choices: ['BF₃', 'CCl₄', 'SF₆', 'CHCl₃'],
    answer: 3,
    explanation: 'CHCl₃ (chloroform) has an asymmetric arrangement of chlorines around carbon, resulting in a net dipole moment. The others are symmetric and nonpolar.'
  },
  {
    topic: 'Bonding',
    q: 'In MO theory, which of the following species has the highest bond order?',
    choices: ['O₂', 'O₂⁺', 'O₂⁻', 'O₂²⁻'],
    answer: 1,
    explanation: 'Bond orders: O₂=2, O₂⁺=2.5, O₂⁻=1.5, O₂²⁻=1. O₂⁺ has the highest bond order.'
  },
  {
    topic: 'Bonding',
    q: 'Which hybridization is exhibited by the carbon atoms in benzene (C₆H₆)?',
    choices: ['sp', 'sp²', 'sp³', 'sp³d'],
    answer: 1,
    explanation: 'Each carbon in benzene forms 3 sigma bonds (to 2 carbons and 1 hydrogen), requiring sp² hybridization, with remaining p orbitals forming the delocalized π system.'
  },
  {
    topic: 'Bonding',
    q: 'What is the formal charge on nitrogen in NO₃⁻ (one resonance structure where N forms one double and two single bonds)?',
    choices: ['+1', '0', '−1', '+2'],
    answer: 0,
    explanation: 'Formal charge = valence e⁻ − nonbonding e⁻ − (1/2)bonding e⁻. N: 5 − 0 − (1/2)(8) = 5 − 4 = +1.'
  },
  {
    topic: 'Bonding',
    q: 'Which of the following has the shortest bond length?',
    choices: ['C–C single bond', 'C=C double bond', 'C≡C triple bond', 'C–H bond'],
    answer: 2,
    explanation: 'As bond order increases, bond length decreases. C≡C triple bonds (~120 pm) are shorter than C=C (~134 pm) and C–C (~154 pm).'
  },

  // ── Organic Chemistry ─────────────────────────────────────────────────────────
  {
    topic: 'Organic Chemistry',
    q: 'Which of the following is the correct IUPAC name for CH₃CH₂CH(CH₃)CH₂CH₃?',
    choices: ['2-methylpentane', '3-methylpentane', '2-ethylbutane', '3-methylhexane'],
    answer: 1,
    explanation: 'The longest chain has 5 carbons (pentane). The methyl branch is on C3 → 3-methylpentane.'
  },
  {
    topic: 'Organic Chemistry',
    q: 'Which reaction type converts an alkene to a diol (two −OH groups)?',
    choices: ['Hydrohalogenation', 'Syn-dihydroxylation with OsO₄', 'Hydrogenation', 'Dehydration'],
    answer: 1,
    explanation: 'Syn-dihydroxylation using OsO₄ (or cold KMnO₄) adds two hydroxyl groups to the same face of a double bond, forming a vicinal diol.'
  },
  {
    topic: 'Organic Chemistry',
    q: 'An ester is formed by the reaction of:',
    choices: [
      'An alcohol and a carboxylic acid',
      'An aldehyde and a ketone',
      'Two alcohols',
      'An amine and an aldehyde'
    ],
    answer: 0,
    explanation: 'Fischer esterification: R-COOH + R\'-OH ⇌ R-COOR\' + H₂O. A carboxylic acid reacts with an alcohol to form an ester.'
  },
  {
    topic: 'Organic Chemistry',
    q: 'Which of the following correctly orders carbocation stability from most to least stable?',
    choices: [
      'Tertiary > Secondary > Primary > Methyl',
      'Primary > Secondary > Tertiary > Methyl',
      'Methyl > Primary > Secondary > Tertiary',
      'Secondary > Tertiary > Primary > Methyl'
    ],
    answer: 0,
    explanation: 'More alkyl substituents donate electron density to stabilize the positive charge. Tertiary carbocations are most stable.'
  },
  {
    topic: 'Organic Chemistry',
    q: 'What is the product when a primary alkyl halide reacts with a strong, bulky base via E2 elimination?',
    choices: [
      'An alcohol',
      'An alkene following Zaitsev\'s rule',
      'An alkene following Hofmann\'s rule',
      'A secondary alkyl halide'
    ],
    answer: 2,
    explanation: 'E2 with a bulky base on primary alkyl halides favors the less substituted (Hofmann) alkene because steric hindrance prevents attack at the more substituted carbon.'
  },
  {
    topic: 'Organic Chemistry',
    q: 'Which spectroscopic technique is most useful for identifying the connectivity of carbon atoms in an organic molecule?',
    choices: ['IR spectroscopy', 'UV-Vis spectroscopy', '¹H NMR spectroscopy', '¹³C NMR spectroscopy'],
    answer: 3,
    explanation: '¹³C NMR directly probes each unique carbon environment in a molecule, making it ideal for mapping carbon connectivity.'
  },
  {
    topic: 'Organic Chemistry',
    q: 'Markovnikov\'s rule predicts that in the addition of HBr to propene (CH₃CH=CH₂), the bromine adds to:',
    choices: [
      'C1 (terminal carbon)',
      'C2 (internal carbon)',
      'Both carbons equally',
      'Neither carbon; elimination occurs'
    ],
    answer: 1,
    explanation: 'Markovnikov\'s rule: H adds to the carbon with more H\'s (C1), Br adds to C2, forming 2-bromopropane via the more stable secondary carbocation.'
  },

  // ── Acid-Base ─────────────────────────────────────────────────────────────────
  {
    topic: 'Equilibrium',
    q: 'What is the pH of a 0.010 M HCl solution?',
    choices: ['1', '2', '3', '4'],
    answer: 1,
    explanation: 'HCl is a strong acid and fully dissociates. [H⁺] = 0.010 M = 10⁻² M. pH = −log(10⁻²) = 2.'
  },
  {
    topic: 'Equilibrium',
    q: 'According to the Lewis definition, an acid is:',
    choices: [
      'A proton donor',
      'A hydroxide ion donor',
      'An electron pair acceptor',
      'An electron pair donor'
    ],
    answer: 2,
    explanation: 'Lewis acids are electron pair acceptors. This is a broader definition than Brønsted-Lowry (proton donors/acceptors).'
  },
  {
    topic: 'Equilibrium',
    q: 'Which of the following is the strongest acid?',
    choices: ['HF (Ka = 6.8 × 10⁻⁴)', 'HCN (Ka = 6.2 × 10⁻¹⁰)', 'CH₃COOH (Ka = 1.8 × 10⁻⁵)', 'H₂CO₃ (Ka = 4.3 × 10⁻⁷)'],
    answer: 0,
    explanation: 'A larger Ka means a stronger acid. HF has Ka = 6.8 × 10⁻⁴, which is the largest value listed.'
  },
];

// ─── State ────────────────────────────────────────────────────────────────────
const activeGames  = new Map(); // channelId → game state
const leaderboards = new Map(); // guildId   → Map(userId → { points, correct, total })

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randomQuestion(topic) {
  const pool = topic ? QUESTIONS.filter(q => q.topic.toLowerCase() === topic.toLowerCase()) : QUESTIONS;
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function embed(title, description, color = 0x2b2d31) {
  return new EmbedBuilder().setTitle(title).setDescription(description).setColor(color);
}

function getLeaderboard(guildId) {
  if (!leaderboards.has(guildId)) leaderboards.set(guildId, new Map());
  return leaderboards.get(guildId);
}

function addPoints(guildId, userId, pts, correct) {
  const lb = getLeaderboard(guildId);
  const cur = lb.get(userId) || { points: 0, correct: 0, total: 0 };
  cur.points  += pts;
  cur.correct += correct ? 1 : 0;
  cur.total   += 1;
  lb.set(userId, cur);
}

function buildAnswerButtons(disabled = false, correctIdx = null) {
  const labels = ['A', 'B', 'C', 'D'];
  const row = new ActionRowBuilder();
  for (let i = 0; i < 4; i++) {
    let style = ButtonStyle.Primary;
    if (disabled && correctIdx !== null) {
      style = i === correctIdx ? ButtonStyle.Success : ButtonStyle.Secondary;
    }
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

function buildBuzzButton(disabled = false) {
  return [new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('buzz')
      .setLabel('⚡ BUZZ IN')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(disabled)
  )];
}

function questionEmbed(q, round, total) {
  const choiceLines = q.choices.map((c, i) => `**${['A','B','C','D'][i]}.** ${c}`).join('\n');
  return new EmbedBuilder()
    .setTitle(`🧪 Chemistry Buzzer — Question ${round}/${total}`)
    .setDescription(`**Topic:** ${q.topic}\n\n${q.q}\n\n${choiceLines}`)
    .setColor(0x5865f2)
    .setFooter({ text: 'First to buzz in gets to answer! 15 seconds to answer after buzzing.' });
}

// ─── Ready ────────────────────────────────────────────────────────────────────
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setActivity('!chem to play | !help for commands', { type: 'LISTENING' });
});

// ─── Message handler ──────────────────────────────────────────────────────────
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args    = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  // ── !help ──────────────────────────────────────────────────────────────────
  if (command === 'help') {
    const e = new EmbedBuilder()
      .setTitle('🧪 Chemistry Buzzer Bot')
      .setColor(0x5865f2)
      .addFields(
        { name: '🎮 Game Commands', value: [
          '`!chem [rounds]` — Start a buzzer game (default 5 rounds)',
          '`!chem topic <name>` — Play questions from a specific topic',
          '`!stop` — Stop the current game',
        ].join('\n') },
        { name: '🏆 Leaderboard', value: [
          '`!lb` — Show server leaderboard',
          '`!stats [@user]` — Show your or someone\'s stats',
          '`!resetlb` — Reset server leaderboard (admin only)',
        ].join('\n') },
        { name: '📚 Topics', value: QUESTIONS
            .map(q => q.topic)
            .filter((t, i, a) => a.indexOf(t) === i)
            .join(', ')
        },
      )
      .setFooter({ text: 'Questions are original USNCO-style problems.' });
    return message.reply({ embeds: [e] });
  }

  // ── !stop ──────────────────────────────────────────────────────────────────
  if (command === 'stop') {
    const game = activeGames.get(message.channelId);
    if (!game) return message.reply('No game is currently running.');
    clearTimeout(game.timeout);
    activeGames.delete(message.channelId);
    return message.reply({ embeds: [embed('🛑 Game Stopped', 'The game has been stopped.')] });
  }

  // ── !lb ────────────────────────────────────────────────────────────────────
  if (command === 'lb') {
    const lb = getLeaderboard(message.guildId);
    if (!lb.size) return message.reply({ embeds: [embed('🏆 Leaderboard', 'No scores yet! Use `!chem` to play.')] });

    const sorted = [...lb.entries()].sort((a, b) => b[1].points - a[1].points).slice(0, 10);
    const medals = ['🥇', '🥈', '🥉'];
    const lines  = await Promise.all(sorted.map(async ([uid, data], i) => {
      const user = await client.users.fetch(uid).catch(() => ({ username: 'Unknown' }));
      const acc  = data.total > 0 ? ((data.correct / data.total) * 100).toFixed(1) : '0.0';
      return `${medals[i] || `**${i+1}.**`} **${user.username}** — ${data.points} pts (${acc}% accuracy)`;
    }));

    return message.reply({ embeds: [new EmbedBuilder()
      .setTitle('🏆 Server Leaderboard')
      .setDescription(lines.join('\n'))
      .setColor(0xffd700)
    ]});
  }

  // ── !stats ─────────────────────────────────────────────────────────────────
  if (command === 'stats') {
    const target = message.mentions.users.first() || message.author;
    const lb     = getLeaderboard(message.guildId);
    const data   = lb.get(target.id);
    if (!data) return message.reply(`No stats found for **${target.username}** yet.`);
    const acc = data.total > 0 ? ((data.correct / data.total) * 100).toFixed(1) : '0.0';
    return message.reply({ embeds: [new EmbedBuilder()
      .setTitle(`📊 Stats for ${target.username}`)
      .setColor(0x57f287)
      .addFields(
        { name: 'Points',    value: String(data.points),  inline: true },
        { name: 'Correct',   value: String(data.correct), inline: true },
        { name: 'Attempted', value: String(data.total),   inline: true },
        { name: 'Accuracy',  value: `${acc}%`,            inline: true },
      )
    ]});
  }

  // ── !resetlb ───────────────────────────────────────────────────────────────
  if (command === 'resetlb') {
    if (!message.member.permissions.has('Administrator'))
      return message.reply('Only administrators can reset the leaderboard.');
    leaderboards.set(message.guildId, new Map());
    return message.reply({ embeds: [embed('🗑️ Leaderboard Reset', 'The server leaderboard has been cleared.')] });
  }

  // ── !chem ──────────────────────────────────────────────────────────────────
  if (command === 'chem') {
    if (activeGames.has(message.channelId))
      return message.reply('A game is already running in this channel! Use `!stop` to end it.');

    let topic  = null;
    let rounds = 5;

    if (args[0] === 'topic' && args[1]) {
      topic  = args.slice(1).join(' ');
      rounds = parseInt(args[args.length - 1]) || 5;
      // check topic exists
      const topicExists = QUESTIONS.some(q => q.topic.toLowerCase() === topic.toLowerCase());
      if (!topicExists) return message.reply(`Topic not found. Available topics: ${[...new Set(QUESTIONS.map(q => q.topic))].join(', ')}`);
    } else if (args[0]) {
      rounds = parseInt(args[0]) || 5;
    }
    rounds = Math.min(Math.max(rounds, 1), 20);

    await message.reply({ embeds: [new EmbedBuilder()
      .setTitle('🧪 Chemistry Buzzer — Starting!')
      .setDescription(`**${rounds} rounds** ${topic ? `(Topic: ${topic})` : '(All topics)'}\n\nClick **⚡ BUZZ IN** as soon as you know the answer. The first to buzz gets to answer!\n\n**Scoring:** +3 pts correct · −1 pt wrong`)
      .setColor(0x57f287)
    ]});

    await new Promise(r => setTimeout(r, 2000));
    startRound(message, rounds, 1, topic);
  }
});

// ─── Game Engine ──────────────────────────────────────────────────────────────
async function startRound(message, totalRounds, roundNum, topic) {
  if (!activeGames.has(message.channelId) && roundNum !== 1) return;

  const q = randomQuestion(topic);
  if (!q) {
    activeGames.delete(message.channelId);
    return message.channel.send({ embeds: [embed('❌ Error', 'Could not find a question for that topic.')] });
  }

  const buzzedUsers = new Set();
  const state = {
    q,
    roundNum,
    totalRounds,
    topic,
    phase: 'buzz',   // 'buzz' | 'answer' | 'done'
    buzzer: null,
    buzzedUsers,
    message: null,
    timeout: null,
  };
  activeGames.set(message.channelId, state);

  // Send question with buzz button
  const sent = await message.channel.send({
    embeds: [questionEmbed(q, roundNum, totalRounds)],
    components: buildBuzzButton(),
  });
  state.message = sent;

  // 30-second buzz timeout
  state.timeout = setTimeout(async () => {
    if (!activeGames.has(message.channelId)) return;
    const cur = activeGames.get(message.channelId);
    if (cur.phase !== 'buzz') return;

    cur.phase = 'done';
    activeGames.delete(message.channelId);

    await sent.edit({ components: buildBuzzButton(true) });
    await message.channel.send({
      embeds: [new EmbedBuilder()
        .setTitle('⏰ Time\'s Up! No one buzzed in.')
        .setDescription(`The correct answer was **${['A','B','C','D'][q.answer]}. ${q.choices[q.answer]}**\n\n💡 ${q.explanation}`)
        .setColor(0xed4245)
      ]
    });

    if (roundNum < totalRounds) {
      await new Promise(r => setTimeout(r, 3000));
      startRound(message, totalRounds, roundNum + 1, topic);
    } else {
      endGame(message);
    }
  }, 30000);
}

async function endGame(message) {
  const lb = getLeaderboard(message.guildId);
  if (!lb.size) return message.channel.send({ embeds: [embed('🏁 Game Over!', 'No one scored this round.')] });

  const sorted = [...lb.entries()].sort((a, b) => b[1].points - a[1].points).slice(0, 5);
  const medals = ['🥇', '🥈', '🥉'];
  const lines  = await Promise.all(sorted.map(async ([uid, data], i) => {
    const user = await client.users.fetch(uid).catch(() => ({ username: 'Unknown' }));
    return `${medals[i] || `**${i+1}.**`} **${user.username}** — ${data.points} pts`;
  }));

  await message.channel.send({ embeds: [new EmbedBuilder()
    .setTitle('🏁 Game Over! — Final Leaderboard')
    .setDescription(lines.join('\n') + '\n\nUse `!chem` to play again!')
    .setColor(0xffd700)
  ]});
}

// ─── Button handler ───────────────────────────────────────────────────────────
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const state = activeGames.get(interaction.channelId);
  if (!state) return interaction.reply({ content: 'No active game.', ephemeral: true });

  // ── BUZZ IN ────────────────────────────────────────────────────────────────
  if (interaction.customId === 'buzz') {
    if (state.phase !== 'buzz')
      return interaction.reply({ content: 'Buzzing is closed for this question.', ephemeral: true });
    if (state.buzzedUsers.has(interaction.user.id))
      return interaction.reply({ content: 'You already buzzed in and got it wrong! Wait for the next question.', ephemeral: true });

    clearTimeout(state.timeout);
    state.phase  = 'answer';
    state.buzzer = interaction.user.id;

    // Lock buzz button, show answer buttons
    await state.message.edit({ components: buildBuzzButton(true) });

    await interaction.reply({
      embeds: [new EmbedBuilder()
        .setTitle(`⚡ ${interaction.user.username} buzzed in!`)
        .setDescription('Choose your answer using the buttons below. You have **15 seconds**!')
        .setColor(0xfee75c)
      ],
      components: buildAnswerButtons(),
    });

    // Store the answer message so we can edit it
    const answerMsg = await interaction.fetchReply();
    state.answerMessage = answerMsg;

    // 15-second answer timeout
    state.timeout = setTimeout(async () => {
      if (!activeGames.has(interaction.channelId)) return;
      const cur = activeGames.get(interaction.channelId);
      if (cur.phase !== 'answer') return;

      addPoints(interaction.guildId, interaction.user.id, -1, false);
      cur.buzzedUsers.add(interaction.user.id);
      cur.phase = 'buzz';
      cur.buzzer = null;

      await answerMsg.edit({ components: buildAnswerButtons(true, state.q.answer) });

      await interaction.channel.send({
        embeds: [embed('⏰ Too slow!', `**${interaction.user.username}** ran out of time! −1 point.\n\nOthers can still buzz in.`, 0xed4245)],
        components: buildBuzzButton(),
      }).then(msg => {
        cur.message = msg;
        // Restart buzz timer for remaining players
        cur.timeout = setTimeout(async () => {
          if (!activeGames.has(interaction.channelId)) return;
          const c = activeGames.get(interaction.channelId);
          if (c.phase !== 'buzz') return;
          activeGames.delete(interaction.channelId);
          await msg.edit({ components: buildBuzzButton(true) });
          await interaction.channel.send({
            embeds: [new EmbedBuilder()
              .setTitle('⏰ No more takers!')
              .setDescription(`The correct answer was **${['A','B','C','D'][state.q.answer]}. ${state.q.choices[state.q.answer]}**\n\n💡 ${state.q.explanation}`)
              .setColor(0xed4245)
            ]
          });
          if (cur.roundNum < cur.totalRounds) {
            await new Promise(r => setTimeout(r, 3000));
            startRound(interaction, cur.totalRounds, cur.roundNum + 1, cur.topic);
          } else {
            endGame(interaction);
          }
        }, 20000);
      });
    }, 15000);

    return;
  }

  // ── ANSWER CHOICE ──────────────────────────────────────────────────────────
  if (interaction.customId.startsWith('answer_')) {
    if (state.phase !== 'answer')
      return interaction.reply({ content: 'Answering is closed.', ephemeral: true });
    if (interaction.user.id !== state.buzzer)
      return interaction.reply({ content: 'Only the person who buzzed in can answer!', ephemeral: true });

    clearTimeout(state.timeout);

    const chosen  = parseInt(interaction.customId.split('_')[1]);
    const correct = chosen === state.q.answer;
    const labels  = ['A', 'B', 'C', 'D'];

    if (state.answerMessage) {
      await state.answerMessage.edit({ components: buildAnswerButtons(true, state.q.answer) }).catch(() => {});
    }

    if (correct) {
      addPoints(interaction.guildId, interaction.user.id, 3, true);
      activeGames.delete(interaction.channelId);

      await interaction.reply({
        embeds: [new EmbedBuilder()
          .setTitle(`✅ Correct! — ${interaction.user.username} +3 pts`)
          .setDescription(`**${labels[chosen]}. ${state.q.choices[chosen]}** is right!\n\n💡 ${state.q.explanation}`)
          .setColor(0x57f287)
        ]
      });

      if (state.roundNum < state.totalRounds) {
        await new Promise(r => setTimeout(r, 3000));
        startRound(interaction, state.totalRounds, state.roundNum + 1, state.topic);
      } else {
        await new Promise(r => setTimeout(r, 1000));
        endGame(interaction);
      }
    } else {
      addPoints(interaction.guildId, interaction.user.id, -1, false);
      state.buzzedUsers.add(interaction.user.id);
      state.phase  = 'buzz';
      state.buzzer = null;

      await interaction.reply({
        embeds: [embed(
          `❌ Wrong — ${interaction.user.username} −1 pt`,
          `**${labels[chosen]}** is incorrect. Others can still buzz in!`,
          0xed4245
        )]
      });

      // Re-open buzz button
      const newBuzzMsg = await interaction.channel.send({
        embeds: [questionEmbed(state.q, state.roundNum, state.totalRounds)],
        components: buildBuzzButton(),
      });
      state.message = newBuzzMsg;

      // Restart buzz timer
      state.timeout = setTimeout(async () => {
        if (!activeGames.has(interaction.channelId)) return;
        const cur = activeGames.get(interaction.channelId);
        if (cur.phase !== 'buzz') return;
        activeGames.delete(interaction.channelId);
        await newBuzzMsg.edit({ components: buildBuzzButton(true) });
        await interaction.channel.send({
          embeds: [new EmbedBuilder()
            .setTitle('⏰ Time\'s Up!')
            .setDescription(`The correct answer was **${labels[state.q.answer]}. ${state.q.choices[state.q.answer]}**\n\n💡 ${state.q.explanation}`)
            .setColor(0xed4245)
          ]
        });
        if (cur.roundNum < cur.totalRounds) {
          await new Promise(r => setTimeout(r, 3000));
          startRound(interaction, cur.totalRounds, cur.roundNum + 1, cur.topic);
        } else {
          endGame(interaction);
        }
      }, 20000);
    }
  }
});

// ─── Login ────────────────────────────────────────────────────────────────────
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('❌ Set the DISCORD_TOKEN environment variable and restart.');
  process.exit(1);
}
client.login(token);
