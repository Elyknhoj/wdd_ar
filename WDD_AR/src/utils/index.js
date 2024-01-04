// React modules
import {Platform, Dimensions} from 'react-native';

// Third party libraries

const {width, height} = Dimensions.get('window');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

/* The purpose of these functions is to be able to take one design (from a standard mobile phone) and apply it to other display sizes.

 * scale - is pretty straight forward and will return the same linear result as using viewport.
 * verticalScale - is like scale, but based on height instead of width, which can be useful.
 * moderateScale - you can control the resize factor (default is 0.5), basically it is good for font sizes.
 
 */

export const scale = size => (shortDimension / guidelineBaseWidth) * size;
export const verticalScale = size =>
  (longDimension / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;
export const moderateVerticalScale = (size, factor = 0.5) =>
  size + (verticalScale(size) - size) * factor;

export const isAndroidDevice = () => {
  return Platform.OS === 'android';
};
export const isIosDevice = () => {
  return Platform.OS === 'ios';
};
