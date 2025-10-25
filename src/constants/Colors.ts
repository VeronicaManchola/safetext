const PRIMARY = '#054BA6';
const PRIMARY_DARK = '#035AA6';
const ACCENT = '#2C7BBF';
const SECONDARY = '#8FAFD9';
const BACKGROUND = '#e5e5e5';
const INPUT_BG = '#F2F2F2';
const WHITE = '#FFFFFF';
const TEXT = '#0B1220';
const TEXT_MUTED = '#1F2A44';
const BORDER = '#8FAFD9';

export const Colors = {
  light: {
    text: TEXT,
    textMuted: TEXT_MUTED,
    textContrast: WHITE,
    title: PRIMARY,
    background: WHITE,
    tint: ACCENT,
    icon: SECONDARY,
    tabIconDefault: SECONDARY,
    tabIconSelected: PRIMARY,

    accent: ACCENT,
    card: WHITE,
    surface: BACKGROUND,
    border: BORDER,
    buttonPrimary: PRIMARY,
    buttonPrimaryText: WHITE,
    buttonSecondary: ACCENT,
    buttonSecondaryText: WHITE,
    inputBg: INPUT_BG,
    inputText: TEXT,
    chipBg: SECONDARY,
    chipText: PRIMARY,
    riskSafe: '#27AE60',
    riskWarning: '#F1C40F',
    riskDanger: '#E74C3C',
  },

  dark: {
    text: '#E6EAF2',
    textMuted: '#C0C9D9',
    textContrast: WHITE,
    title: SECONDARY,
    background: '#0B1A1C',
    tint: ACCENT,
    icon: '#88A7AC',
    tabIconDefault: '#88A7AC',
    tabIconSelected: ACCENT,

    accent: ACCENT,
    card: '#092B30',
    surface: '#0F2428',
    border: '#14383E',
    buttonPrimary: ACCENT,
    buttonPrimaryText: '#0B1A1C',
    buttonSecondary: PRIMARY_DARK,
    buttonSecondaryText: WHITE,
    inputBg: '#0E3A41',
    inputText: '#E6F1F2',
    chipBg: '#123238',
    chipText: ACCENT,
    riskSafe: '#27AE60',
    riskWarning: '#F1C40F',
    riskDanger: '#E74C3C',
  },
};
