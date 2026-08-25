/* =============================================================================
 * SAFE SQUAD — OFFICIAL QUESTIONNAIRE (central question database)
 * =============================================================================
 * ⭐ THIS IS THE ONLY FILE THAT HOLDS EDUCATIONAL CONTENT. ⭐
 *
 * 7 categories × 5 questions = 35 official YES/NO questions.
 * Every question carries its official explanation, and every category carries
 * its official completion message.
 *
 * HOW THE GAMES USE IT
 *   Every round of every mini-game picks ONE random category and plays its five
 *   questions in a random order (see src/core/quiz.ts → QuizSession).
 *   The completion screen then shows that category's completion message, so the
 *   guidance always matches the questions that were actually played.
 *
 * EDITING RULES
 *   · keep every `id` unique
 *   · `correct` is 'YES' or 'NO'
 *   · keep 5 questions per category (that is one full round)
 * ---------------------------------------------------------------------------*/

/** Questions played in one round of every game (= one category). */
export const QUESTIONS_PER_ROUND = 5;

export interface YesNoQuestion {
  /** Unique id, e.g. 'c1-q3'. */
  id: string;
  /** Category id this question belongs to. */
  categoryId: string;
  /** Short topic label shown as a chip above the question. */
  topic: string;
  /** The statement shown to the student. */
  question: string;
  /** Official answer. */
  correct: 'YES' | 'NO';
  /** Official explanation, shown after answering. */
  explanation: string;
}

/**
 * Multiple-choice shape kept for the shared question overlay. The official
 * questionnaire is entirely YES/NO, so no data of this type currently exists.
 */
export interface ChoiceQuestion {
  id: string;
  categoryId: string;
  topic: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  explanation: string;
}

export type AnyQuestion = YesNoQuestion | ChoiceQuestion;

export interface Category {
  id: string;
  /** Full official category name. */
  name: string;
  /** Short label used on HUD chips. */
  shortName: string;
  questions: YesNoQuestion[];
  /** Official end-of-game guidance for this category. */
  completionMessage: string;
}

/* =============================================================================
 * CATEGORY 1 — PHYSICAL ABUSE · CORPORAL PUNISHMENT
 * ===========================================================================*/
const category1: Category = {
  id: 'c1',
  name: 'Physical Abuse — Corporal Punishment',
  shortName: 'Corporal punishment',
  completionMessage:
    'If you have experienced or witnessed someone being physically hurt or punished, do not stay silent. Speak up and seek help from a trusted teacher, school personnel, parent, or adult.',
  questions: [
    {
      id: 'c1-q1',
      categoryId: 'c1',
      topic: 'Corporal punishment',
      question:
        'Physical force used against a student, even without causing serious injury, can be considered violence.',
      correct: 'YES',
      explanation:
        'Physical force can be considered violence even without serious injury because violence is not limited to acts that leave visible or severe injuries. The intentional use of physical force that causes or may cause harm can already be considered violent.',
    },
    {
      id: 'c1-q2',
      categoryId: 'c1',
      topic: 'Corporal punishment',
      question:
        'Pushing, kicking, or punching a classmate is only considered physical violence when it causes visible injury.',
      correct: 'NO',
      explanation:
        'Visible injury is not required for physical violence to occur. Pushing, kicking, or punching involves physical force and can be violent even when the person does not have visible marks or injuries.',
    },
    {
      id: 'c1-q3',
      categoryId: 'c1',
      topic: 'Corporal punishment',
      question: 'Using physical force to threaten or intimidate another student may constitute abuse.',
      correct: 'YES',
      explanation:
        'Using physical force to threaten or intimidate can make a student feel afraid or unsafe. Because it involves the use or threat of force, it may be considered violent or abusive behavior.',
    },
    {
      id: 'c1-q4',
      categoryId: 'c1',
      topic: 'Corporal punishment',
      question:
        'A physical attack between students is not considered violence when it happens outside the classroom.',
      correct: 'NO',
      explanation:
        'The location does not determine whether an act is violence. A physical attack can still be considered violent whether it happens inside the classroom, outside the classroom, or elsewhere in the school.',
    },
    {
      id: 'c1-q5',
      categoryId: 'c1',
      topic: 'Corporal punishment',
      question:
        'Causing physical harm to a student through intentional force may be considered an act of violence in school.',
      correct: 'YES',
      explanation:
        'Intentionally using physical force that causes physical harm is an act of physical violence. When directed toward a student, it may also constitute physical abuse depending on the circumstances.',
    },
  ],
};

