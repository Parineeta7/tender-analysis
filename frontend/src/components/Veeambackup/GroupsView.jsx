import styles from './GroupsView.module.css'

function GroupsView({ backupData, onBack, loading, error }) {
  if (loading) {
    return (
      <div className={styles.groupsView}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading groups data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.groupsView}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Error Loading Data</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button className={styles.backButton} onClick={onBack}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const extractVmNameFromMetadata = (filename) => {
    // Remove .vbm extension and everything after last underscore
    return filename.replace(/\.vbm$/i, '').replace(/_[^_]+$/, '')
  }

  const getAllGroups = () => {
    const groupsMap = {}

    Object.values(backupData).forEach(dateData => {
      Object.entries(dateData).forEach(([groupName, vms]) => {
        vms.forEach(vm => {
          // Only include metadata files
          const metadataFiles = vm.files.filter(file => file.metadata)

          metadataFiles.forEach(file => {
            const extractedName = extractVmNameFromMetadata(file.filename)

            if (!groupsMap[groupName]) {
              groupsMap[groupName] = new Set()
            }

            groupsMap[groupName].add(extractedName)
          })
        })
      })
    })

    const groups = Object.entries(groupsMap).map(([groupName, vmSet]) => ({
      name: groupName,
      vms: Array.from(vmSet).sort()
    })).sort((a, b) => a.name.localeCompare(b.name))

    return groups
  }

  const groups = getAllGroups()

  return (
    <div className={styles.groupsView}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.backButton} onClick={onBack}>
            <span className={styles.backIcon}>←</span>
            Back to Dashboard
          </button>
          <h1 className={styles.title}>
            <span className={styles.groupsIcon}>
              <img src="https://cdn-icons-png.flaticon.com/512/5564/5564268.png" alt="Groups Overview Icon" style={{height: '1.3em', width: '1.3em', verticalAlign: 'middle'}} />
            </span>
            Groups Overview
          </h1>
          <p className={styles.subtitle}>All backup groups and their virtual machines</p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.statsOverview}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{groups.length}</div>
            <div className={styles.statLabel}>Total Groups</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {groups.reduce((total, group) => total + group.vms.length, 0)}
            </div>
            <div className={styles.statLabel}>Unique VMs</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {Math.round(groups.reduce((total, group) => total + group.vms.length, 0) / groups.length || 0)}
            </div>
            <div className={styles.statLabel}>Avg VMs per Group</div>
          </div>
        </div>

        <div className={styles.groupsList}>
          {groups.map(group => (
            <div key={group.name} className={styles.groupCard}>
              <div className={styles.groupHeader}>
                <div className={styles.groupInfo}>
                  <h3 className={styles.groupName}>
                    <span className={styles.groupIcon}>📁</span>
                    Group Name: {group.name}
                  </h3>
                  <div className={styles.groupStats}>
                    <span className={styles.statBadge}>
                      <span className={styles.statIcon}>🖥️</span>
                      {group.vms.length} VMs
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.vmsList}>
                {group.vms.map(vmName => (
                  <div key={vmName} className={styles.vmItem}>
                    <span className={styles.vmIcon}>🖥️</span>
                    <span className={styles.vmName}>{vmName}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {groups.length === 0 && (
          <div className={styles.noDataContainer}>
            <div className={styles.noDataIcon}>📋</div>
            <h3 className={styles.noDataTitle}>No Groups Found</h3>
            <p className={styles.noDataMessage}>
              No backup groups are currently available.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default GroupsView
