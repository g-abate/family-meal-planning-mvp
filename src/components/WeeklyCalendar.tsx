import { motion } from 'framer-motion';
import { Calendar, Clock, Users, RefreshCw, Utensils } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import type { MealPlan, Meal } from './WeeklyView';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DIETARY_COLORS = {
  vegetarian: "bg-green-100 text-green-800",
  vegan: "bg-green-100 text-green-800", 
  gluten_free: "bg-blue-100 text-blue-800",
  nut_free: "bg-yellow-100 text-yellow-800",
  dairy_free: "bg-purple-100 text-purple-800",
  keto: "bg-orange-100 text-orange-800",
  paleo: "bg-red-100 text-red-800",
  low_carb: "bg-indigo-100 text-indigo-800",
  high_protein: "bg-pink-100 text-pink-800",
  mediterranean: "bg-teal-100 text-teal-800"
};

export interface WeeklyCalendarProps {
  mealPlan: MealPlan;
  onRegeneratePlan: () => void;
  onMealClick: (meal: Meal) => void;
}

export default function WeeklyCalendar({ 
  mealPlan, 
  onRegeneratePlan, 
  onMealClick 
}: WeeklyCalendarProps) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  
  const getMealsForDay = (dayName: string) => {
    return mealPlan.meals?.filter(meal => 
      meal.day === dayName.toLowerCase()
    ) || [];
  };

  const getMealTypeDisplay = (mealType: string) => {
    const typeMap = {
      breakfast: { icon: "🌅", label: "Breakfast", color: "text-orange-600" },
      lunch: { icon: "🥙", label: "Lunch", color: "text-blue-600" },
      dinner: { icon: "🍽️", label: "Dinner", color: "text-purple-600" }
    };
    return typeMap[mealType as keyof typeof typeMap] || { icon: "🍴", label: mealType, color: "text-gray-600" };
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-green-700" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Week of {format(weekStart, 'MMMM d, yyyy')}
            </h2>
            <p className="text-gray-600">
              {mealPlan.meals?.length || 0} meals planned
            </p>
          </div>
        </div>
        
        <button
          onClick={onRegeneratePlan}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate Plan
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {DAYS.map((dayName, dayIndex) => {
          const dayMeals = getMealsForDay(dayName);
          const currentDate = addDays(weekStart, dayIndex);
          
          return (
            <motion.div
              key={dayName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: dayIndex * 0.1 }}
            >
              <div className="h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-0">
                <div className="p-4 border-b border-gray-100">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {dayName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {format(currentDate, 'MMM d')}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  {dayMeals.length > 0 ? (
                    dayMeals.map((meal, mealIndex) => {
                      const mealTypeInfo = getMealTypeDisplay(meal.meal_type);
                      
                      return (
                        <motion.div
                          key={mealIndex}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="cursor-pointer"
                          onClick={() => onMealClick?.(meal)}
                        >
                          <div className="border border-gray-100 hover:border-gray-200 transition-colors rounded-lg">
                            <div className="p-4">
                              <div className="flex items-start gap-2 mb-2">
                                <span className="text-lg">{mealTypeInfo.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-medium ${mealTypeInfo.color}`}>
                                    {mealTypeInfo.label}
                                  </p>
                                  <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                                    {meal.recipe_title}
                                  </h4>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                <Utensils className="w-3 h-3" />
                                <span className="capitalize">
                                  {meal.main_protein?.replace('_', ' ')}
                                </span>
                              </div>

                              {/* Prep time and dietary tags */}
                              <div className="flex flex-wrap gap-1">
                                {meal.prep_time && (
                                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                                    {meal.prep_time} min
                                  </span>
                                )}
                                {meal.dietary_tags?.map((tag, tagIndex) => (
                                  <span 
                                    key={tagIndex}
                                    className={`text-xs px-2 py-0.5 rounded ${
                                      DIETARY_COLORS[tag as keyof typeof DIETARY_COLORS] || 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {tag.replace('_', ' ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Utensils className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No meals planned</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md border-0">
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {new Set(mealPlan.meals?.map(m => m.main_protein)).size} Proteins
            </h3>
            <p className="text-sm text-gray-600">Varied protein sources</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border-0">
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {mealPlan.prep_sessions?.length || 0} Sessions
            </h3>
            <p className="text-sm text-gray-600">Prep sessions planned</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border-0">
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Utensils className="w-6 h-6 text-orange-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {mealPlan.dietary_preferences?.length || 0} Restrictions
            </h3>
            <p className="text-sm text-gray-600">Dietary needs met</p>
          </div>
        </div>
      </div>
    </div>
  );
}