/* =============================================================================
 * CATEGORY 2 — PHYSICAL ABUSE · BULLYING OR PEER ABUSE
 * ===========================================================================*/
const category2: Category = {
  id: 'c2',
  name: 'Physical Abuse — Bullying or Peer Abuse',
  shortName: 'Physical bullying',
  completionMessage:
    "If you see someone being physically bullied or harmed by a peer, don't ignore it. Report the incident to a teacher, school personnel, or another trusted adult, and offer support to the person affected. Speaking up can help stop the harm and keep others safe.",
  questions: [
    {
      id: 'c2-q1',
      categoryId: 'c2',
      topic: 'Physical bullying',
      question: 'Punching a classmate is not considered a form of physical bullying.',
      correct: 'NO',
      explanation:
        'Punching a classmate is intentional physical aggression. When used to hurt, intimidate, or repeatedly target another student, it can be considered physical bullying.',
    },
    {
      id: 'c2-q2',
      categoryId: 'c2',
      topic: 'Physical bullying',
      question: 'Pushing someone with the intention to hurt them is a form of physical abuse.',
      correct: 'YES',
      explanation:
        'Pushing someone with the intention of hurting them is deliberate physical aggression. It can therefore be considered physical bullying and, depending on the circumstances, may constitute physical abuse.',
    },
    {
      id: 'c2-q3',
      categoryId: 'c2',
      topic: 'Physical bullying',
      question: 'Kicking or hitting a peer is only considered bullying when it causes visible injury.',
      correct: 'NO',
      explanation:
        'Physical bullying does not require visible injuries. Hitting or kicking can still cause pain, fear, or harm even when there are no bruises, wounds, or other visible marks.',
    },
    {
      id: 'c2-q4',
      categoryId: 'c2',
      topic: 'Physical bullying',
      question: 'Physically threatening someone can create fear and emotional harm.',
      correct: 'YES',
      explanation:
        "A physical threat can make a student feel afraid or unsafe. This fear and insecurity can negatively affect the student's emotional well-being even if the threatened physical act does not actually occur.",
    },
    {
      id: 'c2-q5',
      categoryId: 'c2',
      topic: 'Physical bullying',
      question: 'Repeated physical attacks among peers are not considered a form of peer abuse.',
      correct: 'NO',
      explanation:
        'Repeated physical attacks are harmful physical behaviors directed toward another student. When they involve bullying behavior, they can constitute physical bullying or peer abuse.',
    },
  ],
};

/* =============================================================================
 * CATEGORY 3 — PSYCHOLOGICAL ABUSE · CHILD ABUSE
 * ===========================================================================*/
const category3: Category = {
  id: 'c3',
  name: 'Psychological Abuse — Child Abuse',
  shortName: 'Child abuse',
  completionMessage:
    'If hurtful words, threats, humiliation, rumors, or exclusion are causing emotional distress, remember that you do not have to face it alone. Talk to a trusted teacher, school personnel, parent, or another trusted adult, and support others who may be experiencing the same.',
  questions: [
    {
      id: 'c3-q1',
      categoryId: 'c3',
      topic: 'Child abuse',
      question:
        'Repeatedly insulting or humiliating a child is not considered a form of psychological abuse.',
      correct: 'NO',
      explanation:
        "Repeated insults and humiliation can make a child feel ashamed, unwanted, or worthless. Over time, this can damage the child's self-esteem and emotional well-being.",
    },
    {
      id: 'c3-q2',
      categoryId: 'c3',
      topic: 'Child abuse',
      question: 'Threatening a child to create fear may be considered emotional or psychological abuse.',
      correct: 'YES',
      explanation:
        'Threatening a child to deliberately create fear can cause emotional distress and make the child feel unsafe. Repeated or serious threats may constitute psychological or emotional abuse.',
    },
    {
      id: 'c3-q3',
      categoryId: 'c3',
      topic: 'Child abuse',
      question: 'Constantly criticizing or degrading a child does not affect their emotional well-being.',
      correct: 'NO',
      explanation:
        'Constant criticism or degrading treatment can make a child lose confidence and develop a negative view of themselves. It can therefore negatively affect their emotional and psychological well-being.',
    },
    {
      id: 'c3-q4',
      categoryId: 'c3',
      topic: 'Child abuse',
      question: "Ignoring a child's emotional needs may be considered a form of psychological abuse.",
      correct: 'YES',
      explanation:
        "A child's emotional needs are important to their development. Consistently ignoring those needs can cause emotional harm and, depending on the circumstances, may constitute emotional neglect.",
    },
    {
      id: 'c3-q5',
      categoryId: 'c3',
      topic: 'Child abuse',
      question: 'Making a child feel worthless or unwanted can cause psychological harm.',
      correct: 'YES',
      explanation:
        'Making a child feel worthless or unwanted can seriously affect their self-esteem and sense of self-worth. Such treatment can cause psychological and emotional harm.',
    },
  ],
};

