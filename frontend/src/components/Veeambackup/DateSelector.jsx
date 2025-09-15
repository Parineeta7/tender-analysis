import styles from './DateSelector.module.css'

function DateSelector({ dates, selectedDate, onDateSelect, formatDate }) {
  return (
    <div className={styles.dateSelector}>
      <label className={styles.label}>Select Date:</label>
      <select 
        className={styles.select}
        value={selectedDate}
        onChange={(e) => onDateSelect(e.target.value)}
      >
        <option value="">Choose a date...</option>
        {dates.map(date => (
          <option key={date} value={date}>
            {formatDate(date)}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DateSelector