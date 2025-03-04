// app/breach/[name]/page.jsx
"use client";

import { useState, useEffect, use } from 'react';
import { ArrowLeft, ExternalLink, AlertCircle, Calendar, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function BreachDetailsPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const [breachDetails, setBreachDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to format breach name by removing parentheses and spaces
  const formatBreachName = (name) => {
    return name.replace(/\s*\([^)]*\)\s*/g, "");
  };

  // Get the original breach name from params
  const breachName = unwrappedParams.name;
  // Format the breach name for API requests
  const formattedBreachName = formatBreachName(breachName);

  useEffect(() => {
    async function fetchBreachDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/breach-details?name=${formattedBreachName}`);
        
        if (!response.ok) {
          throw new Error('Gagal memuat data kebocoran');
        }
        
        const data = await response.json();
        setBreachDetails(data.breach);
      } catch (err) {
        console.error('Error fetching breach details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (breachName) {
      fetchBreachDetails();
    }
  }, [breachName, formattedBreachName]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-12 w-12 animate-spin text-green-600 dark:text-green-500 mb-4" />
        <h2 className="text-xl font-semibold">Memuat detail kebocoran...</h2>
      </div>
    );
  }

  if (error || !breachDetails) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <Button 
          variant="outline" 
          onClick={handleBack} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        
        <Card className="border-t-4 border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6 flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Terjadi Kesalahan</h2>
            <p className="text-center">{error || 'Tidak dapat memuat detail kebocoran. Silakan coba lagi nanti.'}</p>
            <Button 
              onClick={handleBack} 
              className="mt-6 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            >
              Kembali ke Pencarian
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Button 
        variant="outline" 
        onClick={handleBack} 
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali
      </Button>
      
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-green-600 dark:bg-green-700 p-8 flex flex-col items-center text-white">
          {breachDetails.logoUrl && (
            <div className="w-24 h-24 bg-white rounded-lg p-2 mb-4 flex items-center justify-center">
              <img 
                src={breachDetails.logoUrl} 
                alt={`${breachName} logo`} 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.src = `/api/placeholder/96/96`;
                  e.target.alt = "Placeholder";
                }}
              />
            </div>
          )}
          <h1 className="text-3xl font-bold mb-2">{breachName}</h1>
          {breachDetails.website && (
            <a 
              href={breachDetails.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-white hover:underline"
            >
              {breachDetails.website.replace(/^https?:\/\//, '')}
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          )}
        </div>
        
        {/* Main Content */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">PENJELASAN SINGKAT</h2>
            <p className="text-gray-700 dark:text-gray-300">{breachDetails.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">DATA YANG BOCOR</h3>
            <div className="flex flex-wrap gap-2">
              {breachDetails.dataTypes.map((type, index) => (
                <Badge 
                  key={index}
                  className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 py-1"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t pt-4 mt-4 dark:border-gray-700">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">UPDATE TERAKHIR:</span> {breachDetails.lastUpdate}
              </span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600 dark:text-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">periksadata.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}