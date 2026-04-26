import type { Metadata } from 'next'
import JsonLd from '../components/JsonLd'

export const metadata: Metadata = {
  title: 'About Brian Isale — Google Africa Scholar, Full Stack Developer & Designer',
  description:
    'Brian Isale is a Full Stack Developer, Creative Designer, and Community Builder based in Nakuru, Kenya. ' +
    'Google Africa Scholar (Andela, 2019) with 6+ years experience. ' +
    'Builds modern web apps with Next.js and React, crafts brand identities, and mentors developers across Africa.',
  keywords: [
    'about Brian Isale', 'Brian Isale biography', 'Brian Isale background',
    'BryanAim', 'Bryan Aim', 'Brian Aim', 'Janja', 'isalebryan', 'isalebrian', 'Isale Brian',
    'Google Africa Scholar Kenya', 'Andela scholar Kenya',
    'full stack developer Nakuru Kenya', 'web developer community builder Kenya', 'Brian Isale skills',
  ],
  alternates: { canonical: 'https://isalebryan.dev/about' },
  openGraph: {
    title: 'About Brian Isale — Google Africa Scholar, Full Stack Developer & Designer',
    description:
      'Google Africa Scholar (Andela, 2019). 6+ years building web apps, brand identities, and community programmes across Kenya. Based in Nakuru.',
    url: 'https://isalebryan.dev/about',
    images: [{ url: '/img/portrait.jpg', width: 1200, height: 630, alt: 'Brian Isale — Full Stack Developer & Creative Designer' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@IsaleBryan',
    creator: '@IsaleBryan',
    title: 'About Brian Isale — Google Africa Scholar & Full Stack Developer',
    description: 'Nakuru-based developer, designer, and community builder. Google Africa Scholar, 6+ years experience.',
    images: ['/img/portrait.jpg'],
  },
}

// ProfilePage — schema.org type for about/bio pages; surfaces in AI knowledge panels
const profilePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  name: 'About Brian Isale',
  url: 'https://isalebryan.dev/about',
  description:
    'Biography and professional background of Brian Isale — Full Stack Developer, Creative Designer, and Community Builder based in Nakuru, Kenya.',
  mainEntity: {
    '@type': 'Person',
    name: 'Brian Isale',
    alternateName: ['BryanAim', 'Bryan Aim', 'Brian Aim', 'Janja', 'isalebryan', 'isalebrian', 'Bryan Isale', 'Isale Brian'],
    url: 'https://isalebryan.dev',
    image: 'https://isalebryan.dev/img/portrait.jpg',
    jobTitle: ['Full Stack Developer', 'Creative Designer', 'Community Builder'],
    description:
      'Brian Isale is a Full Stack Developer and Creative Designer based in Nakuru, Kenya. ' +
      'A Google Africa Scholar (Andela, 2019), he builds modern web applications with Next.js, React, ' +
      'TypeScript, Node.js, and Python. He crafts brand identities, motion graphics, and UI/UX designs. ' +
      'He mentors developers and runs community outreach programmes with HIV SEERs Kenya and Unilever Heroes for Change, ' +
      'having reached 3,000+ youth across Nakuru.',
    email: 'isale.bryan@gmail.com',
    telephone: '+254728822142',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nakuru',
      addressRegion: 'Nakuru County',
      addressCountry: 'KE',
    },
    alumniOf: {
      '@type': 'Organization',
      name: 'Andela',
      description: 'Google Africa Developer Scholarship — Mobile Web Specialist, 2019',
    },
    award: 'Google Africa Scholarship — Mobile Web Specialist (Andela & Pluralsight, 2019)',
    knowsAbout: [
      'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js',
      'Vue.js', 'Node.js', 'Python', 'Django', 'WordPress', 'Tailwind CSS',
      'Adobe Illustrator', 'Adobe Photoshop', 'UI/UX Design', 'Motion Graphics',
      'Brand Identity Design', 'Community Building',
    ],
    sameAs: [
      'https://linkedin.com/in/brian-isale/',
      'https://github.com/BryanAim',
      'https://behance.net/isalebryan',
      'https://twitter.com/IsaleBryan',
      'https://dev.to/bryanaim',
    ],
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',  item: 'https://isalebryan.dev' },
      { '@type': 'ListItem', position: 2, name: 'About', item: 'https://isalebryan.dev/about' },
    ],
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is Brian Isale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brian Isale (also known as BryanAim) is a Full Stack Developer, Creative Designer, and Community Builder based in Nakuru, Kenya. He is a Google Africa Scholar (Andela, 2019) with over 6 years of professional experience building web applications, designing brand identities, and mentoring developers across Africa.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Brian Isale known for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brian Isale is known for building full-stack web applications with Next.js and React, creating brand identities and motion graphics with Adobe tools, winning a Google Africa Scholarship through Andela in 2019, and running community outreach programmes in Nakuru, Kenya that have reached 3,000+ youth.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Brian Isale a Google Africa Scholar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Brian Isale was awarded a Google Africa Developer Scholarship through Andela in 2019, specialising in Mobile Web development via the Pluralsight learning platform.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where did Brian Isale study or train?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brian Isale is largely self-taught and sharpened his skills through the Google Africa Developer Scholarship with Andela (2019). He studied at Jomo Kenyatta University of Agriculture and Technology (JKUAT) and has built his expertise through hands-on projects and mentorship.',
      },
    },
    {
      '@type': 'Question',
      name: 'What programming languages does Brian Isale know?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brian Isale works with JavaScript, TypeScript, Python, and HTML/CSS. On the frontend he uses React, Next.js, Vue.js, and Tailwind CSS. On the backend he uses Node.js, Python/Django, with experience in WordPress and Google Cloud Platform.',
      },
    },
  ],
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={profilePageJsonLd} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  )
}
