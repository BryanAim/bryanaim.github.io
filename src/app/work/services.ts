export interface Service {
  serviceId: string
  icon: string
  title: string
  color: string
  desc: string
  deliverables: string[]
  pricing: string
  turnaround: string
}

export const services: Service[] = [
  {
    serviceId: 'website',
    icon: 'fas fa-laptop-code',
    title: 'Website Design & Development',
    color: '#00ddd7',
    desc: 'Custom websites built fast and clean — from landing pages to full web apps. WordPress, Next.js, or plain HTML/CSS depending on what fits.',
    deliverables: ['Responsive design', 'SEO-ready markup', 'CMS integration', 'Hosting setup'],
    pricing: 'From KES 15,000',
    turnaround: '1–3 weeks',
  },
  {
    serviceId: 'logo',
    icon: 'fas fa-paint-brush',
    title: 'Logo & Brand Identity',
    color: '#b1db00',
    desc: 'A brand that looks intentional. Logo design, colour palettes, typography, and brand guidelines delivered in editable files.',
    deliverables: ['Primary + secondary logo', 'Color palette & fonts', 'Brand guidelines PDF', 'All file formats (AI, PNG, SVG)'],
    pricing: 'From KES 5,000',
    turnaround: '3–7 days',
  },
  {
    serviceId: 'motion',
    icon: 'fas fa-film',
    title: 'Motion Graphics & Social Media',
    color: '#ff8c42',
    desc: 'Animated graphics for social media, presentations, or video intros. Eye-catching visuals that stop the scroll.',
    deliverables: ['Animated logo / intro', 'Social media post templates', 'Story & reel graphics', 'MP4 + GIF exports'],
    pricing: 'From KES 3,000',
    turnaround: '2–5 days',
  },
  {
    serviceId: 'uiux',
    icon: 'fas fa-pen-ruler',
    title: 'UI/UX Design',
    color: '#a78bfa',
    desc: 'Wireframes and high-fidelity mockups for apps and websites. Figma files you can hand off to any developer — or me.',
    deliverables: ['Wireframes', 'High-fidelity mockups', 'Interactive prototype', 'Figma source file'],
    pricing: 'From KES 8,000',
    turnaround: '1–2 weeks',
  },
  {
    serviceId: 'email',
    icon: 'fas fa-envelope-open-text',
    title: 'Email Marketing Setup',
    color: '#f472b6',
    desc: 'Mailchimp campaigns, templates, and automation flows set up and ready to send. Great for small businesses and community organisations.',
    deliverables: ['Account & list setup', 'Custom email template', 'Automation flow', 'Sending guide'],
    pricing: 'From KES 4,000',
    turnaround: '3–5 days',
  },
  {
    serviceId: 'mentorship',
    icon: 'fas fa-chalkboard-teacher',
    title: 'Coding Mentorship',
    color: '#34d399',
    desc: '1-on-1 sessions for students learning web development. HTML, CSS, JavaScript, or React — structured around your pace and goals.',
    deliverables: ['Personalised learning plan', 'Session notes & resources', 'Code review', 'Ongoing support via WhatsApp'],
    pricing: 'KES 800 / hr',
    turnaround: 'Flexible schedule',
  },
]
