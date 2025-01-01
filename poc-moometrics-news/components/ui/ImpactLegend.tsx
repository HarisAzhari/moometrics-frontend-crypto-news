import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ImpactLegendProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ImpactLegend: React.FC<ImpactLegendProps> = ({ isOpen, onToggle }) => {
  const impactLevels = [
    {
      label: 'Strong inc',
      description: 'Strong potential for significant price increase',
      score: '+3',
      color: 'bg-green-500',
      icon: TrendingUp
    },
    {
      label: 'Mod inc',
      description: 'Moderate upward price movement expected',
      score: '+2',
      color: 'bg-green-400',
      icon: TrendingUp
    },
    {
      label: 'Slight inc',
      description: 'Small positive price impact likely',
      score: '+1',
      color: 'bg-green-300',
      icon: TrendingUp
    },
    {
      label: 'Stable',
      description: 'Price expected to remain relatively unchanged',
      score: '0',
      color: 'bg-blue-400',
      icon: Minus
    },
    {
      label: 'Slight dec',
      description: 'Small negative price impact likely',
      score: '-1',
      color: 'bg-red-300',
      icon: TrendingDown
    },
    {
      label: 'Mod dec',
      description: 'Moderate downward price movement expected',
      score: '-2',
      color: 'bg-red-400',
      icon: TrendingDown
    },
    {
      label: 'Strong dec',
      description: 'Strong potential for significant price decrease',
      score: '-3',
      color: 'bg-red-500',
      icon: TrendingDown
    },
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
        onClick={onToggle}
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Impact Guide
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full dark:bg-gray-900">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Market Impact Scoring Guide</CardTitle>
                  <CardDescription className="mt-1">
                    Understanding market impact scores and indicators
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-3">
                  {impactLevels.map((impact) => (
                    <div
                      key={impact.label}
                      className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Badge
                        className={`${impact.color} text-white min-w-[100px] justify-center`}
                      >
                        {impact.label}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {impact.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 min-w-[60px]">
                        <impact.icon className="h-4 w-4 text-gray-500" />
                        <span className="font-mono font-medium">
                          {impact.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm">Sentiment Calculation:</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      • <span className="text-green-500 font-medium">Bullish</span>: Average daily score {'>'} 1
                    </p>
                    <p>
                      • <span className="text-blue-500 font-medium">Neutral</span>: Average daily score between -1 and 1
                    </p>
                    <p>
                      • <span className="text-red-500 font-medium">Bearish</span>: Average daily score {'<'} -1
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ImpactLegend;