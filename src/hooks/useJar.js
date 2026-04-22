// Jar hook facade over jar store.
import { useJarStore } from '../store'

export const useJar = () => {
  const { jars, selectedJar, isLoading, fetchJars, updateJar, setSelectedJar } = useJarStore()
  return { jars, selectedJar, isLoading, fetchJars, updateJar, setSelectedJar }
}
