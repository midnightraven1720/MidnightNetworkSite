// Network-wide baseline rules shown on every server's Rules tab.
// Individual servers add their own themed rules on top of this (see servers.js).

export const ruleCategories = [
  {
    title: "Age Requirement — Non-Negotiable",
    points: [
      "Must be 18+ years old — verified within 24 hours of joining.",
      "Age verification required through the support ticket system.",
      "False age claims result in an immediate permanent ban with no appeals.",
      "Zero tolerance for minors in any context or circumstance.",
    ]
  },
  {
    title: "Immediate Permanent Ban Offenses",
    points: [
      "Being under 18 years old, regardless of claims or circumstances.",
      "Any content involving minors in sexual, suggestive, or inappropriate contexts.",
      "Real doxxing — sharing addresses, phone numbers, or personal documents with malicious intent.",
      "Credible threats of violence with apparent means and intent to harm.",
      "Non-consensual intimate content, including revenge material and deepfakes.",
      "Illegal content sharing, including drugs, weapons, hacking tools, or malware distribution.",
    ]
  },
  {
    title: "Core Server Rules",
    points: [
      "Treat all members with respect — no harassment, bullying, or discrimination.",
      "Follow Discord's Terms of Service and Community Guidelines at all times.",
      "Use appropriate channels for different types of content and discussions.",
      "NSFW content only in designated 18+ channels, with proper verification required.",
      "No impersonation of staff members, other users, or public figures.",
      "Keep conversations mature, professional, and constructive.",
    ]
  },
  {
    title: "Progressive Discipline System",
    points: [
      "Level 1 (Minor): Spam, off-topic, mini-modding — warnings, timeouts (5–60 minutes).",
      "Level 2 (Moderate): Persistent spam, disrespect, trolling — mutes (1–24 hours).",
      "Level 3 (Serious): Harassment, hate speech, NSFW violations — extended mutes, temporary bans.",
      "Level 4 (Severe): Threats, illegal content, ban evasion — temporary bans (1 day – 3 months).",
      "Level 5 (Critical): Child content, doxxing, terrorism — immediate permanent ban.",
    ]
  },
  {
    title: "Direct Message (DM) Policies & Tags",
    points: [
      "DM Open — member welcomes direct messages from server members.",
      "Ask to DM — member requires permission before sending direct messages.",
      "DM Closed — member does not want direct messages from server members.",
      "Violating DM preferences results in a formal warning for a first offense, and a mute for repeated violations.",
      "Harassment via DMs after an 'Ask to DM' refusal or 'DM Closed' status results in a temporary ban.",
    ]
  },
  {
    title: "NSFW Content Guidelines",
    points: [
      "Age verification is mandatory for access to adult content channels.",
      "Consent and boundaries are required in all adult interactions and discussions.",
      "Prohibited content includes anything involving minors, non-consensual material, or extreme violence combined with sexual content.",
      "Content warnings are required for extreme or potentially triggering material.",
      "Report violations immediately through the support ticket system.",
    ]
  },
  {
    title: "Blacklist System",
    points: [
      "Permanent bans for individuals or servers committing serious safety violations.",
      "Information may be shared with trusted partners for network protection.",
      "Appeals are possible after 6+ months, with evidence of genuine behavioral change — one appeal opportunity only.",
      "All blacklist decisions require evidence and senior staff approval.",
    ]
  },
  {
    title: "No Promotion & Financial Exploitation Policy",
    points: [
      "No promotion of adult content platforms, including OnlyFans, Fansly, ManyVids, Chaturbate, or similar.",
      "No cryptocurrency promotion or trading advice, including Bitcoin, NFTs, or investment schemes.",
      "No gambling promotion, including casinos, betting sites, poker rooms, or gambling Discord servers.",
      "No get-rich-quick schemes, including MLMs, pyramid schemes, or dubious investment opportunities.",
      "No selling sexual content or services, including custom content, meetups, or personal sessions.",
      "Violations result in an immediate temporary ban (3–7 days); repeated violations result in a permanent ban.",
    ]
  },
  {
    title: "Drama Management Policies",
    points: [
      "No external server drama — we remain neutral in conflicts between other communities.",
      "No gossip or rumor spreading about other servers, staff, or community members.",
      "Public arguments and flame wars are prohibited — staff will intervene and issue timeouts.",
      "Stirring up controversy for attention will result in warnings and potential mutes.",
      "Report drama instead of participating — let staff handle community conflicts.",
    ]
  },
  {
    title: "Partnership Drama & Conflict Policies",
    points: [
      "No discussing partner server internal drama — we maintain professional neutrality.",
      "No recruiting from partner servers during conflicts — respect partnership agreements.",
      "Don't bring partnership disputes into public channels — handle through staff only.",
      "No badmouthing current or former partner servers.",
      "Report partnership issues to staff immediately — don't let conflicts escalate publicly.",
    ]
  },
  {
    title: "Relationship & Personal Conflict Policies",
    points: [
      "Keep personal relationship conflicts private — use DMs or appropriate support channels.",
      "No public breakup drama or airing relationship issues in community channels.",
      "Respect others' privacy — don't share private conversations, intimate details, or personal information.",
      "No relationship interference — don't involve the community in personal romantic disputes.",
      "Staff mediation is available for serious interpersonal conflicts affecting multiple members.",
    ]
  },
  {
    title: "Getting Help & Reporting",
    points: [
      "Support tickets: for private issues, reports, appeals, and sensitive matters.",
      "Rule questions: ask in the rules-faq channel or open a support ticket.",
      "Emergency situations: DM online staff and open a support ticket immediately.",
      "Harassment reports: aim to respond within 2 hours — document everything.",
    ]
  },
  {
    title: "Important Reminders",
    points: [
      "Ignorance of rules is not an excuse — all members are expected to read and follow guidelines.",
      "Staff enforce rules consistently, regardless of personal relationships or community standing.",
      "Appeals are available for most punishments through the proper support ticket process.",
      "Community safety is our highest priority — report violations to protect everyone.",
    ]
  },
  {
    title: "Emergency Contacts",
    points: [
      "Illegal content: screenshot, DM staff, open a support ticket, and use Discord's report feature.",
      "Active threats or doxxing: document everything and notify staff immediately.",
      "Child safety concerns: contact staff immediately with comprehensive documentation.",
    ]
  },
];

