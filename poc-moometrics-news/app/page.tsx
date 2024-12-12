// CryptoNewsDashboard.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, ChevronUp, HelpCircle, X, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NavigationBar } from './NavigationBar';
import BlurFade from '@/components/ui/blur-fade';



// Define interfaces for the data structure
interface CoinAnalysis {
  coin: string;
  market_impact: string;
}

interface NewsItem {
  coin_analysis: {
    [key: string]: CoinAnalysis;
  };
  date: string;
  source: string;
  summary: string;
  title: string;
  url: string;
  image_url: string;
}

interface ApiResponse {
  data: NewsItem[];
  status: string;
}

type TimeFilter = 'all' | '1d' | '7d' | '30d';



// Impact Legend Component
const ImpactLegend = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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

  if (!isOpen) return null;

  return (
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
              onClick={onClose}
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
  );
};

// Main Dashboard Component
const CryptoNewsDashboard = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const calculateDelay = (index: number) => {
    // Calculate the column position (0, 1, or 2) based on screen size
    const columnCount = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    const column = index % columnCount;
    const row = Math.floor(index / columnCount);
    
    // Base delay starts at 0.1s
    const baseDelay = 0.3;
    // Add more delay for items further to the right
    const columnDelay = column * 0.2;
    // Add a smaller delay for each row
    const rowDelay = row * 0.1;
    
    return baseDelay + columnDelay + rowDelay;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/crypto/summary');
        const data: ApiResponse = await response.json();
        if (data.status === 'success') {
          setNews(data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const formatCoinLabel = (coin: string) => {
    return coin.toUpperCase();
  };

  const formatImpactText = (impact: string) => {
    const impactMap: { [key: string]: string } = {
      'strongly increase': 'Strong inc',
      'moderately increase': 'Mod inc',
      'slightly increase': 'Slight inc',
      'strongly decrease': 'Strong dec',
      'moderately decrease': 'Mod dec',
      'slightly decrease': 'Slight dec',
      'moderately stable': 'Stable',
      'slightly stable': 'Stable'
    };
    return impactMap[impact.toLowerCase()] || impact;
  };

  const getImpactColor = (impact: string) => {
    const impacts: { [key: string]: string } = {
      'strongly increase': 'bg-green-500',
      'moderately increase': 'bg-green-400',
      'slightly increase': 'bg-green-300',
      'strongly decrease': 'bg-red-500',
      'moderately decrease': 'bg-red-400',
      'slightly decrease': 'bg-red-300',
      'moderately stable': 'bg-blue-400',
      'slightly stable': 'bg-blue-300'
    };
    return impacts[impact.toLowerCase()] || 'bg-gray-400';
  };

  const isWithinTimeFrame = (dateString: string, filter: TimeFilter) => {
    if (filter === 'all') return true;

    const articleDate = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - articleDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    switch (filter) {
      case '1d':
        return diffDays <= 1;
      case '7d':
        return diffDays <= 7;
      case '30d':
        return diffDays <= 30;
      default:
        return true;
    }
  };

  const filteredNews = news.filter(item =>
    (searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.keys(item.coin_analysis || {}).some(coin => 
        coin.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) && isWithinTimeFrame(item.date, timeFilter)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-white w-full">
        {/* Absolute positioned container for the dot pattern */}
        <div className="fixed inset-0 pointer-events-none">
          <DotPattern className="opacity-30 w-full h-full"/>
        </div>
        
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">MooMetrics News</h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                AI-powered crypto news aggregator that scrapes and analyzes the latest cryptocurrency news, providing instant summaries and market impact predictions.
              </p>
              
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 -translate-y-1/2" />
                  <Input
                    className="pl-10"
                    placeholder="Search news, coins, or summaries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { label: 'All', value: 'all' },
                    { label: '24h', value: '1d' },
                    { label: '7 days', value: '7d' },
                    { label: '30 days', value: '30d' },
                  ].map((filter) => (
                    <Button
                      key={filter.value}
                      variant={timeFilter === filter.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTimeFilter(filter.value as TimeFilter)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLegendOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Guide
                  </Button>
                </div>
  
                <div className="text-sm text-gray-500">
                  Showing {filteredNews.length} results
                </div>
              </div>
            </div>

  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {filteredNews.map((item, index) => (
                <BlurFade 
                key={index} 
                delay={calculateDelay(index)}
              >
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg">
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="hover:text-blue-600 transition-colors"
                            >
                              {truncateText(item.title, 80)}
                            </a>
                          </CardTitle>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-blue-600 transition-colors ml-2 flex-shrink-0"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Read full article</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>{item.source}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                      {item.image_url && (
                        <img 
                          src={item.image_url} 
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="relative">
                      <p className={`text-gray-600 mb-4 ${!expandedItems.has(index) && 'line-clamp-3'}`}>
                        {item.summary}
                      </p>
                      {item.summary.length > 150 && (
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800 p-0 h-auto font-medium flex items-center gap-1"
                            onClick={() => toggleExpand(index)}
                          >
                            {expandedItems.has(index) ? (
                              <>
                                <ChevronUp className="h-4 w-4" />
                                Show less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4" />
                                Read more
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {item.coin_analysis && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Coin Impact:</h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(item.coin_analysis).map(([coin, analysis]) => (
                            <Badge 
                              key={coin}
                              className={`${getImpactColor(analysis.market_impact)} text-white min-w-[120px] justify-center px-3 py-1 h-7 text-sm font-medium`}
                            >
                              <span className="font-bold mr-1">{formatCoinLabel(coin)}:</span>
                              <span className="whitespace-nowrap">
                                {formatImpactText(analysis.market_impact)}
                              </span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
  
        <ImpactLegend 
          isOpen={isLegendOpen}
          onClose={() => setIsLegendOpen(false)}
        />
      </div>
    </>
  );
};


export default CryptoNewsDashboard;