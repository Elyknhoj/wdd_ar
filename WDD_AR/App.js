// React modules
import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {ImageBackground, Modal, Platform, Text, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {isIosDevice, scale, verticalScale} from './src/utils';

let detectionTimeout;
function App() {
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const detectionDelay = 2000; // 1 second delay
  const loadingDelay = 3000; // 1 second delay

  useEffect(() => {
    let loadingTimeout;
    setIsLoading(true);
    loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, loadingDelay);
    return () => loadingTimeout;
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA;
      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
    };

    requestPermission();
  }, []);

  const onSuccessScan = data => {
    clearTimeout(detectionTimeout);
    setAnimationPlaying(true);
    detectionTimeout = setTimeout(() => {
      setAnimationPlaying(false);
    }, detectionDelay);
  };

  const renderAnimation = () => {
    return (
      <Modal
        visible
        transparent
        theme={{
          colors: {
            backdrop: 'transparent',
          },
        }}>
        <LottieView
          source={require('./src/global/glucometer_v6.json')}
          autoPlay
          loop={false}
          style={{flexGrow: 1}}
        />
      </Modal>
    );
  };

  const renderLoading = () => {
    return (
      <ImageBackground
        resizeMode="cover"
        style={{flex: 1, justifyContent: 'center', padding: scale(20)}}
        source={require('./src/assets/wdd_ar.png')}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          {isIosDevice() ? (
            <LottieView
              source={require('./src/global/wdd_ad_loading.json')}
              autoPlay
              style={{
                width: scale(100),
                height: verticalScale(100),
              }}
            />
          ) : (
            <LottieView
              source={require('./src/global/test.json')}
              autoPlay
              style={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: 0,
                top: verticalScale(300),
                right: 0,
                left: 0,
                width: scale(500),
                height: verticalScale(500),
              }}
            />
          )}
          <Text style={{color: '#000000'}}>L O A D I N G</Text>
        </View>
      </ImageBackground>
    );
  };

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        renderLoading()
      ) : (
        <QRCodeScanner
          reactivate
          reactivateTimeout={100}
          onRead={onSuccessScan}
          cameraStyle={{
            height: '100%',
          }}
          vibrate={false}
          cameraProps={{
            barCodeTypes: [RNCamera.Constants.BarCodeType.qr],
            captureAudio: false,
          }}
        />
      )}
      {animationPlaying && renderAnimation()}
    </View>
  );
}

export default App;
