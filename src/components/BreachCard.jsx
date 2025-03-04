"use client";

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertTriangle, Calendar, Users, Lock, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function BreachCard({ breach }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLearnMore = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Extract breach name from link or use the breach.name
    const breachName = breach.name || 
                      (breach.link ? breach.link.split('/').pop() : '');
    
    // Navigate to the local breach details page
    router.push(`/breach/${breachName}`);
  };

  return (
    <Card className="overflow-hidden border-t-4 border-green-600 dark:border-green-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {breach.image_url && (
              <div className="w-12 h-12 rounded-md bg-gray-100 dark:bg-gray-800 p-2 flex items-center justify-center">
                <img
                  src={breach.image_url}
                  alt={breach.image_alt || breach.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.target.src = `/api/placeholder/48/48`;
                    e.target.alt = "Placeholder";
                  }}
                />
              </div>
            )}
            <div>
              <CardTitle className="text-xl">{breach.name}</CardTitle>
              <CardDescription>Kebocoran Data</CardDescription>
            </div>
          </div>
          <Badge variant="destructive" className="ml-auto bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Terkompromi
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {breach.details && Object.entries(breach.details).map(([key, value], idx) => {
            // Translate keys to Indonesian
            let translatedKey = key;
            if (key.includes("Breached")) {
              translatedKey = key.replace("Breached", "Dibocorkan");
            } else if (key.includes("Affected")) {
              translatedKey = key.replace("Affected", "Terpengaruh");
            } else if (key.includes("Compromised")) {
              translatedKey = key.replace("Compromised", "Terkompromikan");
            }
            
            return (
              <div key={idx} className="flex items-start gap-2">
                {key.includes("Breached") ? (
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                ) : key.includes("Affected") ? (
                  <Users className="h-4 w-4 mt-1 text-muted-foreground" />
                ) : (
                  <Lock className="h-4 w-4 mt-1 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">{translatedKey.replace(":", "")}</p>
                  <p className="font-medium">{value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLearnMore}
          disabled={isLoading}
          className="text-green-600 border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-500 dark:hover:bg-green-900/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memuat
            </>
          ) : (
            <>
              Pelajari Lebih Lanjut <ExternalLink className="h-3 w-3 ml-1" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}