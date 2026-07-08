// Staff Application questions, split into parts.
// Part 1: general suitability (asked to everyone).
// Part 2: Server Staff scenarios (Server Staff + Network Staff + Not Sure).
// Part 3: Network Staff scenarios (Network Staff + Not Sure only).
// Addons: extra scenarios asked to everyone.

const PART1_QUESTIONS = [
  {
    id: 'q1',
    text: 'Which Server are you applying from?',
    type: 'guild_select'
  },
  {
    id: 'q2',
    text: 'Are you applying for:',
    type: 'select',
    options: [
      'Server Staff (moderate only the server you selected)',
      'Network Staff (moderate across all Midnight Network servers)',
      "I'm not sure / I'd like guidance"
    ]
  },
  {
    id: 'q3',
    text: 'What is the minimum age requirement to apply for staff?',
    type: 'select',
    options: ['16+', '18+', '21+', 'No age requirement']
  },
  {
    id: 'q4',
    text: 'Which starting position do ALL new staff members begin in?',
    type: 'select',
    options: ['Admin', 'Moderator', 'Helper', 'Trial Staff']
  },
  {
    id: 'q5',
    text: 'How long have you been a member of the server you selected?',
    type: 'text'
  },
  {
    id: 'q6',
    text: 'This is a volunteer position with no monetary compensation. Do you understand and accept this?',
    type: 'select',
    options: [
      'Yes, I understand this is unpaid volunteer work',
      'No, I was expecting to be paid',
      'I have questions about compensation'
    ]
  },
  { id: 'q7', text: 'What draws you to helping others in online communities?', type: 'text' },
  { id: 'q8', text: 'Which Helper role interests you most (Voice Helper, Image Helper, or Chat Helper) and why?', type: 'text' },
  { id: 'q9', text: 'What relevant skills or experience do you have for your chosen Helper specialization?', type: 'text' },
  { id: 'q10', text: 'How do you approach welcoming new members and making them feel comfortable?', type: 'text' },
  { id: 'q11', text: 'Describe your communication style when helping someone who is confused or frustrated.', type: 'text' },
  { id: 'q12', text: 'How do you handle situations where you don\'t know the answer to a member\'s question?', type: 'text' },
  { id: 'q13', text: 'What is your approach to maintaining positive conversations and community atmosphere?', type: 'text' },
  { id: 'q14', text: 'What is your available schedule? Are you looking for flexible hours or more consistent timing?', type: 'text' },
  { id: 'q15', text: 'How do you balance helping others with your own needs and boundaries?', type: 'text' },
  { id: 'q16', text: 'How do you typically learn new skills or adapt to new responsibilities?', type: 'text' },
  { id: 'q17', text: 'What aspects of server staff work are you most excited to learn about?', type: 'text' },
  { id: 'q18', text: 'What do you believe are the most important qualities for effective community support and member assistance?', type: 'text' },
  { id: 'q19', text: 'Why do you want to join the Helper Department specifically, and how would you contribute to a welcoming environment?', type: 'text' },
  {
    id: 'q20',
    text: 'Some areas of the Midnight Network require ID verification. Have you completed this process?',
    type: 'select',
    options: [
      'Yes, I am ID verified',
      'No, but willing to complete if required',
      'No, I am not willing to complete ID verification',
      "I don't know what this means"
    ]
  }
];

