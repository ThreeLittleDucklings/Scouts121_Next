import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Helmet } from 'react-helmet';
const VERHUUR = gql`
  query GetKnoop($id: ID!) {
    verhuurcategory(id: $id) {
      data {
        id
        attributes {
          type
          beschrijving
          verhuurs {
            data {
              id
              attributes {
                item
                beschrijving
                foto {
                  data {
                    id
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default function Verhuur() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(VERHUUR, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const VerhuurInfo = data.verhuurcategory?.data?.attributes?.verhuurs?.data;

  if (!Array.isArray(VerhuurInfo)) {
    return <p>No items loaded</p>;
  }

  return (
    <div className="MasterGrid">
      <Helmet>
        <title>
          {' '}
          {data.verhuurcategory.data.attributes.type} | Scouts 121 Oude-God
          Mortsel
        </title>
        <meta
          name="description"
          content={data.verhuurcategory.data.attributes.beschrijving}
        />
        <meta
          name="keywords"
          content="verhuur, huren, kamp, scouts121, 121, scouts, scoutskamp, "
        />
        <meta name="HandheldFriendly" content="true" />
      </Helmet>
      {VerhuurInfo.length === 0 ? (
        <p>No items available</p>
      ) : (
        VerhuurInfo.map((verhuur) => (
          <div key={verhuur.id} className="g1-card ">
            <h2>{verhuur.attributes.item}</h2>
            {verhuur.attributes.foto?.data?.attributes?.url ? (
              <img
                src={`https://api.scouts121.be${verhuur.attributes.foto.data.attributes.url}`}
                alt={verhuur.attributes.item}
              />
            ) : (
              <p></p>
            )}
            <p>{verhuur.attributes.beschrijving}</p>
          </div>
        ))
      )}
    </div>
  );
}
