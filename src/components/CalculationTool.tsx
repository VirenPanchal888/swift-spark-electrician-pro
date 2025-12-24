import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { MaterialUsage } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatRupees } from '@/lib/formatters';

const COLORS = [
  'hsl(201, 100%, 36%)',  // Primary blue
  'hsl(195, 100%, 42%)',  // Light blue
  'hsl(43, 100%, 50%)',   // Gold/Accent
  'hsl(220, 90%, 56%)',   // Indigo
  'hsl(280, 65%, 60%)',   // Purple
  'hsl(340, 75%, 55%)',   // Pink
  'hsl(160, 60%, 45%)',   // Teal
  'hsl(25, 95%, 53%)',    // Orange
];

const CalculationTool = () => {
  const { transactions, calculateTotalCost, calculateMaterialUsage } = useStore();
  const [materialUsage, setMaterialUsage] = useState<MaterialUsage[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setTotalCost(calculateTotalCost());
    setMaterialUsage(calculateMaterialUsage());
  }, [transactions, calculateTotalCost, calculateMaterialUsage]);

  // Create data for pie chart with percentages
  const pieData = materialUsage.map((item, index) => ({
    name: item.materialName,
    value: item.totalCost,
    quantity: item.totalQuantity,
    percentage: totalCost > 0 ? ((item.totalCost / totalCost) * 100).toFixed(1) : 0,
    color: COLORS[index % COLORS.length],
  }));

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, name }: any) => {
    if (percentage < 5) return null; // Don't show label for small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-semibold drop-shadow-md"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        {`${percentage}%`}
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 backdrop-blur-sm">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Cost: <span className="font-medium text-foreground">{formatRupees(data.value)}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Qty: <span className="font-medium text-foreground">{data.quantity.toFixed(2)}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Share: <span className="font-medium text-foreground">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4 px-2">
        {payload?.map((entry: any, index: number) => (
          <div
            key={`legend-${index}`}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-all cursor-pointer ${
              activeIndex === index ? 'bg-muted scale-105' : 'hover:bg-muted/50'
            }`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-foreground truncate max-w-[80px] sm:max-w-[120px]">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="data-card rounded-lg">
          <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
            <CardTitle className="text-muted-foreground text-xs sm:text-sm font-normal">Total Spent</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-primary truncate">
              {formatRupees(totalCost)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="data-card rounded-lg">
          <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
            <CardTitle className="text-muted-foreground text-xs sm:text-sm font-normal">Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-primary">
              {transactions.length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="data-card rounded-lg">
          <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
            <CardTitle className="text-muted-foreground text-xs sm:text-sm font-normal">Materials</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-primary">
              {materialUsage.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Pie Chart */}
      <Card className="data-card rounded-lg overflow-hidden">
        <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
          <CardTitle className="text-lg sm:text-xl">Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          {pieData.length > 0 ? (
            <div className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <defs>
                    {COLORS.map((color, index) => (
                      <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={1} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                      </linearGradient>
                    ))}
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                    </filter>
                  </defs>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                    filter="url(#shadow)"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#gradient-${index % COLORS.length})`}
                        style={{
                          transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                          transformOrigin: 'center',
                          transition: 'transform 0.2s ease-out',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center total */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style={{ marginTop: '-24px' }}>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-sm sm:text-base font-bold text-foreground">{formatRupees(totalCost)}</p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>No transaction data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Material Usage Breakdown - Mobile Optimized */}
      <Card className="data-card rounded-lg overflow-hidden">
        <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
          <CardTitle className="text-lg sm:text-xl">Material Usage Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-4">
          {materialUsage.length > 0 ? (
            <div className="divide-y divide-border">
              {materialUsage.map((material, index) => (
                <div 
                  key={index} 
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium text-foreground text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">
                        {material.materialName}
                      </span>
                    </div>
                    <span className="font-bold text-primary text-sm sm:text-base">
                      {formatRupees(material.totalCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm text-muted-foreground pl-5">
                    <span>Qty: {material.totalQuantity.toFixed(2)}</span>
                    <span>Avg: {formatRupees(material.averageCost)}/unit</span>
                  </div>
                  {/* Progress bar showing proportion of total */}
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden ml-5">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${totalCost > 0 ? (material.totalCost / totalCost) * 100 : 0}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p>No materials recorded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculationTool;
