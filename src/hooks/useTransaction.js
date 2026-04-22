// Transaction hook for fetching transaction feed.
import { useCallback } from 'react'
import { useState } from 'react'
import { transactionService } from '../services/transactionService'

export const useTransaction = () => {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true)
    const data = await transactionService.getRecent()
    setTransactions(data)
    setIsLoading(false)
  }, [])

  return { transactions, isLoading, fetchTransactions }
}
