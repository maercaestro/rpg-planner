import React from 'react'
import Layout from './components/Layout'
import Header from './components/Header'
import ProfileCard from './components/ProfileCard'
import QuestBoard from './components/QuestBoard'
import QuestStats from './components/QuestStats'
import './App.css'

function App() {
  return (
    <Layout>
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Character Profile (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          <ProfileCard />
          <QuestStats />
        </div>

        {/* Right Column: Quest Board (2/3 width) */}
        <div className="lg:col-span-2">
          <QuestBoard />
        </div>
      </div>
    </Layout>
  )
}

export default App
