import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'
import { MantineProvider } from '@mantine/core'
import { HeaderTabs } from './HeaderTabs'
import { theme } from './theme'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <MantineProvider theme={theme}>
      <HeaderTabs />
    </MantineProvider>
  )
}

export default App
