import styles from './BackupItem.module.css'

function BackupItem({ backup }) {
  const getBackupTypes = () => {
    const types = []

    const hasFull = backup.full_backup
    const hasIncremental = backup.incremental_backup
    const hasMetadata = backup.metadata

    if (hasFull) types.push({ type: 'Full Backup', icon: '💾', className: 'full' })
    if (hasIncremental) types.push({ type: 'Incremental', icon: '📈', className: 'incremental' })
    if (hasMetadata) types.push({ type: 'Metadata', icon: '📄', className: 'metadata' })

    // Show this if only metadata is present, no full or incremental
    if (!hasFull && !hasIncremental && hasMetadata) {
      types.push({ type: 'No Full or Incremental', icon: '❌', className: 'none' })
    }

    // If no backup at all
    if (!hasFull && !hasIncremental && !hasMetadata) {
      types.push({ type: 'No Backup', icon: '❌', className: 'none' })
    }

    return types
  }

  const formatDateTime = (dateTimeString) => {
    try {
      const date = new Date(dateTimeString)
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return dateTimeString
    }
  }

  const backupTypes = getBackupTypes()

  return (
    <div className={styles.backupItem}>
      <div className={styles.vmInfo}>
        <span className={styles.vmIcon}>🖥️</span>
        <div className={styles.vmDetails}>
          <h3 className={styles.vmName}>{backup.uniqueName}</h3>
          <p className={styles.vmTime}>{formatDateTime(backup.last_modified)}</p>
          <p className={styles.fileCount}>{backup.files.length} file(s)</p>
        </div>
      </div>

      <div className={styles.backupStatuses}>
        {backupTypes.map((backupType, index) => (
          <div key={index} className={`${styles.backupStatus} ${styles[backupType.className]}`}>
            <span className={styles.statusIcon}>{backupType.icon}</span>
            <span className={styles.statusText}>{backupType.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BackupItem
