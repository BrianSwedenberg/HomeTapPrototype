import { useState } from 'react';

interface UseCaseAccordionProps {
  value: string;
  onChange: (value: string) => void;
}

type ParentId = 'reno' | 'invest';

const RENO_OPTIONS = [
  'Roof replacement',
  'Kitchen remodel',
  'Bathroom remodel',
  'Addition / expansion',
  'Basement finish',
  'Patio / deck',
  'Siding / exterior',
  'HVAC / systems',
  'Other',
];

const INVEST_OPTIONS = [
  'Down payment on investment property',
  'Portfolio expansion (multi-family)',
  'Fix & flip funding',
  'Debt payoff / refinance',
  'Business funding',
  'Other',
];

const PARENTS: { id: ParentId; icon: string; label: string; sublabel: string; options: string[] }[] = [
  { id: 'reno',   icon: '🔨', label: 'Home Repair / Renovation', sublabel: 'Improvements, repairs, or additions', options: RENO_OPTIONS },
  { id: 'invest', icon: '💼', label: 'Investment Capital',        sublabel: 'Funding a property purchase or business goal', options: INVEST_OPTIONS },
];

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

export function UseCaseAccordion({ value, onChange }: UseCaseAccordionProps) {
  const [expanded, setExpanded]         = useState<ParentId | null>(null);
  const [selectedParent, setSelectedParent] = useState<ParentId | null>(null);
  const [otherReno, setOtherReno]       = useState('');
  const [otherInvest, setOtherInvest]   = useState('');

  function getSelectedOptionForParent(parentId: ParentId): string | null {
    if (selectedParent !== parentId) return null;
    return value || null;
  }

  function handleToggleParent(id: ParentId) {
    if (selectedParent === id) return; // can't collapse a selected card
    setExpanded(prev => prev === id ? null : id);
  }

  function handleSelectChild(parentId: ParentId, option: string) {
    const otherParent: ParentId = parentId === 'reno' ? 'invest' : 'reno';

    setSelectedParent(parentId);
    setExpanded(null);

    // Clear the other parent's other-input
    if (otherParent === 'reno')    setOtherReno('');
    if (otherParent === 'invest') setOtherInvest('');

    if (option === 'Other') {
      // Store the pending state — actual value set when user types
      onChange('');
    } else {
      onChange(option);
    }
  }

  function handleOtherInput(parentId: ParentId, text: string) {
    if (parentId === 'reno')    setOtherReno(text);
    if (parentId === 'invest') setOtherInvest(text);
    const prefix = parentId === 'reno' ? 'Renovation' : 'Investment';
    onChange(text ? `${prefix}: ${text}` : '');
  }

  return (
    <div className="flex flex-col gap-[10px]">
      {PARENTS.map(parent => {
        const isExpanded   = expanded === parent.id;
        const hasSelection = selectedParent === parent.id;
        const selectedOption = getSelectedOptionForParent(parent.id);
        const isOtherSelected =
          hasSelection &&
          (value.startsWith('Renovation:') || value.startsWith('Investment:'));
        const otherVal = parent.id === 'reno' ? otherReno : otherInvest;

        const cardClass = hasSelection
          ? 'border-primary border-2 bg-[#F5F0FC]'
          : isExpanded
          ? 'border-primary border-2'
          : 'border-[#E8E6F0] border-[1.5px]';

        return (
          <div key={parent.id} className={`rounded-md bg-bg-card overflow-hidden transition-[border-color_150ms] ${cardClass}`}>
            <button
              type="button"
              onClick={() => handleToggleParent(parent.id)}
              className="flex items-center gap-3 p-[14px] px-4 cursor-pointer w-full bg-transparent border-none text-left"
            >
              <span className="text-[20px] w-7 text-center flex-shrink-0">{parent.icon}</span>
              <span className="flex-1">
                <span className="text-[15px] font-semibold text-text-primary block">{parent.label}</span>
                <span className="text-xs text-text-secondary block mt-[1px]">{parent.sublabel}</span>
              </span>
              {hasSelection && selectedOption && (
                <span className="text-[11px] text-primary font-semibold bg-primary-light rounded-full py-[2px] px-2 flex-shrink-0 whitespace-nowrap">
                  {truncate(isOtherSelected ? otherVal || 'Other' : selectedOption, 18)}
                </span>
              )}
              <span
                className="text-[16px] text-[#C4C2D4] flex-shrink-0 transition-transform duration-200"
                style={{ transform: isExpanded || hasSelection ? 'rotate(90deg)' : 'none' }}
              >
                ›
              </span>
            </button>

            {(isExpanded || hasSelection) && (
              <div className="border-t border-border-light px-3 pt-[10px] pb-3 flex flex-col gap-[6px] bg-[#FDFCFF]">
                {parent.options.map(option => {
                  const isSelected = hasSelection && (
                    option === 'Other'
                      ? isOtherSelected
                      : value === option
                  );
                  return (
                    <div key={option}>
                      <button
                        type="button"
                        onClick={() => handleSelectChild(parent.id, option)}
                        className={`flex items-center gap-[10px] p-[10px] px-3 rounded-lg cursor-pointer w-full text-left transition-[border-color_120ms,background_120ms] border ${
                          isSelected
                            ? 'border-primary border-2 bg-primary-light'
                            : 'border-border-light border-[1.5px] bg-bg-card hover:border-[rgba(107,63,160,0.3)] hover:bg-[#F9F7FE]'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border-[1.5px] transition-[border-color_120ms] ${
                            isSelected ? 'border-primary border-4 shadow-[inset_0_0_0_2px_#6B3FA0]' : 'border-border'
                          }`}
                        />
                        <span className="text-[13px] font-medium text-text-primary flex-1">
                          {option === 'Other'
                            ? parent.id === 'reno' ? 'Other repair or renovation' : 'Other investment use'
                            : option}
                        </span>
                      </button>
                      {option === 'Other' && isSelected && (
                        <div className="mt-[6px]">
                          <input
                            autoFocus
                            type="text"
                            value={otherVal}
                            onChange={e => handleOtherInput(parent.id, e.target.value)}
                            placeholder={parent.id === 'reno' ? 'Describe the project…' : 'Describe the goal…'}
                            className="w-full h-10 px-3 border-[1.5px] border-[#E8E6F0] rounded-lg text-[13px] text-[#3D3A52] bg-[#FAFAFE] outline-none focus:border-primary focus:border-2 placeholder-[#C4C2D4]"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
