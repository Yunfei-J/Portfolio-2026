import { initStackedSheets, type StackedSheetsSettings } from "./stacked-sheets";

/** Homepage card stack. Case studies use `case-study-sheets.ts`. */
export const HOME_SHEETS: StackedSheetsSettings = {
  selector: "[data-home-sheet]",
  topVar: "--home-sheet-top",
  opacityVar: "--home-sheet-opacity",
  fadeTo: 0.01,
  fadeCurve: "smooth",
  topOffset: 0,
  holdDistance: "20vh",
  minHoldTime: 100,
  minWidth: 0,
};

export function initHomeSheets() {
  initStackedSheets(HOME_SHEETS);
}