/* =============================================================================
 * CATEGORY 4 — PSYCHOLOGICAL ABUSE · DISCRIMINATION AGAINST CHILDREN
 * ===========================================================================*/
const category4: Category = {
  id: 'c4',
  name: 'Psychological Abuse — Discrimination Against Children',
  shortName: 'Discrimination',
  completionMessage:
    'If you are ignored, mocked, excluded, or made to feel less important because of who you are or where you come from, this hurts deeply. You are just as valuable as anyone else. Share this with a teacher or parent, they will stand with you and make sure you are treated fairly.',
  questions: [
    {
      id: 'c4-q1',
      categoryId: 'c4',
      topic: 'Discrimination',
      question:
        'Excluding a child from activities because of their disability, background, or status is not considered discrimination.',
      correct: 'NO',
      explanation:
        "Excluding a child specifically because of their disability, background, or status can be unfair treatment based on a personal characteristic. When the exclusion is discriminatory, it can violate the child's right to equal treatment.",
    },
    {
      id: 'c4-q2',
      categoryId: 'c4',
      topic: 'Discrimination',
      question: 'Insulting someone because of their differences can cause psychological harm.',
      correct: 'YES',
      explanation:
        "Insulting someone because of their differences can cause embarrassment, humiliation, and emotional distress. Repeated or severe treatment can negatively affect the person's psychological well-being.",
    },
    {
      id: 'c4-q3',
      categoryId: 'c4',
      topic: 'Discrimination',
      question: 'Treating a child unfairly because of their identity does not violate their rights.',
      correct: 'NO',
      explanation:
        'Children have the right to be treated fairly and respectfully. Treating a child unfairly because of their identity can result in unequal treatment and may violate their rights.',
    },
    {
      id: 'c4-q4',
      categoryId: 'c4',
      topic: 'Discrimination',
      question: 'Denying equal opportunities to a child is not considered a form of discrimination.',
      correct: 'NO',
      explanation:
        "Equal opportunities should not be denied unfairly because of a child's characteristics. When opportunities are withheld for discriminatory reasons, this can constitute discrimination.",
    },
    {
      id: 'c4-q5',
      categoryId: 'c4',
      topic: 'Discrimination',
      question:
        'Making a child feel inferior because of their differences can affect their emotional well-being.',
      correct: 'YES',
      explanation:
        'Making a child feel inferior because of their differences can damage their confidence and self-esteem. It can also cause emotional distress and negatively affect their well-being.',
    },
  ],
};

/* =============================================================================
 * CATEGORY 5 — PSYCHOLOGICAL ABUSE · CHILD EXPLOITATION
 * ===========================================================================*/
const category5: Category = {
  id: 'c5',
  name: 'Psychological Abuse — Child Exploitation',
  shortName: 'Child exploitation',
  completionMessage:
    'If you are pressured, forced, or manipulated into doing things that make you feel scared, ashamed, or unworthy, or made to feel you only matter when you serve others, this harms you deeply. You are not here to be used. Tell a teacher, guidance counselor, or your parents.',
  questions: [
    {
      id: 'c5-q1',
      categoryId: 'c5',
      topic: 'Exploitation',
      question:
        'Threatening or manipulating a child to gain something from them is not considered exploitation.',
      correct: 'NO',
      explanation:
        "Threatening or manipulating a child to obtain something takes advantage of the child's vulnerability. This type of behavior may constitute exploitation, particularly when the child is pressured for another person's benefit.",
    },
    {
      id: 'c5-q2',
      categoryId: 'c5',
      topic: 'Exploitation',
      question: 'Using fear or pressure to control a child may cause psychological harm.',
      correct: 'YES',
      explanation:
        'Fear and pressure can be used to control a child against their wishes. This can cause emotional distress, fear, and psychological harm.',
    },
    {
      id: 'c5-q3',
      categoryId: 'c5',
      topic: 'Exploitation',
      question: 'Deceiving a child for personal benefit is not considered a form of exploitation.',
      correct: 'NO',
      explanation:
        "Deceiving a child for personal benefit involves gaining an advantage by taking advantage of the child's trust or vulnerability. This may constitute exploitation depending on the situation.",
    },
    {
      id: 'c5-q4',
      categoryId: 'c5',
      topic: 'Exploitation',
      question: 'Forcing children into harmful situations does not affect their emotional well-being.',
      correct: 'NO',
      explanation:
        'Forcing children into harmful situations can expose them to fear, distress, and psychological harm. Children have the right to protection from harmful and exploitative situations.',
    },
    {
      id: 'c5-q5',
      categoryId: 'c5',
      topic: 'Exploitation',
      question: "Taking advantage of a child's vulnerability is a violation of child protection rights.",
      correct: 'YES',
      explanation:
        "Exploitation involves taking unfair advantage of another person's vulnerability for someone's benefit. Children are entitled to protection from exploitation and other forms of abuse.",
    },
  ],
};

