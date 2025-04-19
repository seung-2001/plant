import {useEffect, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';

function useAppState() {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [isComeback, setIsComeback] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setIsComeback(true);
      } else {
        setIsComeback(false);
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return {isComeback};
}

export default useAppState; 