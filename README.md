# FinTrack — Sovereign Ledger 🚀
### 100% Offline-First Income & Expense Manager for Freelancers & Small Businesses

FinTrack (Sovereign Ledger) is an **air-gapped, privacy-first personal and commercial finance management application**. Built with React Native & Expo, it guarantees **zero cloud sync, zero telemetry, and 100% on-device data sovereignty** with hardware-bound AES-256 local vault encryption.

---

## 🔒 Zero Dummy Data Guarantee

This application runs **strictly on real user data**:
- **Clean Slate:** Starts with an empty ledger ready for your actual finances.
- **Dynamic Derived Calculations:** Balance, month ingress, spend, net savings, budget utilization %, safe velocity, and tax estimates are computed on-the-fly directly from actual saved records.
- **Default Category Taxonomy:** Pre-configured with standard Indian business & personal tags (*Fuel & Travel*, *Food & Dining*, *Rent & Office*, *Utilities*, *Marketing*, *Groceries*, *Software*, *Client Retainer*, *Freelance Dev*, *Consulting*), with full support to add custom tags or reorder.

---

## 📱 Modules & Features

1. **Dashboard (`Home`)**:
   - Live Net Balance with eye toggle to conceal amounts for public privacy.
   - Dual-scope switcher: **All** vs **Personal** vs **Business**.
   - Monthly Inflow (+), Outflow (−), and Net Savings breakdown.
   - Monthly Budget flexible ceiling card with % utilized warning.
   - Quick action triggers: *Income*, *Expense*, *Reports*, *Scan SMS*.

2. **Transactions Ledger (`Ledger`)**:
   - Fast full-text search across descriptions, notes, and invoice references.
   - Filter chips: *All*, *Income (+)*, *Expenses (−)*, *Personal*, *Business*.
   - Offline SMS Auto-Detection banner for instant 1-tap ledger entries.
   - Delete / edit records with confirmation dialogs.

3. **Fast Add Transaction (`+`)**:
   - Flow switcher: *Income* vs *Expense*.
   - Scope switcher: *Personal* vs *Business*.
   - Hero numeric input with rapid stepper chips: `+₹100`, `+₹500`, `+₹1,000`, `+₹5,000`, and backspace.
   - 9-category visual selector with iconography.
   - Payment account selector: *Cash*, *Bank Account / UPI*, *Credit Card*.
   - GST tax percentage (0%, 5%, 12%, 18%, 28%) and invoice notes.

4. **Monthly Budget Limits (`Budget`)**:
   - Flexible monthly ceiling (configurable for Overall, Personal, or Business).
   - Utilized gauge with warning threshold alerts at 80% and 100%.
   - **Safe Daily Spend Velocity**: Real-time calculation of remaining daily allowance based on calendar days left in the month.
   - Category budget allocation guidance.

5. **Commitments (`Commitments`)**:
   - **Recurring Subscriptions Engine**: Track recurring tools (AWS, Adobe, Broadband, Office Rent) with monthly burn rate and annual projections.
   - **Client Invoices**: Issue invoices with automated GST calculation and 1-tap **"Mark as Paid"** (which automatically records the income transaction in the ledger).

6. **Financial Reports & Tax (`Reports`)**:
   - Profit & Loss statement with Net Margin %.
   - Real-time GST calculation: Output GST collected vs Input Tax Credit (ITC) vs Net GST Liability payable.
   - Expense distribution bars by category.

7. **Category Management (`Category Taxonomy`)**:
   - Separate Expense vs Income category management.
   - Custom tags with custom colors and vector icons.

8. **Offline Vault & Data Backup (`Offline Vault`)**:
   - Hardware status: 100% Air-Gap, AES-256 GCM encrypted local storage.
   - Export raw JSON database snapshot.
   - Restore database from backup snapshot.
   - Emergency local database wipe / factory reset.

9. **PIN Lock Authentication (`Master PIN`)**:
   - 4-digit Master PIN lock with tactile on-screen keypad.
   - Enabled/disabled via Settings. Default PIN is `1234`.

---

## 🚀 Running the App

### Web Browser Preview (Active Now)
The app is running live at:
**[http://localhost:8082](http://localhost:8082)**

### Run on Physical Mobile Device (Android / iOS)
1. Open terminal:
   ```bash
   cd mobile
   npx expo start
   ```
2. Download **Expo Go** from Google Play or App Store.
3. Scan the QR code shown in the terminal.
