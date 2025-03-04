// File: app/api/check-breach/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Inisialisasi rate limiter
const rateLimiter = new RateLimiterMemory({
  points: 5, // Maksimum 5 request
  duration: 3600, // Dalam 1 jam (3600 detik)
});

export async function POST(request) {
  try {
    // Dapatkan IP client
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown-ip';

    // Periksa rate limit
    try {
      await rateLimiter.consume(clientIp);
    } catch (rateLimiterError) {
      return NextResponse.json(
        { 
          error: "Too many requests. Limit: 5 requests per hour",
          retryAfter: rateLimiterError.msBeforeNext / 1000 // Dalam detik
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

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

    const formData = new URLSearchParams();
    formData.append('email', email);

    const response = await axios.post(
      'https://periksadata.com/',
      formData.toString(),
      { headers }
    );

    const $ = cheerio.load(response.data);
    const breachSections = $('.feature.feature-5.boxed.boxed--lg.boxed--border.feature--featured');
    
    const breachData = [];
    
    breachSections.each((index, element) => {
      const name = $(element).find('h5').text().trim();
      const imgTag = $(element).find('img');
      const imgUrl = imgTag.attr('src') || null;
      const imgAlt = imgTag.attr('alt') || '';
      const detailsText = $(element).find('.feature__body p').text().trim();
      
      const detailItems = {};
      const smallTags = $(element).find('.feature__body p small');
      const bTags = $(element).find('.feature__body p b');
      
      smallTags.each((i, smallTag) => {
        const key = $(smallTag).text().trim();
        const value = i < bTags.length ? $(bTags[i]).text().trim() : "";
        detailItems[key] = value;
      });
      
      const linkTag = $(element).find('a');
      const link = linkTag.attr('href') || null;
      
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
