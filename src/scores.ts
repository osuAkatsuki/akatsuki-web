export enum SubmissionStatus {
  Failed = 0,
  Submitted = 1,
  Best = 2,
}

export const getGradeColor = (grade: string) => {
  switch (grade) {
    case "XH":
      return "silver";
    case "X":
      return "gold";
    case "SH":
      return "silver";
    case "S":
      return "gold";
    case "A":
      return "green";
    case "B":
      return "blue";
    case "C":
      return "purple";
    case "D":
    case "F":
      return "red";
    default:
      return "black";
  }
};
