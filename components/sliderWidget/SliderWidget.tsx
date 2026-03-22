'use client'

import { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { format, parseISO, startOfDay } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery, gql } from '@apollo/client'
import { renderMarkdownText } from '@/lib/renderMarkdownText'
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

interface SliderWidgetProps {
  onEventCount?: (count: number) => void
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

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'https://api.scouts121.be'

// --- Component ---
export default function SliderWidget({ onEventCount }: SliderWidgetProps) {
  const { loading, error, data } = useQuery(EVENTS)

  const today = startOfDay(new Date())

  const events = data
    ? (data.events.data as Event[])
        .filter((event) => parseISO(event.attributes.datum) >= today)
        .sort((a, b) =>
          new Date(a.attributes.datum).getTime() - new Date(b.attributes.datum).getTime()
        )
    : []

  useEffect(() => {
    if (data) {
      onEventCount?.(events.length)
    }
  }, [data, events.length, onEventCount])

  if (loading) return <p>Evenementen laden...</p>
  if (error) return <p>Fout bij ophalen evenementen</p>
  if (events.length === 0) return null

  return (
    <div className={styles.container}>
    <Swiper
  loop={events.length > 2}
  spaceBetween={20}
  grabCursor={true}
  pagination={{ clickable: true, dynamicBullets: true }}
  navigation={{
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }}
  slidesPerView={1}
  breakpoints={{
    600: { slidesPerView: Math.min(events.length, 2) }
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
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
            )}
            <div className={styles.cardContent}>
              <Link href={`/evenementen/${event.id}`}>
                <h3 className={`${styles.cardTitle} link`}>{event.attributes.title}</h3>
              </Link>
              <div className={styles.cardInfo}>
                <div className={styles.cardDate}>
                  <p>{format(parseISO(event.attributes.datum), 'MMM')}</p>
                  <h3>{format(parseISO(event.attributes.datum), 'd')}</h3>
                </div>
                <div className={styles.cardDescription}>
                  <p className={styles.descriptionText}>
  {renderMarkdownText(event.attributes.description)}
</p>
                  <Link href={`/evenementen/${event.id}`}>
                    <span className={`meer ${styles.leesMore}`}>Lees Meer</span>
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