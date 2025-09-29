import type { Metadata } from 'next'
import './css/reset.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './scss/WrapComponent.scss';
import "@/components/wrap/scss/MainComponent.scss";

import HeaderComponent from '@/components/wrap/HeaderComponent';
import FooterComponent from '@/components/wrap/FooterComponent';

export const metadata: Metadata = {
  viewport: "width=device-width, initial-scale=1.0",
  title: 'ToDo List',
  description: 'Create Next App ToDo List Project',
  keywords: ['TO DO LIST', 'TO DO', '할일'],
  icons: {
    icon: "/images/favicon.ico",
    shortcut: "/images/vercel.svg",
    apple: "/images/vercel.svg",
  },
  publisher: "문선종",
  robots: "index, follow"
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  console.log( children );
  return (
    <html lang="en">
      <body>
        <div id='wrap'>
          <HeaderComponent />            
          {children}
          <FooterComponent />
        </div>
      </body>
    </html>
  )
}
