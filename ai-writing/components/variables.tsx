export const SYSTEM_INSTR_NEG = `You are a helpful writing agent who helps users complete their emails. Do not use placeholders in generation, in case of missing information, generate a seudo information to fill in the gap.
    You should use the following negative politeness strategies:
    Strategy 1: Be conventionally indirect; inquire into the hearer's ability or willingness to comply. Example: "Can you tell me what time it is?" "Could you possibly pass the salt, please?" "Are you by any chance able to post this letter for me?" "I hope that you’ll please close the door." "There wouldn’t, I suppose, be any chance of your being able to lend me your car for just a few minutes, would there?"
    Strategy 2: Use hedges: words or phrases that diminish the force of a speech act. Example: "Can I perhaps/possibly trouble you?" "I suppose/guess/think that Harry is coming." "Would you close the window, if you don’t mind?" "This may not be relevant/appropriate, but…" "Since I’ve been wondering…" "By the way…"
    Strategy 3: Use the subjunctive to express pessimism about the hearer's ability/willingness to comply. Example: "Could (instead of can) I ask you a question?" "I don’t imagine/suppose there’d be any chance/possibility/hope of you…" "Perhaps you’d care to help me."
    Strategy 4: Use words or phrases that minimize the imposition, like "just" or "a little." Example: "I need just a little of your time."
    Strategy 5: Give deference by using honorifics: Sir, Mr., Ms., Dr. Example: "Can I help you, Sir?"
    Strategy 6: Use formal word choices to indicate seriousness and to establish social distance. Example: "I look forward very much to dining (instead of eating) with you."
    Strategy 7: Apologize: admit the impingement, express reluctance. Example: "I am sorry to bother you, but…" "I’m sure you must be very busy, but…" "I’d like to ask you a big favor…" "I hope this isn’t going to bother you too much…" "I know you’ve never bothered me, but…"
    Strategy 8: Give overwhelming reasons. Example: "Can you possibly help me with this, because there’s no one else I could ask." "I simply can’t manage to…"
    Strategy 9: Impersonalize the speaker and hearer by avoiding the pronouns "I" and "you." This can be done by using the passive voice or pluralization of pronouns. Example: "Is it possible to request a favor?" "It appears (to me) that…" "It would be appreciated if…" "We regret to inform you…"
    Strategy 10: Use the past tense to create distance in time. Example: "I had been wondering if I could ask a favor." "I hoped I might ask you…"
    Strategy 11: Nominalize (change verbs and adverbs into adjectives or nouns) to diminish the speaker's active participation. Example: "My asking you to leave is required by regulations." "It is my pleasure to be able to inform you…"
    Strategy 12: State the FTA (Face-Threatening Act) as a general rule. Example: "Regulations require that I ask you to leave."
    Strategy 13: Go on record as incurring a debt. Example: "I’d be eternally grateful if you would…"
`
export const SYSTEM_INSTR_POS = `You are a helpful writing agent who helps users complete their emails. Do not use placeholders in generation, in case of missing information, generate a seudo information to fill in the gap.
    You write in a way that is characteriszed as positve politeness. Positive politeness higlights friendliness and intimacy, and it has the following strategies:
    Strategy 1: Notice hearer's admirable qualities or possessions, show interest, exaggerate. Words that are commonly associated with positive politeness: ‘marvelous, fantastic, extraordinary, wonderful, delightful, ravishing, divine, incredible, appalling, ghastly, devastating, outrageous, despicable, revolting, ridiculous, incredible, absolutely, completely’. Example: 'Hey love your new Palm-pilot, can I borrow it sometime?' ‘How absolutely marvelous/extraordinary/devastating/incredible!’
    Strategy 2: Employ phonological slurring to convey in-group membership. Example: 'Heya, gimme a hand with this willya?'
    Strategy 3: Use colloquialisms or slang to convey in-group membership. Example: 'Most are damn hard, but this one should be a piece-of-cake.'
    Strategy 4: Use ellipsis (omission) to communicate tacit understandings. Example: '(Do you) mind if I join you?'
    Strategy 5: Use first name or in-group name (mate, buddy, pal, honey, dear, brother, sister, etc.) to insinuate familiarity. Example: 'Hey Bud, have you gotta minute?' ’Hey Johnny, how’s it going?’
    Strategy 6: Claim common view: assert knowledge of hearer's wants or that hearer has knowledge of speaker's wants. Example: 'You know how the janitors don't like it when...'
    Strategy 7: Seek agreement; raise or presuppose common ground/ common values (use so, then, to refer to a fake prior agreement, pressuring the addressee to accept the request). Example : ‘I’ll be seeing you then.’ ‘So when are you coming to see us?’
    Strategy 8: Hedging opinions: use hedging to be vague about disagreeing opinions. Examples: ‘It’s really beautiful, in a way.’ ‘I don’t know, like I think people have a right to their own opinions.’
    Strategy 9: Engage in small talk/ joke. Example: 'How bout that game last night? Did the Ravens whip the pants off the Giants or what!' ‘
    Strategy 10: Give or ask for reasons: assert reflexivity by making activity seem reasonable to the hearer. Example: 'I'm really late for an important appointment, so ...' ‘Why not lend me your cottage for the weekend?’
    Strategy 11: Use inclusive forms ('we' or 'lets') to include both speaker and hearer in the activity, or use ‘you know’. Example: 'We're not feeling well, are we?' ‘I really had a hard time learning to drive, you know.’ ‘Let’s get on with dinner’
    Strategy 12: Use presuppose manipulation, by presupposing wants, attitudes, values, familiarity in relationship, and knowledge. Example: ‘Wouldn’t you want a drink?’ ‘Look, you’re a pal of mine, so how about…’
    Strategy 13: Assert reciprocal exchange or tit for tat. Example: 'Do me this favor, and I'll make it up to you.'
    Strategy 14: Be optimistic and presume cooperation. Example: ‘Look, I'm sure you won’t mind if I borrow your typewriter.’ ‘I just dropped by for a minute to invite you  for a tea tomorrow - you will come, won’t you?’
    Strategy 15: Give something desired - gifts, sympathy, understanding. Example: 'You look like you've had a rough week.'
`
export const INSTR_GENERIC = 'You are a helpful assistant that helps users complete their sentence.' 
export const INSTR_POS = 'You are a helpful assistant that use positive polite strategies to help users complete their emails.'
export const INSTR_NEG = 'You are a helpful assistant that use negative polite strategies to help users complete their emails.'
export const INSTR_BEG = 'The user input is incomplete, and your job is to continue from where they left off, providing a concise completion. Do not generate from the beginning of the email, and only start from where the email is incomplete. '
export const SCE_1 = 'You’re enrolled in a course and have interacted with the course TA (teaching assistant) during office hours. You write an email to ask if the TA could clarify a specific concept from a recent class discussion or recommend some additional study materials related to the topic.'
export const SCE_2 = 'You are working on a project with a colleague, and you’re at a stage where you need their part of the work to be completed in order to proceed with your own tasks. You write an email about their progress and find out if they can finish their part within the week to keep the project on schedule.'
export const SCE_3 = 'You’re working on a group project for a university course and have had a few discussions with your project advisor. You write an email to ask if the advisor could provide feedback on your current project outline or suggest any resources that might help improve your presentation.'
export const INSTR_END = 'Please complete the email in a way that non-redundant.'
export const PRE_STUDY_INSTR = 'Each of the following scenario describes a situation where you will be writing an email to someone to make a request. Imagine you are in that scenario (you may want to recall your experience if you have encountered a similar sitatuon before), give ratings on how you would perceive the email receiver.'
export const PRINTABLE_KEYS = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?")

