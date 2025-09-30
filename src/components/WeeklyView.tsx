import React, { useState, useEffect } from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import WeeklyCalendar from './WeeklyCalendar';

// Types for meal plan data
export interface Meal {
  day: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  recipe_title: string;
  main_protein: string;
  prep_time?: number;
  dietary_tags?: string[];
}

export interface PrepSession {
  session_name: string;
  duration_minutes: number;
  tasks: string[];
}

export interface MealPlan {
  week_start_date: string;
  meals: Meal[];
  available_proteins: string[];
  available_vegetables: string[];
  dietary_preferences: string[];
  prep_sessions: PrepSession[];
  evaluation_score?: number;
}

// A hardcoded sample plan to show on first visit
const samplePlan: MealPlan = {
  week_start_date: new Date().toISOString(),
  meals: [
    { day: 'monday', meal_type: 'lunch', recipe_title: 'Mediterranean Chicken Bowl', main_protein: 'chicken', prep_time: 30 },
    { day: 'monday', meal_type: 'dinner', recipe_title: 'Beef & Bell Pepper Stir Fry', main_protein: 'beef', prep_time: 25 },
    { day: 'tuesday', meal_type: 'lunch', recipe_title: 'Leftover Stir Fry', main_protein: 'beef', prep_time: 5 },
    { day: 'tuesday', meal_type: 'dinner', recipe_title: 'Honey Garlic Chicken with Broccoli', main_protein: 'chicken', prep_time: 35 },
    { day: 'wednesday', meal_type: 'lunch', recipe_title: 'Chicken Salad Sandwich', main_protein: 'chicken', prep_time: 15 },
    { day: 'wednesday', meal_type: 'dinner', recipe_title: 'Sheet Pan Sausage & Veggies', main_protein: 'pork', prep_time: 40 },
    { day: 'thursday', meal_type: 'lunch', recipe_title: 'Leftover Sausage & Veggies', main_protein: 'pork', prep_time: 5 },
    { day: 'thursday', meal_type: 'dinner', recipe_title: 'Black Bean Burgers', main_protein: 'beans', prep_time: 30 },
    { day: 'friday', meal_type: 'lunch', recipe_title: 'Quinoa Salad with Black Beans', main_protein: 'beans', prep_time: 20 },
    { day: 'friday', meal_type: 'dinner', recipe_title: 'Pesto Shrimp Pasta', main_protein: 'shrimp', prep_time: 25 },
  ],
  available_proteins: ['chicken', 'beef', 'pork', 'beans', 'shrimp'],
  available_vegetables: ['broccoli', 'bell_peppers', 'onions', 'zucchini'],
  dietary_preferences: ['high_protein'],
  prep_sessions: [
    { 
      session_name: 'Sunday Prep', 
      duration_minutes: 120, 
      tasks: [
        'Chop vegetables for the week',
        'Marinate chicken',
        'Cook quinoa for salads',
        'Prepare salad dressings'
      ] 
    }
  ],
  evaluation_score: 8
};

interface WeeklyViewProps {
  onStartNewPlan?: () => void;
  onViewPrepPlan?: () => void;
}

export default function WeeklyView({ 
  onStartNewPlan, 
  onViewPrepPlan 
}: WeeklyViewProps) {
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMealPlans();
  }, []);

  const loadMealPlans = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to load meal plans
      // For now, we'll use the sample plan
      setCurrentPlan(samplePlan);
    } catch (error) {
      console.error("Error loading meal plans:", error);
      setCurrentPlan(samplePlan); // Show sample on error too
    }
    setIsLoading(false);
  };

  const handleRegeneratePlan = () => {
    onStartNewPlan?.();
  };

  const handleMealClick = (meal: Meal) => {
    console.log("Meal clicked:", meal);
    // TODO: Navigate to meal details or edit modal
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Loading your meal plans...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="weekly-meal-plan-heading">Weekly Meal Plan</h1>
            <p className="text-gray-600">Your current meal schedule and prep plan.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={onViewPrepPlan}
              className="bg-green-800 hover:bg-green-900 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <ClipboardList className="w-5 h-5" />
              See Prep Plan
            </button>
            <button 
              onClick={onStartNewPlan}
              className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Plan
            </button>
          </div>
        </div>

        {currentPlan && (
          <WeeklyCalendar 
            mealPlan={currentPlan}
            onRegeneratePlan={handleRegeneratePlan}
            onMealClick={handleMealClick}
          />
        )}
      </div>
    </div>
  );
}
