'use client'

import React from 'react';
import { Moon, Search, BarChart2, User } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';

const marketStats = [
  { label: "Cryptos", value: "989" },
  { label: "Exchanges", value: "187" },
  { label: "Market Cap", value: "$3.60T" },
  { label: "24h Vol", value: "$47.84B" },
  { label: "Dominance", value: "BTC 53.1% ETH 12.3%" },
];

export function NavigationBar() {
  return (
    <div className="w-full border-b">
      {/* Market Stats Bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-900 py-1 px-4">
        <div className="container mx-auto flex items-center justify-start gap-4 text-sm overflow-x-auto whitespace-nowrap">
          {marketStats.map((stat, index) => (
            <React.Fragment key={stat.label}>
              <span>
                <span className="text-gray-600">{stat.label}: </span>
                <span>{stat.value}</span>
              </span>
              {index < marketStats.length - 1 && <span className="text-gray-400">|</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">🐮 MooMetrics</span>
            </div>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink className="px-3 py-2 hover:text-blue-600" href="/">
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Crypto Data</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      <div className="grid gap-2">
                        <NavigationMenuLink href="/prices">Prices</NavigationMenuLink>
                        <NavigationMenuLink href="/charts">Charts</NavigationMenuLink>
                        <NavigationMenuLink href="/markets">Markets</NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Cryptocurrencies</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      <div className="grid gap-2">
                        <NavigationMenuLink href="/top-100">Top 100</NavigationMenuLink>
                        <NavigationMenuLink href="/gainers-losers">Gainers & Losers</NavigationMenuLink>
                        <NavigationMenuLink href="/trending">Trending</NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Exchanges</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      <div className="grid gap-2">
                        <NavigationMenuLink href="/spot">Spot</NavigationMenuLink>
                        <NavigationMenuLink href="/derivatives">Derivatives</NavigationMenuLink>
                        <NavigationMenuLink href="/dex">DEX</NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      <div className="grid gap-2">
                        <NavigationMenuLink href="/tutorials">Tutorials</NavigationMenuLink>
                        <NavigationMenuLink href="/guides">Guides</NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink className="px-3 py-2 hover:text-blue-600" href="/moozones">
                    MooZones 👑
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink className="px-3 py-2 hover:text-blue-600" href="/pricing">
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <BarChart2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Moon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Added grey line below the navigation */}
      <div className="border-t border-gray-300" />
    </div>
  );
} 