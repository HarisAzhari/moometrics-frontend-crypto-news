import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ImpactLegend = () => {
  const [isOpen, setIsOpen] = useState(false);

  const impactLevels = [
    {
      label: 'Strong inc',
      description: 'Strong potential for significant price increase',
      color: 'bg-green-500',
    },
    {
      label: 'Mod inc',
      description: 'Moderate upward price movement expected',
      color: 'bg-green-400',
    },
    {
      label: 'Slight inc',
      description: 'Small positive price impact likely',
      color: 'bg-green-300',
    },
    {
      label: 'Strong dec',
      description: 'Strong potential for significant price decrease',
      color: 'bg-red-500',
    },
    {
      label: 'Mod dec',
      description: 'Moderate downward price movement expected',
      color: 'bg-red-400',
    },
    {
      label: 'Slight dec',
      description: 'Small negative price impact likely',
      color: 'bg-red-300',
    },
    {
      label: 'Stable',
      description: 'Price expected to remain relatively unchanged',
      color: 'bg-blue-400',
    },
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Impact Guide
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Understanding Impact Labels</CardTitle>
                  <CardDescription className="mt-1">
                    Learn how to interpret news impact on different cryptocurrencies
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-3">
                  {impactLevels.map((impact) => (
                    <div
                      key={impact.label}
                      className="flex items-center gap-3"
                    >
                      <Badge
                        className={`${impact.color} text-white min-w-[100px] justify-center`}
                      >
                        {impact.label}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {impact.description}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-sm mb-2">How to use:</h4>
                  <p className="text-sm text-gray-600">
                    Each news article shows coin impact badges indicating the 
                    predicted market effect. The color and label indicate the 
                    direction and strength of the potential price impact based 
                    on the news content.
                  </p>
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