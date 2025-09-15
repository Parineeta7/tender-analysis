import BackupItem from './BackupItem'
import styles from './GroupSection.module.css'

function GroupSection({ groupName, backups, isExpanded, onToggle }) {
  const getGroupStats = () => {
    const total = backups.length
    const fullBackups = backups.filter(backup => backup.full_backup).length
    const incrementalBackups = backups.filter(backup => backup.incremental_backup).length
    const metadataFiles = backups.filter(backup => backup.metadata).length
    
    return { total, fullBackups, incrementalBackups, metadataFiles }
  }

  const stats = getGroupStats()

  return (
    <div className={styles.groupSection}>
      <button 
        className={`${styles.groupHeader} ${isExpanded ? styles.expanded : ''}`}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <div className={styles.groupInfo}>
          <div className={styles.groupTitle}>
            <span className={styles.groupIcon}>📁</span>
            <h3 className={styles.groupName}>Group Name: {groupName}</h3>
          </div>
          <div className={styles.groupStats}>
            <span className={styles.statBadge}>
              <span className={styles.statIcon}>🖥️</span>
              {stats.total} VMs
            </span>
            <span className={styles.statBadge}>
              <span className={styles.statIcon}>💾</span>
              {stats.fullBackups} Full
            </span>
            <span className={styles.statBadge}>
              <span className={styles.statIcon}>📈</span>
              {stats.incrementalBackups} Incremental
            </span>
            <span className={styles.statBadge}>
              <span className={styles.statIcon}>📄</span>
              {stats.metadataFiles} Metadata
            </span>
          </div>
        </div>
        <div className={`${styles.expandIcon} ${isExpanded ? styles.rotated : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path 
              d="M8 10L12 14L16 10" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
      
      <div className={`${styles.vmItems} ${isExpanded ? styles.show : ''}`}>
        <div className={styles.itemsContainer}>
          {backups.map((backup, index) => (
            <BackupItem 
              key={`${backup.uniqueName}-${index}`} 
              backup={backup} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default GroupSection