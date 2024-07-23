import { formatNumber, formatTimespan } from "./formatting"

describe("formatting", () => {
  it.each([
    [0, "0"],
    [1, "1"],
    [1.1, "1.1"],
    [1.11, "1.11"],
    [1.111, "1.11"],
    [1.115, "1.11"], // based js
    [1.1151, "1.12"],
    [999, "999"],
    [1000, "1,000"],
    [10000, "10,000"],
    [100000, "100,000"],
    [1000000, "1,000,000"],
  ])("formatNumber", (input: number, expected: string) => {
    expect(formatNumber(input)).toEqual(expected)
  })
  it.each([
    [5, "5s"],
    [65, "1m 5s"],
    [3665, "1h 1m 5s"],
    [90065, "1d 1h 1m"],
    [31626065, "1y 1d 1h"],
    [3185226065, "1c 1y 1d"],
  ])("formatTimespan", (input: number, expected: string) => {
    expect(formatTimespan(input, 3)).toEqual(expected)
  })
})
