import { BigironAddress, BigironAbi } from './constants'
const lotteryContract = web3 => {
  return new web3.eth.Contract(BigironAbi, BigironAddress)
}

export default lotteryContract
