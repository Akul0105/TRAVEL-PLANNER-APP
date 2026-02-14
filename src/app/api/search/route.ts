/**
 * Search API Route
 * Handles POST requests from the frontend search bar
 * Connects to Mystral API (via mystralService.ts) to get smart, Google-like suggestions
 */

import { NextRequest, NextResponse } from "next/server";
import { getSearchSuggestions } from "@/services/mystralService"; // make sure this file exists

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Get the "query" text from the frontend request
    const { query } = await request.json();   //it reads the user's search text from the request 

    // 2️⃣ Validate the input
    if (!query || typeof query !== "string") {   //checks if the query is valid
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // 3️⃣ Call the Mystral API service to get AI-generated search suggestions
    const data = await getSearchSuggestions(query);   //sends query to  mystral and waits for suggestions

    // 4️⃣ Send the suggestions back to the frontend
    return NextResponse.json(data);   //returns the suggestions to the frontend so that the users can see it 
  } catch (error) {
    console.error("Search API error:", error);

    // 5️⃣ Handle and return any errors
    return NextResponse.json(
      { error: "Failed to fetch search suggestions" },
      { status: 500 }
    );
  }
}

// when someone types a search query, this code sends it to an AI service called mystral to get siggestions like Google does.
//the code listens for search requests--> checks the input --> ask Mystral for suggestions --> send suggestions back to the user 
