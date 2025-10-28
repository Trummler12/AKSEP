import Router from './components/routing/Router'
import './styles/globals.css'
import './styles/themes.css'
import './styles/components/shared.css'
import './styles/components/ui.css'

export default function App() {
  return (
    <div id="app-root" className="app-root dark">
      <Router />
    </div>
  )
}
