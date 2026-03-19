'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { format, parseISO, startOfDay } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery, gql } from '@apollo/client'
import { gql as gqlTag } from '@apollo/client'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import styles from './SliderWidget.module.css'

// --- Types ---
interface EventAttributes {
  title: string
  datum: string
  description: string
  thumbnail: {
    data: {
      id: number
      attributes: { url: string }
    } | null
  }
}

interface Event {
  id: number
  attributes: EventAttributes
}

// --- Query ---
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
`

// --- Helpers ---
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'https://api.scouts121.be'

const truncateText = (text: string | null, length: number): string => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// --- Component ---
export default function SliderWidget() {
  const { loading, error, data } = useQuery(EVENTS)

  if (loading) return <p>Evenementen laden...</p>
  if (error) return <p>Fout bij ophalen evenementen</p>

  const today = startOfDay(new Date())

  const events = (data.events.data as Event[])
    .filter((event) => parseISO(event.attributes.datum) >= today)
    .sort((a, b) =>
      new Date(a.attributes.datum).getTime() - new Date(b.attributes.datum).getTime()
    )

  if (events.length === 0) return <p>Geen komende evenementen</p>

  return (
    <div className={styles.container}>
      <Swiper
        loop={true}
        spaceBetween={60}
        grabCursor={true}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        breakpoints={{
          900: { slidesPerView: 2 },
          1400: { slidesPerView: 3 },
        }}
        modules={[Navigation, Pagination]}
        className={styles.swiper}
      >
        {events.map((event) => (
          <SwiperSlide className={styles.slide} key={event.id}>
            {event.attributes.thumbnail?.data && (
              <Image
                className={styles.cardImg}
                src={`${STRAPI_URL}${event.attributes.thumbnail.data.attributes.url}`}
                alt={event.attributes.title}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }}
              />
            )}
            <Link className="centered" href={`/evenementen/${event.id}`}>
              <h3 className="link">{event.attributes.title}</h3>
            </Link>
            <div className={styles.eventGrid}>
  <div>
    <div className="centered">
      <p>{format(parseISO(event.attributes.datum), 'MMM')}</p>
      <h3>{format(parseISO(event.attributes.datum), 'd')}</h3>
    </div>
  </div>
  <div className={styles.colSpan2}>
    <div className="centered">
      <p className="link">
        {truncateText(event.attributes.description, 80)}
      </p>
      <Link href={`/evenementen/${event.id}`}>
        <span className="meer">Lees Meer</span>
      </Link>
    </div>
  </div>
</div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-next">
          <i className="ri-arrow-right-s-line"></i>
        </div>
        <div className="swiper-button-prev">
          <i className="ri-arrow-left-s-line"></i>
        </div>
        <div className="swiper-pagination"></div>
      </Swiper>
    </div>
  )
}