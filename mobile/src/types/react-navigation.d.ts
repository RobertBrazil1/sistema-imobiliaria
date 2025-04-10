declare module '@react-navigation/native' {
  import { NavigationProp } from '@react-navigation/core';
  
  export function useNavigation<T = any>(): NavigationProp<T>;
  export function useRoute<T = any>(): { params: T };
}

declare module '@react-navigation/native-stack' {
  import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
  
  export function createNativeStackNavigator(): {
    Navigator: React.FC<any>;
    Screen: React.FC<any>;
  };
} 