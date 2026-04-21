import { fetchPartnerData } from '../lib/fetchPartnerData';
import { useAppStore } from '../store/useAppStore';

export function usePartnerData() {
  const { setPartnerData, setLoading, setError } = useAppStore();

  async function loadPartnerData(partnerId: string): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPartnerData(partnerId);
      setPartnerData(data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load partner data');
      return false;
    }
  }

  return { loadPartnerData };
}
