import { forwardRef } from 'react';
import { useWizardStore } from '../../stores/wizardStore';
import { PREP_DURATIONS } from '../../types/wizard';

export const PrepStyleStep = forwardRef<HTMLInputElement>((_props, ref) => {
  const { prepStyle, setPrepStyle } = useWizardStore();

  const handleSessionsChange = (sessions: number) => {
    setPrepStyle({ 
      sessionsPerWeek: sessions, 
      sessionDuration: prepStyle.sessionDuration 
    });
  };

  const handleDurationChange = (duration: string) => {
    setPrepStyle({ 
      sessionsPerWeek: prepStyle.sessionsPerWeek, 
      sessionDuration: duration as keyof typeof PREP_DURATIONS 
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-primary-500 mb-4">
          How do you prefer to prep meals?
        </h4>
        <p className="text-sage-600">
          Choose your prep schedule and session length
        </p>
      </div>

      {/* Sessions per week */}
      <div className="space-y-4">
        <label className="block text-lg font-semibold text-primary-500 mb-4">
          How many prep sessions per week?
        </label>
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => handleSessionsChange(Math.max(1, prepStyle.sessionsPerWeek - 1))}
            className="w-12 h-12 rounded-full border-2 border-sage-300 hover:border-sage-400 flex items-center justify-center text-2xl font-semibold text-sage-600 hover:text-sage-700 transition-colors"
            aria-label="Decrease sessions"
          >
            −
          </button>
          <div className="text-4xl font-bold text-primary-500 min-w-16 text-center">
            {prepStyle.sessionsPerWeek}
          </div>
          <button
            type="button"
            onClick={() => handleSessionsChange(Math.min(7, prepStyle.sessionsPerWeek + 1))}
            className="w-12 h-12 rounded-full border-2 border-sage-300 hover:border-sage-400 flex items-center justify-center text-2xl font-semibold text-sage-600 hover:text-sage-700 transition-colors"
            aria-label="Increase sessions"
          >
            +
          </button>
        </div>
        <p className="text-center text-sm text-sage-500">
          {prepStyle.sessionsPerWeek === 1 
            ? 'One focused prep session' 
            : `${prepStyle.sessionsPerWeek} prep sessions per week`}
        </p>
      </div>

      {/* Session duration */}
      <div className="space-y-4">
        <label id="duration-label" className="block text-lg font-semibold text-primary-500 mb-4">
          How long per session?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto" role="radiogroup" aria-labelledby="duration-label">
          {PREP_DURATIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleDurationChange(value)}
              className={`py-4 px-6 rounded-lg border-2 font-medium transition-all ${
                prepStyle.sessionDuration === value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-sage-200 hover:border-sage-300 text-sage-700 hover:bg-sage-50'
              }`}
              role="radio"
              aria-checked={prepStyle.sessionDuration === value}
              aria-label={`${label} session duration`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-sage-500">
          {prepStyle.sessionDuration === '1h' && 'Quick prep for simple meals'}
          {prepStyle.sessionDuration === '1.5h' && 'Balanced prep for variety'}
          {prepStyle.sessionDuration === '2h' && 'Comprehensive prep for the week'}
          {prepStyle.sessionDuration === '3h' && 'Extensive prep for complex meals'}
        </p>
      </div>

      {/* Summary */}
      <div className="bg-sage-50 rounded-lg p-4 text-center">
        <p className="text-sm text-sage-600">
          <span className="font-semibold">Your prep plan:</span> {prepStyle.sessionsPerWeek} session{prepStyle.sessionsPerWeek !== 1 ? 's' : ''} per week, {prepStyle.sessionDuration} each
        </p>
      </div>

      <input
        ref={ref}
        type="hidden"
        tabIndex={-1}
      />
    </div>
  );
});

PrepStyleStep.displayName = 'PrepStyleStep';