export type SCENARIOS_TYPE = {
    id: number;
    text: string;
}

export const PRE_STUDY_SCENARIOS = [
    { id:1, text:"You’re working on a project that involves coordinating with other teams. You ask a colleague from a different department, whom you’ve worked with occasionally and whose role includes handling interdepartmental communications, if they could help review and ensure that all necessary information is properly prepared before you finalize your report for submission to your supervisor."},
    { id:2, text:"You need to request a meeting with a team member in your department to discuss potential collaboration on a project. You’ve interacted a few times but haven’t worked closely together." },
    { id:3, text:"You’re enrolled in a course and have interacted with the course TA during office hours. You write an email to ask if the TA could clarify a specific concept from a recent class discussion or recommend some additional study materials related to the topic." },
    { id:4, text:"You are starting a research project and you recall a senior researcher in your department, with whom you’ve had several conversations during department events, whose expertise closely aligns with your topic. You believe they might be interested in collaborating but are uncertain about their availability." },
    { id:5, text:"You are working on a project with a colleague, and you’re at a stage where you need their part of the work to be completed in order to proceed with your own tasks. You write an email about their progress and find out if they can finish their part within the week to keep the project on schedule." },
    { id:6, text:"You’re working on a group project for a university course and have had a few discussions with your project advisor. You write an email to ask if the advisor could provide feedback on your current project outline or suggest any resources that might help improve your presentation." },
    { id:7, text:"You ask your professor, Alex Morgan, who taught a large lecture class you attended a few years ago but with whom you had little direct interaction, to introduce you to someone who may be hiring in your chosen career path."},
    { id:8, text:"You are organizing a major event and need a high-profile sponsor to secure the necessary funding. You decide to reach out to Alex Morgan, a CEO of a leading company, whom you met briefly at a fundraising event, to request sponsorship."},
    { id:9, text:"You are going to a conference next week, and you know one of your colleagues, Alex Morgan, are going to the same conference and they also don’t have a car.. You write an email to ask if it’s possible to share a ride to the venue."},
    { id:10, text:"You’ve recently taken up a new hobby, hiking, and you know that your colleague, Alex Morgan enjoy s similar activities. You’re writing an email to ask if he/she’d like to join you for a hike this weekend."},
]

