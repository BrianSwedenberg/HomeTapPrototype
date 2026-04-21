import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { submitLead } from '../../lib/submitLead';
import { isFormComplete } from '../../lib/validation';
import { UseCaseAccordion } from './UseCaseAccordion';
import type { ReferralFormData } from '../../types';

const EMPTY_FORM: ReferralFormData = {
  firstName: '', lastName: '', email: '', phone: '',
  address1:  '', city: '',    state: '', zip:  '',
  useCase:   '', notes: '',
};

export function ReferralForm() {
  const [form, setForm]             = useState<ReferralFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);

  const { activePartnerId, setPendingReferral, navigateTo } = useAppStore(s => ({
    activePartnerId:     s.activePartnerId,
    setPendingReferral:  s.setPendingReferral,
    navigateTo:          s.navigateTo,
  }));

  function handleField(field: keyof ReferralFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit() {
    if (!activePartnerId || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await submitLead(form, activePartnerId);
      setPendingReferral(form);
      navigateTo('confirmation');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  }

  const canSubmit = isFormComplete(form) && !isSubmitting;

  const inputClass =
    'h-12 px-[14px] border-[1.5px] border-[#E8E6F0] rounded-md text-[14px] text-[#3D3A52] bg-[#FAFAFE] outline-none transition-[border-color_150ms,box-shadow_150ms,background_150ms] w-full focus:border-primary focus:border-2 focus:shadow-focus focus:bg-bg-card placeholder-[#C4C2D4]';

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-5 pb-[120px]">

      {/* Homeowner Info */}
      <div className="mb-6">
        <div className="text-[12px] font-bold text-text-secondary uppercase tracking-[0.8px] mb-3">Homeowner Info</div>
        <div className="flex gap-[10px] mb-3">
          <div className="flex flex-col gap-[5px] flex-1">
            <label className="text-xs font-semibold text-text-secondary">First name <span className="text-error">*</span></label>
            <input className={inputClass} type="text" placeholder="Jane" value={form.firstName} onChange={handleField('firstName')} />
          </div>
          <div className="flex flex-col gap-[5px] flex-1">
            <label className="text-xs font-semibold text-text-secondary">Last name <span className="text-error">*</span></label>
            <input className={inputClass} type="text" placeholder="Smith" value={form.lastName} onChange={handleField('lastName')} />
          </div>
        </div>
        <div className="flex flex-col gap-[5px] mb-3">
          <label className="text-xs font-semibold text-text-secondary">Email <span className="text-error">*</span></label>
          <input className={inputClass} type="email" placeholder="jane@email.com" value={form.email} onChange={handleField('email')} />
        </div>
        <div className="flex flex-col gap-[5px]">
          <label className="text-xs font-semibold text-text-secondary">Phone <span className="text-error">*</span></label>
          <input className={inputClass} type="tel" placeholder="(617) 555-0100" value={form.phone} onChange={handleField('phone')} />
        </div>
      </div>

      {/* Property Address */}
      <div className="mb-6">
        <div className="text-[12px] font-bold text-text-secondary uppercase tracking-[0.8px] mb-3">Property Address</div>
        <div className="flex flex-col gap-[5px] mb-3">
          <label className="text-xs font-semibold text-text-secondary">Street address <span className="text-error">*</span></label>
          <input className={inputClass} type="text" placeholder="123 Main Street" autoComplete="street-address" value={form.address1} onChange={handleField('address1')} />
        </div>
        <div className="flex gap-[10px] mb-3">
          <div className="flex flex-col gap-[5px]" style={{ flex: 2 }}>
            <label className="text-xs font-semibold text-text-secondary">City <span className="text-error">*</span></label>
            <input className={inputClass} type="text" placeholder="Boston" value={form.city} onChange={handleField('city')} />
          </div>
          <div className="flex flex-col gap-[5px]" style={{ flex: 1 }}>
            <label className="text-xs font-semibold text-text-secondary">State <span className="text-error">*</span></label>
            <input className={inputClass} type="text" placeholder="MA" maxLength={2} value={form.state} onChange={handleField('state')} />
          </div>
        </div>
        <div className="flex flex-col gap-[5px]" style={{ maxWidth: 140 }}>
          <label className="text-xs font-semibold text-text-secondary">ZIP <span className="text-error">*</span></label>
          <input className={inputClass} type="text" placeholder="02101" inputMode="numeric" maxLength={5} value={form.zip} onChange={handleField('zip')} />
        </div>
      </div>

      {/* Use of Funds */}
      <div className="mb-6">
        <div className="text-[12px] font-bold text-text-secondary uppercase tracking-[0.8px] mb-3">
          Use of Funds <span className="text-error">*</span>
        </div>
        <UseCaseAccordion
          value={form.useCase}
          onChange={val => setForm(prev => ({ ...prev, useCase: val }))}
        />
      </div>

      {/* Additional Notes */}
      <div className="mb-6">
        <div className="text-[12px] font-bold text-text-secondary uppercase tracking-[0.8px] mb-3">Additional Notes</div>
        <div className="flex flex-col gap-[5px]">
          <label className="text-xs font-semibold text-text-secondary">
            Notes <span className="text-text-disabled font-normal">(optional)</span>
          </label>
          <textarea
            className="p-3 px-[14px] h-[88px] resize-none border-[1.5px] border-[#E8E6F0] rounded-md text-[14px] text-[#3D3A52] bg-[#FAFAFE] outline-none transition-[border-color_150ms,box-shadow_150ms] w-full leading-relaxed focus:border-primary focus:border-2 focus:shadow-focus focus:bg-bg-card placeholder-[#C4C2D4]"
            placeholder="Any context that would help the Hometap team — project scope, timeline, or anything the homeowner mentioned…"
            value={form.notes}
            onChange={handleField('notes')}
          />
        </div>
      </div>

      {/* Sticky Submit Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-bg-card border-t border-border-light px-4 pt-3 pb-6 z-[100]">
        {submitError && (
          <p className="text-[12px] text-error mb-2 text-center">{submitError}</p>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full h-[52px] bg-primary text-white font-bold text-[16px] border-none rounded-full cursor-pointer transition-[background_180ms,transform_100ms] hover:bg-primary-dark active:scale-[0.98] disabled:bg-[#C4B5D9] disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="inline-block w-[18px] h-[18px] border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Submit Referral'
          )}
        </button>
        <div className="text-center text-[11px] text-text-disabled mt-2">🔒 Your client's information is encrypted and secure</div>
      </div>
    </div>
  );
}
