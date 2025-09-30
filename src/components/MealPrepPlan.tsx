import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, ChefHat, Thermometer, Timer, CheckCircle, Package, Zap } from 'lucide-react';

interface MealPrepPlanProps {
  onBack: () => void;
}

interface PrepPhase {
  id: string;
  title: string;
  duration: string;
  icon: React.ReactNode;
  color: string;
  tasks: string[];
  notes?: string[];
}

const prepPhases: PrepPhase[] = [
  {
    id: 'setup',
    title: 'Setup',
    duration: '10 min',
    icon: <ChefHat className="w-5 h-5" />,
    color: 'bg-blue-500',
    tasks: [
      'Clear counters, set up prep → cook → storage triangle',
      'Preheat oven to 200°C / 400°F',
      'Pull containers, shallow pans, labels',
      'Color-coded cutting boards (raw vs veg)'
    ]
  },
  {
    id: 'knife-work',
    title: 'Knife Work & Marinades',
    duration: '20 min',
    icon: <ChefHat className="w-5 h-5" />,
    color: 'bg-green-500',
    tasks: [
      'Veg prep: Dice broccoli, bell peppers, carrots, pumpkin',
      'Chop mushrooms, eggplant, green beans',
      'Wash/dry spinach, portion raw into containers',
      'Aromatics: mince garlic & ginger',
      'Protein prep: Chicken thighs: divide → half marinated teriyaki (wraps, curry), half seasoned for baked drumsticks',
      'Sirloin steak: slice thin, marinate soy + sesame',
      'Prawns: thaw, drain, pat dry (season w/ garlic butter mix)',
      'Sausages: score lightly for roasting'
    ]
  },
  {
    id: 'oven-roast',
    title: 'Oven Batch Roast',
    duration: '40 min, overlapping',
    icon: <Thermometer className="w-5 h-5" />,
    color: 'bg-orange-500',
    tasks: [
      'Sheet Pan 1 (traybake): Pumpkin + sausages',
      'Sheet Pan 2 (veg): Eggplant + mushrooms (for pasta)',
      'Sheet Pan 3 (chicken): Drumsticks + green beans + carrots (Day 4 dinner)',
      'Roast all simultaneously (~30 min, rotate halfway)'
    ]
  },
  {
    id: 'stovetop',
    title: 'Stovetop Proteins',
    duration: '30 min',
    icon: <ChefHat className="w-5 h-5" />,
    color: 'bg-red-500',
    tasks: [
      'While oven runs:',
      'Pan 1: Garlic butter prawns (flash sear <3 min). Cool quickly, refrigerate',
      'Pan 2: Teriyaki chicken thighs (pan-sear ~8–10 min/side). Slice, portion for wraps + curry',
      'Pan 3: Brown mince beef + garlic/ginger. Add broccoli + peppers → stir fry base. Portion',
      'Reserve sirloin steak marinated raw → fry fresh mid-week for fried rice'
    ]
  },
  {
    id: 'starches',
    title: 'Starches',
    duration: '20 min',
    icon: <Package className="w-5 h-5" />,
    color: 'bg-yellow-500',
    tasks: [
      'Rice: Cook 5–6 cups. Spread on sheet pans to cool quickly. Portion: stir fry, teriyaki lunch, prawn fried rice, steak fried rice, sausage fried rice',
      'Pasta: Par-cook 2 min under, toss in oil, store for eggplant/prawn pasta'
    ]
  },
  {
    id: 'assembly',
    title: 'Assembly & Storage',
    duration: '30 min',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'bg-purple-500',
    tasks: [
      'Lunches:',
      '• Chicken & spinach wraps (box with roasted veg side)',
      '• Beef stir fry (rice portioned in)',
      '• Prawn fried rice (rice + peas + carrots)',
      '• Steak fried rice (rice only; steak added mid-week)',
      '• Sausage fried rice (reserve 2 sausages, dice for rice)',
      'Dinners:',
      '• Garlic prawns + rice + beans',
      '• Sausage + pumpkin traybake (reheat later)',
      '• Eggplant/mushroom pasta (store base; prawns added fresh)',
      '• Baked chicken drumsticks + carrots/beans (reheat)',
      '• Chicken & pumpkin curry (finish curry base + chicken + pumpkin)',
      'Label: Dish • Date • Use-by • Reheat method',
      'Place early perishables (prawns, spinach wraps) in "Eat Next" bin',
      'Freeze curry + sausage fried rice portions if >3 days out'
    ],
    notes: [
      'Early perishables go in "Eat Next" bin',
      'Freeze portions >3 days out'
    ]
  }
];

const results = {
  totalTime: '2 Hours',
  lunches: 5,
  dinners: 5,
  description: '5 Lunches ready (3 fully packed, 2 with easy mid-week add-ins). 5 Dinners staged (3 ready-to-heat, 2 needing minor fresh assembly). All proteins + veg reused efficiently, modules capped at ≤8. Sequencing rules respected (prawns/spinach early, curry late).'
};

export default function MealPrepPlan({ onBack }: MealPrepPlanProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meal Prep Plan</h1>
              <p className="text-gray-600">Your complete 2-hour prep strategy</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">In 2 Hours You'll Have</h2>
              <p className="text-gray-600">Complete meal prep for the week</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/70 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{results.lunches}</div>
              <div className="text-sm text-gray-600">Lunches Ready</div>
            </div>
            <div className="bg-white/70 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{results.dinners}</div>
              <div className="text-sm text-gray-600">Dinners Staged</div>
            </div>
            <div className="bg-white/70 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{results.totalTime}</div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
          </div>
          
          <p className="mt-4 text-sm text-gray-700 leading-relaxed">
            {results.description}
          </p>
        </motion.div>

        {/* Prep Phases */}
        <div className="space-y-6">
          {prepPhases.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Phase Header */}
              <div className={`${phase.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      {phase.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Phase {index + 1}: {phase.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Timer className="w-4 h-4" />
                        <span className="text-white/90 font-medium">{phase.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{index + 1}</div>
                    <div className="text-white/70 text-sm">Phase</div>
                  </div>
                </div>
              </div>

              {/* Phase Content */}
              <div className="p-6">
                <div className="space-y-3">
                  {phase.tasks.map((task, taskIndex) => (
                    <motion.div
                      key={taskIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (index * 0.1) + (taskIndex * 0.05) }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed">{task}</p>
                    </motion.div>
                  ))}
                </div>

                {phase.notes && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Important Notes:</h4>
                    <ul className="space-y-1">
                      {phase.notes.map((note, noteIndex) => (
                        <li key={noteIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">You're All Set!</h3>
          <p className="text-gray-600">
            Follow this plan step by step and you'll have a week's worth of meals ready in just 2 hours.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
