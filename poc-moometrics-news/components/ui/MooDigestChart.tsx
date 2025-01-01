'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { useMediaQuery } from 'react-responsive';
import { useQuery } from '@tanstack/react-query';
import ImpactLegend from './ImpactLegend';

interface MooDigestChartProps {
  selectedCoin: string;
}

const availableCoins = [
  { value: "BTC", label: "Bitcoin" },
  { value: "ETH", label: "Ethereum" },
  { value: "SOL", label: "Solana" },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: any[], label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg">
        <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1">
            <p className="text-sm font-medium">{label}</p>
          </div>
        </div>
        <div className="p-3 space-y-3">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium">{entry.name}</span>
              </div>
              <span className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const fetchNewsData = async (coin: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_MOOMETRICS_NEWS_BACKEND_URL}/crypto/${coin}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();

  return Object.entries(data.data.data).map(([date, dateData]: [string, any]) => ({
    date,
    moderatelyDecrease: (dateData.market_impact['moderately decrease'] || 0) + (dateData.market_impact['moderately_decrease'] || 0),
    moderatelyIncrease: (dateData.market_impact['moderately increase'] || 0) + (dateData.market_impact['moderately_increase'] || 0),
    moderatelyStable: (dateData.market_impact['moderately stable'] || 0) + (dateData.market_impact['moderately_stable'] || 0),
    slightlyDecrease: (dateData.market_impact['slightly decrease'] || 0) + (dateData.market_impact['slightly_decrease'] || 0),
    slightlyIncrease: (dateData.market_impact['slightly increase'] || 0) + (dateData.market_impact['slightly_increase'] || 0),
    slightlyStable: (dateData.market_impact['slightly stable'] || 0) + (dateData.market_impact['slightly_stable'] || 0),
    stronglyIncrease: (dateData.market_impact['strongly increase'] || 0) + (dateData.market_impact['strongly_increase'] || 0),
  }));
};

const MooDigestChart: React.FC<MooDigestChartProps> = ({ selectedCoin: initialCoin }) => {
  const [selectedCoin, setSelectedCoin] = useState(initialCoin);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 768;

  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ['newsData', selectedCoin],
    queryFn: () => fetchNewsData(selectedCoin),
    enabled: !!selectedCoin,
  });

  if (isLoading) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading data...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-red-500">Error loading data. Please try again later.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-xl">Sentiment Analysis</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLegendOpen(true)}
            className="flex items-center gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            Impact Guide
          </Button>
          <Select value={selectedCoin} onValueChange={setSelectedCoin}>
            <SelectTrigger className="w-[120px] bg-background dark:bg-transparent border-input dark:border-gray-700 dark:text-white">
              <SelectValue placeholder="Select coin" />
            </SelectTrigger>
            <SelectContent>
              {availableCoins.map((coin) => (
                <SelectItem key={coin.value} value={coin.value}>
                  {coin.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] md:h-[300px] w-full pt-10 md:pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ 
                top: windowWidth < 768 ? 60 : 50, 
                right: 30, 
                left: 0, 
                bottom: 5 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), 'dd MMM')}
                fontSize={11}
                stroke="#9ca3af"
                tickLine={true}
                axisLine={true}
                interval={'preserveStartEnd'}
                minTickGap={40}
                hide={windowWidth < 768}
              />
              <YAxis
                fontSize={11}
                stroke="#9ca3af"
                tickLine={true}
                axisLine={true}
                hide={windowWidth < 768}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="moderatelyDecrease" name="Moderately Decrease" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="moderatelyIncrease" name="Moderately Increase" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="moderatelyStable" name="Moderately Stable" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="slightlyDecrease" name="Slightly Decrease" stroke="#fca5a5" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="slightlyIncrease" name="Slightly Increase" stroke="#86efac" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="slightlyStable" name="Slightly Stable" stroke="#93c5fd" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="stronglyIncrease" name="Strongly Increase" stroke="#166534" strokeWidth={2} dot={false} />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{
                  top: windowWidth < 768 ? -20 : 10,
                  left: 0,
                  width: '100%'
                }}
                content={({ payload }) => (
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-2 mb-4 md:mb-0">
                    {payload?.map((entry) => (
                      <div key={entry.value} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-0.5"
                          style={{ backgroundColor: entry.color }} 
                        />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <ImpactLegend 
        isOpen={isLegendOpen}
        onClose={() => setIsLegendOpen(false)}
      />
    </Card>
  );
};

export default MooDigestChart;