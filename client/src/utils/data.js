import header from '../assets/header.png'
import header2 from '../assets/header2.png'

export const sliderItems = [
  {
    id: 1,
    img: `${header}`,
    title: "Best Web Development Courses",
    desc: `Get world's BEST Web Development courses at most affordable price`,
    bg: "#f5fafd",
  },
  {
    id: 2,
    img: `${header2}`,
    title: "Teach & Earn From Home",
    desc: "Become an Instructor and sell your Webdev courses",
    bg: '#fcf1ed',
    button: 'Be a Teacher',
    link: '/instructor/onboarding'
  }
];

export const levelFilters = [
  {
    level: 'Beginner',
    id: 'beginner'
  },
  {
    level: 'Intermediate',
    id: 'intermediate'
  },
  {
    level: 'Advanced',
    id: 'advanced'
  },
  {
    level: 'All',
    id: 'all'
  },
]

export const categoryFilters = [
  {
    category: 'Frontend Developent',
    id: 'frontend'
  },
  {
    category: 'Backend Developent',
    id: 'backend'
  },
  {
    category: 'Fullstack Developent',
    id: 'fullstack'
  }
]