export const LIKERT_QUESTIONS = [
    { id: 1, text: "1. How socially distant do you feel with the receiver of the email? Social distance refers to how close or familiar two people feel with each other. It's often based on how often they interact and what they exchange, like help, favours, or emotional support." },
    { id: 2, text: "2. How do you perceive the power dynamic between you and the receiver? Power dynamic refers to how much one person can control or influence another. This can involve control over resources (like money or authority) or the ability to shape others' beliefs and actions." },
    { id: 3, text: "3. How demanding you think your request is to the receiver? The level that a task is demanding can be determined based on two factors: 1) the services requested (like time or effort) and 2) the goods requested (including non-material goods like information or expressions of respect)." }
]

export type WRITING_SCENARIO_TYPE = {
    id: number,
    text: string,
    info: string
} 

export const WRITING_SCENARIOS = [
    { id:1, 
        text: SCE_1,
        info: `Course Name: Data Visualization Techiniques
                TA Name: Alex Morgan
                Specific Concept: The difference between bar charts and line graphs for showing trends
    `},
    { id:2, 
        text: SCE_2,
        info: `Project Name: Market Analysis Report for Q4
                Colleague’s Name: Jamie Lee
                Specific Task: Compiling and analyzing customer feedback data
                Your Task: Creating the presentation slides based on the analysis
    `},
    { id:3, 
        text: SCE_3,
        info: `Course Name: Strategic Marketing Management
                Project Advisor’s Name: Dr. Taylor Morgan
                Project Topic: Developing a marketing strategy for a new eco-friendly product launch
                Specific Request: Feedback on the project outline and suggestions for resources to improve the presentation on market segmentation
    `}
]

export const WRITING_INFO_INSTR = "Here is some additional information you can use as a reference. Feel free to use your own information and examples that align more closely with your past experiences."

export const WRITING_TASK_INSTR = `The following scenario describes a situation where you will be writing an email to someone to make a request. Imagine you are in that scenario (you may want to recall your experience if you have encountered a similar situation before) and write an email in the text box below, and feel free to fill in the details with your own situation or preferences. 

You can use the AI tool we provide to help you write the email. Feel free to incorporate as many suggestions from the AI tool as you see appropriate.
Please try your best to write socially appropriate message so that the email request you wrote is most likely to get accepted by the receiver.`

export const POST_STUDY_QUESTIONS = [
    "1. I think that the email I wrote with the AI tool represents me authentically.",
    "2. I think the AI writing assistant sounded like I would write myself.",
    "3. I am confident that the message will be perceived positively by the receiver.",
    "4. I think AI suggestions are helpful.",
    "5. I think AI suggestions are appropriate to the social situation."
]