/**
 * Convert smart contract ticker to package name.
 *
 * @param {string} ticker - smart contract ticker, e.g. $SUI
 * @returns {string} - package name, e.g. sui
 */
export function tickerToPackageName(ticker: string): string {
  return ticker.toLowerCase().trim().slice(1)
}

// eof
