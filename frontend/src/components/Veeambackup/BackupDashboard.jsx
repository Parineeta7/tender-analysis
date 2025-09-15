import { useState, useEffect } from 'react'
import DateSelector from './DateSelector'
import GroupSection from './GroupSection'
import GroupsView from './GroupsView'
import styles from './BackupDashboard.module.css'

function BackupDashboard() {
  const [backupData, setBackupData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [expandedGroups, setExpandedGroups] = useState(new Set())
  const [showGroupsView, setShowGroupsView] = useState(false)

  useEffect(() => {
    fetchBackupData()
  }, [])

  const fetchBackupData = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://fastapi.phoneme.in/veeam')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const groupedData = groupBackupsByDateDirectoryAndVM(data)
      setBackupData(groupedData)

      const dates = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a))
      if (dates.length > 0) {
        setSelectedDate(dates[0])
      }

      setError(null)
    } catch (err) {
      console.error('Error fetching backup data:', err)
      setError('Failed to fetch backup data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const groupBackupsByDateDirectoryAndVM = (data) => {
    const grouped = {}
    const vmMetadataMap = {}

    data.forEach((backup) => {
      const date = backup.last_modified.split(' ')[0]
      const directory = backup.parent_directory
      const vmName = extractUniqueVmName(backup.vm)

      if (!grouped[date]) grouped[date] = {}
      if (!grouped[date][directory]) grouped[date][directory] = {}
      if (!grouped[date][directory][vmName]) {
        grouped[date][directory][vmName] = {
          uniqueName: vmName,
          metadata: false,
          full_backup: false,
          incremental_backup: false,
          files: [],
          last_modified: backup.last_modified
        }
      }

      const vmGroup = grouped[date][directory][vmName]

      if (backup.metadata) {
        vmGroup.metadata = true
        vmMetadataMap[vmName] = { group: directory, vmName }
      }
      if (backup.full_backup) vmGroup.full_backup = true
      if (backup.incremental_backup) vmGroup.incremental_backup = true

      vmGroup.files.push({
        filename: backup.vm,
        metadata: backup.metadata,
        full_backup: backup.full_backup,
        incremental_backup: backup.incremental_backup,
        last_modified: backup.last_modified
      })

      if (new Date(backup.last_modified) > new Date(vmGroup.last_modified)) {
        vmGroup.last_modified = backup.last_modified
      }
    })

    Object.keys(grouped).forEach(date => {
      Object.entries(vmMetadataMap).forEach(([vmName, { group }]) => {
        if (!grouped[date][group]) grouped[date][group] = {}

        if (!grouped[date][group][vmName]) {
          grouped[date][group][vmName] = {
            uniqueName: vmName,
            metadata: false,
            full_backup: false,
            incremental_backup: false,
            files: [],
            last_modified: `${date} 00:00:00`
          }
        }
      })

      Object.keys(grouped[date]).forEach(directory => {
        grouped[date][directory] = Object.values(grouped[date][directory])
      })
    })

    return grouped
  }

  const extractUniqueVmName = (vmFileName) => {
    let cleanName = vmFileName.replace(/\.(vbk|vib|vbm)$/i, '')
    cleanName = cleanName.replace(/\.\d{2,6}D\d{4}-\d{2}-\d{2}T\d{6}_[A-F0-9]+$/i, '')
    cleanName = cleanName.replace(/\.vm-\d+D\d{4}-\d{2}-\d{2}T\d{6}_[A-F0-9]+$/i, '')
    cleanName = cleanName.replace(/_[A-F0-9]{4,6}$/i, '')
    return cleanName
  }

  const toggleGroup = (groupName) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName)
    } else {
      newExpanded.add(groupName)
    }
    setExpandedGroups(newExpanded)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getOverallStats = () => {
    const totalDates = Object.keys(backupData).length
    let totalBackups = 0
    let fullBackups = 0

    Object.values(backupData).forEach(dateData => {
      Object.values(dateData).forEach(vms => {
        vms.forEach(vm => {
          totalBackups += vm.files.length
          if (vm.full_backup) fullBackups += vm.files.filter(f => f.full_backup).length
        })
      })
    })

    return { totalDates, totalBackups, fullBackups }
  }

  const getSelectedDateStats = () => {
    if (!selectedDate || !backupData[selectedDate]) {
      return { totalGroups: 0, totalVMs: 0, fullBackups: 0, incrementalBackups: 0, metadataFiles: 0 }
    }

    const dateData = backupData[selectedDate]
    const totalGroups = Object.keys(dateData).length
    let totalVMs = 0
    let fullBackups = 0
    let incrementalBackups = 0
    let metadataFiles = 0

    Object.values(dateData).forEach(vms => {
      totalVMs += vms.length
      vms.forEach(vm => {
        if (vm.full_backup) fullBackups++
        if (vm.incremental_backup) incrementalBackups++
        if (vm.metadata) metadataFiles++
      })
    })

    return { totalGroups, totalVMs, fullBackups, incrementalBackups, metadataFiles }
  }

  const navigateToGroupsView = () => setShowGroupsView(true)
  const navigateBackToDashboard = () => setShowGroupsView(false)

  if (showGroupsView) {
    return (
      <GroupsView backupData={backupData} onBack={navigateBackToDashboard} loading={loading} error={error} />
    )
  }

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading backup data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Error Loading Data</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button className={styles.retryButton} onClick={fetchBackupData}>Try Again</button>
        </div>
      </div>
    )
  }

  const overallStats = getOverallStats()
  const selectedDateStats = getSelectedDateStats()
  const availableDates = Object.keys(backupData).sort((a, b) => new Date(b) - new Date(a))

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <img src="https://cdn-icons-png.flaticon.com/512/9780/9780637.png" alt="VM Icon" style={{height: '2.5rem', width: '2.5rem', marginRight: '0.7rem', verticalAlign: 'middle'}} />
            Veeam Backup Dashboard
          </h1>
          <p className={styles.subtitle}>Monitor and manage your backup operations</p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.statsOverview}>
          <div className={styles.statCard}><div className={styles.statNumber}>{overallStats.totalDates}</div><div className={styles.statLabel}>Total Dates</div></div>
          <div className={styles.statCard}><div className={styles.statNumber}>{overallStats.totalBackups}</div><div className={styles.statLabel}>Total Backups</div></div>
          <div className={styles.statCard}><div className={styles.statNumber}>{overallStats.fullBackups}</div><div className={styles.statLabel}>Full Backups</div></div>
        </div>

        <div className={styles.controlsSection}>
          <DateSelector dates={availableDates} selectedDate={selectedDate} onDateSelect={setSelectedDate} formatDate={formatDate} />
          <div className={styles.buttonGroup}>
            <button className={styles.groupsViewButton} onClick={navigateToGroupsView}>
              <span className={styles.buttonIcon}>
                <img src="https://cdn-icons-png.flaticon.com/512/5564/5564268.png" alt="Groups View Icon" style={{height: '1.3em', width: '1.3em', verticalAlign: 'middle'}} />
              </span>
              Groups View
            </button>
            <button className={styles.refreshButton} onClick={fetchBackupData} disabled={loading}>
              <span className={styles.refreshIcon}>
                <img src="https://cdn-icons-png.flaticon.com/512/6756/6756708.png" alt="Refresh Icon" style={{height: '1.3em', width: '1.3em', verticalAlign: 'middle'}} />
              </span>
              Refresh Data
            </button>
          </div>
        </div>

        {selectedDate && backupData[selectedDate] && (
          <div className={styles.selectedDateSection}>
            <div className={styles.selectedDateHeader}>
              <h2 className={styles.selectedDateTitle}>{formatDate(selectedDate)}</h2>
              <div className={styles.selectedDateStats}>
                <span className={styles.statBadge}><span className={styles.statIcon}>📁</span>{selectedDateStats.totalGroups} Groups</span>
                <span className={styles.statBadge}><span className={styles.statIcon}>🖥️</span>{selectedDateStats.totalVMs} VMs</span>
                <span className={styles.statBadge}><span className={styles.statIcon}>💾</span>{selectedDateStats.fullBackups} Full</span>
                <span className={styles.statBadge}><span className={styles.statIcon}>📈</span>{selectedDateStats.incrementalBackups} Incremental</span>
                <span className={styles.statBadge}><span className={styles.statIcon}>📄</span>{selectedDateStats.metadataFiles} Metadata</span>
              </div>
            </div>

            <div className={styles.groupsList}>
              {Object.entries(backupData[selectedDate]).map(([groupName, vms]) => (
                <GroupSection
                  key={groupName}
                  groupName={groupName}
                  backups={vms}
                  isExpanded={expandedGroups.has(groupName)}
                  onToggle={() => toggleGroup(groupName)}
                />
              ))}
            </div>
          </div>
        )}

        {availableDates.length === 0 && (
          <div className={styles.noDataContainer}>
            <div className={styles.noDataIcon}>📊</div>
            <h3 className={styles.noDataTitle}>No Backup Data Found</h3>
            <p className={styles.noDataMessage}>No backup records are currently available. Please check your backup system or try refreshing.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default BackupDashboard
