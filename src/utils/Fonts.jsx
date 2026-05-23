import { useFonts as useExpoFonts } from 'expo-font';

const useFonts = () => {
  const [fontsLoaded, error] = useExpoFonts({
    'Poppins-Thin':               require('../assets/fonts/Poppins/Poppins-Thin.ttf'),
    'Poppins-ThinItalic':         require('../assets/fonts/Poppins/Poppins-ThinItalic.ttf'),
    'Poppins-ExtraLight':         require('../assets/fonts/Poppins/Poppins-ExtraLight.ttf'),
    'Poppins-ExtraLightItalic':   require('../assets/fonts/Poppins/Poppins-ExtraLightItalic.ttf'),
    'Poppins-Light':              require('../assets/fonts/Poppins/Poppins-Light.ttf'),
    'Poppins-LightItalic':        require('../assets/fonts/Poppins/Poppins-LightItalic.ttf'),
    'Poppins-Regular':            require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Italic':             require('../assets/fonts/Poppins/Poppins-Italic.ttf'),
    'Poppins-Medium':             require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-MediumItalic':       require('../assets/fonts/Poppins/Poppins-MediumItalic.ttf'),
    'Poppins-SemiBold':           require('../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-SemiBoldItalic':     require('../assets/fonts/Poppins/Poppins-SemiBoldItalic.ttf'),
    'Poppins-Bold':               require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-BoldItalic':         require('../assets/fonts/Poppins/Poppins-BoldItalic.ttf'),
    'Poppins-ExtraBold':          require('../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraBoldItalic':    require('../assets/fonts/Poppins/Poppins-ExtraBoldItalic.ttf'),
    'Poppins-Black':              require('../assets/fonts/Poppins/Poppins-Black.ttf'),
    'Poppins-BlackItalic':        require('../assets/fonts/Poppins/Poppins-BlackItalic.ttf'),
    'DancingScript':              require('../assets/fonts/DancingScript.ttf'),
    'DMSerif':                    require('../assets/fonts/DMSerif.ttf'),
    'Domine-Bold':                require('../assets/fonts/Domine-Bold.ttf'),
    'Fancy':                      require('../assets/fonts/Fancy.ttf'),
    'Garamond':                   require('../assets/fonts/Garamond.ttf'),
    'Lato-Regular':               require('../assets/fonts/Lato-Regular.ttf'),
    'PlayfairDisplay-Medium':     require('../assets/fonts/PlayfairDisplay-Medium.ttf'),
    'TrajanPro-Regular':          require('../assets/fonts/TrajanPro-Regular.ttf'),
    'TrajanPro-Bold':             require('../assets/fonts/TrajanPro-Bold.otf'),
    'InterDisplay-Medium':        require('../assets/fonts/InterDisplay-Medium.otf'),
  });

  return fontsLoaded || !!error;
};

export default useFonts;
