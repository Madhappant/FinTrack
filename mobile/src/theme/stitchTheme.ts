// Design tokens matching stitch_fintrack_offline_expense_manager (Sovereign Ledger)
export const stitchTheme = {
  colors: {
    // Primary Brand & Surfaces
    primary: '#091426',             // Obsidian Navy
    primaryContainer: '#1E293B',    // Deep Slate
    primaryFixed: '#D8E3FB',
    primaryFixedDim: '#BCC7DE',

    // Interactive & Focus
    secondary: '#0051D5',           // Royal Blue
    secondaryContainer: '#316BF3',
    secondaryLight: '#DBE1FF',

    // Canvas & Elevated Surfaces
    background: '#F8F9FF',          // Clean Canvas
    surface: '#F8FAFC',
    card: '#FFFFFF',
    surfaceContainerLow: '#EFF4FF',
    surfaceContainer: '#E5EEFF',
    surfaceContainerHigh: '#DCE9FF',
    surfaceContainerHighest: '#D3E4FE',

    // Cashflow Semantics
    income: '#16A34A',              // Pure Emerald
    incomeVibrant: '#10B981',
    incomeContainer: '#F0FDF4',
    incomeText: '#005137',

    expense: '#DC2626',             // Crimson Red
    expenseVibrant: '#EF4444',
    expenseContainer: '#FEF2F2',
    expenseText: '#93000A',

    warning: '#D97706',             // Amber Alert
    warningVibrant: '#F59E0B',
    warningContainer: '#FFFBEB',
    warningText: '#92400E',

    // Typography & Borders
    textPrimary: '#0B1C30',
    textSecondary: '#45474C',
    textMuted: '#75777D',
    textWhite: '#FFFFFF',

    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    outline: '#C5C6CD',
  },
  typography: {
    fontDisplay: 'System',
    tnum: { fontVariant: ['tabular-nums'] as const },
  },
  roundness: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
    xxl: 24,
    full: 9999,
  }
};