/* =============================================================================
 * CATEGORY 6 — PSYCHOLOGICAL ABUSE · VIOLENCE AGAINST CHILDREN
 * ===========================================================================*/
const category6: Category = {
  id: 'c6',
  name: 'Psychological Abuse — Violence Against Children',
  shortName: 'Psychological violence',
  completionMessage:
    'If you get called names, threatened, humiliated, gossiped about, or left out at school, this hurts your heart and mind deeply. It is wrong and not your fault. Tell a trusted teacher, guidance counselor, or parent. You deserve to feel safe and valued.',
  questions: [
    {
      id: 'c6-q1',
      categoryId: 'c6',
      topic: 'Psychological violence',
      question:
        'Repeatedly insulting or humiliating a student is not considered a form of psychological violence.',
      correct: 'NO',
      explanation:
        "Repeated insults and humiliation can cause emotional pain and damage a child's self-esteem. Because of this, they can be forms of psychological or emotional violence.",
    },
    {
      id: 'c6-q2',
      categoryId: 'c6',
      topic: 'Psychological violence',
      question: 'Threatening a student to create fear may be considered emotional abuse.',
      correct: 'YES',
      explanation:
        'Threatening a student to create fear can cause emotional distress and make the student feel unsafe. Depending on the circumstances, this may constitute psychological or emotional abuse.',
    },
    {
      id: 'c6-q3',
      categoryId: 'c6',
      topic: 'Psychological violence',
      question: "Harassment and intimidation do not cause harm to a student's mental well-being.",
      correct: 'NO',
      explanation:
        "Harassment and intimidation can cause a student to experience fear, stress, or emotional distress. Therefore, they can negatively affect the student's mental and emotional well-being.",
    },
    {
      id: 'c6-q4',
      categoryId: 'c6',
      topic: 'Psychological violence',
      question:
        'Spreading harmful rumors to damage a student emotionally is not considered a form of abuse.',
      correct: 'NO',
      explanation:
        'Spreading harmful rumors with the purpose of embarrassing or hurting a student can damage their reputation and emotional well-being. It can therefore be a form of psychological or relational bullying.',
    },
    {
      id: 'c6-q5',
      categoryId: 'c6',
      topic: 'Psychological violence',
      question: 'Intentionally isolating or excluding a student can cause psychological harm.',
      correct: 'YES',
      explanation:
        'Intentionally isolating or excluding a student can make them feel rejected, lonely, or unwanted. This can cause emotional distress and negatively affect their psychological well-being.',
    },
  ],
};

/* =============================================================================
 * CATEGORY 7 — PSYCHOLOGICAL ABUSE · BULLYING OR PEER ABUSE
 * ===========================================================================*/
