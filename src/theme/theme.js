// theme.js
import { Dimensions, PixelRatio, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

// ============================================
// 📏 RESPONSIVE SCALING SYSTEM
// ============================================
const guidelineBaseWidth = 375; // iPhone 11 Pro base
const guidelineBaseHeight = 812;

// Scale based on device width
const scale = (size) => (width / guidelineBaseWidth) * size;

// Scale based on device height
const verticalScale = (size) => (height / guidelineBaseHeight) * size;

// Moderate scale with configurable factor (prevents extreme scaling)
const moderateScale = (size, factor = 0.25) => {
  return size + (scale(size) - size) * factor;
};

// Font scale with pixel ratio consideration
const fontScale = (size) => {
  const scaled = moderateScale(size, 0.2);
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

// ============================================
// 🎨 COLOR PALETTE - ORANGE & GOLD THEME
// ============================================
export const COLORS = {
  // ===== PRIMARY BRAND COLORS (ORANGE & GOLD) =====
  primary: "#FF971D",          // Orange (Your Brand Color)
  primaryLight: "#FFB14D",     // Light Orange
  primaryDark: "#D97400",      // Deep Orange
  primaryLighter: "#FFD39A",   // Lighter Orange
  primaryPale: "#FFF4E6",      // Very Light Orange

  secondary: "#C9B15D",        // Gold
  secondaryLight: "#D9C77F",   // Light Gold
  secondaryDark: "#A8922C",    // Dark Gold
  secondaryLighter: "#EFE5BC", // Pale Gold

  accent: "#C9B15D",           // Rich Gold
  accentLight: "#EFE5BC",      // Champagne Gold
  accentDark: "#A8922C",       // Dark Gold

  // ===== NEUTRAL COLORS =====
  white: "#FFFFFF",
  black: "#000000",
  background: "#faf5ea",
  backgroundSecondary: "#F8F8F8",
  backgroundTertiary: "#F5F3EF",
  backgroundDark: "#111111",
  backgroundOrange: "#FFF4E6",  // Light orange tint background
  backgroundGold: "#F8F5EC",    // Light gold tint background
  surface: "#F8F8F8",
  card: "#FFFFFF",
  softCard: "#F8F8F8",
  overlay: "rgba(255, 151, 29, 0.7)",   // Orange overlay
  overlayDark: "rgba(0, 0, 0, 0.7)",
  overlayGold: "rgba(201, 177, 93, 0.1)",
  overlayOrange: "rgba(255, 151, 29, 0.1)",

  // ===== TEXT COLORS =====
  textPrimary: "#111111",        // Almost black
  textSecondary: "#6B7280",      // Gray text
  textTertiary: "#9CA3AF",       // Light gray text (textMuted)
  textDisabled: "#D1D5DB",       // Disabled text
  textInverse: "#FFFFFF",        // White text on dark
  textOrange: "#FF971D",         // Orange text
  textOrangeDark: "#D97400",     // Dark orange text
  textGold: "#C9B15D",           // Gold text
  textGoldDark: "#A8922C",       // Dark gold text

  // ===== GRAY SCALE =====
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111111",

  // ===== ORANGE VARIATIONS =====
  orangeLight: "#FFF4E6",
  orangeMedium: "#FFB14D",
  orangeDark: "#D97400",
  orangeVivid: "#FF7A00",
  orangeIce: "#FFE8CC",
  orangeSoft: "#FFD39A",
  orangeDeep: "#B85C00",

  // ===== BORDER & DIVIDER =====
  border: "#E5E5E5",
  borderLight: "#F3F4F6",
  borderMedium: "#D1D5DB",
  borderDark: "#4B5563",
  borderOrange: "#FF971D",
  borderGold: "#C9B15D",
  divider: "#E5E5E5",

  // ===== INPUT COLORS =====
  inputBackground: "#F9FAFB",
  inputBorder: "#E5E5E5",
  inputPlaceholder: "rgba(107, 114, 128, 0.6)",
  inputFocused: "#FF971D",       // Orange for focus
  inputFocusedAlt: "#C9B15D",    // Gold alternative

  // ===== STATUS COLORS =====
  success: "#7BAE3A",
  successLight: "#A5CC6A",
  successDark: "#5A8A1E",
  error: "#DC2626",
  errorLight: "#EF4444",
  errorDark: "#991B1B",
  warning: "#FF971D",
  warningLight: "#FFB14D",
  warningDark: "#D97400",
  info: "#3B82F6",
  infoLight: "#60A5FA",
  infoDark: "#1E40AF",
  disabled: "#F3F4F6",

  // ===== GOLD VARIATIONS =====
  goldPrimary: "#C9B15D",        // Gold
  goldSecondary: "#D9C77F",      // Light Gold
  goldTertiary: "#EFE5BC",       // Champagne
  goldBronze: "#CD7F32",         // Bronze
  goldRose: "#B76E79",           // Rose Gold
  goldLight: "#F8F5EC",          // Very light gold
  goldMedium: "#C9B15D",         // Medium gold
  goldDark: "#A8922C",           // Dark gold

  // ===== TRANSPARENT COLORS =====
  transparent: "transparent",
  // Orange opacity
  orangeOpacity10: "rgba(255, 151, 29, 0.1)",
  orangeOpacity20: "rgba(255, 151, 29, 0.2)",
  orangeOpacity30: "rgba(255, 151, 29, 0.3)",
  orangeOpacity40: "rgba(255, 151, 29, 0.4)",
  orangeOpacity50: "rgba(255, 151, 29, 0.5)",
  orangeOpacity60: "rgba(255, 151, 29, 0.6)",
  orangeOpacity70: "rgba(255, 151, 29, 0.7)",
  orangeOpacity80: "rgba(255, 151, 29, 0.8)",
  orangeOpacity90: "rgba(255, 151, 29, 0.9)",
  // Black opacity
  blackOpacity10: "rgba(0, 0, 0, 0.1)",
  blackOpacity20: "rgba(0, 0, 0, 0.2)",
  blackOpacity30: "rgba(0, 0, 0, 0.3)",
  blackOpacity40: "rgba(0, 0, 0, 0.4)",
  blackOpacity50: "rgba(0, 0, 0, 0.5)",
  blackOpacity60: "rgba(0, 0, 0, 0.6)",
  blackOpacity70: "rgba(0, 0, 0, 0.7)",
  blackOpacity80: "rgba(0, 0, 0, 0.8)",
  blackOpacity90: "rgba(0, 0, 0, 0.9)",
  // White opacity
  whiteOpacity10: "rgba(255, 255, 255, 0.1)",
  whiteOpacity20: "rgba(255, 255, 255, 0.2)",
  whiteOpacity30: "rgba(255, 255, 255, 0.3)",
  whiteOpacity50: "rgba(255, 255, 255, 0.5)",
  whiteOpacity70: "rgba(255, 255, 255, 0.7)",
  whiteOpacity80: "rgba(255, 255, 255, 0.8)",
  whiteOpacity90: "rgba(255, 255, 255, 0.9)",
  // Gold opacity
  goldOpacity10: "rgba(201, 177, 93, 0.1)",
  goldOpacity20: "rgba(201, 177, 93, 0.2)",
  goldOpacity30: "rgba(201, 177, 93, 0.3)",
  goldOpacity50: "rgba(201, 177, 93, 0.5)",

  // ===== SHADOW & EFFECTS =====
  shadow: "rgba(0, 0, 0, 0.1)",
  shadowMedium: "rgba(0, 0, 0, 0.2)",
  shadowStrong: "rgba(0, 0, 0, 0.3)",
  shadowOrange: "rgba(255, 151, 29, 0.25)",
  shadowGold: "rgba(201, 177, 93, 0.3)",

  // ===== GRADIENT COLORS =====
  gradient: {
    // Orange gradients
    orangePrimary: ["#FF971D", "#FFB14D"],   // Orange to light orange
    orangeDeep: ["#D97400", "#FF971D"],      // Deep to orange
    orangeLight: ["#FFB14D", "#FFD39A"],     // Light orange gradient
    orangeVivid: ["#FF7A00", "#FFB14D"],     // Vivid to soft orange
    orangeToWhite: ["#FF971D", "#FFFFFF"],   // Orange to white

    // Gold gradients
    goldLight: ["#C9B15D", "#D9C77F"],       // Gold gradient
    goldDark: ["#A8922C", "#C9B15D"],        // Dark to light gold
    luxuryGold: ["#C9B15D", "#D9C77F", "#EFE5BC"], // Luxury gold
    shimmer: ["#C9B15D", "#EFE5BC", "#C9B15D"],    // Gold shimmer

    // Orange & Gold combinations
    orangeToGold: ["#FF971D", "#C9B15D"],    // Orange to Gold
    goldToOrange: ["#C9B15D", "#FF971D"],    // Gold to Orange
    elegance: ["#D97400", "#C9B15D"],        // Deep orange to rich gold
    luxury: ["#FF971D", "#C9B15D", "#FFB14D"], // Orange-Gold-Light Orange
    premium: ["#D97400", "#FF971D", "#C9B15D"], // Deep orange to gold

    // Neutral surfaces
    surface: ["#F8F8F8", "#FFFFFF"],         // Neutral surface
    surfaceWarm: ["#F5F3EF", "#FFFFFF"],     // Warm tint surface
    darkSurface: ["#111111", "#1F2937"],     // Dark surface
  },
};

// ============================================
// 📐 SIZING SYSTEM
// ============================================
export const SIZES = {
  // ===== BASE SIZE =====
  base: 16,

  // ===== SPACING SCALE =====
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
  xxl: moderateScale(48),
  xxxl: moderateScale(64),

  // ===== PADDING & MARGIN =====
  padding: {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(20),
    xxl: moderateScale(24),
    xxxl: moderateScale(32),
    container: moderateScale(20), // Standard container padding
  },

  margin: {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(20),
    xxl: moderateScale(24),
    xxxl: moderateScale(32),
  },

  // ===== BORDER RADIUS =====
  radius: {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(20),
    xxl: moderateScale(24),
    xxxl: moderateScale(32),
    full: 9999,
    card: moderateScale(16),
    button: moderateScale(12),
    input: moderateScale(10),
  },

  // ===== FONT SIZES =====
  font: {
    xxs: fontScale(8),
    xs: fontScale(10),
    sm: fontScale(12),
    md: fontScale(14),
    lg: fontScale(16),
    xl: fontScale(18),
    xxl: fontScale(20),
    xxxl: fontScale(24),
  },

  // ===== HEADING SIZES =====
  heading: {
    h1: fontScale(32),
    h2: fontScale(28),
    h3: fontScale(24),
    h4: fontScale(20),
    h5: fontScale(18),
    h6: fontScale(16),
  },

  // ===== ICON SIZES =====
  icon: {
    xs: moderateScale(12),
    sm: moderateScale(16),
    md: moderateScale(20),
    lg: moderateScale(24),
    xl: moderateScale(28),
    xxl: moderateScale(32),
    xxxl: moderateScale(48),
    xxxxl: moderateScale(64),
  },

  // ===== DIMENSIONS =====
  screen: {
    width,
    height,
    isSmallDevice: width < 375,
    isMediumDevice: width >= 375 && width < 414,
    isLargeDevice: width >= 414,
    isTablet: width >= 768,
  },

  // ===== COMPONENT SIZES =====
  button: {
    sm: moderateScale(36),
    md: moderateScale(44),
    lg: moderateScale(52),
    xl: moderateScale(60),
    height: {
      sm: moderateScale(36),
      md: moderateScale(48),
      lg: moderateScale(56),
    },
  },

  input: {
    sm: moderateScale(36),
    md: moderateScale(44),
    lg: moderateScale(52),
    height: moderateScale(48),
  },

  card: {
    padding: moderateScale(16),
    paddingLg: moderateScale(20),
  },

  header: {
    height: Platform.OS === "ios" ? moderateScale(88) : moderateScale(56),
  },

  tabBar: {
    height: Platform.OS === "ios" ? moderateScale(84) : moderateScale(60),
  },
};

// ============================================
// 🔤 TYPOGRAPHY SYSTEM (POPPINS)
// ============================================
export const FONTS = {
  // ===== FONT FAMILIES =====
  family: {
    // Poppins weights
    thin:       "Poppins-Thin",
    extraLight: "Poppins-ExtraLight",
    light:      "Poppins-Light",
    regular:    "Poppins-Regular",
    medium:     "Poppins-Medium",
    semiBold:   "Poppins-SemiBold",
    bold:       "Poppins-Bold",
    extraBold:  "Poppins-ExtraBold",
    black:      "Poppins-Black",

    // Poppins italics
    thinItalic:       "Poppins-ThinItalic",
    extraLightItalic: "Poppins-ExtraLightItalic",
    lightItalic:      "Poppins-LightItalic",
    italic:           "Poppins-Italic",
    mediumItalic:     "Poppins-MediumItalic",
    semiBoldItalic:   "Poppins-SemiBoldItalic",
    boldItalic:       "Poppins-BoldItalic",
    extraBoldItalic:  "Poppins-ExtraBoldItalic",
    blackItalic:      "Poppins-BlackItalic",

    // Other fonts
    dancing:        "DancingScript",
    dmSerif:        "DMSerif",
    domineBold:     "Domine-Bold",
    fancy:          "Fancy",
    garamond:       "Garamond",
    lato:           "Lato-Regular",
    playfair:       "PlayfairDisplay-Medium",
    trajanRegular:  "TrajanPro-Regular",
    trajanBold:     "TrajanPro-Bold",
    inter:          "InterDisplay-Medium",

    // Aliases
    heading:  "Poppins-Bold",
    body:     "Poppins-Regular",
    bodyBold: "Poppins-SemiBold",
  },

  // ===== FONT WEIGHTS =====
  weight: {
    thin: "100",
    light: "300",
    regular: "400",
    medium: "500",
    semiBold: "600",
    bold: "700",
    extraBold: "800",
  },

  // ===== HEADING STYLES =====
  h1: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.heading.h1,
    lineHeight: SIZES.heading.h1 * 1.2,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.heading.h2,
    lineHeight: SIZES.heading.h2 * 1.25,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.heading.h3,
    lineHeight: SIZES.heading.h3 * 1.3,
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  h4: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.heading.h4,
    lineHeight: SIZES.heading.h4 * 1.3,
    color: COLORS.textPrimary,
  },
  h5: {
    fontFamily: "Poppins-Medium",
    fontSize: SIZES.heading.h5,
    lineHeight: SIZES.heading.h5 * 1.4,
    color: COLORS.textPrimary,
  },
  h6: {
    fontFamily: "Poppins-Medium",
    fontSize: SIZES.heading.h6,
    lineHeight: SIZES.heading.h6 * 1.4,
    color: COLORS.textPrimary,
  },

  // ===== BODY TEXT STYLES =====
  bodyLarge: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.font.lg,
    lineHeight: SIZES.font.lg * 1.5,
    color: COLORS.textPrimary,
  },
  body: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.5,
    color: COLORS.textPrimary,
  },
  bodyMedium: {
    fontFamily: "Poppins-Medium",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.5,
    color: COLORS.textPrimary,
  },
  bodySmall: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.font.sm,
    lineHeight: SIZES.font.sm * 1.5,
    color: COLORS.textSecondary,
  },
  bodyBold: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.5,
    color: COLORS.textPrimary,
  },

  // ===== LABEL & CAPTION =====
  label: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.sm,
    lineHeight: SIZES.font.sm * 1.4,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  labelUppercase: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.sm,
    lineHeight: SIZES.font.sm * 1.4,
    color: COLORS.textPrimary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  caption: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.font.xs,
    lineHeight: SIZES.font.xs * 1.4,
    color: COLORS.textSecondary,
  },
  captionBold: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.xs,
    lineHeight: SIZES.font.xs * 1.4,
    color: COLORS.textPrimary,
  },

  // ===== BUTTON TEXT =====
  button: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.3,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  buttonLarge: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.font.lg,
    lineHeight: SIZES.font.lg * 1.3,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  buttonSmall: {
    fontFamily: "Poppins-Medium",
    fontSize: SIZES.font.sm,
    lineHeight: SIZES.font.sm * 1.3,
    color: COLORS.white,
  },

  // ===== SPECIAL STYLES (ORANGE & GOLD TEXT) =====
  orangeHeading: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.heading.h2,
    lineHeight: SIZES.heading.h2 * 1.25,
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  orangeText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.5,
    color: COLORS.primary,
  },
  goldHeading: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.heading.h2,
    lineHeight: SIZES.heading.h2 * 1.25,
    color: COLORS.goldPrimary,
    letterSpacing: -0.3,
  },
  goldText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.5,
    color: COLORS.goldPrimary,
  },
};

// ============================================
// 🎭 SHADOWS
// ============================================
export const SHADOWS = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  // Orange shadow for brand feel
  orange: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  orangeStrong: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  // Gold shadow for accents
  gold: {
    shadowColor: COLORS.goldPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  goldStrong: {
    shadowColor: COLORS.goldPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
};

// ============================================
// 📱 DEVICE BREAKPOINTS
// ============================================
export const BREAKPOINTS = {
  small: width < 375,
  medium: width >= 375 && width < 768,
  large: width >= 768,
  tablet: width >= 768,
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isLargeDevice: width >= 768,
  isTablet: width >= 768,
};


// ============================================
// 🎯 EXPORT DEFAULT THEME
// ============================================
const theme = {
  COLORS,
  SIZES,
  FONTS,
  SHADOWS,
  BREAKPOINTS,
  scale,
  verticalScale,
  moderateScale,
  fontScale,
};

export default theme;