export const ruleFAQ = [
  {
    title: "Age Verification & Requirements",
    qa: [
      { q: "Why do you require age verification?", a: "Legal compliance and safety. Adult content requires verified 18+ access to comply with laws and Discord's Terms of Service." },
      { q: "What happens if I don't verify within 24 hours?", a: "You'll be automatically removed from the server. The 24-hour window ensures we maintain legal compliance." },
      { q: "Can I verify with a school ID or other non-government document?", a: "No. Only government-issued photo identification is accepted." },
      { q: "Why is there zero tolerance for age violations?", a: "Legal liability and community safety — any minor accessing adult content creates serious risk for everyone involved." },
    ]
  },
  {
    title: "Progressive Discipline System",
    qa: [
      { q: "Why do you have 5 different violation levels?", a: "Fairness and proportionality. Minor mistakes shouldn't result in permanent bans, but serious safety violations require immediate action." },
      { q: "Can I appeal a Level 5 violation?", a: "No immediate appeals for Level 5 (Critical) violations. Appeals may be possible after 6+ months for some violations, but never for the most serious ones." },
      { q: "Why do repeat offenses get harsher punishments?", a: "Pattern behaviour indicates unwillingness to follow community standards, so consequences escalate accordingly." },
      { q: "Who decides what level a violation is?", a: "Multiple staff members review evidence and determine violation levels based on established criteria." },
    ]
  },
  {
    title: "Zero Tolerance Violations",
    qa: [
      { q: "Why is there zero tolerance for certain violations?", a: "Safety and legal compliance — violations like content involving minors, doxxing, and credible threats pose immediate danger." },
      { q: "What counts as 'content involving minors'?", a: "Any sexual, suggestive, or inappropriate content featuring anyone under 18, including fictional or 'aged up' characters." },
      { q: "Why can't you just remove the content and give a warning?", a: "Some violations are too serious for warnings — they indicate someone who poses ongoing danger to the community." },
      { q: "What is 'real doxxing' vs. 'doxxing attempts'?", a: "Real doxxing is successfully sharing someone's personal identifying information with malicious intent. Attempts are trying to do so but failing. Both are serious, but real doxxing is an immediate permanent ban." },
    ]
  },
  {
    title: "NSFW Content Policies",
    qa: [
      { q: "Why do you need age verification for NSFW channels?", a: "Legal requirement and platform compliance — many jurisdictions require verification for access to sexual material." },
      { q: "What's the difference between artistic nudity and prohibited content?", a: "Artistic nudity focuses on aesthetic expression without explicit sexual focus. Prohibited content includes anything involving minors, non-consensual material, or extreme violence combined with sexual content." },
      { q: "Why can't I share NSFW content in general channels?", a: "Mixed audience protection and consent — not everyone wants to see adult content, and NSFW channels let people choose their exposure." },
      { q: "What are content warnings and why are they required?", a: "Brief descriptions of potentially triggering content that let people decide whether to view it, helping maintain consent and respect boundaries." },
    ]
  },
  {
    title: "No Promotion & Financial Policies",
    qa: [
      { q: "Why can't I promote my OnlyFans or other adult content?", a: "Community focus and exploitation prevention — our server is for genuine social interaction, not commercial promotion." },
      { q: "Why are cryptocurrency and gambling discussions banned?", a: "Member protection from financial scams that commonly target adult communities." },
      { q: "Can I mention that I create content without promoting it?", a: "Casual mention in conversation is different from promotion. Directing people to paid content or soliciting customers will be treated as promotion." },
      { q: "Why is this policy so strict with immediate bans?", a: "Prevention of community commercialization — allowing any promotion quickly leads to the server being overrun with sellers and scammers." },
    ]
  },
  {
    title: "Direct Message Policies",
    qa: [
      { q: "What do the DM preference tags mean?", a: "DM Open means they welcome messages, Ask to DM means get permission first, and DM Closed means don't message them privately." },
      { q: "Why do you enforce DM preferences so strictly?", a: "Consent and boundary respect are essential in adult communities." },
      { q: "What if someone doesn't have a DM preference tag?", a: "Assume 'Ask to DM' and request permission before messaging." },
      { q: "Why is harassment via DMs taken so seriously?", a: "Private harassment is often more threatening and persistent than public harassment, and can't be easily monitored by staff." },
    ]
  },
  {
    title: "Drama & Conflict Management",
    qa: [
      { q: "Why can't I discuss drama from other servers?", a: "Neutrality and focus maintenance — we maintain professional neutrality in external disputes." },
      { q: "What's the difference between discussing issues and spreading gossip?", a: "Discussing issues focuses on problem-solving. Gossip involves spreading rumors or negative judgments without constructive purpose." },
      { q: "Why do you intervene in public arguments?", a: "Community atmosphere protection — public arguments create uncomfortable environments and can escalate quickly." },
      { q: "Can I get help with relationship problems from the community?", a: "General advice in appropriate channels is fine, but detailed personal conflicts should stay private." },
    ]
  },
  {
    title: "Partnership Policies",
    qa: [
      { q: "Why don't you accept cross-ID verification from partner servers?", a: "Security and liability — we can't verify the quality of other servers' age verification processes." },
      { q: "What makes a server eligible for partnership?", a: "18+ verification, professional staff, safety standards, and community health." },
      { q: "Why do you have restrictions on partnership drama?", a: "Professional relationships and conflict prevention — public disputes damage relationships and can split communities." },
      { q: "How do you handle false blacklisting between partners?", a: "We require evidence before accepting blacklist information and investigate reports of false blacklisting." },
    ]
  },
  {
    title: "Blacklist System",
    qa: [
      { q: "What is the blacklist and why do you have it?", a: "A community protection system that permanently bans individuals and servers who have committed serious safety violations." },
      { q: "How do you decide who gets blacklisted?", a: "Evidence-based decisions with multiple staff reviews, requiring documented evidence and senior staff approval." },
      { q: "Can blacklisted people appeal?", a: "Limited appeals after 6+ months for some violations, requiring acknowledgment of wrongdoing and evidence of behavioral change. Only one appeal allowed." },
      { q: "Why do you share blacklist information with other servers?", a: "Network safety — dangerous individuals often move between servers when banned, so sharing information helps prevent continued harm." },
    ]
  },
  {
    title: "False Blacklisting Protection",
    qa: [
      { q: "What is false blacklisting and how do you prevent it?", a: "Being wrongly added to the blacklist based on fabricated evidence or malicious reporting. We prevent this through multiple verification requirements and independent review." },
      { q: "What evidence do you require before blacklisting someone?", a: "Multiple source confirmation, timestamped documentation, and verification from at least 2 trusted staff members or partners." },
      { q: "What happens to people who make false blacklist reports?", a: "Progressive consequences ranging from warnings to blacklist addition for malicious campaigns." },
      { q: "Can someone appeal a blacklist they believe is false?", a: "Yes — appeals for suspected false blacklisting can be submitted immediately rather than waiting 6 months, with priority review." },
    ]
  },
  {
    title: "Support & Appeals",
    qa: [
      { q: "When should I create a support ticket vs. ask publicly?", a: "Private issues, sensitive matters, or personal problems need tickets. General rule questions can happen publicly." },
      { q: "Why do appeal reviews take so long?", a: "Thorough investigation and fairness — appeals require multiple staff review and evidence verification." },
      { q: "Can I appeal any punishment?", a: "Most punishments can be appealed except Level 5 critical violations, and appeals must include acknowledgment of wrongdoing." },
    ]
  },
  {
    title: "Emergency & Safety",
    qa: [
      { q: "What constitutes an emergency requiring immediate staff contact?", a: "Immediate threats to safety, including credible violence threats, active doxxing, illegal content, or child safety concerns." },
      { q: "Why do you require evidence for serious reports?", a: "Fair enforcement — screenshots and context help staff make accurate decisions and protect innocent people from false reports." },
      { q: "What happens to evidence after a case is resolved?", a: "Secure storage with access limited to authorized staff, and automatic review for deletion after appropriate retention periods." },
    ]
  },
  {
    title: "General Philosophy",
    qa: [
      { q: "Why are the rules so comprehensive and strict?", a: "Adult community responsibility and legal protection — 18+ communities face unique legal and safety challenges." },
      { q: "How do you balance freedom with safety?", a: "We aim to give members as much freedom as possible while maintaining essential safety standards." },
      { q: "Why do you emphasize professional behavior in an adult community?", a: "Maturity and respect — being 18+ means taking responsibility for your actions and treating others well." },
    ]
  },
  {
    title: "No Flirting With Staff",
    qa: [
      { q: "What exactly counts as flirting with staff?", a: "Romantic comments, sexual compliments, pickup lines, or persistent personal questions — as well as using charm to try to get special treatment." },
      { q: "What if a staff member seems to be flirting back or being friendly?", a: "Staff are trained to be friendly and helpful to everyone. Being nice doesn't mean romantic interest — when in doubt, keep it professional." },
      { q: "Can I still joke around or be friendly with staff members?", a: "Absolutely — friendly, respectful conversation is fine. The line is romantic or sexual territory." },
      { q: "What should I do if I accidentally crossed the line or got a warning?", a: "Take it seriously, apologize sincerely, and adjust your behavior going forward." },
    ]
  },
];
