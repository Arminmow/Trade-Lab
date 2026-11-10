export const tradeHistoryService = {
  /** For now it only logs the file. Reading and parsing will be added here. */
  load(file: File): void {
    console.log("Trade history file:", file);
  },
};