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

  // Descriptive Chemistry
  { topic: 'Descriptive Chemistry', q: 'Which of the following gases turns limewater milky white?', choices: ['SO₂', 'CO₂', 'NH₃', 'HCl'], answer: 1, explanation: 'CO₂ + Ca(OH)₂ → CaCO₃ (white precipitate) + H₂O.' },
  { topic: 'Descriptive Chemistry', q: 'Which flame color is associated with sodium ions?', choices: ['Red', 'Violet', 'Yellow', 'Green'], answer: 2, explanation: 'Sodium produces a characteristic bright yellow flame at 589 nm.' },
  { topic: 'Descriptive Chemistry', q: 'A white solid dissolves in water to give pH > 7. The solid is most likely:', choices: ['NaCl', 'Na₂CO₃', 'NH₄Cl', 'AlCl₃'], answer: 1, explanation: 'Na₂CO₃ is the salt of a strong base and weak acid; it hydrolyzes to give a basic solution.' },
  { topic: 'Descriptive Chemistry', q: 'Which halogen exists as a liquid at room temperature (25°C)?', choices: ['F₂', 'Cl₂', 'Br₂', 'I₂'], answer: 2, explanation: 'Bromine (Br₂) is the only halogen that is liquid at standard room temperature.' },
  { topic: 'Descriptive Chemistry', q: 'Which reagent is used to test for the presence of starch?', choices: ['Benedict\'s solution', 'Iodine solution', 'Biuret reagent', 'Fehling\'s solution'], answer: 1, explanation: 'Iodine turns dark blue-black in the presence of starch due to triiodide intercalation in the amylose helix.' },

  // States of Matter
  { topic: 'States of Matter', q: 'At STP, which gas would deviate most from ideal behavior?', choices: ['H₂', 'He', 'NH₃', 'N₂'], answer: 2, explanation: 'NH₃ has strong hydrogen bonding and a large dipole moment, causing the greatest deviation from ideal behavior.' },
  { topic: 'States of Matter', q: 'A gas at 27°C and 1.0 atm occupies 2.0 L. What volume will it occupy at 127°C and 1.0 atm?', choices: ['1.5 L', '2.67 L', '3.0 L', '4.0 L'], answer: 1, explanation: 'Charles\'s Law: V₂ = 2.0 × (400/300) = 2.67 L.' },
  { topic: 'States of Matter', q: 'Which intermolecular force explains the unusually high boiling point of water compared to H₂S?', choices: ['London dispersion forces', 'Dipole-dipole interactions', 'Hydrogen bonding', 'Ion-dipole forces'], answer: 2, explanation: 'Water forms extensive O–H···O hydrogen bonds, dramatically raising its boiling point.' },
  { topic: 'States of Matter', q: 'Which solid has the highest melting point?', choices: ['NaCl', 'CO₂', 'SiO₂', 'I₂'], answer: 2, explanation: 'SiO₂ is a covalent network solid with continuous Si–O bonds throughout, melting at ~1700°C.' },
  { topic: 'States of Matter', q: 'According to kinetic molecular theory, which is true at higher temperatures?', choices: ['Gas molecules move slower on average', 'The speed distribution narrows', 'Average kinetic energy of molecules increases', 'Molecules spend more time in collisions'], answer: 2, explanation: 'KE_avg = (3/2)kT; average kinetic energy is directly proportional to absolute temperature.' },

  // Thermodynamics
  { topic: 'Thermodynamics', q: 'Which process has a negative ΔS?', choices: ['Melting of ice', 'Dissolving NH₄NO₃ in water', 'Condensation of steam to liquid water', 'Sublimation of dry ice'], answer: 2, explanation: 'Gas → liquid greatly reduces molecular freedom; ΔS < 0.' },
  { topic: 'Thermodynamics', q: 'A reaction has ΔH = −100 kJ/mol and ΔS = −200 J/(mol·K). Above what temperature is it non-spontaneous?', choices: ['200 K', '300 K', '500 K', '750 K'], answer: 2, explanation: 'ΔG = 0 when T = ΔH/ΔS = 100000/200 = 500 K. Above 500 K, ΔG > 0 (non-spontaneous).' },
  { topic: 'Thermodynamics', q: 'Using Hess\'s Law: A→B ΔH=+50 kJ; B→C ΔH=−80 kJ. What is ΔH for A→C?', choices: ['+130 kJ', '−130 kJ', '−30 kJ', '+30 kJ'], answer: 2, explanation: 'ΔH(A→C) = +50 + (−80) = −30 kJ.' },
  { topic: 'Thermodynamics', q: 'How much heat is needed to raise 50.0 g of water from 20.0°C to 80.0°C? (c = 4.18 J/g·°C)', choices: ['8.36 kJ', '12.54 kJ', '16.72 kJ', '4.18 kJ'], answer: 1, explanation: 'q = mcΔT = 50.0 × 4.18 × 60.0 = 12,540 J = 12.54 kJ.' },
  { topic: 'Thermodynamics', q: 'A spontaneous exothermic reaction with ΔS > 0 is spontaneous:', choices: ['Only at high temperatures', 'Only at low temperatures', 'At all temperatures', 'Never'], answer: 2, explanation: 'When ΔH < 0 and ΔS > 0, ΔG = ΔH − TΔS is always negative.' },
  { topic: 'Thermodynamics', q: 'For N₂(g) + 3H₂(g) → 2NH₃(g), which is true about ΔS?', choices: ['ΔS > 0 because bonds form', 'ΔS < 0 because 4 mol gas → 2 mol gas', 'ΔS = 0 because no phase change', 'ΔS > 0 because temperature rises'], answer: 1, explanation: 'Fewer moles of gas means less disorder; ΔS < 0.' },

  // Kinetics
  { topic: 'Kinetics', q: 'For a first-order reaction, if the initial concentration doubles, the initial rate:', choices: ['Stays the same', 'Doubles', 'Quadruples', 'Increases 8×'], answer: 1, explanation: 'rate = k[A]; doubling [A] doubles the rate.' },
  { topic: 'Kinetics', q: 'The half-life of a first-order reaction is 20 minutes. What fraction remains after 60 minutes?', choices: ['1/2', '1/4', '1/6', '1/8'], answer: 3, explanation: '60 min = 3 half-lives; (1/2)³ = 1/8.' },
  { topic: 'Kinetics', q: 'Increasing temperature increases the rate constant primarily because:', choices: ['More molecules exceed the activation energy', 'Activation energy decreases', 'The frequency factor A decreases', 'The equilibrium constant increases'], answer: 0, explanation: 'Higher T shifts the Maxwell-Boltzmann distribution so more molecules have energy ≥ E_a.' },
  { topic: 'Kinetics', q: 'Which statement about a catalyst is correct?', choices: ['It increases activation energy', 'It is consumed in the reaction', 'It provides a lower-energy pathway', 'It changes ΔH of reaction'], answer: 2, explanation: 'A catalyst lowers E_a by providing an alternative mechanism; it is not consumed and does not change ΔH.' },
  { topic: 'Kinetics', q: 'For rate = k[A]²[B]: if [A] is halved and [B] is doubled, the rate:', choices: ['Doubles', 'Halves', 'Stays the same', 'Quadruples'], answer: 1, explanation: 'New rate = k(A/2)²(2B) = (1/4)(2)k[A]²[B] = (1/2) rate. Rate is halved.' },
  { topic: 'Kinetics', q: 'The rate-determining step of a mechanism is:', choices: ['Always the first step', 'The step with lowest activation energy', 'The slowest step', 'The step producing the most product'], answer: 2, explanation: 'The slowest step controls the overall rate — it is the bottleneck of the mechanism.' },

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

  // Electrochemistry
  { topic: 'Electrochemistry', q: 'In an electrochemical cell, oxidation occurs at the:', choices: ['Cathode in galvanic cells only', 'Anode in both galvanic and electrolytic cells', 'Cathode in both cell types', 'Anode in electrolytic cells only'], answer: 1, explanation: 'Oxidation always occurs at the anode, in both galvanic and electrolytic cells.' },
  { topic: 'Electrochemistry', q: 'E°(Zn²⁺/Zn) = −0.76 V; E°(Cu²⁺/Cu) = +0.34 V. What is E°cell for a Zn-Cu galvanic cell?', choices: ['−1.10 V', '+0.42 V', '+1.10 V', '−0.42 V'], answer: 2, explanation: 'E°cell = E°cathode − E°anode = 0.34 − (−0.76) = +1.10 V.' },
  { topic: 'Electrochemistry', q: 'The Nernst equation accounts for the effect of:', choices: ['Temperature only', 'Concentration only', 'Both temperature and concentration', 'Pressure only'], answer: 2, explanation: 'E = E° − (RT/nF)lnQ includes both temperature (T) and concentration (via Q).' },
  { topic: 'Electrochemistry', q: 'How many moles of electrons are transferred when 1 mol Cr²⁺ is oxidized to Cr³⁺?', choices: ['1 mol e⁻', '2 mol e⁻', '3 mol e⁻', '6 mol e⁻'], answer: 0, explanation: 'Cr²⁺ → Cr³⁺ + 1e⁻; each Cr loses 1 electron.' },
  { topic: 'Electrochemistry', q: 'What is deposited at the cathode when aqueous CuSO₄ is electrolyzed?', choices: ['Oxygen gas', 'Sulfur', 'Copper metal', 'Hydrogen gas'], answer: 2, explanation: 'Cu²⁺ + 2e⁻ → Cu(s). Copper metal plates out at the cathode.' },

  // Atomic Structure
  { topic: 'Atomic Structure', q: 'Which electron configuration represents an excited state of carbon?', choices: ['1s²2s²2p²', '1s²2s²2p¹3s¹', '1s²2s¹2p³', '1s²2p⁴'], answer: 1, explanation: 'Ground state C = 1s²2s²2p². Having an electron in 3s is an excited state.' },
  { topic: 'Atomic Structure', q: 'Which element has the highest first ionization energy?', choices: ['Na', 'Cl', 'Ar', 'K'], answer: 2, explanation: 'Argon has a full valence shell and the highest first ionization energy of these elements.' },
  { topic: 'Atomic Structure', q: 'Which correctly orders increasing atomic radius?', choices: ['F < O < N < C', 'C < N < O < F', 'Na < Mg < Al < Si', 'F < Cl < Br < I'], answer: 3, explanation: 'Atomic radius increases down a group as electrons fill higher shells: F < Cl < Br < I.' },
  { topic: 'Atomic Structure', q: 'The de Broglie wavelength λ = h/p, so it is inversely proportional to:', choices: ['Charge', 'Momentum', 'Potential energy', 'Atomic number'], answer: 1, explanation: 'λ = h/p; wavelength is inversely proportional to momentum (mass × velocity).' },
  { topic: 'Atomic Structure', q: '²³⁸₉₂U undergoes alpha decay. What is the product?', choices: ['²³⁴₉₀Th', '²³⁸₉₃Np', '²³⁴₉₁Pa', '²³⁶₉₀Th'], answer: 0, explanation: 'Alpha decay: A decreases by 4, Z by 2. 238−4=234, 92−2=90 → ²³⁴₉₀Th.' },
  { topic: 'Atomic Structure', q: 'Which quantum number describes the shape of an orbital?', choices: ['Principal (n)', 'Angular momentum (l)', 'Magnetic (mₗ)', 'Spin (mₛ)'], answer: 1, explanation: 'l determines shape: 0=s, 1=p, 2=d, 3=f.' },

  // Bonding
  { topic: 'Bonding', q: 'What is the electron geometry of SF₄?', choices: ['Tetrahedral', 'Trigonal bipyramidal', 'Octahedral', 'Seesaw'], answer: 1, explanation: 'SF₄ has 4 bonding pairs + 1 lone pair = 5 electron groups → trigonal bipyramidal electron geometry.' },
  { topic: 'Bonding', q: 'Which molecule is polar?', choices: ['BF₃', 'CCl₄', 'SF₆', 'CHCl₃'], answer: 3, explanation: 'CHCl₃ has an asymmetric arrangement of Cl atoms, giving a net dipole moment. The others are symmetric.' },
  { topic: 'Bonding', q: 'In MO theory, which species has the highest bond order?', choices: ['O₂', 'O₂⁺', 'O₂⁻', 'O₂²⁻'], answer: 1, explanation: 'Bond orders: O₂=2, O₂⁺=2.5, O₂⁻=1.5, O₂²⁻=1. O₂⁺ is highest.' },
  { topic: 'Bonding', q: 'What hybridization do carbon atoms in benzene exhibit?', choices: ['sp', 'sp²', 'sp³', 'sp³d'], answer: 1, explanation: 'Each C forms 3 sigma bonds (sp²), with remaining p orbitals forming the delocalized π system.' },
  { topic: 'Bonding', q: 'What is the formal charge on N in NO₃⁻ (one double bond, two single bonds to O)?', choices: ['+1', '0', '−1', '+2'], answer: 0, explanation: 'Formal charge = 5 − 0 − (8/2) = +1.' },
  { topic: 'Bonding', q: 'Which has the shortest bond length?', choices: ['C–C single bond', 'C=C double bond', 'C≡C triple bond', 'C–H bond'], answer: 2, explanation: 'Higher bond order → shorter bond. C≡C (~120 pm) < C=C (~134 pm) < C–C (~154 pm).' },

  // Organic Chemistry
  { topic: 'Organic Chemistry', q: 'What is the IUPAC name for CH₃CH₂CH(CH₃)CH₂CH₃?', choices: ['2-methylpentane', '3-methylpentane', '2-ethylbutane', '3-methylhexane'], answer: 1, explanation: 'Longest chain = 5 carbons (pentane); methyl group on C3 → 3-methylpentane.' },
  { topic: 'Organic Chemistry', q: 'Which reaction converts an alkene to a diol?', choices: ['Hydrohalogenation', 'Syn-dihydroxylation with OsO₄', 'Hydrogenation', 'Dehydration'], answer: 1, explanation: 'OsO₄ (or cold KMnO₄) adds two −OH groups syn to give a vicinal diol.' },
  { topic: 'Organic Chemistry', q: 'An ester is formed by the reaction of:', choices: ['An alcohol and a carboxylic acid', 'An aldehyde and a ketone', 'Two alcohols', 'An amine and an aldehyde'], answer: 0, explanation: 'Fischer esterification: R-COOH + R\'-OH ⇌ R-COOR\' + H₂O.' },
  { topic: 'Organic Chemistry', q: 'Correct order of carbocation stability (most → least stable):', choices: ['Tertiary > Secondary > Primary > Methyl', 'Primary > Secondary > Tertiary > Methyl', 'Methyl > Primary > Secondary > Tertiary', 'Secondary > Tertiary > Primary > Methyl'], answer: 0, explanation: 'More alkyl groups donate electron density and stabilize the positive charge.' },
  { topic: 'Organic Chemistry', q: 'Markovnikov\'s rule predicts HBr adds to CH₃CH=CH₂ with Br going to:', choices: ['C1 (terminal carbon)', 'C2 (internal carbon)', 'Both equally', 'Neither; elimination occurs'], answer: 1, explanation: 'H adds to C1 (more H\'s), Br adds to C2, forming 2-bromopropane via the more stable 2° carbocation.' },
  { topic: 'Organic Chemistry', q: 'Which technique is most useful for identifying carbon connectivity in an organic molecule?', choices: ['IR spectroscopy', 'UV-Vis spectroscopy', '¹H NMR spectroscopy', '¹³C NMR spectroscopy'], answer: 3, explanation: '¹³C NMR directly probes each unique carbon environment, mapping carbon connectivity.' },
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
