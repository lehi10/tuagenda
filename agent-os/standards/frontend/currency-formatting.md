# Currency Formatting

Always use `currency-utils.ts` to format prices. Never hardcode currency symbols or use `.toFixed()` directly.

```ts
import { formatCurrency, getCurrencySymbol, isCurrencySymbolSuffix } from "@/client/lib/currency-utils";

formatCurrency(25.5, "PEN")  // "S/ 25.50"
formatCurrency(25.5, "EUR")  // "25,50 €"
formatCurrency(25.5, "USD")  // "$25.50"
formatCurrency(1000, "CLP", { showDecimals: false }) // "$1.000"

getCurrencySymbol("PEN")        // "S/"
isCurrencySymbolSuffix("EUR")   // true  → symbol goes after the number
isCurrencySymbolSuffix("USD")   // false → symbol goes before
```

## Rules

- Currency code comes from `business.currency` (ISO 4217, stored in DB as `VARCHAR(3)`)
- Never pass a raw symbol string — always pass the ISO code
- `formatPrice(amount, currencyCode)` in `booking-utils.ts` delegates to `formatCurrency` — use it in booking flow
- Symbol position (prefix vs suffix) is resolved automatically by `Intl.NumberFormat` via `CURRENCY_LOCALE_MAP`

## Adding a new currency

Add the ISO code → locale mapping in `CURRENCY_LOCALE_MAP` inside `currency-utils.ts`:

```ts
const CURRENCY_LOCALE_MAP: Record<string, string> = {
  // ...
  COP: "es-CO",  // $ (peso colombiano)
};
```

Without a mapping, `Intl` falls back to browser locale and may display the full code (e.g. `"PEN 25.00"`) instead of the symbol.
