// Main app shell combining sidebar and navbar.
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function PageWrapper({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

export default PageWrapper
