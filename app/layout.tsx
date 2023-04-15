import { Nunito } from 'next/font/google'
import Navbar from './components/navbar/Navbar'
import './globals.css'
import ClientOnly from './components/ClientOnly';
import RegisterModal from './components/modals/RegisterModal';

// Una nueva manera de manejar metadatos
export const metadata = {
  title: 'Alojamiento',
  description: 'App de alojamiento',
}

// Las fuentes importadas pueden configurarse de este modo y utilizarse a traves de classnames
const font = Nunito({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <RegisterModal />
          <Navbar />
        </ClientOnly>
        
        {children}
        </body>
    </html>
  )
}
