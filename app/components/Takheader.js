import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Helmet } from 'react-helmet';
const TAKKEN = gql`
  query GetTakken {
    takken {
      data {
        id
        attributes {
          numberID
          actief
          naam
        }
      }
    }
  }
`;

export default function KnoopHeader() {
  // Use the useQuery hook to fetch the data
  const { loading, error, data } = useQuery(TAKKEN);

  // Handle loading and error states
  if (loading) return <p>Loading takken...</p>;
  if (error) return <p>Error bij ophalen takken</p>;

  // Extract takken from the response data
  const takken = data.takken.data
  const takkenfiltered = takken.filter((tak) => tak.attributes.actief);
  const sortedTakken = takkenfiltered.sort(
    (a, b) => a.attributes.numberID - b.attributes.numberID
  );

  return (
    <div>
      <Helmet>
        <title>De Takken | Scouts 121 Oude-God Mortsel</title>
        <meta
          name="description"
          content="Wat staat er allemaal te gebeuren deze maand? De leiding heeft voor hun leden weer een programma in elkaar gestoken van ravotten, spelen en knutselen. Niet elke tak doet hetzelfde, natuurlijk niet. Lees daarom het programma na van jouw tak. Groepsleiding | Kapoenen | Welka's | Jojo's | Jonggivers | Givers Vergeet niet om ook de activiteiten in het oog te houden."
        />
        <meta
          name="keywords"
          content="contact, contacteren, e-mail, scouts121, 121, scouts"
        />
        <meta name="HandheldFriendly" content="true" />
      </Helmet>
      <div className="knoopnavy">
        <nav>
          <ul className="knoopnav">
            {sortedTakken.map((tak) => (
              <li>
                <Link key={tak.id} to={`/takken/${tak.id}`}>
                  {tak.attributes.naam}
                </Link>
              </li>
            ))}{' '}
          </ul>
        </nav>
      </div>
    </div>
  );
}
