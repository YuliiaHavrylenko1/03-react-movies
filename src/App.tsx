import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import SearchBar from './components/SearchBar/SearchBar';
import MovieGrid from './components/MovieGrid/MovieGrid';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import MovieModal from './components/MovieModal/MovieModal';

import { fetchMovies } from './services/movieService';
import type { Movie } from './types/movie';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError('');
    setMovies([]);

    fetchMovies(query)
      .then(results => {
        if (results.length === 0) {
          toast('No movies found for your request.');
        }
        setMovies(results);
      })
      .catch(() => {
        setError('There was an error, please try again...');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    document.body.style.overflow = 'hidden'; // блокування скролу при відкритті модалки
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    document.body.style.overflow = ''; // розблокування скролу
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />
      {loading && <Loader />}
      {error && <ErrorMessage />}
      {!loading && !error && <MovieGrid movies={movies} onSelect={handleSelectMovie} />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  );
}
