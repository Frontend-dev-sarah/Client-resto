import colors from './colors';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { MapStyleElement } from 'react-native-maps';

const elevationShadowStyle = (elevation: number, color?: string) => ({
  elevation: elevation / 2,
  shadowColor: color ? color : colors.black,
  shadowOffset: { width: 0, height: 0.5 * elevation },
  shadowOpacity: 0.5,
  shadowRadius: 0.8 * elevation
});

const noShadow = (color?: string) => elevationShadowStyle(0, color);
const shadow = (color?: string) => elevationShadowStyle(5, color);
const shadow05 = (color?: string) => elevationShadowStyle(0.5, color);
const shadowBold = (color?: string) => elevationShadowStyle(8, color);
const shadowExtraBold = (color?: string) => elevationShadowStyle(24, color);

const marginBottomIPhoneX = getBottomSpace();

const mapStyle: MapStyleElement[] = [
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [
      {
        saturation: 36
      },
      {
        color: '#000000'
      },
      {
        lightness: 40
      }
    ]
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        visibility: 'on'
      },
      {
        color: '#000000'
      },
      {
        lightness: 16
      }
    ]
  },
  {
    featureType: 'all',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#000000'
      },
      {
        lightness: 20
      }
    ]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000'
      },
      {
        lightness: 20
      }
    ]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000'
      },
      {
        lightness: 21
      }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#000000'
      },
      {
        lightness: 17
      }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#000000'
      },
      {
        lightness: 29
      },
      {
        weight: 0.2
      }
    ]
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000'
      },
      {
        lightness: 18
      }
    ]
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000'
      },
      {
        lightness: 16
      }
    ]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000'
      },
      {
        lightness: 19
      }
    ]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000'
      },
      {
        lightness: 17
      }
    ]
  }
];

export default {
  mapStyle,
  marginBottomIPhoneX,
  noShadow,
  shadow,
  shadowBold,
  shadowExtraBold,
  shadow05
};
