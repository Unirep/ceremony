import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Header from '../components/Header'
import ContributionCard from '../components/ContributionCard'
import Pagination from '../components/Pagination'
import Footer from '../components/Footer'
import './stats.css'

import state from '../contexts/state'

export default observer(() => {
  const { ui, ceremony } = useContext(state)
  const [detailIsOpen, setDetailIsOpen] = useState(true)
  const [activeCircuit, setActiveCircuit] = useState(ceremony.circuitNames[0])
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(10)
  const [loadFromLocal, setLoadFromLocal] = useState(true)
  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const data = ceremony.transcript.filter(
    (d) => d.circuitName === activeCircuit
  )
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord)
  const nPages = Math.ceil(data.length / recordsPerPage)

  React.useEffect(() => {
    if (!activeCircuit) {
      setActiveCircuit(ceremony.circuitNames[0])
    }
  }, [ceremony.circuitNames])

  const toggleDetailOpen = () => {
    if (detailIsOpen) {
      setDetailIsOpen(false)
    } else {
      setDetailIsOpen(true)
    }
  }

  const decideTranscriptLink = () => {
    if (loadFromLocal) {
      return '/transcript.json'
    } else {
      return new URL('/transcript', HTTP_SERVER).toString()
    }
  }

  const decideZkeyLink = (circuitName) => {
    if (loadFromLocal) {
      if (circuitName.indexOf('Sign Up') >= 0) {
        return `https://keys.unirep.io/2.0.0-no-beacon/signup.zkey`
      } else if (circuitName.indexOf('Epoch Key Lite') >= 0) {
        return `https://keys.unirep.io/2.0.0-no-beacon/epochKeyLite.zkey`
      } else if (circuitName.indexOf('Epoch Key') >= 0) {
        return `https://keys.unirep.io/2.0.0-no-beacon/epochKey.zkey`
      } else if (circuitName.indexOf('User State Transition') >= 0) {
        return `https://keys.unirep.io/2.0.0-no-beacon/userStateTransition.zkey`
      } else if (circuitName.indexOf('Reputation') >= 0) {
        return `https://keys.unirep.io/2.0.0-no-beacon/reputation.zkey`
      } else if (circuitName.indexOf('Scope Nullifier') >= 0) {
        return `https://keys.unirep.io/2.0.0-no-beacon/scopeNullifier.zkey`
      }
    } else {
      return new URL(
        `/contribution/${circuitName}/latest`,
        HTTP_SERVER
      ).toString()
    }
  }

  const decideWhetherLoadFromLocal = async () => {
    if (HTTP_SERVER) {
      try {
        await fetch(new URL('/transcript', HTTP_SERVER).toString())
        setLoadFromLocal(false)
      } catch (e) {
        setLoadFromLocal(true)
      }
    }
  }

  React.useEffect(() => {
    // decideWhetherLoadFromLocal()
  }, [])

  return (
    <div className="stats-content">
      <Header />

      <div className="stats-container">
        <div>
          <div className="stats-heading">CEREMONY STATS</div>
          <div className="stats-link">
            <a href={decideTranscriptLink()} target="_blank">
              Full transcript
            </a>
          </div>
          {/* <div className="stats-link">
            {ceremony.attestationUrl ? (
              <a href={ceremony.attestationUrl} target="_blank">
                Public attestations
              </a>
            ) : null}
          </div> */}
        </div>

        {ui.isMobile ? (
          <div className="stats-details" onClick={toggleDetailOpen}>
            <div>{detailIsOpen ? 'Close detail' : 'Expand detail'}</div>
            <img
              src={require(`../../public/arrow_${
                detailIsOpen ? 'collapse' : 'dropdown'
              }.svg`)}
              alt="expand or collapse arrow"
            />
          </div>
        ) : null}

        {detailIsOpen ? (
          <div className="stats-categories">
            {ceremony.ceremonyState.circuitStats?.map((c) => (
              <div className="stat-item" key={c.name}>
                <div>{c.name}</div>
                <div className="stat-count">
                  <div>{c.contributionCount}</div>
                  <a href={decideZkeyLink(c.name)}>
                    <img
                      src={require('../../public/arrow_download.svg')}
                      alt="download arrow"
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="contribution-container">
        {/* old style displaying cards with cosmos images */}
        {/* {ceremony.transcript.map((d) => (
          <ContributionCard
            key={d._id}
            index={d.index}
            name={d.name}
            hash={d.hash}
            createdAt={d.createdAt}
            circuit={d.circuitName}
          ></ContributionCard>
        ))} */}

        <div className="circuit">
          <div className="circuit-heading">Contributions</div>
          <div className="view">view by circuit:</div>
          <div className="circuit-select">
            <select
              onChange={(e) => setActiveCircuit(e.target.value)}
              value={activeCircuit}
            >
              {ceremony.circuitNames.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="contribution-table">
          <div className="table-heading">
            <div style={{ display: 'flex' }}>
              <div className="table-index">index</div>
              <div>name</div>
            </div>
            <div>hash</div>
            <div>age</div>
          </div>

          {currentRecords.map((d) => (
            <ContributionCard
              key={d._id}
              index={d.index}
              name={d.name}
              hash={d.hash}
              createdAt={d.createdAt}
              circuit={d.circuitName}
            ></ContributionCard>
          ))}

          <Pagination
            nPages={nPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      <Footer />
    </div>
  )
})
