// File: app/api/check-breach/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Configure the request similar to the Python code
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'DNT': '1',
      'Origin': 'https://periksadata.com',
      'Referer': 'https://periksadata.com/',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
      'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
    };

    // Convert email to form data format
    const formData = new URLSearchParams();
    formData.append('email', email);

    // Make the request
    const response = await axios.post(
      'https://periksadata.com/',
      formData.toString(),
      { headers }
    );

    // Parse the HTML content using cheerio (similar to BeautifulSoup)
    const $ = cheerio.load(response.data);
    
    // Find all breach sections (the div with class "feature feature-5...")
    const breachSections = $('.feature.feature-5.boxed.boxed--lg.boxed--border.feature--featured');
    
    // Extract breach data
    const breachData = [];
    
    breachSections.each((index, element) => {
      // Get breach name
      const name = $(element).find('h5').text().trim();
      
      // Get image URL
      const imgTag = $(element).find('img');
      const imgUrl = imgTag.attr('src') || null;
      const imgAlt = imgTag.attr('alt') || '';
      
      // Get breach details
      const detailsText = $(element).find('.feature__body p').text().trim();
      
      // Parse the details
      const detailItems = {};
      
      // Get all small tags and b tags to extract key-value pairs
      const smallTags = $(element).find('.feature__body p small');
      const bTags = $(element).find('.feature__body p b');
      
      smallTags.each((i, smallTag) => {
        const key = $(smallTag).text().trim();
        const value = i < bTags.length ? $(bTags[i]).text().trim() : "";
        detailItems[key] = value;
      });
      
      // Add link
      const linkTag = $(element).find('a');
      const link = linkTag.attr('href') || null;
      
      // Create breach entry
      const breachEntry = {
        name,
        image_url: imgUrl,
        image_alt: imgAlt,
        details: detailItems,
        link
      };
      
      breachData.push(breachEntry);
    });
    
    return NextResponse.json({ breachData });
    
  } catch (error) {
    console.error('Error checking data breach:', error);
    return NextResponse.json(
      { error: "Failed to check data breach" },
      { status: 500 }
    );
  }
}