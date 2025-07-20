import type { DeliverableMark } from "~/lib/types";

/**
 * Rounds a given numeric value to the provided precision.
 */
function round(value: number, precision: number = 0) {
  var multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

export class GradeCalculator {
  fullWeight: number = 100.0;
  weightCompleted: number = 0.0;
  pointsEarned: number = 0.0;
  targetGrade: number = 0.0;

  constructor(target: number) {
    this.targetGrade = target;
  }

  addMark(mark: DeliverableMark): void {
    this.pointsEarned += mark.mark;
    this.weightCompleted += mark.weight;
  }

  addMarks(marks: DeliverableMark[]): void {
    marks.forEach(this.addMark);
  }

  isComplete(): boolean {
    return this.weightCompleted >= 100.0;
  }

  weightRemaining(): boolean {
    return !this.isComplete();
  }

  /**
   * Returns the deliverable goal of the corresponding course, rounded to 1 decimal.
   */
  get deliverableGoal(): number {
    if (this.isComplete()) {
      return 0;
    }
    const pointsRemaining = this.targetGrade - this.pointsEarned;
    const weightRemaining = this.fullWeight - this.weightCompleted;
    // See comments on the grade() function
    return round(pointsRemaining / weightRemaining, 1);
  }

  /**
   * Returns the current grade of the corresponding course, rounded to 1 decimal.
   */
  get grade(): number {
    // This gives a percentage because ordinarily, you would divide each grade
    // by 100 to get the weighted point contribution, and then re-multiply at
    // the end to get a proper percentage.
    //
    // We can just skip that procedure entirely this way, plus it's fewer computations.
    return round(this.pointsEarned / this.weightCompleted, 1);
  }
}
