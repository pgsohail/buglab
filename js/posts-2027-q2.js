/* bugslab blog — 2027 queue, April to June. Each post goes live on its date. */
window.BLOG_POSTS = (window.BLOG_POSTS || []).concat([

{
slug: 'property-based-testing',
title: 'Property-based testing: let the computer find your edge cases',
date: '2027-04-05',
tag: 'Debugging & QA',
excerpt: 'Instead of writing examples by hand, describe rules your code must always follow and let a tool hunt for inputs that break them.',
takeaways: [
    'Test properties, not just examples',
    'Tools shrink failures to the smallest input',
    'Great for parsers, maths and data transformations'
],
body: `
<p>Most tests are example-based: given this input, expect that output. They only check the cases you thought of. Property-based testing flips it around. You describe a rule that should hold for <em>every</em> valid input, and the testing tool generates hundreds of random inputs looking for one that breaks it.</p>

<h2>What a property looks like</h2>
<ul>
<li>Encoding then decoding any value gives back the original value.</li>
<li>Sorting a list never changes its length, and the result is always in order.</li>
<li>A discount calculation never produces a negative price.</li>
<li>The total of an invoice always equals the sum of its line items.</li>
</ul>

<h2>A quick example</h2>
<pre><code>from hypothesis import given, strategies as st

@given(st.lists(st.integers()))
def test_sort_keeps_length_and_order(xs):
    result = my_sort(xs)
    assert len(result) == len(xs)
    assert all(a &lt;= b for a, b in zip(result, result[1:]))</code></pre>
<p>Tools such as Hypothesis (Python), fast-check (JavaScript) and QuickCheck-style libraries in many languages generate inputs, including empty lists, huge numbers, negative values and odd characters.</p>

<h2>Shrinking: the best feature</h2>
<p>When a property fails, the tool simplifies the failing input as far as it can. Instead of a 300-item list of random numbers, you get something like <code>[0, -1]</code>. That makes the bug obvious.</p>

<h2>Where it shines</h2>
<ul>
<li>Parsers, serialisers and file formats.</li>
<li>Financial and numeric calculations.</li>
<li>Data cleaning and transformation code.</li>
<li>Smart contracts, where fuzzing with invariants is the same idea.</li>
</ul>

<h2>Getting started</h2>
<p>Keep your example tests. Add one or two property tests for the most critical logic. You will often find an edge case within the first run, which is exactly the point.</p>
`
},

{
slug: 'multi-agent-systems-in-practice',
title: 'AI agents that work together: multi-agent systems in practice',
date: '2027-04-12',
tag: 'AI & machine learning',
excerpt: 'Splitting work between specialised agents can improve quality. It can also multiply cost and confusion. When the extra complexity pays off.',
takeaways: [
    'Start with one agent and add more only when needed',
    'Give each agent a narrow role and clear outputs',
    'Coordinate through structured hand-offs, not chat'
],
body: `
<p>A popular idea in AI engineering is the multi-agent system: several AI agents, each with its own role, working together on a task. One plans, one researches, one writes, one reviews. Done well, it mirrors how a good team works. Done badly, it is an expensive group chat.</p>

<h2>When multiple agents help</h2>
<ul>
<li><strong>Different skills or tools:</strong> one agent queries the database, another writes the customer email. Each gets only the tools it needs.</li>
<li><strong>Independent checking:</strong> a reviewer agent with a separate prompt catches mistakes the author agent misses.</li>
<li><strong>Parallel work:</strong> research on five topics can run at the same time, then be combined.</li>
<li><strong>Context limits:</strong> splitting a large task keeps each agent's context focused and smaller.</li>
</ul>

<h2>When they hurt</h2>
<ul>
<li>Every extra agent adds cost, latency and another place for errors.</li>
<li>Agents talking freely to each other can loop, drift off-task or amplify each other's mistakes.</li>
<li>Debugging gets harder, because a bad final answer may come from any step.</li>
</ul>

<h2>Design patterns that work</h2>
<ol>
<li><strong>Orchestrator and workers:</strong> one coordinator breaks down the task, assigns pieces and assembles results.</li>
<li><strong>Author and reviewer:</strong> one produces, another checks against explicit criteria.</li>
<li><strong>Pipeline:</strong> a fixed sequence of steps, each with a defined input and output format.</li>
</ol>
<p>In all three, hand-offs should be structured (JSON with required fields), not open-ended conversation.</p>

<h2>Practical advice</h2>
<p>Build the simplest version first: a single agent with good tools. Measure where it fails. Add a second agent only to fix a specific, measured weakness, and keep detailed traces of every step so you can see which agent did what.</p>
`
},

{
slug: 'zero-knowledge-proofs-without-maths',
title: 'Zero-knowledge proofs without the maths',
date: '2027-04-19',
tag: 'Blockchain & Web3',
excerpt: 'Prove something is true without revealing why. Zero-knowledge proofs sound like magic, but the idea fits in a few paragraphs.',
takeaways: [
    'Prove a fact without exposing the data behind it',
    'Used for privacy and for scaling blockchains',
    'Circuits are code, and need audits too'
],
body: `
<p>A zero-knowledge proof (ZKP) lets one party convince another that a statement is true without revealing anything beyond the fact that it is true. That sounds impossible, but it is well-established cryptography, and it is moving from research into real products.</p>

<h2>An everyday analogy</h2>
<p>Imagine proving you are over 18 to a website without showing your birth date, name or ID number. The site learns exactly one thing, "this person is an adult", and nothing else. That is the promise of zero-knowledge proofs.</p>

<h2>Where ZKPs are used</h2>
<ul>
<li><strong>Scaling blockchains:</strong> ZK rollups prove that thousands of transactions were processed correctly with one small proof that the main chain can verify cheaply.</li>
<li><strong>Privacy:</strong> prove you hold enough funds, or that a transaction follows the rules, without exposing balances or identities.</li>
<li><strong>Identity and credentials:</strong> prove membership, age, residency or qualifications selectively.</li>
<li><strong>Verifiable computation:</strong> prove that an off-chain calculation, potentially including some machine learning inference, was done correctly.</li>
</ul>

<h2>How developers build them</h2>
<p>You do not write the cryptography yourself. You describe the statement to be proven as a "circuit" or a program, using languages and toolkits built for this purpose, and the framework produces the prover and verifier. The skill is in expressing the logic correctly and efficiently.</p>

<h2>The catches</h2>
<ul>
<li><strong>Bugs are subtle:</strong> a circuit that forgets to constrain a value can let someone prove something false. ZK code needs specialist audits.</li>
<li><strong>Proving cost:</strong> generating proofs can be computationally heavy, though this keeps improving.</li>
<li><strong>Trusted setup:</strong> some proof systems need a one-time setup ceremony, while others avoid it. Know which one you are using.</li>
</ul>

<h2>Why it matters</h2>
<p>ZKPs offer a rare combination: more privacy and more verifiability at the same time. Expect them to show up increasingly in identity, finance and compliance, often without users ever hearing the term.</p>
`
},

{
slug: 'change-data-capture-real-time-analytics',
title: 'Real-time analytics with change data capture',
date: '2027-04-26',
tag: 'Data engineering',
excerpt: 'Copying whole tables every night is slow and wasteful. Change data capture streams only what changed, as it happens.',
takeaways: [
    'CDC reads changes from the database log',
    'No extra load from repeated full exports',
    'Handle deletes and schema changes from day one'
],
body: `
<p>The traditional way to get data out of an application database is a nightly export: copy the whole table, or every row updated since yesterday. It is simple, but slow, heavy on the database, and it misses deletes. Change data capture (CDC) is a better pattern for many teams.</p>

<h2>How CDC works</h2>
<p>Databases keep a log of every change for their own recovery and replication, such as the write-ahead log in PostgreSQL or the binlog in MySQL. CDC tools read that log and turn each insert, update and delete into an event, which can be sent to a stream, a warehouse or another service. Debezium is a widely used open-source option, and many managed tools offer the same idea.</p>

<h2>Why it is useful</h2>
<ul>
<li><strong>Freshness:</strong> changes arrive in seconds instead of the next morning.</li>
<li><strong>Low impact:</strong> reading the log is much lighter than repeatedly querying big tables.</li>
<li><strong>Deletes are captured:</strong> nightly "updated since" exports often miss rows that were removed.</li>
<li><strong>Full history:</strong> every change becomes an event, which is useful for audits and debugging.</li>
</ul>

<h2>Common uses</h2>
<ul>
<li>Keeping a data warehouse close to real time.</li>
<li>Updating search indexes and caches when records change.</li>
<li>Triggering workflows, such as sending an email when an order status changes.</li>
<li>Migrating databases with minimal downtime.</li>
</ul>

<h2>Pitfalls to plan for</h2>
<ul>
<li><strong>Schema changes:</strong> decide how new or renamed columns flow downstream.</li>
<li><strong>Ordering and duplicates:</strong> consumers must cope with events arriving more than once.</li>
<li><strong>Initial snapshot:</strong> you still need a starting copy of existing data before streaming changes.</li>
<li><strong>Sensitive data:</strong> the log contains everything, so filter or mask personal fields early.</li>
</ul>
<p>CDC is not only for big companies. For many teams it is the simplest route from "yesterday's numbers" to "right now" without rebuilding their applications.</p>
`
},

{
slug: 'chaos-engineering-for-small-teams',
title: 'Chaos engineering for small teams',
date: '2027-05-03',
tag: 'Debugging & QA',
excerpt: 'You do not need a big platform team to test how your system fails. Small, planned experiments reveal weak spots before customers do.',
takeaways: [
    'Break things on purpose, in a controlled way',
    'Start in staging with simple experiments',
    'Every experiment needs a hypothesis and a stop button'
],
body: `
<p>Chaos engineering sounds dramatic: deliberately breaking parts of your system. The idea is simple and sensible. Instead of waiting for a dependency to fail at 3am, you make it fail at 3pm on a Tuesday, with everyone watching, and see what happens.</p>

<h2>Why small teams should care</h2>
<p>Small teams usually have less redundancy and fewer people on call. A single slow API or full disk can take down the whole product. Finding these weak points early is cheaper than learning about them during an outage.</p>

<h2>Simple experiments to start with</h2>
<ul>
<li><strong>Kill a server or container:</strong> does traffic move to a healthy one?</li>
<li><strong>Slow down a dependency:</strong> add delay to calls to your payment provider or database. Do timeouts and retries behave sensibly?</li>
<li><strong>Return errors from a third-party API:</strong> does your app degrade gracefully, or does the whole page fail?</li>
<li><strong>Fill the disk or exhaust memory</strong> on a test machine: are alerts triggered?</li>
<li><strong>Restore from backup:</strong> the classic experiment. Many teams discover their backups do not restore cleanly.</li>
</ul>

<h2>How to run an experiment</h2>
<ol>
<li><strong>Write a hypothesis:</strong> "If the recommendations service is down, product pages still load within two seconds without recommendations."</li>
<li><strong>Limit the blast radius:</strong> start in staging, then a small slice of production traffic if appropriate.</li>
<li><strong>Have a stop button:</strong> know exactly how to end the experiment instantly.</li>
<li><strong>Observe:</strong> watch dashboards, logs and user-facing behaviour.</li>
<li><strong>Write down what you learned</strong> and fix what broke.</li>
</ol>

<h2>The real benefit</h2>
<p>Beyond finding bugs, these exercises train the team. People learn the system's failure modes, practise using dashboards and runbooks, and become calmer during real incidents because they have seen something similar before.</p>
`
},

{
slug: 'on-device-ai',
title: 'On-device AI: privacy, speed and offline features',
date: '2027-05-10',
tag: 'AI & machine learning',
excerpt: 'Phones and laptops now run capable AI models locally. That changes what is possible for privacy-sensitive and offline products.',
takeaways: [
    'Data never leaves the device',
    'No network round trip means instant responses',
    'Plan for weaker models and varied hardware'
],
body: `
<p>Most AI features today send data to a server, run a model there and send back the answer. Increasingly, capable models can run directly on phones, laptops and edge devices, helped by dedicated AI chips in modern hardware and by smaller, efficient models.</p>

<h2>Why run AI on the device?</h2>
<ul>
<li><strong>Privacy:</strong> personal messages, photos, health or financial data can be processed without ever leaving the device.</li>
<li><strong>Speed:</strong> no network round trip, so features like autocomplete, transcription and image filters feel instant.</li>
<li><strong>Offline:</strong> the feature keeps working on a plane, in a basement or in areas with poor coverage.</li>
<li><strong>Cost:</strong> the user's hardware does the work, so your server bill does not grow with usage.</li>
</ul>

<h2>The trade-offs</h2>
<ul>
<li><strong>Smaller models:</strong> on-device models are less capable than the largest server models, so they suit focused tasks.</li>
<li><strong>Hardware variety:</strong> performance differs widely between a new flagship phone and a five-year-old laptop.</li>
<li><strong>App size and battery:</strong> models take storage and drain power if used heavily.</li>
<li><strong>Updates:</strong> improving the model means shipping an app update or downloading new weights.</li>
</ul>

<h2>The hybrid pattern</h2>
<p>Many products combine both: a small on-device model handles common, private or time-sensitive tasks, and the app falls back to a server model for harder requests, with the user's permission where sensitive data is involved.</p>

<h2>Good first use cases</h2>
<ul>
<li>Speech-to-text and voice commands.</li>
<li>Smart replies and text suggestions.</li>
<li>Classifying or tagging photos and documents.</li>
<li>Summarising content the user already has on their device.</li>
</ul>
<p>If your product handles sensitive data or needs to work anywhere, on-device AI is worth serious consideration.</p>
`
},

{
slug: 'stablecoins-and-payments',
title: 'Stablecoins and payments: where crypto is quietly useful',
date: '2027-05-17',
tag: 'Blockchain & Web3',
excerpt: 'Away from price speculation, stablecoins are being used for cross-border payments and settlement. How they work and what to check.',
takeaways: [
    'Stablecoins track a currency such as the US dollar',
    'Reserves and redemption rights are what matter',
    'Regulation is shaping who can issue and use them'
],
body: `
<p>Stablecoins are tokens designed to hold a steady value, usually one US dollar or one euro. While other crypto assets swing in price, stablecoins have found practical uses in payments, remittances and settlement between businesses.</p>

<h2>How they keep their value</h2>
<ul>
<li><strong>Fiat-backed:</strong> each token is backed by cash and short-term government debt held by the issuer. Holders can, in principle, redeem tokens for the underlying currency.</li>
<li><strong>Crypto-collateralised:</strong> backed by more crypto than the value issued, managed by smart contracts.</li>
<li><strong>Algorithmic:</strong> rely on market mechanisms rather than full reserves. Some well-known designs of this type have collapsed, which is a lesson in why reserves matter.</li>
</ul>

<h2>Why businesses use them</h2>
<ul>
<li><strong>Speed:</strong> transfers settle in minutes, at any time, including weekends.</li>
<li><strong>Cost:</strong> cross-border transfers can be cheaper than traditional routes, especially on low-fee networks.</li>
<li><strong>Programmability:</strong> payments can be automated, split or released when conditions are met.</li>
</ul>

<h2>What to check before building on one</h2>
<ul>
<li><strong>Reserves and attestations:</strong> who holds the backing assets, and how often are they independently checked?</li>
<li><strong>Redemption:</strong> who is allowed to redeem tokens for cash, and how quickly?</li>
<li><strong>Issuer controls:</strong> many issuers can freeze tokens at specific addresses, which matters for compliance and for risk.</li>
<li><strong>Regulation:</strong> rules are evolving in many places, including the EU's MiCA framework and others, and they affect what you can offer to whom.</li>
<li><strong>Operations:</strong> on-ramps, off-ramps, accounting and tax treatment need as much attention as the smart contracts.</li>
</ul>

<h2>Our take</h2>
<p>Stablecoins are one of the clearest examples of blockchain being useful in a boring, practical way. For payment products, the engineering challenge is less the blockchain and more compliance, reconciliation and customer experience.</p>
`
},

{
slug: 'synthetic-data',
title: 'Synthetic data: useful, risky, and how to tell the difference',
date: '2027-05-24',
tag: 'Data engineering',
excerpt: 'Generated data can unblock testing and training when real data is scarce or sensitive. It can also teach models the wrong lessons.',
takeaways: [
    'Great for testing, demos and rare edge cases',
    'Validate it against real data before trusting it',
    'Synthetic does not automatically mean private'
],
body: `
<p>Synthetic data is artificially generated data that imitates real data. It can be produced by simple rules, statistical models or, increasingly, by generative AI. Used well, it solves real problems. Used carelessly, it creates convincing nonsense.</p>

<h2>Good uses</h2>
<ul>
<li><strong>Testing and development:</strong> realistic fake customers and orders, so developers do not need production data on their laptops.</li>
<li><strong>Demos:</strong> believable data for sales demos and screenshots without exposing anyone.</li>
<li><strong>Rare events:</strong> generate more examples of rare cases, such as fraud patterns or unusual inputs, to test how systems cope.</li>
<li><strong>Bootstrapping AI evaluation:</strong> draft test questions and edge cases, then have humans review them.</li>
</ul>

<h2>The risks</h2>
<ul>
<li><strong>Missing the messiness:</strong> real data has quirks, typos and odd correlations. Synthetic data is often too clean, so systems that pass synthetic tests fail on real input.</li>
<li><strong>Bias amplification:</strong> a generator learns patterns, including biases, from its source data, and can exaggerate them.</li>
<li><strong>Privacy leaks:</strong> some generators can reproduce records very close to real individuals. Synthetic does not automatically mean anonymous.</li>
<li><strong>Model collapse:</strong> training models mostly on generated outputs can degrade quality over time.</li>
</ul>

<h2>How to use it safely</h2>
<ol>
<li>Compare statistics (distributions, correlations, missing-value rates) between synthetic and real data.</li>
<li>Test whether conclusions or model performance hold when you switch to real data.</li>
<li>Check that no synthetic record is near-identical to a real one.</li>
<li>Label synthetic data clearly so it never gets mistaken for the real thing.</li>
</ol>
<p>Synthetic data is a tool, not a replacement for reality. Use it to move faster, then validate against the real world.</p>
`
},

{
slug: 'distributed-tracing',
title: 'Debugging distributed systems with tracing',
date: '2027-05-31',
tag: 'Debugging & QA',
excerpt: 'When one request touches ten services, logs alone cannot tell you where time went. Distributed tracing can.',
takeaways: [
    'A trace follows one request across every service',
    'Spans show exactly where time and errors happen',
    'Propagate context through queues and async jobs too'
],
body: `
<p>In a monolith, a slow request usually means one slow function. In a system of microservices, queues and third-party APIs, a slow request could be slow anywhere. Distributed tracing shows the full journey of a single request, step by step.</p>

<h2>Key concepts</h2>
<ul>
<li><strong>Trace:</strong> the complete record of one request through the system.</li>
<li><strong>Span:</strong> one step within the trace, such as an HTTP call, a database query or a function, with a start time, duration and attributes.</li>
<li><strong>Context propagation:</strong> passing the trace ID from service to service, usually in request headers, so every span joins the same trace.</li>
</ul>

<h2>What tracing reveals</h2>
<ul>
<li>Which service or query is responsible for most of the latency.</li>
<li>Calls that happen one after another but could run in parallel.</li>
<li>"N+1" patterns, where one request triggers dozens of identical database queries.</li>
<li>Retries and timeouts that silently add seconds.</li>
<li>Exactly where an error started, before it was wrapped and re-thrown elsewhere.</li>
</ul>

<h2>Getting started</h2>
<ol>
<li>Use OpenTelemetry, the open standard, so you can switch backends later.</li>
<li>Turn on automatic instrumentation for your web framework, HTTP clients and database drivers. This gives a lot of value with little code.</li>
<li>Add custom spans around important business steps, such as "calculate price" or "reserve stock".</li>
<li>Make sure trace context flows through message queues and background jobs, not just HTTP.</li>
<li>Include the trace ID in logs, so you can jump from a trace to the matching log lines.</li>
</ol>

<h2>Sampling</h2>
<p>Recording every trace can be expensive at high traffic. Sample a percentage of normal requests, but keep all traces that contain errors or are unusually slow. Those are the ones you will want when something goes wrong.</p>
`
},

{
slug: 'ai-regulation-what-builders-should-do',
title: 'AI regulation is arriving: what builders should do now',
date: '2027-06-07',
tag: 'AI & machine learning',
excerpt: 'Rules for AI are moving from proposals to obligations. Most of what they ask for is simply good engineering practice.',
takeaways: [
    'Know where AI is used in your product',
    'Document data, purpose and risks',
    'Keep humans able to oversee and override'
],
body: `
<p>AI regulation is no longer theoretical. The EU AI Act is being phased in, and other governments and regulators are publishing their own rules and guidance. For builders, the details vary by country and use case, but the direction is consistent: know what your AI does, document it, and keep it under control.</p>
<p><em>This is general information, not legal advice. For specific obligations, talk to a qualified lawyer.</em></p>

<h2>Risk-based thinking</h2>
<p>Many frameworks treat AI uses differently depending on risk. A chatbot that recommends recipes is very different from a system that screens job applicants or assesses credit. Higher-risk uses come with stricter requirements around testing, documentation and human oversight.</p>

<h2>Practical steps that help everywhere</h2>
<ol>
<li><strong>Keep an AI inventory:</strong> list every place AI is used, which model or provider, what data it sees, and who owns it.</li>
<li><strong>Classify the risk:</strong> which uses affect people's rights, money, health, jobs or safety?</li>
<li><strong>Document your data:</strong> where training and input data came from, and whether you have the right to use it.</li>
<li><strong>Test and record results:</strong> keep evaluation results, including checks for bias and failure cases.</li>
<li><strong>Be transparent with users:</strong> tell people when they are interacting with AI or seeing AI-generated content.</li>
<li><strong>Enable human oversight:</strong> make sure people can review, correct and override important decisions.</li>
<li><strong>Log and monitor:</strong> keep records of how the system behaves in production and how issues are handled.</li>
</ol>

<h2>Why this is good news</h2>
<p>Almost everything on that list also makes AI products better: fewer surprises, easier debugging, more trust from customers. Teams that build these habits now will find compliance much easier, and will likely ship more reliable products too.</p>
`
},

{
slug: 'smart-contract-upgrades-and-proxies',
title: 'Smart contract upgrades: proxies, risks and alternatives',
date: '2027-06-14',
tag: 'Blockchain & Web3',
excerpt: 'Upgradeable contracts let you fix bugs after launch. They also give someone the power to change the rules. Here is how to balance both.',
takeaways: [
    'Proxies separate storage from logic',
    'Upgrade power is a security risk in itself',
    'Use timelocks, multisigs and careful storage layouts'
],
body: `
<p>Smart contracts are often described as immutable. In practice, many production contracts are upgradeable, using proxy patterns. This lets teams fix bugs and add features, but it also means someone can change how the contract behaves. Both sides of that trade-off need careful handling.</p>

<h2>How proxies work</h2>
<p>Users interact with a proxy contract that holds the data (balances, settings). The proxy forwards every call to a separate implementation contract that holds the logic. To upgrade, the admin points the proxy at a new implementation. The address and data stay the same; the behaviour changes.</p>
<p>Common patterns include transparent proxies, UUPS proxies and beacon proxies, all with well-tested implementations in libraries such as OpenZeppelin.</p>

<h2>Classic upgrade bugs</h2>
<ul>
<li><strong>Storage collisions:</strong> reordering or changing variable types in a new version can corrupt existing data. New variables should only be added at the end, or managed with namespaced storage.</li>
<li><strong>Uninitialised implementations:</strong> forgetting to initialise or lock the implementation contract has led to serious incidents.</li>
<li><strong>Constructors do not run:</strong> upgradeable contracts use initialiser functions instead, which must be protected from being called twice.</li>
</ul>

<h2>Governing the upgrade key</h2>
<ul>
<li>Use a multisig wallet rather than a single key.</li>
<li>Add a timelock, so users can see an upgrade coming and leave if they disagree.</li>
<li>Publish and verify every new implementation before it takes effect.</li>
<li>Consider giving up upgrade rights entirely once the system is mature.</li>
</ul>

<h2>Alternatives to full upgradeability</h2>
<ul>
<li><strong>Modular design:</strong> keep the core immutable and make only peripheral modules replaceable.</li>
<li><strong>Migration:</strong> deploy a new version and let users move over voluntarily.</li>
<li><strong>Parameter changes only:</strong> allow limited, bounded settings changes instead of arbitrary code changes.</li>
</ul>
<p>The right level of upgradeability depends on how young the system is and how much trust users are asked to give. Be explicit about it, because users will be.</p>
`
},

{
slug: 'lakehouse-architecture-plain-english',
title: 'Lakehouse architecture in plain English',
date: '2027-06-21',
tag: 'Data engineering',
excerpt: 'Data lakes are cheap but messy. Warehouses are tidy but rigid. The lakehouse tries to give you both. Here is what that really means.',
takeaways: [
    'Cheap file storage with warehouse-style reliability',
    'Open table formats are the key ingredient',
    'Organise data in layers from raw to business-ready'
],
body: `
<p>For years, companies chose between two models. A <strong>data warehouse</strong> stores structured, cleaned data for fast SQL analytics, but can be expensive and less flexible. A <strong>data lake</strong> stores any kind of file cheaply, but often turns into a "data swamp" nobody trusts. A lakehouse combines the low-cost storage of a lake with the reliability and performance of a warehouse.</p>

<h2>The key ingredient: open table formats</h2>
<p>A lakehouse stores data as files in cheap object storage, but adds a table format layer, such as Apache Iceberg, Delta Lake or Apache Hudi. This layer adds features that plain files lack:</p>
<ul>
<li><strong>Transactions:</strong> writes either fully succeed or do not happen, so readers never see half-written data.</li>
<li><strong>Schema enforcement and evolution:</strong> add or change columns safely.</li>
<li><strong>Time travel:</strong> query the data as it was at an earlier point, useful for audits and debugging.</li>
<li><strong>Efficient updates and deletes:</strong> essential for privacy requests and corrections.</li>
</ul>

<h2>The layered approach</h2>
<p>Many lakehouses organise data in layers, sometimes called bronze, silver and gold:</p>
<ol>
<li><strong>Raw (bronze):</strong> data as it arrived, untouched.</li>
<li><strong>Cleaned (silver):</strong> standardised, deduplicated and validated.</li>
<li><strong>Business-ready (gold):</strong> aggregated tables and metrics that reports and models use.</li>
</ol>

<h2>Why it is popular</h2>
<ul>
<li>One copy of the data can serve BI, data science and machine learning.</li>
<li>Several engines can read the same open tables, which reduces vendor lock-in.</li>
<li>Storage costs stay low even as data grows.</li>
</ul>

<h2>Is it right for you?</h2>
<p>If your data is modest and mostly structured, a managed warehouse may be simpler. If you handle large volumes, mixed data types or machine learning workloads, a lakehouse built on open formats is often a sound long-term choice.</p>
`
},

{
slug: 'finding-memory-leaks',
title: 'Memory leaks: find them before they find you',
date: '2027-06-28',
tag: 'Debugging & QA',
excerpt: 'The app is fine after a deploy, then slows down and crashes days later. Classic memory leak. Here is how to track one down.',
takeaways: [
    'Look for memory that grows and never comes back down',
    'Compare heap snapshots over time',
    'Caches, listeners and global collections are usual suspects'
],
body: `
<p>Memory leaks rarely show up in testing. The service runs perfectly for hours, then memory creeps upward until it slows down or the process is killed. Restarting "fixes" it, until it happens again. Even in garbage-collected languages, leaks are common.</p>

<h2>Spotting a leak</h2>
<p>Graph memory usage over several days. Normal applications show a sawtooth pattern: memory rises, garbage collection runs, and it drops back to a steady baseline. A leak shows a baseline that keeps rising, often in steps after each deploy or busy period.</p>

<h2>Common causes</h2>
<ul>
<li><strong>Unbounded caches:</strong> a dictionary that stores results forever and never evicts old entries.</li>
<li><strong>Event listeners and callbacks</strong> that are added repeatedly and never removed.</li>
<li><strong>Global collections</strong> that keep references to request or user objects.</li>
<li><strong>Timers and intervals</strong> that are never cleared.</li>
<li><strong>Closures</strong> that accidentally capture large objects.</li>
<li><strong>Connections and file handles</strong> that are opened but not closed.</li>
</ul>

<h2>Tracking it down</h2>
<ol>
<li><strong>Reproduce under load:</strong> run a load test against a staging instance and watch memory.</li>
<li><strong>Take heap snapshots:</strong> one at the start, one after load, one after more load. Browser and Node.js DevTools, Python's tracemalloc and Java profilers can all do this.</li>
<li><strong>Compare snapshots:</strong> look for object types whose count keeps growing between snapshots.</li>
<li><strong>Follow the references:</strong> profilers show what is keeping those objects alive. That path usually points straight at the bug.</li>
</ol>

<h2>Preventing it</h2>
<ul>
<li>Give every cache a maximum size or expiry time.</li>
<li>Pair every "add listener" with a matching "remove".</li>
<li>Use language features for cleanup, such as context managers in Python or try/finally blocks.</li>
<li>Alert on memory growth trends, not just on hitting a hard limit.</li>
</ul>
`
}

]);
