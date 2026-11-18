/* ======================================================
    Lab 8 - App.jsx starter
====================================================== */

import React, { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import MovieGrid from "./components/MovieGrid.jsx";

export default function App() {
  // TODO 3: 
  // Create state variables using useState: 
  // - movies: empty array 
  // - isLoading: true 
  // - error: empty string 
  // - searchTerm: "Batman" 
  // - watchlist: empty array 

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("Batman");
  const [watchlist, setWatchlist] = useState([]);

  const API_KEY = "ENTER_OMDB_API_KEY_HERE";


  const fetchMovies = async (query) => {
    // TODO 4: 
    // Before fetching: 
    // - set isLoading to true 
    // - clear the error message 
    setIsLoading(true);
    setError("");

    if (!API_KEY || API_KEY === "ENTER_OMDB_API_KEY_HERE") {
      // Makes movies empty such as setMovies([]) 
      // Call setError with your error message such as “No API key” 
      // Set isLoading to false; 
      setMovies([]);
      setError("No API key. Please add the OMDb API key in App.jsx.");
      setIsLoading(false);
      return;
    }

    try {
      const url =
        `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      // TODO 5: 
      // If data.Response is True, store data.Search in movies, use setMovies. 
      // Otherwise: 
      // - set movies to [] (like TODO 4) 
      // - set error to data.Error or “No movies found” 
      
      if (data.Response === "True") {
        // Success => data.Search is the list of movies.
        setMovies(data.Search);
      } else {
        // Failure => clear the movies and show the API message or the message below
        setMovies([]);
        setError(data.Error || "No movies found");
      }

    } catch (err) {
      // TODO 6: 
      // Set error to "Failed to fetch movies." 
      // Set movies to [] 
      console.error(err);
      setError("Failed to fetch movies.");
      setMovies([]);
    } finally {
      // TODO 7: 
      // Set isLoading to false  
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // TODO 8: 
    // Call fetchMovies with searchTerm 
    // This should run on first load and when searchTerm changes.
    fetchMovies(searchTerm); 
  }, [searchTerm]);

  const handleSearch = (newSearchTerm) => {
    // TODO 9: 
    // Update searchTerm using the value received from SearchBar. 
    // Do not call fetchMovies directly here. 
    setSearchTerm(newSearchTerm);
  };

  const addToWatchlist = (movie) => {
    setWatchlist((prevWatchlist) => {
      const alreadyExists = prevWatchlist.some(
        (item) => item.imdbID === movie.imdbID
      );
      if (alreadyExists) {
        return prevWatchlist;
      }
      return [...prevWatchlist, movie];
    });
  };

  // Decide what to show in the results area
  let resultsContent;
  if (isLoading) {
    // Still waiting for the API
    resultsContent = <p className="status">Loading...</p>;
  } else if (error !== "") {
    // The API (or the network) gave an error
    resultsContent = <p className="status error">{error}</p>;
  } else if (movies.length === 0) {
    // No error but nothing to show
    resultsContent = <p className="status">No movies found.</p>;
  } else {
    // Show movies since we have them now
    resultsContent = <MovieGrid movies={movies} addToWatchlist={addToWatchlist} />;
  }

  return (
    <div className="page">
      <Header title="Movie Search" searchTerm={searchTerm} />

      {/* TODO 10: 
          Render SearchBar and pass handleSearch as onSearch
      */}
      <SearchBar onSearch={handleSearch} />

      <main className="panel">
        {/* TODO 11A: 
            Conditional rendering: 
            - If isLoading is true, show <p className="status">Loading...</p> 
            - Else if error is not empty, show <p className="status error">{error}</p> 
            - Else if movies.length === 0, show 
              <p className="status">No movies found.</p> 
            - Otherwise render <MovieGrid movies={movies} addToWatchlist={addToWatchlist} /> 
        */}
        {resultsContent}

        {/* TODO 11B: 
            Add a watchlist section below the search results. 
            - Show a heading such as "My Watchlist" 
            - If watchlist.length === 0, show "No movies in watchlist yet." 
            - Otherwise map through watchlist and render each saved movie 
        */}
        <section className="watchlist">
          <h2>My Watchlist</h2>
          {watchlist.length === 0 ? (
            <p className="status">No movies in watchlist yet.</p>
          ) : (
            <ul>
              {/* One list item for each saved movie */}
              {watchlist.map((movie) => (
                <li key={movie.imdbID}>
                  {movie.Title} ({movie.Year})
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}