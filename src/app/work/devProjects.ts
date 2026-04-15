export interface DevProject {
  title: string
  img: string
  url: string
  github?: string
  desc: string
  tags: string[]
}

export const devProjects: DevProject[] = [
  {
    title: 'WeatherNow',
    img: '/img/projects/weather.jpg',
    url: 'https://weathernow-afb00.web.app/',
    github: 'https://github.com/BryanAim/weather-app',
    desc: 'Real-time weather app with geolocation and 5-day forecasts.',
    tags: ['JavaScript', 'Firebase', 'API'],
  },
  {
    title: 'Covid Tracker',
    img: '/img/projects/corona.jpg',
    url: 'https://isalebryan.dev/everything-corona-virus/',
    github: 'https://github.com/BryanAim/everything-corona-virus',
    desc: 'Live global COVID-19 statistics dashboard with charts.',
    tags: ['JavaScript', 'REST API', 'Charts'],
  },
  {
    title: 'VueGram',
    img: '/img/projects/vuegram.jpg',
    url: 'https://aim-vuegram.herokuapp.com/',
    github: 'https://github.com/BryanAim/vuegram',
    desc: 'Instagram-inspired photo sharing app built with Vue.js and Firebase.',
    tags: ['Vue.js', 'Firebase', 'Vuex'],
  },
  {
    title: 'NaxTechmakers',
    img: '/img/projects/naxtechmakers.jpg',
    url: 'http://naxtechmakers.com/',
    github: 'https://github.com/NakuruTechMakers/techiesofnakuru',
    desc: 'Community website for the Nakuru tech ecosystem.',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'Personal Portfolio',
    img: '/img/projects/my-portfolio.jpg',
    url: 'https://isalebryan.dev',
    github: 'https://github.com/BryanAim/bryanaim.github.io',
    desc: 'This site — built with Next.js, TypeScript, and Framer Motion.',
    tags: ['Next.js', 'TypeScript', 'Framer Motion'],
  },
  {
    title: 'Personal Library',
    img: '/img/projects/project1.jpg',
    url: 'https://github.com/BryanAim/FCC-personal-library',
    github: 'https://github.com/BryanAim/FCC-personal-library',
    desc: 'freeCodeCamp quality assurance project — book library API.',
    tags: ['Node.js', 'Express', 'MongoDB'],
  },
  {
    title: 'GSAP Scroll Animation',
    img: '/img/projects/project2.jpg',
    url: 'https://github.com/BryanAim/gsap-scroll-animation',
    github: 'https://github.com/BryanAim/gsap-scroll-animation',
    desc: 'Smooth scroll-triggered animation experiments with GSAP.',
    tags: ['GSAP', 'JavaScript', 'CSS'],
  },
]
