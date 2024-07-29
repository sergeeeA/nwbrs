import style from '../styles/Table.module.css'
import TableRow from './TableRow'
import { useAppContext } from '../context/context'

const Table = () => {
  const { lotteryPlayers } = useAppContext()
  return (
    <div className={style.wrapper}>

      <div className={style.tableHeader}>
        
        <div className={style.addressTitle}>WALLET</div>
        <div className={style.heading1}>CONTESTANTS</div> {/* New heading */}
        <div className={style.amountTitle}>BERA</div>
      </div>
      <div className={style.rows}>
        {lotteryPlayers.length > 0 ? (
          lotteryPlayers.map((player, index) => (
            <TableRow key={index} player={player} />
          ))
        ) : (
          <div className={style.noPlayers}>No beras yet</div>
        )}
      </div>
    </div>
  )
}

export default Table
