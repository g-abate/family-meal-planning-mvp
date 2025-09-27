import { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import UpdatePrompt from './components/UpdatePrompt';

function App() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-white'>
        {/* Header */}
        <header className='bg-white border-b border-sage-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95'>
          <div className='container-app'>
            <div className='flex items-center justify-between h-20'>
              <div className='flex items-center space-x-4'>
                <div className='w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center shadow-soft'>
                  <span className='text-white font-bold text-xl'>M</span>
                </div>
                <h1 className='text-2xl font-semibold text-primary-500'>
                  Family Meal Planning
                </h1>
              </div>
              <button
                onClick={() => setIsWizardOpen(true)}
                className='btn btn-primary btn-md animate-fade-in'
              >
                Start Planning
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className='container-app section-padding'>
          <div className='max-w-4xl mx-auto'>
            {/* Hero Section */}
            <div className='text-center mb-20 animate-fade-in'>
              <h2 className='text-5xl font-bold text-primary-500 mb-6 text-balance leading-tight'>
                Plan Your Family Meals in Minutes
              </h2>
              <p className='text-xl text-sage-600 mb-10 text-balance max-w-2xl mx-auto leading-relaxed'>
                Get personalized meal plans, prep checklists, and never wonder
                "what's for dinner" again.
              </p>
              <button
                onClick={() => setIsWizardOpen(true)}
                className='btn btn-primary btn-lg animate-float'
              >
                Get Started
              </button>
            </div>

            {/* Features Grid */}
            <div className='grid md:grid-cols-3 gap-10 mb-20'>
              <div className='card-luxury text-center animate-slide-up group'>
                <div className='card-body'>
                  <div className='w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
                    <span className='text-primary-500 text-2xl'>🍽️</span>
                  </div>
                  <h3 className='text-xl font-semibold text-primary-500 mb-3'>
                    Smart Meal Planning
                  </h3>
                  <p className='text-sage-600 leading-relaxed'>
                    Get personalized meal suggestions based on your family's
                    preferences and dietary needs.
                  </p>
                </div>
              </div>

              <div
                className='card-luxury text-center animate-slide-up group'
                style={{ animationDelay: '0.1s' }}
              >
                <div className='card-body'>
                  <div className='w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
                    <span className='text-sage-500 text-2xl'>📋</span>
                  </div>
                  <h3 className='text-xl font-semibold text-sage-700 mb-3'>
                    Prep Checklists
                  </h3>
                  <p className='text-sage-600 leading-relaxed'>
                    Optimized prep sessions that fit your schedule and maximize
                    efficiency.
                  </p>
                </div>
              </div>

              <div
                className='card-luxury text-center animate-slide-up group'
                style={{ animationDelay: '0.2s' }}
              >
                <div className='card-body'>
                  <div className='w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
                    <span className='text-orange-400 text-2xl'>⚡</span>
                  </div>
                  <h3 className='text-xl font-semibold text-orange-500 mb-3'>
                    Quick & Easy
                  </h3>
                  <p className='text-sage-600 leading-relaxed'>
                    Set up your meal plan in under 2 minutes with our simple
                    4-step wizard.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className='card-luxury bg-gradient-to-br from-primary-50 to-sage-50 border-primary-200 animate-scale-in'>
              <div className='card-body text-center'>
                <h3 className='text-3xl font-semibold text-primary-500 mb-6'>
                  Ready to Transform Your Meal Planning?
                </h3>
                <p className='text-sage-600 mb-8 text-lg leading-relaxed max-w-2xl mx-auto'>
                  Join thousands of families who save time and reduce stress
                  with our meal planning system.
                </p>
                <button
                  onClick={() => setIsWizardOpen(true)}
                  className='btn btn-accent btn-lg animate-pulse-soft'
                >
                  Start Your Free Plan
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Wizard Modal Placeholder */}
        {isWizardOpen && (
          <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in'>
            <div
              className='card-luxury max-w-2xl w-full animate-scale-in'
              role='dialog'
              aria-labelledby='wizard-title'
              aria-describedby='wizard-description'
            >
              <div className='card-header'>
                <h3
                  id='wizard-title'
                  className='text-2xl font-semibold text-primary-500'
                >
                  Meal Planning Wizard
                </h3>
              </div>
              <div className='card-body'>
                <p
                  id='wizard-description'
                  className='text-sage-600 mb-6 text-lg leading-relaxed'
                >
                  The wizard will be implemented in the next phase. For now,
                  this is a placeholder to demonstrate the Tailwind CSS setup
                  with our luxurious minimalism design language.
                </p>
                <div className='flex space-x-4'>
                  <button
                    onClick={() => setIsWizardOpen(false)}
                    className='btn btn-secondary btn-md'
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setIsWizardOpen(false)}
                    className='btn btn-primary btn-md'
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PWA Update Prompt */}
        <UpdatePrompt />
      </div>
    </ErrorBoundary>
  );
}

export default App;