const PART2_QUESTIONS = [
  { id: 'p2q1', text: 'A new member joins and immediately starts asking multiple questions at once in general chat. How do you help them while keeping the channel organized? (Communication & New Members)', type: 'text' },
  { id: 'p2q2', text: "A member posts a meme in the wrong channel. It's their first time doing this. How do you address it? (Minor Rule Violation)", type: 'text' },
  { id: 'p2q3', text: 'A member is trying to participate but their English is very limited and others are getting frustrated trying to understand them. How do you handle this? (Language Barrier)', type: 'text' },
  { id: 'p2q4', text: "A member asks the same question you've already answered three times this week. They apologize and say they keep forgetting. How do you respond? (Repeat Questions)", type: 'text' },
  { id: 'p2q5', text: "Multiple members are having an off-topic conversation in a channel dedicated to specific content. They're not being disruptive, just in the wrong place. What do you do? (Channel Misuse)", type: 'text' },
  { id: 'p2q6', text: "Someone shares an image that makes you uncomfortable but you're not 100% sure if it breaks the rules. No senior staff are online. How do you proceed? (Questionable Content)", type: 'text' },
  { id: 'p2q7', text: "Your friend posts something that's a minor rule violation. Other members saw it. How do you handle this situation? (Friend Breaking Rules)", type: 'text' },
  { id: 'p2q8', text: "A member keeps pushing boundaries with slightly inappropriate jokes that aren't quite rule-breaking but are making others uncomfortable. How do you address this? (Boundary Testing)", type: 'text' },
  { id: 'p2q9', text: 'A member DMs you asking if you can bend a rule "just this once" because they have a good reason. How do you respond? (Request for Special Treatment)', type: 'text' },
  { id: 'p2q10', text: 'A member tells you that another Helper gave them different information about the rules than what you know is correct. How do you handle this? (Conflicting Information)', type: 'text' },
  { id: 'p2q11', text: "A member starts venting about serious personal problems in a public channel. It's getting heavy and others seem uncomfortable. How do you redirect this sensitively? (Personal Venting)", type: 'text' },
  { id: 'p2q12', text: "You're helping someone with a question when three other members start asking you different questions in different channels. How do you manage this? (Multi-tasking Pressure)", type: 'text' },
  { id: 'p2q13', text: "You politely remind a member about a rule and they become defensive, saying you're being too strict and other servers don't care about this. How do you respond? (Defensive Member)", type: 'text' },
  { id: 'p2q14', text: "You realize you gave a member incorrect information earlier and they've already acted on it. How do you correct your mistake? (Mistake Recognition)", type: 'text' },
  { id: 'p2q15', text: 'A member needs help with something but you need to log off in 5 minutes. They seem frustrated when you mention you\'re about to leave. How do you handle this? (Time Conflict)', type: 'text' }
];

const PART3_QUESTIONS = [
  { id: 'p3q1', text: 'You notice another staff member using their permissions inappropriately - giving roles to friends without proper process or punishing someone they have a personal conflict with. What do you do? (Witnessing Power Abuse)', type: 'text' },
  { id: 'p3q2', text: 'A member asks you to give them a verified role without completing the required verification process. They say their ID is "at home" and they\'ll do it later, but they want access now. How do you respond? (Verification Bypass Request)', type: 'text' },
  { id: 'p3q3', text: 'A member has violated a server rule for the first time. You need to warn them. Walk us through how you would handle this - what would you say, and how would you document it? (Issuing a Warning)', type: 'text' },
  { id: 'p3q4', text: 'A member is permanently banned from one network server for harassment. They immediately join another network server. What steps do you take?', type: 'text' },
  { id: 'p3q5', text: "A member complains that they got warned in Server A for something that's allowed in Server B. They're accusing staff of being inconsistent. How do you explain this?", type: 'text' },
  { id: 'p3q6', text: 'You notice the same user causing minor issues in two different network servers under slightly different usernames. What do you do?', type: 'text' },
  { id: 'p3q7', text: 'A member who is verified in Den of Desires asks you to just give them access to another restricted area since "you can see I\'m already verified." How do you handle this?', type: 'text' },
  { id: 'p3q8', text: "You need to make an important announcement that affects all three network servers. What's your process for coordinating this?", type: 'text' },
  { id: 'p3q9', text: "Rule violations are happening simultaneously in two different network servers. You can't handle both at once. How do you prioritize?", type: 'text' },
  { id: 'p3q10', text: "Two members are having a personal conflict that's spilling across multiple network servers. How do you coordinate with other staff to address this network-wide?", type: 'text' },
  { id: 'p3q11', text: 'A member has committed serious violations in one server. Do you recommend a network-wide blacklist? What factors do you consider?', type: 'text' },
  { id: 'p3q12', text: 'Server Staff in one server took action on a user without checking if they\'re flagged in other network servers. The user has a history you would have caught. How do you address this?', type: 'text' },
  { id: 'p3q13', text: "As Network Staff, you have access to sensitive verification information across servers. A member asks you about another member's verification status. How do you respond?", type: 'text' },
  { id: 'p3q14', text: "Staff in Server A banned someone, but staff in Server B want to give them a second chance. You're Network Staff. How do you handle this disagreement?", type: 'text' },
  { id: 'p3q15', text: "You're enforcing rules in Den of Desires (NSFW/BDSM education server) versus Midnight Lounge (SFW). How does your moderation approach differ between these environments?", type: 'text' }
];

const ADDON_QUESTIONS = [
  { id: 'addq1', text: "A partnered server is advertising in your network, but you notice they're not following the partnership agreement. What's your process?", type: 'text' },
  { id: 'addq2', text: 'You suspect a member is using alt accounts across different network servers to evade previous warnings. How do you investigate and handle this?', type: 'text' }
];

module.exports = { PART1_QUESTIONS, PART2_QUESTIONS, PART3_QUESTIONS, ADDON_QUESTIONS };