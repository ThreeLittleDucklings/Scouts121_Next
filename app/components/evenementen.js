import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { format, parseISO, startOfDay } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const EVENTS = gql`
  query GetEvenementen {
    events {
      data {
        id
        attributes {
          title
          datum
          description
          thumbnail {
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
`;

export default function Evenementen() {
  // Use the useQuery hook to fetch the data
  const { loading, error, data } = useQuery(EVENTS);

  // Handle loading and error states
  if (loading) return <p>Loading takken...</p>;
  if (error) return <p>Error bij ophalen takken</p>;

  // Get today's date at the start of the day
  const today = startOfDay(new Date());

  // Extract events from the response data
  const events = data.events.data
    .filter((event) => {
      // Parse the event date
      const eventDate = parseISO(event.attributes.datum);
      // Return true if the event date is today or in the future
      return eventDate >= today;
    })
    .sort(
      (a, b) => new Date(a.attributes.datum) - new Date(b.attributes.datum)
    ); // Sort events by date

  // Determine how many events to display
  const numberOfEventsToShow =
    events.length >= 6 ? 6 : Math.min(events.length, 3);
  const displayedEvents = events.slice(0, numberOfEventsToShow);

  // Determine if the `grid-row-2` class should be applied
  const gridClass = numberOfEventsToShow > 3 ? 'large6' : 'small3';
  const eventGridClass =
    numberOfEventsToShow > 3 ? 'eventlarge6' : 'eventsmall3';
  return (
    <div className={`${gridClass}`}>
      <div className={`${eventGridClass} cards`}>
        {displayedEvents.map((event) => (
          <div key={event.id}>
            {event.attributes.thumbnail && event.attributes.thumbnail.data && (
              <img
                src={`https://api.scouts121.be${event.attributes.thumbnail.data.attributes.url}`} // Adjusted path
                alt={event.attributes.title}
              />
            )}
            <div className="eventGrid">
              <div>
                <div className="centered">
                  <p>{format(parseISO(event.attributes.datum), 'MMM')}</p>
                  <h3>{format(parseISO(event.attributes.datum), 'd')}</h3>
                </div>{' '}
              </div>
              <div className="grid-col-2">
                <div className="centered">
                  <Link to={`/evenementen/${event.id}`}>
                    <p className="link">{event.attributes.title}</p>
                  </Link>
                  <p className="link">{event.attributes.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
