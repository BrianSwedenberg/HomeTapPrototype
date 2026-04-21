import { useAppStore } from '../../store/useAppStore';

export function FAB() {
  const { currentScreen, navigateTo } = useAppStore(s => ({
    currentScreen: s.currentScreen,
    navigateTo:    s.navigateTo,
  }));

  function handleClick() {
    if (currentScreen === 'refer') return; // no-op on Refer screen
    navigateTo('refer');
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Refer a new homeowner"
      className="fixed bottom-20 right-[calc(50%-195px+16px)] w-[52px] h-[52px] rounded-full bg-primary flex items-center justify-center shadow-[0_4px_16px_rgba(107,63,160,0.45)] z-[200] border-none cursor-pointer transition-[background_180ms,transform_100ms] hover:bg-primary-dark hover:scale-105 active:scale-[0.96]"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </button>
  );
}
