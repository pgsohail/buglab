/* bugslab blog — 2027 queue, January to March. Each post goes live on its date. */
window.BLOG_POSTS = (window.BLOG_POSTS || []).concat([

{
slug: 'ai-trends-to-watch-2027',
title: 'AI in 2027: the trends we are watching',
date: '2027-01-18',
tag: 'AI & machine learning',
excerpt: 'Less hype, more plumbing. The AI shifts most likely to matter to real products this year, and how to prepare for each.',
takeaways: [
    'Agents move from demos to narrow, real workflows',
    'Smaller and cheaper models get good enough for most tasks',
    'Evaluation and governance become core engineering work'
],
body: `
<p>Every January brings a wave of predictions. Most of them age badly. Instead of guessing which model wins, we look at the shifts that change how products are built. These are the ones we expect to matter most this year, and what you can do about each one today.</p>

<h2>1. Agents get narrower, and more useful</h2>
<p>General "do anything" agents make great demos and unreliable products. The agents that deliver value tend to own one workflow end to end: triaging support tickets, reconciling invoices, preparing a weekly report. Expect more teams to ship focused agents with clear permissions and human checkpoints, rather than open-ended assistants.</p>
<p><strong>What to do now:</strong> list the repetitive, rules-heavy workflows in your business. The best agent candidates are tasks that are tedious for people but easy to check.</p>

<h2>2. Small models become the default</h2>
<p>The largest models are impressive, but many everyday tasks such as classification, extraction, summarisation and routing do not need them. Smaller models are faster and cheaper, and can often run on your own infrastructure or even on a user's device.</p>
<p><strong>What to do now:</strong> for each AI feature, ask whether a smaller model would pass your evaluation set. Often the answer is yes.</p>

<h2>3. Evaluation becomes a discipline</h2>
<p>Teams that ship AI successfully treat evaluation like testing: versioned datasets, clear scoring, and checks on every change. As AI moves into more critical workflows, this stops being optional.</p>

<h2>4. Governance and regulation catch up</h2>
<p>Rules for AI, such as the EU AI Act, are being phased in, and customers increasingly ask how AI features handle their data. Documentation, data lineage and audit logs are becoming part of the product.</p>
<p><strong>What to do now:</strong> keep a simple register of where AI is used in your product, what data it sees and who is responsible for it.</p>

<h2>5. AI meets your existing data</h2>
<p>The biggest gains rarely come from a new model. They come from connecting AI to clean, well-organised company data. That makes data engineering, the unglamorous part, more valuable than ever.</p>

<h2>The common thread</h2>
<p>The winners this year will not be the teams with access to the most advanced model. Everyone has that. They will be the teams that pick the right problems, measure quality honestly and connect AI to good data.</p>
`
},

{
slug: 'account-abstraction-explained',
title: 'Account abstraction: making crypto wallets feel normal',
date: '2027-01-25',
tag: 'Blockchain & Web3',
excerpt: 'Seed phrases and gas fees scare off most people. Account abstraction lets wallets behave like the apps users already know.',
takeaways: [
    'Smart accounts replace fragile seed phrases',
    'Apps can sponsor gas so users never see it',
    'Recovery and spending limits become possible'
],
body: `
<p>Ask a new user to write down twelve random words, buy a separate token to pay fees, and approve cryptic transactions, and most of them leave. Account abstraction is a set of ideas, implemented on Ethereum through standards such as ERC-4337, that lets wallets behave much more like normal apps.</p>

<h2>The problem with traditional wallets</h2>
<p>A classic Ethereum account is controlled by a single private key. Lose it and the funds are gone. Leak it and they are stolen. Every transaction must be paid for in the chain's native token, and the rules for what the account can do are fixed.</p>

<h2>What changes with smart accounts</h2>
<p>With account abstraction, the user's account is itself a smart contract. That contract decides what counts as a valid transaction, which unlocks features people expect from any modern app:</p>
<ul>
<li><strong>Social or device-based recovery:</strong> regain access through trusted contacts or a second device, instead of a seed phrase.</li>
<li><strong>Passkeys and biometrics:</strong> sign in with the same face or fingerprint unlock used for banking apps.</li>
<li><strong>Sponsored gas:</strong> the app pays fees on the user's behalf, or lets them pay in a stablecoin.</li>
<li><strong>Batching:</strong> approve and swap in one click instead of two separate transactions.</li>
<li><strong>Spending limits and session keys:</strong> let a game spend small amounts without a pop-up every time, while large transfers still need full approval.</li>
</ul>

<h2>What builders should watch out for</h2>
<ul>
<li>The account is now code, so it needs the same audit care as any contract that holds funds.</li>
<li>Recovery mechanisms must be designed carefully. A weak recovery path is a backdoor.</li>
<li>Gas sponsorship costs money and can be abused, so rate limits and rules are essential.</li>
</ul>

<h2>Why it matters</h2>
<p>Most people will never care how blockchains work. They will care whether an app is easy and safe to use. Account abstraction is one of the most practical steps towards products that people outside crypto can use without a tutorial.</p>
`
},

{
slug: 'modern-data-stack-consolidation',
title: 'The modern data stack is consolidating: what it means for you',
date: '2027-02-01',
tag: 'Data engineering',
excerpt: 'Ten tools glued together was the norm. Now platforms are absorbing more of the stack. Here is how to choose without regret.',
takeaways: [
    'Fewer tools usually means fewer failure points',
    'Keep your data in open formats',
    'Choose by team skills, not hype'
],
body: `
<p>A few years ago a typical data setup used a separate tool for ingestion, storage, transformation, orchestration, quality checks, cataloguing, BI and reverse ETL. Each was good at its job, and together they were expensive, fragile and hard to own. The trend now is consolidation: larger platforms are absorbing many of these jobs.</p>

<h2>Why consolidation is happening</h2>
<ul>
<li><strong>Cost:</strong> every tool brings a licence, an integration to maintain and someone who needs to understand it.</li>
<li><strong>Reliability:</strong> each hand-off between tools is a place where data can break silently.</li>
<li><strong>Governance:</strong> access control and lineage are far easier when data stays in one place.</li>
</ul>

<h2>The risk: lock-in</h2>
<p>An all-in-one platform is convenient until you want to leave, or until pricing changes. The best protection is to keep data in open formats. Open table formats such as Apache Iceberg and Delta Lake let several engines read the same data, so your storage is not tied to one vendor's compute.</p>

<h2>How to decide what you need</h2>
<ol>
<li><strong>Start from questions, not tools.</strong> What decisions does the business need data for, and how fresh does it need to be?</li>
<li><strong>Count your people.</strong> A two-person team should not run eight tools. Pick the smallest stack your team can confidently operate.</li>
<li><strong>Keep transformations in code.</strong> SQL or Python models in version control can move between platforms; logic hidden in a UI cannot.</li>
<li><strong>Test the exit.</strong> Before committing, check how you would export your data and models if you had to.</li>
</ol>

<h2>Our take</h2>
<p>For most small and mid-sized teams, a single well-chosen platform plus a code-based transformation layer beats a sprawling stack. Spend the time you save on data quality and on answering the questions the business actually asks.</p>
`
},

{
slug: 'ai-assisted-debugging',
title: 'AI-assisted debugging: where it helps and where it hurts',
date: '2027-02-08',
tag: 'Debugging & QA',
excerpt: 'AI tools can explain stack traces and suggest fixes in seconds. They can also confidently send you the wrong way.',
takeaways: [
    'Great for explaining errors and unfamiliar code',
    'Always reproduce before trusting a suggested fix',
    'Never paste secrets or customer data into tools'
],
body: `
<p>AI coding assistants have changed how many developers debug. Paste in an error and you get an explanation and a fix almost instantly. Sometimes that saves an hour. Sometimes it costs one, because the answer was plausible and wrong.</p>

<h2>Where AI genuinely helps</h2>
<ul>
<li><strong>Explaining errors:</strong> cryptic compiler messages, long stack traces and obscure library errors become readable.</li>
<li><strong>Understanding unfamiliar code:</strong> ask what a function does, or why a pattern was used, before you change it.</li>
<li><strong>Generating hypotheses:</strong> "what could cause this?" produces a useful checklist of possibilities to test.</li>
<li><strong>Writing reproduction tests:</strong> describe the bug and get a first draft of a failing test.</li>
<li><strong>Searching logs:</strong> summarising large log extracts to spot the unusual lines.</li>
</ul>

<h2>Where it hurts</h2>
<ul>
<li><strong>Confident guesses:</strong> the tool does not run your code. It predicts likely answers, which can be wrong for your specific system.</li>
<li><strong>Symptom fixes:</strong> wrapping code in a try/except or adding a null check can hide the real cause.</li>
<li><strong>Outdated knowledge:</strong> suggestions may use APIs that have changed in the version you use.</li>
<li><strong>Data leaks:</strong> pasting production data, keys or customer details into an external tool can break policy and law.</li>
</ul>

<h2>A workflow that works</h2>
<ol>
<li>Reproduce the bug yourself first.</li>
<li>Use AI to explain the error and list possible causes.</li>
<li>Test the hypotheses against the real system, one at a time.</li>
<li>Write a failing test, then apply the fix and confirm it passes.</li>
<li>Review the fix as carefully as you would a colleague's code.</li>
</ol>

<h2>The bottom line</h2>
<p>Treat AI as a knowledgeable colleague who has never seen your system. Great for ideas and explanations, but the evidence still has to come from your code, your logs and your tests.</p>
`
},

{
slug: 'small-language-models',
title: 'Small language models: why smaller can be smarter for your product',
date: '2027-02-15',
tag: 'AI & machine learning',
excerpt: 'You do not need the biggest model for most tasks. Smaller models are faster, cheaper and easier to keep private.',
takeaways: [
    'Match model size to task difficulty',
    'Small models cut latency and cost dramatically',
    'Route only hard requests to large models'
],
body: `
<p>It is tempting to use the most capable model for everything. But many product features, such as tagging tickets, extracting fields from documents or classifying intent, are well within the reach of much smaller models. Choosing the right size is one of the easiest wins in AI engineering.</p>

<h2>What small models are good at</h2>
<ul>
<li>Classification and routing ("is this a refund request or a bug report?").</li>
<li>Structured extraction (names, dates, amounts from invoices or emails).</li>
<li>Short summaries and rewriting.</li>
<li>Narrow tasks after light fine-tuning on your own examples.</li>
</ul>

<h2>Why they matter</h2>
<ul>
<li><strong>Speed:</strong> responses in milliseconds make features feel instant.</li>
<li><strong>Cost:</strong> running many requests becomes affordable at scale.</li>
<li><strong>Privacy:</strong> small models can run on your own servers, or on the user's device, so sensitive data never leaves your control.</li>
<li><strong>Reliability:</strong> fewer external dependencies and more predictable behaviour.</li>
</ul>

<h2>The routing pattern</h2>
<p>A common design is a cascade: a small model handles every request first and also judges its own confidence. Easy requests are answered immediately. Hard or uncertain ones are passed to a larger model. Most traffic stays fast and cheap, while quality on difficult cases stays high.</p>

<h2>How to decide</h2>
<ol>
<li>Build an evaluation set for the task.</li>
<li>Test a few model sizes against it.</li>
<li>Pick the smallest model that meets your quality bar, and re-check when your data or requirements change.</li>
</ol>
<p>Bigger is not better. Better is the model that meets your quality bar at the lowest cost and latency.</p>
`
},

{
slug: 'real-world-asset-tokenisation',
title: 'Real-world asset tokenisation, explained simply',
date: '2027-02-22',
tag: 'Blockchain & Web3',
excerpt: 'Bonds, funds, property and invoices are moving on-chain. What tokenisation actually means, and the hard parts nobody advertises.',
takeaways: [
    'A token is only as good as the legal claim behind it',
    'Compliance logic lives in the contract',
    'Oracles and custody are the weak points'
],
body: `
<p>Tokenisation means representing ownership of a real-world asset, such as a government bond, a fund share, a building or an invoice, as a token on a blockchain. Financial institutions have been experimenting with it seriously, mainly for faster settlement, around-the-clock trading and easier fractional ownership.</p>

<h2>What you actually gain</h2>
<ul>
<li><strong>Faster settlement:</strong> transfers can settle in minutes instead of days.</li>
<li><strong>Fractional ownership:</strong> an asset can be split into small units.</li>
<li><strong>Programmability:</strong> interest payments, transfer rules and reporting can be automated in code.</li>
<li><strong>Transparency:</strong> ownership history is visible and auditable.</li>
</ul>

<h2>The hard parts</h2>
<p><strong>The legal link.</strong> A token does not magically give you the building. The legal structure must make the token holder's rights enforceable off-chain. Without that, the token is just a number.</p>
<p><strong>Compliance.</strong> Most real-world assets can only be held by verified or eligible investors. That usually means permissioned tokens, with allow-lists, transfer restrictions and the ability for an administrator to freeze or recover tokens under defined conditions.</p>
<p><strong>Custody and data.</strong> Someone must hold the real asset and report its value. Prices and events such as defaults enter the chain through oracles, which are a point of trust and failure.</p>

<h2>Engineering considerations</h2>
<ul>
<li>Use well-established token standards and add compliance hooks rather than inventing your own.</li>
<li>Design admin powers carefully, protect them with multisig and timelocks, and document them clearly.</li>
<li>Plan for corporate actions: dividends, redemptions, splits and maturity.</li>
<li>Audit both the contracts and the off-chain processes that feed them.</li>
</ul>

<h2>Where this is heading</h2>
<p>Tokenisation looks less like a revolution and more like gradual plumbing upgrades in finance. The projects that succeed will be the ones that treat legal, compliance and operations as seriously as the smart contracts.</p>
`
},

{
slug: 'data-contracts',
title: 'Data contracts: stop upstream changes from breaking you',
date: '2027-03-01',
tag: 'Data engineering',
excerpt: 'A renamed column upstream silently breaks a dashboard downstream. Data contracts turn that surprise into a conversation.',
takeaways: [
    'Agree on schema and meaning between producers and consumers',
    'Enforce the contract automatically in CI',
    'Version changes instead of breaking them'
],
body: `
<p>Most data teams know the pain: an application team renames a field or changes its type, and a week later finance notices their numbers look wrong. Nobody did anything malicious. There was just no agreement about what the data should look like. A data contract is that agreement, written down and enforced.</p>

<h2>What goes in a data contract</h2>
<ul>
<li><strong>Schema:</strong> field names, types and which ones are required.</li>
<li><strong>Meaning:</strong> what each field represents, in plain language. "amount" in pence or pounds? Before or after tax?</li>
<li><strong>Quality rules:</strong> allowed values, uniqueness, acceptable null rates.</li>
<li><strong>Freshness:</strong> how often data arrives and how late it may be.</li>
<li><strong>Ownership:</strong> who produces the data and who to contact when something changes.</li>
</ul>

<h2>Making it real</h2>
<p>A contract in a wiki page is a nice intention. A contract checked automatically is protection. Store the contract as code (for example as a YAML or JSON schema) next to the producing service. In CI, check that changes to that service still satisfy the contract. If a change breaks it, the build fails before the problem reaches production.</p>

<h2>Handling change</h2>
<p>Contracts do not freeze data forever. They make change deliberate:</p>
<ol>
<li>Add new fields freely, since that rarely breaks consumers.</li>
<li>For breaking changes, publish a new version alongside the old one.</li>
<li>Give consumers time to migrate, then retire the old version.</li>
</ol>

<h2>Where to start</h2>
<p>Do not try to cover everything. Pick the two or three data sources that feed your most important reports or models, write contracts for them with their owners, and add automated checks. The conversations you have along the way are often as valuable as the contracts themselves.</p>
`
},

{
slug: 'observability-vs-monitoring',
title: 'Observability vs monitoring: knowing why, not just what',
date: '2027-03-08',
tag: 'Debugging & QA',
excerpt: 'Monitoring tells you something is broken. Observability helps you work out why, even for problems you never predicted.',
takeaways: [
    'Monitoring answers known questions',
    'Observability lets you ask new ones',
    'Logs, metrics and traces work best together'
],
body: `
<p>"Observability" is often used as a fancy word for monitoring. The difference is real and practical. Monitoring watches for problems you anticipated. Observability gives you enough information to investigate problems you did not.</p>

<h2>Monitoring: known unknowns</h2>
<p>Monitoring is dashboards and alerts on things you decided in advance were important: CPU above 90%, error rate above 1%, checkout latency above two seconds. It is essential, and it tells you <em>that</em> something is wrong.</p>

<h2>Observability: unknown unknowns</h2>
<p>Real incidents are often new. "Checkout is slow, but only for customers in Germany using Apple Pay on the mobile app." No dashboard was built for that. An observable system lets you slice its data by any of those attributes and find the cause without shipping new code.</p>

<h2>The three signals</h2>
<ul>
<li><strong>Metrics:</strong> cheap numbers over time, great for trends and alerts.</li>
<li><strong>Logs:</strong> detailed records of individual events, best when structured.</li>
<li><strong>Traces:</strong> the path of a single request through every service, with timings for each step.</li>
</ul>
<p>Each is useful alone. Together they let you jump from "error rate spiked" (metric) to "these requests failed" (traces) to "here is the exact error" (logs).</p>

<h2>Practical steps</h2>
<ol>
<li>Adopt an open standard such as OpenTelemetry so instrumentation is not tied to one vendor.</li>
<li>Attach rich context to every event: user type, region, version, feature flag state.</li>
<li>Propagate trace IDs across services, queues and background jobs.</li>
<li>Alert on symptoms users feel, such as errors and latency, not every internal metric.</li>
</ol>

<h2>The payoff</h2>
<p>Good observability shrinks the time between "something is wrong" and "we know why" from hours to minutes. That makes incidents shorter, on-call less stressful and releases less scary.</p>
`
},

{
slug: 'multimodal-ai-products',
title: 'Multimodal AI: products that can see, hear and read',
date: '2027-03-15',
tag: 'AI & machine learning',
excerpt: 'Models that understand images, audio and documents together open up practical features. Here are the ones worth building.',
takeaways: [
    'Documents and photos are the quickest wins',
    'Combine vision with your own data for accuracy',
    'Always keep a human check for high-stakes outputs'
],
body: `
<p>Early language models only read text. Many current models can also take in images, scanned documents, audio and sometimes video. That is not just a novelty. It removes a lot of manual work that used to need people to look at things and type what they saw.</p>

<h2>Practical features you can build today</h2>
<ul>
<li><strong>Document understanding:</strong> read invoices, receipts, contracts and forms, including tables and handwriting, and turn them into structured data.</li>
<li><strong>Photo-based support:</strong> a customer sends a photo of an error screen or a damaged product, and the system understands the problem.</li>
<li><strong>Inspection and quality checks:</strong> flag visible defects or missing items in images from a warehouse or production line.</li>
<li><strong>Meeting and call notes:</strong> transcribe audio, then summarise decisions and actions.</li>
<li><strong>Accessibility:</strong> describe images for screen-reader users and caption audio automatically.</li>
</ul>

<h2>Making it accurate</h2>
<p>Out-of-the-box results can be impressive and still not good enough for production. Accuracy improves when you:</p>
<ul>
<li>Ask for structured output, such as JSON with specific fields, instead of free text.</li>
<li>Validate extracted values against your own data (does this supplier exist? does the total match the line items?).</li>
<li>Provide examples of your real documents rather than generic ones.</li>
<li>Measure performance on a test set of real inputs, including blurry, rotated and unusual ones.</li>
</ul>

<h2>Risks to manage</h2>
<ul>
<li>Images and audio can contain personal data, so apply the same privacy rules as for text.</li>
<li>Models can misread numbers, so be extra careful with amounts, dates and IDs.</li>
<li>For high-stakes decisions such as payments or approvals, keep a person in the loop.</li>
</ul>
<p>Multimodal AI is most valuable where people currently spend time looking and typing. Find those tasks, and you have found your first project.</p>
`
},

{
slug: 'layer-2-rollups-explained',
title: 'Layer 2s explained: rollups, fees and trade-offs',
date: '2027-03-22',
tag: 'Blockchain & Web3',
excerpt: 'Most Ethereum activity now happens on Layer 2 networks. What rollups are, how they differ, and how to choose one to build on.',
takeaways: [
    'Rollups batch transactions and post them to Ethereum',
    'Optimistic and ZK rollups trade off speed and complexity',
    'Check decentralisation and exit options before building'
],
body: `
<p>Ethereum is secure but has limited capacity, which made transactions expensive at busy times. Layer 2 networks (L2s) were built to fix that. They process transactions off the main chain and post compressed results back to it, inheriting much of its security at a fraction of the cost.</p>

<h2>How rollups work</h2>
<p>A rollup collects many transactions, executes them, and publishes the data and resulting state to Ethereum. Because the data is on Ethereum, anyone can reconstruct the rollup's state and check that it is correct. The question is <em>how</em> correctness is guaranteed.</p>

<h2>Optimistic rollups</h2>
<p>Optimistic rollups assume batches are valid unless someone proves otherwise. There is a challenge window, often around a week, during which anyone can submit a fraud proof. The trade-off: withdrawing directly back to Ethereum can take that long, although third-party bridges offer faster exits for a fee.</p>

<h2>Zero-knowledge rollups</h2>
<p>ZK rollups attach a cryptographic proof to each batch showing it was executed correctly. Ethereum verifies the proof, so there is no long challenge window. The trade-off is engineering complexity and the cost of generating proofs, although both have improved quickly.</p>

<h2>What to check before building on one</h2>
<ul>
<li><strong>Who runs the sequencer?</strong> Many L2s still rely on a single operator to order transactions. Understand what happens if it goes down or censors users.</li>
<li><strong>Can users exit on their own?</strong> A safe rollup lets users withdraw to Ethereum even if the operator disappears.</li>
<li><strong>Upgrade keys:</strong> who can change the rollup's contracts, and is there a delay to let users leave first?</li>
<li><strong>Ecosystem:</strong> wallets, bridges, oracles and liquidity matter as much as raw speed.</li>
<li><strong>EVM compatibility:</strong> how much existing Solidity code and tooling works unchanged?</li>
</ul>

<h2>Our view</h2>
<p>For most new applications, building on a mature L2 is the sensible default. Pick one based on security assumptions and ecosystem, not just the lowest fee this week.</p>
`
},

{
slug: 'vector-databases-explained',
title: 'Vector databases: what they are and when you need one',
date: '2027-03-29',
tag: 'Data engineering',
excerpt: 'Vector search powers AI features like semantic search and RAG. You may not need a new database to get it.',
takeaways: [
    'Embeddings turn meaning into numbers you can search',
    'Start with vector support in your existing database',
    'Hybrid search usually beats pure vector search'
],
body: `
<p>Vector databases became famous alongside AI assistants. They store embeddings, lists of numbers that represent the meaning of text, images or other data, and find items with similar meaning quickly. That powers semantic search, recommendations and retrieval for RAG systems.</p>

<h2>How it works</h2>
<p>An embedding model converts each document (or chunk of one) into a vector. A search query is converted the same way. The database then finds the stored vectors closest to the query vector. "How do I get my money back?" can match a document titled "Refund policy" even though they share no keywords.</p>

<h2>Do you need a dedicated vector database?</h2>
<p>Often, no. Many general-purpose databases now support vector search, for example PostgreSQL with the pgvector extension, as well as several search engines and cloud data warehouses. Starting there keeps your data, permissions and backups in one place.</p>
<p>A dedicated vector database starts to make sense when you have very large collections (many millions of vectors), need very low latency at high traffic, or require specialised indexing and filtering features.</p>

<h2>Things that matter more than the database</h2>
<ul>
<li><strong>Chunking:</strong> how you split documents affects results more than which database you choose.</li>
<li><strong>Embedding model:</strong> different models suit different languages and domains. Test a few.</li>
<li><strong>Hybrid search:</strong> combining keyword and vector search handles product codes, names and exact phrases that pure vector search misses.</li>
<li><strong>Metadata filters:</strong> restrict results by date, team or permissions before ranking.</li>
<li><strong>Re-embedding:</strong> if you change embedding models, every stored vector must be regenerated. Plan for it.</li>
</ul>

<h2>Our advice</h2>
<p>Start simple, measure search quality with real queries, and only add specialised infrastructure when you can show the simple option is the bottleneck.</p>
`
}

]);
