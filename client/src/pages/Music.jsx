import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../music.css';

// GraphQL query to fetch albums
const GET_ALBUMS = gql`
  query GetAlbums {
    albums {
      _id
      title
      releaseDate
      tracklist {
        trackNumber
        title
      }
    }
  }
`;
export default function Music() {
  const { loading, error, data } = useQuery(GET_ALBUMS);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (

      <div className="container px-5 py-10 mx-auto text-center lg:px-40">
        <Slider {...settings} className="square-carousel">
          {data.albums.map((album) => (
            <div key={album._id} className="square-slide">

                className="square-image"
              />
              <div className="overlay">
                <div className="album-details">

                  <ul>

                    {album.tracklist.map((track, i) => (
                      <li key={i}>{track.title}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}