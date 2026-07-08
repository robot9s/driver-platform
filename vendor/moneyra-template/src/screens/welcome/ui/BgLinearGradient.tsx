import {LinearGradient} from 'expo-linear-gradient'
import {StyleSheet} from 'react-native'

const BgLinearGradient = () => {
  return (
    <LinearGradient
      colors={['rgba(37, 39, 45, 1)', 'rgba(17, 20, 26, 1)']}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      style={StyleSheet.absoluteFill}
    />
  )
}

export default BgLinearGradient
