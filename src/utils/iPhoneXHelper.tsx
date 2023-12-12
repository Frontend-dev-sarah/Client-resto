import { getBottomSpace, ifIphoneX } from 'react-native-iphone-x-helper';

function iphoneXhelper(color = '#FFFFFF') {
  return ifIphoneX(
    {
      paddingBottom: getBottomSpace(),
      backgroundColor: color
    },
    {}
  );
}

export default iphoneXhelper;
