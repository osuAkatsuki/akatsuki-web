import { GameMode } from "./gameModes"

export enum SubmissionStatus {
  Failed = 0,
  Submitted = 1,
  Best = 2,
}

export const getGradeColor = (grade: string) => {
  switch (grade) {
    case "XH":
      return "silver"
    case "X":
      return "gold"
    case "SH":
      return "silver"
    case "S":
      return "gold"
    case "A":
      return "green"
    case "B":
      return "blue"
    case "C":
      return "purple"
    case "D":
    case "F":
      return "red"
    default:
      return "black"
  }
}

export const remapSSForDisplay = (
  grade: "XH" | "X" | "SH" | "S" | "A" | "B" | "C" | "D" | "F"
): "SS" | "S" | "A" | "B" | "C" | "D" | "F" => {
  switch (grade) {
    case "XH":
    case "X":
      return "SS"
    case "SH":
    case "S":
      return "S"
    default:
      return grade
  }
}

export const calculateGrade = (
  gameMode: GameMode,
  mods: number, // TODO: enum
  acc: number,
  num_300s: number,
  num_100s: number,
  num_50s: number,
  num_misses: number
) => {
  const objectCount = num_300s + num_100s + num_50s + num_misses

  // Hidden | Flashlight | FadeIn
  const shouldUseSilverGrades = (mods & 1049608) > 0 // TODO: enum

  switch (gameMode) {
    case GameMode.Standard:
    case GameMode.Taiko:
      var ratio300 = num_300s / objectCount
      var ratio50 = num_50s / objectCount

      if (ratio300 === 1) {
        return shouldUseSilverGrades ? "XH" : "X"
      }

      if (ratio300 > 0.9 && ratio50 <= 0.01 && num_misses === 0) {
        return shouldUseSilverGrades ? "SH" : "S"
      }
      if ((ratio300 > 0.8 && num_misses === 0) || ratio300 > 0.9) {
        return "A"
      }
      if ((ratio300 > 0.7 && num_misses === 0) || ratio300 > 0.8) {
        return "B"
      }
      if (ratio300 > 0.6) {
        return "C"
      }
      return "D"

    case GameMode.Catch:
      if (acc === 100) {
        return shouldUseSilverGrades ? "XH" : "X"
      }
      if (acc > 98) {
        return shouldUseSilverGrades ? "SH" : "S"
      }
      if (acc > 94) {
        return "A"
      }
      if (acc > 90) {
        return "B"
      }
      if (acc > 85) {
        return "C"
      }
      return "D"

    case GameMode.Mania:
      if (acc === 100) {
        return shouldUseSilverGrades ? "XH" : "X"
      }
      if (acc > 95) {
        return shouldUseSilverGrades ? "SH" : "S"
      }
      if (acc > 90) {
        return "A"
      }
      if (acc > 80) {
        return "B"
      }
      if (acc > 70) {
        return "C"
      }
      return "D"
  }
}
