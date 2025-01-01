'use client'

import React from 'react';
import { PlayCircle, Calendar, Eye, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// Custom scrollbar styles
const scrollbarStyles = `
  .thin-scrollbar ::-webkit-scrollbar {
    width: 6px;
  }
  
  .thin-scrollbar ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .thin-scrollbar ::-webkit-scrollbar-thumb {
    background-color: #E5E7EB;
    border-radius: 3px;
  }
  
  .thin-scrollbar ::-webkit-scrollbar-thumb:hover {
    background-color: #D1D5DB;
  }
`;

// Complete channel list matching exact format from API
const CHANNEL_LIST = [
  { id: '@CoinBureau', name: 'Coin Bureau' },
  { id: '@MeetKevin', name: 'Meet Kevin' },
  { id: '@Brian Jung', name: 'Brian Jung' },
  { id: '@AltcoinDaily', name: 'Altcoin Daily' },
  { id: '@CryptosRUs', name: 'CryptosRUs' },
  { id: '@elliotrades_official', name: 'EllioTrades' },
  { id: '@DataDash', name: 'DataDash' },
  { id: '@IvanOnTech', name: 'Ivan on Tech' },
  { id: '@TheCryptoLark', name: 'Lark Davis' },
  { id: '@CryptoCasey', name: 'Crypto Casey' },
  { id: '@AnthonyPompliano', name: 'Anthony Pompliano' },
  { id: '@alessiorastani', name: 'Alessio Rastani' },
  { id: '@CryptoCapitalVenture', name: 'Crypto Capital Venture' },
  { id: '@aantonop', name: 'aantonop' },
  { id: '@Boxmining', name: 'Boxmining' },
  { id: '@CryptoZombie', name: 'Crypto Zombie' },
  { id: '@tonevays', name: 'Tone Vays' },
  { id: '@ScottMelker', name: 'Scott Melker' },
  { id: '@CTOLARSSON', name: 'CTO LARSSON' },
  { id: '@Bankless', name: 'Bankless' },
  { id: '@gemgemcrypto', name: 'GemGemCrypto' }
];

interface Analysis {
  coin_mentioned: string;
  indicator: string;
  reason: string[];
}

interface Video {
  id: number;
  title: string;
  thumbnail_url: string;
  url: string;
  published_at: string;
  analyses: Analysis[];
  channel_name: string;
  channel_id: string;
  views: string;
}

interface ApiResponse {
  data: {
    total_videos: number;
    videos: Video[];
  };
}

const YouTubeDashboard = () => {
  const [data, setData] = React.useState<ApiResponse | null>(null);
  const [selectedChannel, setSelectedChannel] = React.useState<string>('');
  const [selectedVideo, setSelectedVideo] = React.useState<Video | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [channelCounts, setChannelCounts] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/youtube/get');
        const result = await response.json();
        setData(result);
        if (result.data.videos.length > 0) {
          setSelectedChannel(result.data.videos[0].channel_name);
          setSelectedVideo(result.data.videos[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if (data) {
      updateChannelCounts(data.data.videos);
    }
  }, [selectedDate, data]);

  const updateChannelCounts = (videos: Video[]) => {
    const filteredVideos = videos.filter(video => {
      const videoDate = new Date(video.published_at);
      return videoDate.toDateString() === selectedDate.toDateString();
    });

    // Initialize counts with 0
    const counts: Record<string, number> = {};
    CHANNEL_LIST.forEach(channel => {
      counts[channel.name] = 0;
    });

    // Update counts based on videos
    filteredVideos.forEach(video => {
      // Find the matching channel (case-insensitive comparison)
      const channelEntry = CHANNEL_LIST.find(
        ch => ch.name.toLowerCase() === video.channel_name.toLowerCase()
      );
      
      if (channelEntry) {
        counts[channelEntry.name] = (counts[channelEntry.name] || 0) + 1;
      }
    });

    setChannelCounts(counts);
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!data) return null;

  const filteredVideos = data.data.videos.filter(video => {
    const videoDate = new Date(video.published_at);
    return videoDate.toDateString() === selectedDate.toDateString();
  });

  const selectedChannelVideos = filteredVideos.filter(video => 
    video.channel_name.toLowerCase() === selectedChannel.toLowerCase()
  );

  // Aggregate all coins mentioned on the selected date
  const aggregatedCoins = filteredVideos.flatMap(video => video.analyses)
    .reduce((acc: Record<string, { indicators: Set<string>, reasons: string[] }>, analysis) => {
      if (!acc[analysis.coin_mentioned]) {
        acc[analysis.coin_mentioned] = {
          indicators: new Set([analysis.indicator]),
          reasons: analysis.reason
        };
      } else {
        analysis.reason.forEach(reason => {
          if (!acc[analysis.coin_mentioned].reasons.includes(reason)) {
            acc[analysis.coin_mentioned].reasons.push(reason);
          }
        });
        acc[analysis.coin_mentioned].indicators.add(analysis.indicator);
      }
      return acc;
    }, {});

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="flex h-screen bg-white thin-scrollbar">
        {/* Left Panel - Channels */}
        <div className="w-80 min-w-80 border-r">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-3">Channels</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal mb-4">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <ScrollArea className="h-[calc(100vh-140px)]">
              {CHANNEL_LIST.map(({ id, name }) => {
                const hasUploads = channelCounts[name] > 0;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setSelectedChannel(name);
                      const firstVideo = selectedChannelVideos.find(v => 
                        v.channel_name.toLowerCase() === name.toLowerCase()
                      );
                      if (firstVideo) setSelectedVideo(firstVideo);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${
                      selectedChannel === name 
                        ? 'bg-blue-100 text-blue-900' 
                        : hasUploads
                        ? 'bg-white text-gray-900 hover:bg-gray-50'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium truncate flex-1 mr-2 ${
                        hasUploads ? 'text-gray-900' : 'text-gray-400'
                      }`}>@{name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                        hasUploads 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>{channelCounts[name] || 0}</span>
                    </div>
                  </button>
                );
              })}
            </ScrollArea>
          </div>
        </div>

        {/* Middle Panel - Videos */}
        <div className="flex-1 border-r min-w-0">
          <ScrollArea className="h-screen">
            <div className="p-6">
              {selectedChannel && channelCounts[selectedChannel] === 0 ? (
                <div className="flex flex-col items-center justify-center h-[80vh] text-center">
                  <div className="w-16 h-16 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">No Videos Today</h3>
                  <p className="text-gray-500 text-lg">@{selectedChannel} hasn't uploaded any videos on {format(selectedDate, "MMMM d, yyyy")}</p>
                </div>
              ) : (
                selectedChannelVideos.map((video, i) => (
                  <div 
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`cursor-pointer ${i > 0 ? 'mt-8' : ''}`}
                  >
                    {/* Video Section */}
                    <div className="flex gap-4 mb-4">
                      <div className="relative w-48 h-28 flex-shrink-0">
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        />
                        <a 
                          href={video.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg"
                        >
                          <PlayCircle className="w-12 h-12 text-white" />
                        </a>
                      </div>
                      <div>
                        <h2 className="text-base font-medium mb-2 line-clamp-2">{video.title}</h2>
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {video.channel_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {video.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(video.published_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Coin Analysis Section */}
                    <div className="pl-2">
                      {video.analyses.map((analysis, index) => (
                        <div key={index} className="mb-4 border-l-2 border-gray-100 pl-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm">{analysis.coin_mentioned}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-sm ${
                              analysis.indicator.toLowerCase().includes('bullish')
                                ? 'bg-green-100 text-green-700'
                                : analysis.indicator.toLowerCase().includes('neutral')
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {analysis.indicator}
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {analysis.reason.map((reason, reasonIdx) => (
                              <p key={reasonIdx} className="text-sm text-gray-600 leading-relaxed">
                                {reason}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Aggregated Coins */}
        <div className="w-80 min-w-80">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-3">All Mentioned Coins</h2>
            <div className="text-sm text-gray-500 mb-4">
              {format(selectedDate, "MMMM d, yyyy")}
            </div>
            <ScrollArea className="h-[calc(100vh-130px)]">
              {Object.entries(aggregatedCoins).map(([coin, data], index) => {
                const sentimentCounts = Array.from(data.indicators).reduce((acc: {bullish: number, neutral: number, bearish: number}, indicator) => {
                  const sentiment = indicator.toLowerCase();
                  if (sentiment.includes('bullish')) acc.bullish++;
                  else if (sentiment.includes('neutral')) acc.neutral++;
                  else if (sentiment.includes('bearish')) acc.bearish++;
                  return acc;
                }, { bullish: 0, neutral: 0, bearish: 0 });

                return (
                  <div key={index} className="py-2.5 border-b last:border-b-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{coin}</span>
                      <div className="flex gap-1.5">
                        {sentimentCounts.bullish > 0 && (
                          <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-medium">
                            {sentimentCounts.bullish}
                          </div>
                        )}
                        {sentimentCounts.neutral > 0 && (
                          <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-medium">
                            {sentimentCounts.neutral}
                          </div>
                        )}
                        {sentimentCounts.bearish > 0 && (
                          <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm font-medium">
                            {sentimentCounts.bearish}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
};

export default YouTubeDashboard;