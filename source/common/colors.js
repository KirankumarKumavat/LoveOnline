/**
 * Commom basic colors used in app
 */
const common = {
   white: '#ffffff',
   black: '#000000',
   purple: "#b459da",
   transparent: "transparent",
   offWhite: "#FFFFFF66",
   transparentWhite: '#F8F8F8',
   lightWhite: "rgba(255,255,255,0.45)",
   lightBlue: "#CE60EF",
   VerylightBlue: "rgba(206, 96, 239, 0.4)",
   textColor: '#444B53',
   lightDotColor: "#D8DADB",
   loaderBackground: "rgba(0,0,0,0.2)",
   modalBackground: 'rgba(0, 0, 0, 0.75)',
   error: '#F65314',
   inputAccessoryBg: "#eff0f1",
   orange: "#81DD51",
   backgroundDark: '#333333',
   chatLight: "#A9B0BB",
   mediumTextColor: "#3C4255",
   notificationTextColor: "#383838",
}

/**
 * white shade colors
 */
const whiteShade = {
   whiteShade1: "#FFFFFF5A",
   whiteShade2: "rgba(255,255,255,0.3)",
   lightWhite: "rgba(255,255,255,0.26)",
   textInputBorder: '#C2C8CF',
   inputBorder2: "#EBEBEB",
   shadowColor: '#C2C8CF33',
   borderColorWhite: "#F6F7F7",
}

/**
 * gray shade colors
 */
const grayShade = {
   grayShade1: "#77777740",
   grayShade2: "#E3E3E3",
   grayShade3: '#E3E6E9',
   grayShadeDark: '#8C939C',
   lightGrayBackground: "#F5F6F8",
   gray: "#E7E8E9",
   grayShade4: "#F0F0F0",
   composerBorder: "#00000014",
   grayShade5: "#F7F7F7",
   borderlightColor: "#EDEDED",
   starTextColor: "#BFBFBF",

   selectionColor: "#a9a9a9",
}

/**
 * blue shade colors
 */
const blueShade = {
   blueShade1: "#F26A6B",
   // blueShade1: "#7B67ED",
   blueShade2: '#6C51FA',
   lightSkyBlue: "#87CEFA",
   blue: '#50ADE7', // primary color
}

/**
 * set of all colors given above
 */
const colors = {
   ...common,
   ...grayShade,
   ...blueShade,
   ...whiteShade,
}
export default colors;