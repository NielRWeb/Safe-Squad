/**
 * Question engine — one round = one random category of the official
 * questionnaire (5 YES/NO questions), shuffled, with scoring and progress.
 * Shared by all seven games so the rules stay identical everywhere.
 */
import {
  QUESTIONS_PER_ROUND,
  categoryById,
  randomCategory,
  type AnyQuestion,
  type Category,
  type ChoiceQuestion,
  type YesNoQuestion,
} from '../data/questions';

/** Fisher–Yates shuffle (returns a new array, never mutates the source). */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pickRandom<T>(items: readonly T[], fallback: T): T {
  if (!items.length) return fallback;
  return items[Math.floor(Math.random() * items.length)];
}

/** Answer options of a choice question in random order. */
export function shuffledAnswers(q: ChoiceQuestion): string[] {
  return shuffle(q.answers);
}

export interface RoundResult {
  correct: number;
  wrong: number;
  total: number;
  percent: number;
}

/**
 * One round of the questionnaire.
 *
 * A round always plays ONE category so the official completion message that is
 * shown at the end matches the questions the student actually answered.
 */
export class QuizSession {
  readonly category: Category;
  readonly questions: YesNoQuestion[];
  index = 0;
  correct = 0;
  wrong = 0;
  wrongStreak = 0;
  private answeredCurrent = false;

  constructor(categoryId?: string) {
    const category = (categoryId && categoryById(categoryId)) || randomCategory();
    this.category = category;
    this.questions = shuffle(category.questions).slice(0, QUESTIONS_PER_ROUND);
    if (!this.questions.length) {
      throw new Error('No questions available — check src/data/questions.ts');
    }
  }

  get total(): number {
    return this.questions.length;
  }
  get current(): YesNoQuestion {
    return this.questions[Math.min(this.index, this.questions.length - 1)];
  }
  get humanIndex(): number {
    return Math.min(this.index + 1, this.total);
  }
  get isFinished(): boolean {
    return this.index >= this.total;
  }
  get progressRatio(): number {
    return this.total ? this.index / this.total : 0;
  }
  /** Official guidance for the category that was played. */
  get completionMessage(): string {
    return this.category.completionMessage;
  }

  /** Records an answer for the current question (only counted once). */
  score(isCorrect: boolean): void {
    if (this.answeredCurrent) return;
    this.answeredCurrent = true;
    if (isCorrect) {
      this.correct++;
      this.wrongStreak = 0;
    } else {
      this.wrong++;
      this.wrongStreak++;
    }
  }

  /** Moves to the next question. Returns false when the round is over. */
  next(): boolean {
    this.index++;
    this.answeredCurrent = false;
    return !this.isFinished;
  }

  /** Allows the current question to be answered again (retry flows). */
  allowRetry(): void {
    this.answeredCurrent = false;
  }

  result(): RoundResult {
    const total = this.total;
    return {
      correct: this.correct,
      wrong: this.wrong,
      total,
      percent: total ? Math.round((this.correct / total) * 100) : 0,
    };
  }
}

/** Checks a YES/NO answer. */
export function checkYesNo(q: YesNoQuestion, answer: 'YES' | 'NO'): boolean {
  return q.correct === answer;
}

/** Checks a multiple-choice answer (kept for the shared overlay). */
export function checkChoice(q: ChoiceQuestion, answer: string): boolean {
  return q.correctAnswer === answer;
}

/** Type guard used by the shared question overlay. */
export function isChoiceQuestion(q: AnyQuestion): q is ChoiceQuestion {
  return 'answers' in q;
}
