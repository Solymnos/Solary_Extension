import { useEffect, useState } from 'react';
import './App.css';
import MovieCard from './MovieCard';

// a92c67ec

const API_URL = 'http://www.omdbapi.com?apikey=a92c67ec';

const movie1 = {
    Poster: "https://m.media-amazon.com/images/M/MV5BNjA3NGExZDktNDlhZC00NjYyLTgwNmUtZWUzMDYwMTZjZWUyXkEyXkFqcGdeQXVyMTU1MDM3NDk0._V1_SX300.jpg",
    Title: "Avatar",
    Type: "movie",
    Year: "2009",
    imdbID: "tt0499549"
}
const App = () => {
    const [movies, setMovies ] = useState([]);

    const searchMovies = async(title) => {
        const response = await fetch(`${API_URL}&s=${title}`);
        const data = await response.json();
        console.log(data);
        setMovies(data.Search);
    }

    useEffect(() => {
       searchMovies('avatar');
       
    }, []);
    return (
        <div className='app'>
            <h1>MovieLand</h1>
            <div className='search'>
                <input
                placeholder='Search for movie'
                onChange={() => {}}
            />
            </div>
            { 
                movies?.length > 0
                ? ( <div className='container'>
                    {movies.map((movie) => (
                        <MovieCard movie1={movie} />
                    ))}
                    </div>
                    ) : (
                        <div className='empty'>
                            <h2>No movies found</h2>
                        </div>
                    )
            }
            
        </div>
    )
}

export default App;