import './index.css';
import { useAppStore } from './store/useAppStore';
import { LoginScreen } from './screens/LoginScreen';
import { PipelineScreen } from './screens/PipelineScreen';
import { ReferScreen } from './screens/ReferScreen';
import { ConfirmationScreen } from './components/referral/ConfirmationScreen';
import { ProspectDetailScreen } from './screens/ProspectDetailScreen';
import { AccountScreen } from './components/account/AccountScreen';

export default function App() {
  const currentScreen = useAppStore(s => s.currentScreen);

  switch (currentScreen) {
    case 'login':        return <LoginScreen />;
    case 'pipeline':     return <PipelineScreen />;
    case 'refer':        return <ReferScreen />;
    case 'confirmation': return <ConfirmationScreen />;
    case 'detail':       return <ProspectDetailScreen />;
    case 'account':      return <AccountScreen />;
    default:             return <LoginScreen />;
  }
}
