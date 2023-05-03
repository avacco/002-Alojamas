import { Nunito } from 'next/font/google'
import Navbar from './components/navbar/Navbar'
import './globals.css'
import ClientOnly from './components/ClientOnly';
import RegisterModal from './components/modals/RegisterModal';
import ToasterProvider from './providers/ToasterProvider';
import LoginModal from './components/modals/LoginModal';
import getCurrentUser from './actions/getCurrentUser';
import RentModal from './components/modals/RentModal';

// Una nueva manera de manejar metadatos
export const metadata = {
  title: 'Alojamiento',
  description: 'App de alojamiento',
  icons: {
    icon: {
      url: "/favicon.png",
      type: "image/png",
    },
    shortcut: { url: "/favicon.png", type: "image/png" },
  },
}

// Las fuentes importadas pueden configurarse de este modo y utilizarse a traves de classnames
const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({children,}: {
  children: React.ReactNode
}) {

  const currentUser = await getCurrentUser();


  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <RentModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className='pb-20 pt-20'>
          {children}
        </div>
        </body>
    </html>
  )
}
