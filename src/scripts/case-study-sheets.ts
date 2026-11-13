import { initStackedSheets, type StackedSheetsSettings } from "./stacked-sheets";

/** Case-study section stack. Homepage uses `home-sheets.ts`. */
export const CASE_STUDY_SHEETS: StackedSheetsSettings = {
  selector: "[data-case-sheet]",
  topVar: "--case-sheet-top",
  opacityVar: "--case-sheet-opacity",
  fadeTo: 0.01,
  fadeCurve: "smooth",
  topOffset: 0,
  holdDistance: "0px",
  minHoldTime: 0,
  minWidth: 0,
};

export function initCaseStudySheets() {
  initStackedSheets(CASE_STUDY_SHEETS);
}
