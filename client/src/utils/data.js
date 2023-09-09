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

//course section
// export const courses = [
//   {
//     title: "DSA Basics",
//     desc: 'Lorem ipsum dolor sit amet, consectetur lorem, sed do eiusmod tempor incidid lorem. Lorem ipsum dolor amet, consect.',
//     thumbnail: "https://img-c.udemycdn.com/course/240x135/4614502_28e1_3.jpg",
//     instuctor: "Souvik Pal",
//     // rating: 4.5,
//     // ratedBy: 13,
//     category: "DSA",
//     level: "Beginner",
//     price: "12",
//     couponCode: "EARLYBIRD25",
//     tag: "Bestseller",
//     totalEnrolled: 20,

//     contents:
//       [
//         {
//           section: 'Introduction',
//           lectures: [
//             {
//               title: "Intro to DSA",
//               duration: 150
//             },
//             {
//               title: "Basics of Algo",
//               duration: 250
//             },
//           ]
//         },
//         {
//           section: 'Details',
//           lectures: [
//             {
//               title: "Intro to DSA",
//               duration: 120
//             },
//             {
//               title: "Basics of Algo",
//               duration: 200
//             },
//           ]
//         },
//       ],

//     content: [
//       {
//         introduction: [
//           {
//             title: "Intro to DSA",
//             duration: 150
//           },
//           {
//             title: "Basics of Algo",
//             duration: 250
//           },
//         ],
//       },
//       {
//         conclusion: [
//           {
//             title: "conclude to DSA",
//             duration: 550
//           },
//           {
//             title: "What's next",
//             duration: 450
//           },
//         ],
//       },
//       {
//         "Detailed Views": [
//           {
//             title: "All about DSA",
//             duration: 55
//           },
//         ],
//       },
//     ],
//     reviews: [
//       {
//         userId: 1,
//         comment: "Lorem Ipsum is Lorem Ipsum and Lorem Ipsum is",
//         rate: 5
//       },
//       {
//         userId: 2,
//         comment: "Lorem Ipsum is Lorem Ipsum and Lorem Ipsum is",
//         rate: 4
//       },
//     ],
//     requirements: [
//       "NO Android/ Java or iOS (Swift, ObjectiveC) development experience is required",
//       "React knowledge is a must (but you absolutely DON'T have to be an expert)"
//     ],
//     isReviewed: false,
//     currentStatus: "" //published, unpublished, ""
//   },
// ]