const category7: Category = {
  id: 'c7',
  name: 'Psychological Abuse — Bullying or Peer Abuse',
  shortName: 'Peer bullying',
  completionMessage:
    'If you receive constant yelling, put-downs, threats, rejection, or being made to feel worthless or afraid, this is emotional harm. You do not deserve this and it is never your fault. Speak up to someone you trust, your parents, or guidance counselor.',
  questions: [
    {
      id: 'c7-q1',
      categoryId: 'c7',
      topic: 'Peer bullying',
      question: 'Repeatedly calling someone hurtful names is not considered a form of bullying.',
      correct: 'NO',
      explanation:
        'Repeatedly calling someone hurtful names can humiliate them and damage their self-esteem. When done as bullying behavior, it can be a form of verbal or psychological bullying.',
    },
    {
      id: 'c7-q2',
      categoryId: 'c7',
      topic: 'Peer bullying',
      question: 'Spreading rumors to embarrass someone may be considered a form of psychological bullying.',
      correct: 'YES',
      explanation:
        'Spreading rumors to embarrass or harm someone can damage their relationships, reputation, and emotional well-being. This can be a form of relational or psychological bullying.',
    },
    {
      id: 'c7-q3',
      categoryId: 'c7',
      topic: 'Peer bullying',
      question: 'Threatening or intimidating classmates does not cause emotional harm.',
      correct: 'NO',
      explanation:
        'Threatening or intimidating classmates can create fear and make them feel unsafe. This can cause emotional distress even when no physical harm occurs.',
    },
    {
      id: 'c7-q4',
      categoryId: 'c7',
      topic: 'Peer bullying',
      question: 'Intentionally excluding someone from a group is not considered bullying.',
      correct: 'NO',
      explanation:
        'Intentionally excluding someone to hurt or isolate them can cause feelings of rejection and loneliness. When done as harmful peer behavior, it can be a form of relational bullying.',
    },
    {
      id: 'c7-q5',
      categoryId: 'c7',
      topic: 'Peer bullying',
      question: 'Humiliating a peer in person or online can cause psychological harm.',
      correct: 'YES',
      explanation:
        'Humiliating a peer in person or online can cause embarrassment, emotional distress, and psychological harm. When it meets the circumstances of bullying, it can be considered bullying.',
    },
  ],
};

/** The complete official questionnaire: 7 categories × 5 questions = 35. */
export const categories: Category[] = [
  category1,
  category2,
  category3,
  category4,
  category5,
  category6,
  category7,
];

/** Flat list of all 35 official questions. */
export const allQuestions: YesNoQuestion[] = categories.flatMap((c) => c.questions);

/** Picks one category at random (one category = one round). */
export function randomCategory(): Category {
  return categories[Math.floor(Math.random() * categories.length)];
}

export function categoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

/* =============================================================================
 * COACHING TEXT (not part of the questionnaire — never reveals an answer)
 * ===========================================================================*/
export const tipsByGame: Record<string, string[]> = {
  babyCry: [
    'Read the statement twice: does it describe something that protects a child, or something that harms them?',
    'Statements containing "only", "never" or "not considered" are often false.',
    'Harm can be real even when nobody can see a bruise.',
    'Need a little help? Tap How to Play for a reminder of the rules.',
  ],
  puzzle: [
    'Ask yourself whether the action would make a child feel safe, respected and protected.',
    'Watch out for statements that excuse harm because "there was no injury".',
    'Emotional harm counts as harm, even without physical contact.',
    'Need a little help? Tap How to Play to review how pieces are earned.',
  ],
  factFall: [
    'Slow down at the fork: is the statement always true, or only sometimes?',
    'Statements with words like "only", "never" or "always" are often myths.',
    'Remember: harm is still harm even when there is no visible mark.',
    'Need a little help? Tap How to Play before choosing your road.',
  ],
  hearts: [
    'Think about who is being protected by the statement — the child, or the person causing harm?',
    'Threats and intimidation can be abusive even when nobody is touched.',
    'If a statement excuses harmful behaviour, it is usually false.',
    'Need a little help? Tap How to Play to review the battle rules.',
  ],
  maze: [
    'Read the statement carefully before you answer — the maze never hints at the answer.',
    'Statements with "only", "never" or "not considered" are often false.',
    'Keep an eye on the enemies: take a longer route rather than a risky one.',
    'Need a little help? Tap How to Play for the controls.',
  ],
  princess: [
    'Question blocks pause the game — take your time before answering.',
    'Ask yourself whether the situation protects the child or silences them.',
    'Use checkpoints: they save your progress through the level.',
    'Need a little help? Tap How to Play for the jump controls.',
  ],
  bingo: [
    'The 5 hidden stars form a secret pattern — all boxes look identical while you play.',
    'A star only counts once you answer its question correctly.',
    'Empty boxes are part of the board — they cost you nothing but a tap.',
    'Need a little help? Tap How to Play to review the Bingo rules.',
  ],
};

/** Short lines shown after a wrong answer (never reveal the answer). */
export const encouragements: string[] = [
  'Not quite — but noticing the warning sign is the skill.',
  'Almost! Read the statement again, then keep going.',
  'That one is tricky. Learn it now, use it in real life.',
];
