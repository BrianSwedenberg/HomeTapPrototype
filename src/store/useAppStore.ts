import { create } from 'zustand';
import type { Partner, LeadWithStatus, ReferralStatus, PartnerData, ReferralFormData, Screen, StatusHistoryEntry } from '../types';

interface AppStore {
  // ── Navigation ──
  currentScreen: Screen;
  selectedLeadId: number | null;
  navigateTo: (screen: Screen, leadId?: number) => void;

  // ── Auth / Partner ──
  activePartnerId: string | null;
  partner: Partner | null;
  setActivePartner: (partnerId: string) => void;
  clearPartner: () => void;

  // ── Data ──
  leads: LeadWithStatus[];
  allStatuses: ReferralStatus[];
  statusHistoryMap: Record<number, StatusHistoryEntry[]>;
  isLoading: boolean;
  error: string | null;
  setPartnerData: (data: PartnerData & { statusHistoryMap: Record<number, StatusHistoryEntry[]> }) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // ── Referral Form ──
  pendingReferral: ReferralFormData | null;
  setPendingReferral: (data: ReferralFormData) => void;
  clearPendingReferral: () => void;
}

const initialState = {
  currentScreen:    'login' as Screen,
  selectedLeadId:   null,
  activePartnerId:  null,
  partner:          null,
  leads:            [],
  allStatuses:      [],
  statusHistoryMap: {},
  isLoading:        false,
  error:            null,
  pendingReferral:  null,
};

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,

  navigateTo: (screen, leadId) =>
    set({ currentScreen: screen, selectedLeadId: leadId ?? null }),

  setActivePartner: (partnerId) =>
    set({ activePartnerId: partnerId }),

  clearPartner: () =>
    set({ ...initialState }),

  setPartnerData: (data) =>
    set({
      partner:          data.partner,
      leads:            data.leads,
      allStatuses:      data.allStatuses,
      statusHistoryMap: data.statusHistoryMap,
      isLoading:        false,
      error:            null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  setPendingReferral: (data) => set({ pendingReferral: data }),

  clearPendingReferral: () => set({ pendingReferral: null }),
}));
