// app/api/breach-details/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const breachName = searchParams.get('name');
  
  if (!breachName) {
    return NextResponse.json(
      { error: 'Breach name is required' },
      { status: 400 }
    );
  }
  
  try {
    const headers = {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-US,en;q=0.9,id;q=0.8',
      'dnt': '1',
      'priority': 'u=0, i',
      'referer': 'https://periksadata.com/',
      'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    };

    const response = await fetch(`https://periksadata.com/breach/${breachName}`, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data for breach: ${breachName}`);
    }
    
    const htmlContent = await response.text();
    
    // Extract data from HTML response
    const breachData = parseBreachDetails(htmlContent, breachName);
    
    return NextResponse.json({ breach: breachData });
  } catch (error) {
    console.error('Error fetching breach details:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

function parseBreachDetails(html, breachName) {
  // Helper function to extract content between tags
  const extractContent = (startTag, endTag) => {
    const startIndex = html.indexOf(startTag);
    if (startIndex === -1) return '';
    
    const contentStart = startIndex + startTag.length;
    const contentEnd = html.indexOf(endTag, contentStart);
    if (contentEnd === -1) return '';
    
    return html.substring(contentStart, contentEnd).trim();
  };

  // Extract logo URL
  let logoUrl = '';
  const logoMatch = html.match(/<img src="([^"]+)" width="100" alt="">/);
  if (logoMatch && logoMatch[1]) {
    logoUrl = logoMatch[1];
  }

  // Extract website
  let website = '';
  const websiteMatch = html.match(/<a class="btn[^"]*" href="([^"]+)"><span[^>]*>([^<]+)<\/span><\/a>/);
  if (websiteMatch && websiteMatch[1]) {
    website = websiteMatch[1];
  }

  // Extract description
  let description = '';
  const descStart = '<p class="lead">';
  const descEnd = '<br><br><small>DATA YANG BOCOR</small>';
  description = extractContent(descStart, descEnd);

  // Extract compromised data types
  let dataTypes = [];
  const dataTypesSection = html.match(/<span class="label label--inline text-center rounded">([^<]+)<\/span>/g);
  if (dataTypesSection) {
    dataTypes = dataTypesSection.map(item => {
      const match = item.match(/>([^<]+)</);
      return match ? match[1] : '';
    }).filter(Boolean);
  }

  // Extract last update date
  let lastUpdate = '';
  const lastUpdateStart = '<p class="lead"><br><small>UPDATE TERAKHIR</small></p>';
  const lastUpdateEnd = '</div>';
  lastUpdate = extractContent(lastUpdateStart, lastUpdateEnd);

  return {
    name: breachName,
    logoUrl,
    website,
    description,
    dataTypes,
    lastUpdate,
    rawHtml: html // Include raw HTML for debugging
  };
}