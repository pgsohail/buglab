/* bugslab blog — 2027 queue, July to September. Each post goes live on its date. */
window.BLOG_POSTS = (window.BLOG_POSTS || []).concat([

{
slug: 'evaluating-ai-agents',
title: 'Evaluating AI agents: beyond single-answer tests',
date: '2027-07-05',
tag: 'AI & machine learning',
excerpt: 'An agent can reach the right answer the wrong way, or the wrong answer through a series of reasonable steps. Test the journey, not just the end.',
takeaways: [
    'Judge the outcome, the path and the cost',
    'Use realistic sandboxes, not live systems',
    'Track failure types over time'
],
body: `
<p>Evaluating a chatbot answer is hard enough. Evaluating an agent, which takes many steps, calls tools and changes things, is harder. A final answer can look right while the agent took dangerous or wasteful actions on the way. A proper evaluation looks at the whole run.</p>

<h2>Three things to measure</h2>
<ul>
<li><strong>Outcome:</strong> did it achieve the goal? Was the ticket resolved, the report correct, the record updated properly?</li>
<li><strong>Path:</strong> were the steps sensible and safe? Did it use the right tools, avoid unnecessary actions and respect permissions?</li>
<li><strong>Cost:</strong> how many steps, tokens, seconds and pounds did the task take?</li>
</ul>

<h2>Build a sandbox</h2>
<p>Never evaluate agents against live systems. Create a test environment with fake but realistic data, such as a copy of the helpdesk with synthetic customers or a staging database. Each test task starts from a known state, so results are repeatable and mistakes are harmless.</p>

<h2>Design good test tasks</h2>
<ul>
<li>Cover easy, typical and hard cases.</li>
<li>Include tasks the agent should refuse or escalate.</li>
<li>Add tasks with misleading or injected instructions in the data, to test robustness.</li>
<li>Define success precisely enough that it can be checked automatically where possible, for example by inspecting the final state of the sandbox.</li>
</ul>

<h2>Classify failures</h2>
<p>A single pass rate hides a lot. Label failures by type:</p>
<ul>
<li>Misunderstood the task.</li>
<li>Picked the wrong tool or used it incorrectly.</li>
<li>Looped or gave up too early.</li>
<li>Took an unsafe or unauthorised action.</li>
<li>Correct outcome, but far too expensive.</li>
</ul>
<p>Over time, this tells you whether to improve prompts, tools, permissions or the model itself.</p>

<h2>Run it continuously</h2>
<p>Agents are sensitive to small changes in prompts, tools and models. Run the evaluation suite on every change, and add every real-world failure as a new test case.</p>
`
},

{
slug: 'mev-explained',
title: 'MEV explained: the hidden tax on blockchain transactions',
date: '2027-07-12',
tag: 'Blockchain & Web3',
excerpt: 'Bots can see your trade before it is confirmed and profit from it. What MEV is, how it hurts users, and how apps can protect them.',
takeaways: [
    'Pending transactions are public and can be exploited',
    'Sandwich attacks cost traders through worse prices',
    'Use slippage limits and private transaction routes'
],
body: `
<p>On many blockchains, transactions wait in a public queue before being included in a block. Anyone can see them. Whoever decides the order of transactions in a block can extract value by reordering, inserting or excluding them. This is called MEV, originally "miner extractable value", now usually "maximal extractable value".</p>

<h2>Common forms of MEV</h2>
<ul>
<li><strong>Arbitrage:</strong> bots spot price differences between exchanges and trade to close them. This is mostly harmless and keeps prices aligned.</li>
<li><strong>Liquidations:</strong> bots compete to liquidate undercollateralised loans for a reward. This is part of how lending protocols stay solvent.</li>
<li><strong>Sandwich attacks:</strong> a bot sees your large swap, buys just before you (pushing the price up), lets your trade execute at the worse price, then sells straight after. You pay more, the bot keeps the difference.</li>
<li><strong>Front-running:</strong> copying a profitable transaction and getting it included first.</li>
</ul>

<h2>Why it matters for builders</h2>
<p>Users of your app may lose money to MEV without ever realising it. Their swap just "had bad slippage". Over time this erodes trust and makes your product look expensive.</p>

<h2>How to protect users</h2>
<ul>
<li><strong>Sensible slippage limits:</strong> default to tight tolerances so trades fail rather than execute at a terrible price.</li>
<li><strong>Private transaction routes:</strong> send transactions through services that keep them out of the public queue until they are included in a block.</li>
<li><strong>Batch auctions and intent-based designs:</strong> some protocols collect orders and settle them together at a uniform price, which removes the ordering advantage.</li>
<li><strong>Commit-reveal schemes:</strong> users first commit to a hidden action, then reveal it later, so it cannot be copied in advance.</li>
</ul>

<h2>Contract design tips</h2>
<p>Avoid logic where whoever calls first wins a large reward, and do not rely on transaction order for fairness. Assume every pending transaction is visible to adversaries, because it usually is.</p>
`
},

{
slug: 'privacy-by-design-anonymisation',
title: 'Data privacy by design: anonymisation that actually works',
date: '2027-07-19',
tag: 'Data engineering',
excerpt: 'Removing names is not anonymisation. How re-identification happens, and the techniques that genuinely protect people.',
takeaways: [
    'Combinations of harmless fields can identify people',
    'Collect less, keep it shorter, restrict access',
    'Pseudonymised data is still personal data'
],
body: `
<p>A common belief is that deleting names and emails makes a dataset anonymous. It does not. Researchers have repeatedly shown that a few ordinary attributes, such as postcode, birth date and gender, can single out a large share of people when combined with other public data.</p>

<h2>Key terms</h2>
<ul>
<li><strong>Pseudonymisation:</strong> replacing identifiers with tokens or IDs. Useful, but whoever has the key can reverse it, so under laws like GDPR the data is still personal data.</li>
<li><strong>Anonymisation:</strong> transforming data so individuals can no longer reasonably be identified by anyone. This is much harder to achieve than it sounds.</li>
</ul>

<h2>Techniques that help</h2>
<ul>
<li><strong>Generalisation:</strong> replace exact values with ranges, such as age bands instead of birth dates, or a region instead of a full postcode.</li>
<li><strong>Suppression:</strong> remove rare values or tiny groups that make individuals stand out.</li>
<li><strong>Aggregation:</strong> share counts and averages instead of individual rows, with minimum group sizes.</li>
<li><strong>Noise:</strong> techniques such as differential privacy add carefully calibrated randomness so statistics stay useful while individual records stay hidden.</li>
<li><strong>Tokenisation:</strong> keep a lookup table for real identifiers in a separate, tightly controlled system.</li>
</ul>

<h2>Privacy by design in pipelines</h2>
<ol>
<li><strong>Collect less:</strong> do not ingest fields you do not need.</li>
<li><strong>Mask early:</strong> hash, tokenise or drop sensitive fields as close to the source as possible.</li>
<li><strong>Separate access:</strong> most analysts should never need raw identifiers.</li>
<li><strong>Set retention:</strong> delete or aggregate detailed data after a defined period.</li>
<li><strong>Support deletion requests:</strong> know where a person's data lives so you can remove it.</li>
</ol>

<h2>A final caution</h2>
<p>Whether data counts as anonymous can have legal consequences. For anything sensitive, involve your data protection lead or legal adviser early, and treat "anonymised" claims with healthy scepticism.</p>
`
},

{
slug: 'api-contract-testing',
title: 'Contract testing for APIs: catch breaking changes early',
date: '2027-07-26',
tag: 'Debugging & QA',
excerpt: 'Service A changes a field, service B breaks in production. Contract tests catch that in CI, without spinning up the whole system.',
takeaways: [
    'Consumers define what they rely on',
    'Providers verify they still meet it on every build',
    'Faster and more reliable than full end-to-end tests'
],
body: `
<p>When services talk to each other through APIs, the biggest risk is not a crash inside one service. It is a change in one service that quietly breaks another. Unit tests on each side pass, but together they fail. Contract testing is designed to catch exactly this.</p>

<h2>What is a contract?</h2>
<p>A contract describes the requests a consumer sends and the responses it expects: which fields it needs, their types and status codes. Crucially, it only includes what the consumer actually uses, not the whole API.</p>

<h2>Consumer-driven contracts</h2>
<ol>
<li>The consumer team writes tests describing its expectations of the provider. Running them produces a contract file.</li>
<li>The contract is shared, often through a broker.</li>
<li>The provider's CI runs the contract against the real provider code and checks that it still satisfies every consumer.</li>
<li>If a change would break a consumer, the provider's build fails before deployment.</li>
</ol>
<p>Tools such as Pact are built around this workflow. Schema-based approaches using OpenAPI definitions are a lighter alternative.</p>

<h2>Why not just use end-to-end tests?</h2>
<ul>
<li>End-to-end tests need every service running, which is slow and fragile.</li>
<li>When they fail, it is often unclear which service caused it.</li>
<li>Contract tests run in seconds, in each service's own pipeline, and point directly at the incompatible change.</li>
</ul>
<p>Keep a small number of end-to-end tests for critical journeys, and let contract tests cover the integration points.</p>

<h2>Good practices</h2>
<ul>
<li>Only assert on fields the consumer genuinely uses, so providers stay free to evolve.</li>
<li>Version breaking changes and give consumers time to migrate.</li>
<li>Make "can I deploy?" checks part of your release process.</li>
</ul>
`
},

{
slug: 'ai-for-code-review',
title: 'AI for code review: a second pair of eyes, not a replacement',
date: '2027-08-02',
tag: 'AI & machine learning',
excerpt: 'AI reviewers can catch bugs, missing tests and security issues in seconds. Here is how to use them without lowering the bar.',
takeaways: [
    'AI catches the routine so humans can focus on design',
    'Give it your conventions and context',
    'A human still owns every merge decision'
],
body: `
<p>AI code review tools read a pull request and leave comments within minutes: possible bugs, missing error handling, unclear names, security concerns. Used well, they make human reviews faster and better. Used badly, they create noise or false confidence.</p>

<h2>What AI reviewers are good at</h2>
<ul>
<li>Spotting common bugs: off-by-one errors, unhandled nulls, missing awaits, resource leaks.</li>
<li>Flagging security smells such as SQL built from strings, secrets in code or unvalidated input.</li>
<li>Noticing missing tests for new branches of logic.</li>
<li>Summarising large pull requests so human reviewers know where to focus.</li>
<li>Checking consistency with your style and conventions.</li>
</ul>

<h2>What they struggle with</h2>
<ul>
<li>Whether the change is the right solution to the business problem.</li>
<li>Architecture and long-term maintainability trade-offs.</li>
<li>Context that lives outside the diff: decisions made in meetings, upcoming plans, customer promises.</li>
<li>Avoiding plausible-sounding but wrong suggestions.</li>
</ul>

<h2>Making it work</h2>
<ol>
<li><strong>Give context:</strong> provide your coding guidelines, architecture notes and examples of good code.</li>
<li><strong>Tune the noise:</strong> if most comments are ignored, people stop reading them. Turn off low-value categories.</li>
<li><strong>Run it early:</strong> let authors see AI feedback before requesting human review.</li>
<li><strong>Keep humans accountable:</strong> a person approves every merge and owns the result.</li>
<li><strong>Protect your code:</strong> check where code is sent and how it is stored, especially for private repositories.</li>
</ol>

<h2>The result</h2>
<p>The best outcome is not fewer human reviews. It is better ones: humans spend less time on typos and null checks, and more on design, correctness and teaching.</p>
`
},

{
slug: 'cross-chain-bridges-security',
title: 'Cross-chain bridges: why they get hacked and how to use them safely',
date: '2027-08-09',
tag: 'Blockchain & Web3',
excerpt: 'Bridges have been behind some of the largest losses in crypto history. Understanding their trust model is the first defence.',
takeaways: [
    'Every bridge has a trust model: know it',
    'Large pools of locked funds attract attackers',
    'Limit exposure with caps, delays and monitoring'
],
body: `
<p>Blockchains cannot natively talk to each other. Bridges move assets and messages between them. Because they often hold huge pools of locked funds and rely on complex verification, bridges have been the target of several of the biggest hacks in the industry.</p>

<h2>How most bridges work</h2>
<p>A typical bridge locks your tokens in a contract on chain A, and something then tells chain B to mint an equivalent token for you. The critical question is: <em>who or what decides that the lock really happened?</em></p>

<h2>Trust models</h2>
<ul>
<li><strong>Trusted operators or multisigs:</strong> a group of signers attests to events. Simple, but if enough keys are compromised, funds can be stolen.</li>
<li><strong>External validator networks:</strong> a larger set of independent parties, with stake at risk if they misbehave.</li>
<li><strong>Light clients and proofs:</strong> chain B verifies chain A's consensus or a cryptographic proof directly. More trust-minimised, but more complex to build.</li>
<li><strong>Native rollup bridges:</strong> moving between Ethereum and its rollups uses the rollup's own security, usually the safest route but sometimes slower.</li>
</ul>

<h2>Common causes of bridge failures</h2>
<ul>
<li>Compromised signer keys.</li>
<li>Bugs in message verification, where forged messages are accepted as real.</li>
<li>Upgrade mistakes or misconfigured contracts.</li>
<li>Lack of monitoring, so an attack runs for hours before anyone notices.</li>
</ul>

<h2>If you build or integrate with bridges</h2>
<ul>
<li>Choose bridges with clear, well-understood trust models and strong audit histories.</li>
<li>Add rate limits and caps on how much can move in a period.</li>
<li>Use delays for large withdrawals so suspicious activity can be stopped.</li>
<li>Monitor bridge contracts and set alerts for unusual flows.</li>
<li>Have an incident plan: who can pause, and how fast?</li>
</ul>

<h2>For users</h2>
<p>Bridge only what you need, prefer official or native bridges where available, and remember that a "wrapped" token is only as safe as the bridge behind it.</p>
`
},

{
slug: 'semantic-layer',
title: 'Semantic layers: one definition of revenue for everyone',
date: '2027-08-16',
tag: 'Data engineering',
excerpt: 'Finance, sales and the CEO see three different revenue numbers. A semantic layer defines metrics once and serves them everywhere.',
takeaways: [
    'Define each metric once, in code',
    'Every tool reads the same definitions',
    'Makes AI and self-serve analytics trustworthy'
],
body: `
<p>Every growing company hits the same problem. The board deck says revenue is one number, the sales dashboard says another, and a spreadsheet in finance says a third. Nobody is lying. Each one used a slightly different definition: before or after refunds, by invoice date or payment date, including or excluding tax.</p>

<h2>What a semantic layer is</h2>
<p>A semantic layer sits between your data warehouse and the tools people use. It defines business concepts, such as metrics (revenue, active users, churn), dimensions (region, product, plan) and how tables relate, in one place, usually as code. Dashboards, spreadsheets, notebooks and AI assistants query the semantic layer instead of writing their own SQL.</p>

<h2>Benefits</h2>
<ul>
<li><strong>Consistency:</strong> "revenue" means the same thing everywhere.</li>
<li><strong>Governance:</strong> definitions are reviewed, versioned and documented.</li>
<li><strong>Self-service:</strong> non-technical users can explore data safely without writing complex joins.</li>
<li><strong>Trustworthy AI analytics:</strong> when an AI assistant answers "what was revenue last quarter?", it can use the agreed definition instead of guessing at SQL.</li>
</ul>

<h2>How to introduce one</h2>
<ol>
<li>Pick the five to ten metrics that matter most and cause the most arguments.</li>
<li>Agree definitions with their business owners, and write them down in plain language.</li>
<li>Implement them in your semantic layer tool or transformation framework, with tests.</li>
<li>Point key dashboards at those definitions and retire duplicates.</li>
<li>Add new metrics only through the same reviewed process.</li>
</ol>

<h2>The real work</h2>
<p>The technology is the easy part. The valuable part is the conversation where finance and sales agree, finally, on what "revenue" means. The semantic layer makes that agreement stick.</p>
`
},

{
slug: 'feature-flags-ship-safely',
title: 'Feature flags: ship safely, roll back instantly',
date: '2027-08-23',
tag: 'Debugging & QA',
excerpt: 'Separate deploying code from releasing features. Feature flags let you test in production, roll out gradually and switch off problems in seconds.',
takeaways: [
    'Deploy dark, release gradually',
    'A kill switch beats a frantic rollback',
    'Clean up old flags or they become debt'
],
body: `
<p>Without feature flags, deploying code and releasing a feature are the same event. If something goes wrong, you roll back the whole deployment. Feature flags separate the two: code ships turned off, and you choose when and for whom to turn it on.</p>

<h2>What flags make possible</h2>
<ul>
<li><strong>Gradual rollouts:</strong> release to 1% of users, then 10%, then everyone, watching metrics at each step.</li>
<li><strong>Kill switches:</strong> turn off a misbehaving feature in seconds without redeploying.</li>
<li><strong>Testing in production:</strong> enable a feature for internal staff first, with real data and infrastructure.</li>
<li><strong>Trunk-based development:</strong> merge unfinished work behind a flag instead of keeping long-lived branches.</li>
<li><strong>Experiments:</strong> compare two versions of a feature to see which performs better.</li>
</ul>

<h2>Types of flags</h2>
<ul>
<li><strong>Release flags:</strong> temporary, removed once the feature is fully launched.</li>
<li><strong>Operational flags:</strong> long-lived switches to disable expensive or risky functionality under load.</li>
<li><strong>Permission flags:</strong> enable features for specific plans or customers.</li>
</ul>

<h2>Debugging with flags</h2>
<p>Flags add a new dimension to bugs: "it only breaks when flags A and B are both on". Include active flag states in logs and traces, so you can see exactly which combination a user had when something failed.</p>

<h2>Avoiding flag debt</h2>
<ul>
<li>Give every release flag an owner and an expiry date.</li>
<li>Remove the flag and the old code path soon after full rollout.</li>
<li>Test both on and off states for important flags.</li>
<li>Keep the number of active flags visible, and review it regularly.</li>
</ul>
<p>Used with discipline, feature flags turn releases from stressful events into routine, reversible steps.</p>
`
},

{
slug: 'knowledge-graphs-and-llms',
title: 'Knowledge graphs and LLMs: structured memory for AI',
date: '2027-08-30',
tag: 'AI & machine learning',
excerpt: 'Vector search finds similar text. Knowledge graphs capture how things connect. Together they help AI answer harder questions.',
takeaways: [
    'Graphs store entities and their relationships',
    'Great for multi-step questions across documents',
    'Combine with vector search, not instead of it'
],
body: `
<p>Most retrieval systems for AI search for text passages similar to a question. That works well for "what is our refund policy?". It struggles with questions like "which customers are affected if supplier X has a delay?", which require following relationships across many records. Knowledge graphs help with exactly that.</p>

<h2>What a knowledge graph is</h2>
<p>A knowledge graph stores <strong>entities</strong> (customers, products, suppliers, people, contracts) and the <strong>relationships</strong> between them (buys, supplies, manages, depends on). Instead of rows in separate tables or paragraphs in documents, you get a connected map of your domain.</p>

<h2>How it helps LLM applications</h2>
<ul>
<li><strong>Multi-hop questions:</strong> follow chains of relationships ("supplier → component → product → customers").</li>
<li><strong>Disambiguation:</strong> know that "Apple" in your CRM is a customer, not a fruit, and which account it is.</li>
<li><strong>Grounded answers:</strong> the model can cite specific entities and relationships rather than paraphrasing loosely related text.</li>
<li><strong>Summaries across many documents:</strong> graph-based approaches can group related information and summarise themes across a large collection.</li>
</ul>

<h2>Building one</h2>
<ol>
<li>Start from structured data you already have, such as CRM, ERP and product catalogues.</li>
<li>Use LLMs to extract entities and relationships from documents, then validate them, because extraction makes mistakes.</li>
<li>Define a clear, small schema of entity and relationship types for your domain.</li>
<li>Keep the graph updated as source data changes.</li>
</ol>

<h2>When it is worth it</h2>
<p>Knowledge graphs take effort to build and maintain. They pay off when your users ask relationship-heavy questions, in areas such as supply chains, compliance, investigations and complex products. For simple document Q&amp;A, good vector and keyword search is usually enough, and many strong systems use both.</p>
`
},

{
slug: 'decentralised-identity',
title: 'Decentralised identity: logging in without passwords or platforms',
date: '2027-09-06',
tag: 'Blockchain & Web3',
excerpt: 'What if your credentials lived in your own wallet, and you shared only what each site needs? That is the idea behind decentralised identity.',
takeaways: [
    'Users hold their own verifiable credentials',
    'Share only the facts a service needs',
    'Personal data should stay off-chain'
],
body: `
<p>Today, your online identity is scattered across platforms. You sign in with a big tech account, upload your passport to every new service, and hope each one protects your data. Decentralised identity offers a different model: you hold your own credentials and decide what to share.</p>

<h2>Key building blocks</h2>
<ul>
<li><strong>Decentralised identifiers (DIDs):</strong> identifiers you control, not issued by a single platform.</li>
<li><strong>Verifiable credentials:</strong> digitally signed statements from an issuer, such as a university confirming a degree, a bank confirming identity checks, or an employer confirming your role.</li>
<li><strong>Wallets:</strong> apps where users store credentials and choose what to present.</li>
<li><strong>Verifiers:</strong> services that check the issuer's signature without needing to contact the issuer each time.</li>
</ul>
<p>These are based on open standards, including work from the W3C, and governments are exploring digital identity wallets built on similar ideas.</p>

<h2>Selective disclosure</h2>
<p>A powerful feature is sharing only what is needed. To prove you are over 18, you can present a credential that confirms exactly that, without revealing your name, address or full birth date. Zero-knowledge techniques can strengthen this further.</p>

<h2>Where blockchains fit, and where they do not</h2>
<p>Blockchains can be useful for publishing issuers' public keys, registries and revocation lists. Personal data itself should <strong>not</strong> be written on-chain, because it cannot be deleted, which conflicts with privacy rights such as erasure under GDPR.</p>

<h2>Challenges</h2>
<ul>
<li>Recovery if a user loses their device.</li>
<li>Getting issuers and verifiers to adopt the same standards.</li>
<li>User experience that feels as simple as "sign in with" buttons.</li>
</ul>
<p>Decentralised identity will likely arrive gradually, through specific uses like age checks, professional credentials and government ID, rather than replacing all logins at once.</p>
`
},

{
slug: 'data-observability',
title: 'Data observability: knowing your pipelines are healthy',
date: '2027-09-13',
tag: 'Data engineering',
excerpt: 'Software teams monitor their apps. Data teams need the same for their tables. What data observability covers and how to start.',
takeaways: [
    'Monitor freshness, volume, schema, distribution and lineage',
    'Detect problems before the business does',
    'Lineage shows what breaks downstream'
],
body: `
<p>When a website goes down, alerts fire within seconds. When a data pipeline loads half the usual rows, the first alert is often a confused message from the finance team three days later. Data observability brings monitoring discipline to data.</p>

<h2>The five things to watch</h2>
<ol>
<li><strong>Freshness:</strong> is data arriving on time?</li>
<li><strong>Volume:</strong> is the amount of data in a normal range?</li>
<li><strong>Schema:</strong> have columns been added, removed or changed type?</li>
<li><strong>Distribution:</strong> have values shifted unexpectedly, such as a spike in nulls or an average that jumps overnight?</li>
<li><strong>Lineage:</strong> which upstream sources feed this table, and which dashboards and models depend on it?</li>
</ol>

<h2>Rules vs anomaly detection</h2>
<p>Explicit rules ("order_id is never null") catch known problems precisely. Anomaly detection learns normal patterns and flags unusual changes you did not think to write rules for. Most teams benefit from both: rules for critical guarantees, anomaly detection for broad coverage.</p>

<h2>Why lineage matters</h2>
<p>When a source breaks, lineage answers two urgent questions: what caused this, and who else is affected? Instead of guessing, you can notify the owners of exactly the dashboards and models that depend on the broken table.</p>

<h2>Getting started</h2>
<ul>
<li>Instrument your most important tables first: those behind executive reports, billing and production models.</li>
<li>Route alerts to the team that can fix them, with enough context to act.</li>
<li>Track incidents: how often data breaks, how quickly it is noticed and how long it takes to fix.</li>
<li>Review noisy alerts regularly. If people ignore them, they are not working.</li>
</ul>

<h2>The goal</h2>
<p>Data teams should find out about broken data before anyone else does. When that happens consistently, trust in data, and in the data team, goes up.</p>
`
},

{
slug: 'performance-profiling',
title: 'Performance profiling: find the slow 5% that matters',
date: '2027-09-20',
tag: 'Debugging & QA',
excerpt: 'Guessing where code is slow is usually wrong. Profilers show where time actually goes, so you optimise what matters.',
takeaways: [
    'Measure before optimising',
    'Flame graphs show where time really goes',
    'Look at slow percentiles, not just averages'
],
body: `
<p>Developers are famously bad at guessing which part of their code is slow. We optimise a loop that takes a millisecond while a database query next to it takes two seconds. Profiling replaces guesses with measurements.</p>

<h2>Start with the right metric</h2>
<p>Averages hide pain. If 95% of requests take 100ms and 5% take five seconds, the average looks fine, but one in twenty users is having a terrible time. Track percentiles such as p95 and p99, and investigate the slowest requests first.</p>

<h2>Types of profilers</h2>
<ul>
<li><strong>CPU profilers:</strong> show which functions consume processing time.</li>
<li><strong>Memory profilers:</strong> show allocations and what is holding memory.</li>
<li><strong>Database query analysis:</strong> query plans (EXPLAIN) and slow-query logs reveal missing indexes and inefficient joins.</li>
<li><strong>Browser performance tools:</strong> show rendering, scripting and network time for front-end code.</li>
<li><strong>Continuous profilers:</strong> sample production systems all the time with low overhead, so you can see real-world hotspots.</li>
</ul>

<h2>Reading a flame graph</h2>
<p>A flame graph shows call stacks stacked vertically, with width representing time. Wide bars are where time goes. Look for unexpectedly wide functions, especially ones that should be cheap, such as serialisation, logging or regular expressions.</p>

<h2>The usual culprits</h2>
<ul>
<li>N+1 database queries.</li>
<li>Missing indexes on frequently filtered columns.</li>
<li>Doing expensive work inside loops that could be done once.</li>
<li>Calling external APIs one after another instead of in parallel.</li>
<li>Serialising or parsing large payloads repeatedly.</li>
<li>Excessive logging in hot paths.</li>
</ul>

<h2>The method</h2>
<ol>
<li>Measure and record a baseline.</li>
<li>Profile to find the biggest hotspot.</li>
<li>Fix one thing.</li>
<li>Measure again to confirm the improvement.</li>
</ol>
<p>Repeat until performance is good enough, then stop. Not all code needs to be fast; the code users wait on does.</p>
`
},

{
slug: 'ai-cost-control',
title: 'Keeping AI bills under control: caching, routing and right-sizing',
date: '2027-09-27',
tag: 'AI & machine learning',
excerpt: 'AI features that delight users can also surprise finance. Practical techniques to cut inference costs without hurting quality.',
takeaways: [
    'Measure cost per feature and per user',
    'Cache, trim and route before you negotiate prices',
    'Set budgets and alerts like any other infrastructure'
],
body: `
<p>The first AI prototype is cheap. Then usage grows, prompts get longer, agents take more steps, and the monthly bill becomes a topic in board meetings. The good news: most AI systems have plenty of room for savings without users noticing.</p>

<h2>First, measure</h2>
<p>Track tokens, requests and cost per feature, per customer and per workflow. You cannot optimise what you cannot see, and the expensive part is often not what people expect, such as a background summarisation job nobody uses.</p>

<h2>Techniques that work</h2>
<ul>
<li><strong>Right-size models:</strong> use smaller models for simple tasks and reserve large ones for hard cases. Routing alone can cut costs significantly.</li>
<li><strong>Trim prompts:</strong> long system prompts, repeated examples and oversized context add up on every request. Keep only what improves results.</li>
<li><strong>Retrieve less, retrieve better:</strong> sending ten documents when two would do wastes tokens and can lower quality.</li>
<li><strong>Cache:</strong> reuse answers for repeated questions, and use provider features such as prompt caching for large shared prefixes where available.</li>
<li><strong>Batch:</strong> run non-urgent jobs, such as nightly summaries or classifications, through batch processing options, which are often cheaper.</li>
<li><strong>Limit output length:</strong> ask for concise answers and structured output where possible.</li>
<li><strong>Cap agent steps:</strong> stop runaway loops before they burn budget.</li>
</ul>

<h2>Guardrails for spending</h2>
<ul>
<li>Set per-user and per-feature rate limits.</li>
<li>Alert when daily spend exceeds a threshold.</li>
<li>Review the most expensive requests weekly.</li>
</ul>

<h2>Keep quality honest</h2>
<p>Every cost optimisation should be checked against your evaluation set. Saving 40% is not a win if answers get noticeably worse. Measure cost and quality together, and you can usually improve both.</p>
`
}

]);
