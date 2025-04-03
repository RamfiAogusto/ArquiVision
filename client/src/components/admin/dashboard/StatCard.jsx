import React from 'react';
import { Card, CardContent } from '../../ui/card';

export default function StatCard({ title, value, icon, className = '', loading = false }) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline mt-1">
              <h3 className="text-3xl font-bold">
                {loading ? (
                  <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
                ) : (
                  value
                )}
              </h3>
            </div>
          </div>
          {icon && (
            <div className="bg-primary/10 p-3 rounded-full">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 