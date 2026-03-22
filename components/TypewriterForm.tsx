'use client'

import { useState, useEffect } from 'react'
import styles from './TypewriterForm.module.css'

interface Field {
  label: string
  value: string
  type?: 'text' | 'textarea' | 'date' | 'number' | 'select'
  options?: string[]
}

interface TypewriterFormProps {
  title: string
  fields: Field[]
}

export default function TypewriterForm({ title, fields }: TypewriterFormProps) {
  const [fieldValues, setFieldValues] = useState<string[]>(fields.map(() => ''))
  const [currentField, setCurrentField] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pause' | 'reset'>('typing')

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (phase === 'typing') {
      const field = fields[currentField]
      if (currentChar < field.value.length) {
        // Type next character
        timeout = setTimeout(() => {
          setFieldValues(prev => {
            const next = [...prev]
            next[currentField] = field.value.substring(0, currentChar + 1)
            return next
          })
          setCurrentChar(c => c + 1)
        }, 50)
      } else if (currentField < fields.length - 1) {
        // Move to next field
        timeout = setTimeout(() => {
          setCurrentField(f => f + 1)
          setCurrentChar(0)
        }, 400)
      } else {
        // All fields done — pause before reset
        timeout = setTimeout(() => setPhase('pause'), 2000)
      }
    } else if (phase === 'pause') {
      timeout = setTimeout(() => setPhase('reset'), 500)
    } else if (phase === 'reset') {
      setFieldValues(fields.map(() => ''))
      setCurrentField(0)
      setCurrentChar(0)
      setPhase('typing')
    }

    return () => clearTimeout(timeout)
  }, [phase, currentField, currentChar, fields])

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.formTitle}>{title}</h3>
      <div className={styles.form}>
        {fields.map((field, i) => (
          <div key={i} className={styles.formRow}>
            <label className={styles.label}>{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                className={styles.textarea}
                value={fieldValues[i]}
                readOnly
                rows={3}
              />
            ) : field.type === 'select' ? (
              <div className={styles.selectDisplay}>
                {fieldValues[i] || <span className={styles.placeholder}>Selecteer...</span>}
              </div>
            ) : (
              <div className={styles.inputDisplay}>
                {fieldValues[i] || <span className={styles.placeholder}>{field.label}...</span>}
                {i === currentField && phase === 'typing' && (
                  <span className={styles.cursor}>|</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}