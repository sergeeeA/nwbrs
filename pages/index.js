import Header from '../components/Header'
import PotCardB from '../components/PotCardB'

import PotCard from '../components/PotCard'
import Footer from '../components/Footer'

import potCardsContainer from '../styles/potCardsContainer.module.css'
import style from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={style.wrapper}>
      <Header />
      <div className={potCardsContainer.potCardsContainer}>

        <PotCard />
        <PotCardB />
      </div>
      
      <Footer />

    </div>
  )
}
/*comment*/