import type { ScamLibraryItem } from '../types';

export const SCAM_LIBRARY_ITEMS: ScamLibraryItem[] = [
  {
    id: 'scam-phishing-banking',
    title: 'Bank Impersonation & OTP Social Engineering',
    titleUr: 'Bank Ke Naam Par OTP Chori Aur Fraud',
    category: 'Phishing Link',
    riskLevel: 'Critical',
    overview: 'Fraudsters masquerade as reputable commercial banks, claiming that the victim\'s debit card, bank account, or mobile banking portal has been suspended or flagged for fraudulent activity.',
    overviewUr: 'Dhokebaaz bank ke numainday ban kar call ya SMS karte hain aur kehte hain ke aap ka account ya card block ho gaya hai, aur unlock karne ke liye OTP mangte hain.',
    tactics: [
      'Spoofed SMS alphanumeric sender IDs imitating commercial banks',
      'Artificial emergency windows (e.g. "Action needed within 15 minutes")',
      'Credential harvesting portals hosted on .xyz, .top, or typo-squatted domains',
      'Phone spoofing requesting the victim to recite incoming one-time SMS passcodes'
    ],
    tacticsUr: [
      'Bank ke miltay jultay SMS IDs se jali paigham bhejna',
      'Jald-bazi ka masnooi dabao paida karna (maslan 15 minute mein account band)',
      'Jali login websites jahan user apna PIN aur password darj kare',
      'Phone call par security checking ke bahane OTP code mangna'
    ],
    realWorldExample: '"Urgent Notice: Unauthorized debit of $849.00 flagged on your account. If this was not you, visit http://secure-bank-cancel.top immediately to reverse transaction."',
    indicators: [
      'Direct link in SMS to an unverified domain',
      'Requests for your complete card number, CVV, or one-time verification code',
      'Sense of extreme panic or threat of irreversible fund loss'
    ],
    defenseTips: [
      'Banks never ask for your PIN, CVV, or OTP via phone call or SMS.',
      'Always navigate to your bank portal by manually typing the official domain or using the official mobile app.',
      'If in doubt, call the official customer care telephone number printed on the back of your physical card.'
    ],
    defenseTipsUr: [
      'Koi bhi bank phone ya message par aap se OTP ya PIN nahi mangta.',
      'Bank ki website hamesha khud browser mein likh kar kholein ya official mobile app istemal karein.',
      'Shak ki soorat mein card ke peechay likhay hue helpline number par rabta karein.'
    ]
  },
  {
    id: 'scam-fake-remote-jobs',
    title: 'High-Paying Remote Task & Freelance Escrow Scam',
    titleUr: 'Ghar Baithe Aasan Online Nokri Ka Dhoka',
    category: 'Fake Job Offer',
    riskLevel: 'High',
    overview: 'Unsolicited WhatsApp or Telegram messages offering lucrative remote tasks (such as rating YouTube videos, reviewing hotels, or typing data) promising $200-$800 daily wages.',
    overviewUr: 'WhatsApp ya Telegram par achanak message aata hai ke ghar baithe video like karke ya typing karke rozana 5,000 se 20,000 kamayein, lekin pehlay registration fee mangi jati hai.',
    tactics: [
      'Direct unsolicited contact on WhatsApp or Telegram from overseas country codes (+62, +84, +234, +44)',
      'Initial micro-payout of $5 to $10 to build false trust and legitimacy',
      'Demands for "recharge" or "security deposit" to unlock higher-tier commissions',
      'Crypto wallet or mobile wallet deposits that cannot be reversed'
    ],
    tacticsUr: [
      'Ghair-mulki numbers se WhatsApp par rabta karna',
      'Aitmaad jeetne ke liye pehle chota sa munafa dena',
      'Bara munafa nikalne ke liye advance deposit ya fees ka mutalba',
      'Crypto ya mobile wallet ke zariye paise mangna jo wapis na mil sakein'
    ],
    realWorldExample: '"Greetings! I am Sarah from HR Global Talent. We have remote part-time positions rating movies online. Earn $300-$500 daily. Flexible 2 hours. Message @global_recruiter on Telegram."',
    indicators: [
      'Unrealistically high remuneration for entry-level or trivial tasks',
      'Recruitment conducted entirely via encrypted messaging apps without formal interviews',
      'Requirement to transfer personal funds to "unlock" earned balances'
    ],
    defenseTips: [
      'Legitimate employers will never require you to pay upfront fees, equipment deposits, or task balance recharges.',
      'Never move recruitment discussions from verified job platforms (LinkedIn, Upwork) to unmonitored Telegram chats.',
      'Do not share personal government identification or banking details with unsolicited recruiters.'
    ],
    defenseTipsUr: [
      'Koi bhi asali idara kaam shuru karne ke liye aapse advance fees nahi leta.',
      'Telegram ya WhatsApp par anjan logon se nokri ke mutaliq guftagu na karein.',
      'Apna CNIC, passport ya bank maloomat kisi ghair-tasdeeq shuda shakhs ko na dein.'
    ]
  },
  {
    id: 'scam-lottery-advance-fee',
    title: 'Lottery, Grant & Advance-Fee Fraud (BISP / Prize Scheme)',
    titleUr: 'Inami Lottery Aur Sarkari Imdad Ka Advance Fee Fraud',
    category: 'Lottery / Prize Fraud',
    riskLevel: 'Critical',
    overview: 'Notifications falsely informing the recipient that they have won millions in a lottery, prize draw, or government grant (e.g. Benazir Income Support Program, Jeeto Pakistan, or international lotteries).',
    overviewUr: 'Users ko paigham bheja jata hai ke unka lakhon ka inam nikla hai ya sarkari scheme se imdad aayi hai, lekin inam lene ke liye pehlay tax ya file processing fee jama karwayein.',
    tactics: [
      'Claims that the user was randomly selected via their SIM card number',
      'Requirement to send processing fees, taxes, or clearance fees via JazzCash or EasyPaisa',
      'Impersonation of government officials or TV show hosts',
      'Aggressive warnings that unclaimed funds will lapse within 24 hours'
    ],
    tacticsUr: [
      'Yeh kehna ke aap ka SIM number lucky draw mein chuna gaya hai',
      'JazzCash ya EasyPaisa par advance processing fee mangna',
      'Sarkari afseran ya mashhoor TV anchors ke naam ka istemal',
      'Dhamki dena ke agar 24 ghante mein paise na bheje toh inam zaya ho jayega'
    ],
    realWorldExample: '"Congratulations! Under the Federal Welfare Relief Draw, your mobile number has won Rs 1,500,000. To claim your cheque, send registration fee of Rs 3,500 via mobile wallet to Officer Khan."',
    indicators: [
      'Winning a lottery or contest you never purchased a ticket or entered into',
      'Demanding advance payments through untraceable consumer payment wallets',
      'Poor grammar, excessive exclamation marks, and urgent time limits'
    ],
    defenseTips: [
      'You cannot win a contest or lottery you never deliberately entered.',
      'Legitimate grants or lotteries never require the recipient to transfer funds or taxes in advance.',
      'Block the sender immediately and report the number to the national cybercrime wing.'
    ],
    defenseTipsUr: [
      'Aap us lottery ko kabhi nahi jeet sakte jis ka ticket aap ne kabhi na khareeda ho.',
      'Asali sarkari imdad lene ke liye koi advance fees ada nahi karni parti.',
      'Number ko foran block karein aur cyber crime helpline par report karein.'
    ]
  },
  {
    id: 'scam-crypto-drainer',
    title: 'Crypto Airdrop & Smart Contract Wallet Drainer',
    titleUr: 'Crypto Airdrop Aur Jali Wallet Phishing',
    category: 'Crypto Giveaway Scam',
    riskLevel: 'Critical',
    overview: 'Malicious links masquerading as token airdrops, NFT giveaways, or decentralized finance staking yields that trick users into approving malicious smart contracts that drain cryptocurrency wallets.',
    overviewUr: 'Muft cryptocurrency ya NFT tokens ka lalach de kar jali website par wallet connect karwaya jata hai aur tamam tokens chori kar liye jatay hain.',
    tactics: [
      'Compromised verified Twitter/X accounts promoting fake airdrops',
      'Lookalike decentralized app (dApp) domains using Unicode lookalikes',
      'Approval requests for `SetApprovalForAll` or unlimited ERC-20 spending allowances',
      'Fake tech support on Discord or Telegram asking for seed phrases'
    ],
    tacticsUr: [
      'Social media accounts hack karke jali airdrop ki mashoori karna',
      'Jali dApp websites jahan wallet connect karne ko kaha jaye',
      'Unlimited permission sign karwana taake wallet ke tamam coins nikal sakein',
      'Secret recovery seed phrase mangna'
    ],
    realWorldExample: '"The official Layer-2 Foundation Airdrop is live! Connect your Web3 wallet now to claim your 2,500 token allocation before the claim period closes tonight: https://airdrop-claim-layer2.vip"',
    indicators: [
      'Urgency to claim high-value tokens within hours',
      'Web3 wallet transaction prompt asking for permissions to transfer all assets',
      'Requests for secret recovery seed phrases or private keys'
    ],
    defenseTips: [
      'Never type your 12 or 24-word recovery seed phrase into any website or form under any circumstance.',
      'Use transaction simulation tools (e.g. Pocket Universe, Wallet Guard) before signing transactions.',
      'Revoke suspicious token allowances using official tools like revoke.cash.'
    ],
    defenseTipsUr: [
      'Apna 12 ya 24 alfaz ka recovery seed phrase kisi bhi website par na likhein.',
      'Kisi bhi transaction par sign karne se pehle uski permissions ko ghor se parhein.',
      'Revoke.cash jaisi services se mashkook permissions ko khatam karein.'
    ]
  },
  {
    id: 'scam-ceo-impersonation',
    title: 'Executive & CEO Business Email Compromise (BEC)',
    titleUr: 'Afser Ya Company CEO Ban Kar Fraud',
    category: 'Impersonation',
    riskLevel: 'High',
    overview: 'Social engineering attack where an adversary poses as the victim\'s CEO, managing director, or supervisor, requesting urgent confidential wire transfers or purchasing gift cards for client gifts.',
    overviewUr: 'Hamlawaar company ke bare afser ya boss ban kar email ya message karta hai aur kisi urgent meeting ka bahana bana kar fori payment ya gift cards khareedne ko kehta hai.',
    tactics: [
      'Display name spoofing (e.g. sender shows "CEO Name" with an external Gmail/Proton address)',
      'Exploitation of organizational hierarchy to intimidate subordinates into quick action',
      'Insistence on secrecy: "I am in a confidential board meeting, do not call my phone, communicate only via email/chat"',
      'Requests for Apple, Google Play, or Steam gift cards or urgent foreign wire transfers'
    ],
    tacticsUr: [
      'Boss ka naam likh kar kisi aam Gmail address se message bhejna',
      'Dabao dalna taake junior employee baghair tasdeeq ke foran hukum mane',
      'Yeh kehna ke main zaroori meeting mein hoon, phone mat karein sirf chat karein',
      'Gift cards ya fori bank transfer karne ki farmaish karna'
    ],
    realWorldExample: '"Are you at your desk right now? I need you to handle an urgent confidential task for our client presentation. Purchase five $100 Apple gift cards and email the codes directly to me before 3 PM."',
    indicators: [
      'External email tag or unfamiliar sender address matching an internal executive\'s name',
      'Requests to circumvent standard financial procurement or payment approval protocols',
      'Insistence that the matter is confidential and not to be discussed with team members'
    ],
    defenseTips: [
      'Always verify unusual payment requests via an established secondary communication channel (in-person or known direct extension).',
      'Inspect the full reply-to address, not merely the displayed friendly name.',
      'Adhere strictly to corporate multi-signature payment controls regardless of caller rank.'
    ],
    defenseTipsUr: [
      'Kisi bhi ghair-mamooli payment request ko boss se direct mil kar ya unke asali number par call karke verify karein.',
      'Sirf naam na dekhein balke mukammal email address check karein.',
      'Company ke payment usoolon par sakhti se amal karein.'
    ]
  },
  {
    id: 'scam-tech-support',
    title: 'Tech Support Remote Access & Fake Virus Alert',
    titleUr: 'Jali Virus Alert Aur Computer Remote Access Dhoka',
    category: 'Tech Support Scam',
    riskLevel: 'Critical',
    overview: 'Full-screen browser pop-ups displaying blaring sirens, fake Windows/Apple security warnings, and urging the victim to call a toll-free number to prevent immediate data loss or arrest.',
    overviewUr: 'Computer par achanak jali warning screen aati hai ke aap ke computer mein virus aa gaya hai aur foran diye gaye number par call karein warna sara data delete ho jayega.',
    tactics: [
      'Browser lockdown scripts that disable escape key, mouse clicks, and full-screen exits',
      'Persuading the victim to install remote management software (AnyDesk, TeamViewer, UltraViewer)',
      'Opening Windows Event Viewer and claiming benign system logs are malicious Trojan horses',
      'Manipulating browser HTML to show fake overpayments into the victim\'s bank account'
    ],
    tacticsUr: [
      'Browser screen ko lock karke khaufnak awazein aur warnings dikhana',
      'User ko TeamViewer ya AnyDesk install karne par majboor karna',
      'Computer ka control le kar jali virus dikhana',
      'Bank account mein jali zayada raqam dikha kar wapsi ka mutalba karna'
    ],
    realWorldExample: '"CRITICAL SECURITY ALERT: Your computer has been locked by Windows Defender due to Trojan:Win32/Spyware activity. Call Microsoft Certified Technicians immediately at 1-800-555-0199."',
    indicators: [
      'Loud automated voice warnings or browser tabs that cannot be closed normally',
      'Toll-free telephone numbers claiming to be official Microsoft, Apple, or Google tech support',
      'Requests to grant remote desktop control to an unknown inbound caller'
    ],
    defenseTips: [
      'Microsoft, Apple, and Google never provide unsolicited pop-ups with telephone numbers to fix computers.',
      'Force close frozen browser windows using Windows Task Manager (Ctrl + Shift + Esc).',
      'Never allow unknown individuals remote access to your computer or internet banking.'
    ],
    defenseTipsUr: [
      'Microsoft ya Apple kabhi bhi computer theek karne ke liye pop-up par phone number nahi dete.',
      'Agar browser phans jaye toh Task Manager (Ctrl + Shift + Esc) se band karein.',
      'Kisi bhi anjan shakhs ko apne computer ka remote control hargiz na dein.'
    ]
  }
];
