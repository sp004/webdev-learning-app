# Online Web Development Learning and Teaching platform: MERN(MongoDB, Express, Node, React) Stack

## Screenshots

![App Screenshot](https://res.cloudinary.com/dh4nb9zjl/image/upload/v1695055626/webdevskool/github%20screenshots/home_ics93p.png)

![App Screenshot](https://res.cloudinary.com/dh4nb9zjl/image/upload/v1695055990/webdevskool/github%20screenshots/course3_ublln5.png)

![App Screenshot](https://res.cloudinary.com/dh4nb9zjl/image/upload/v1695055625/webdevskool/github%20screenshots/course2_pqrapz.png)

![App Screenshot](https://res.cloudinary.com/dh4nb9zjl/image/upload/v1695055991/webdevskool/github%20screenshots/mycourses_j1ntmn.png)

![App Screenshot](https://res.cloudinary.com/dh4nb9zjl/image/upload/v1695055780/webdevskool/github%20screenshots/create-course_eflacs.png)

![App Screenshot](https://res.cloudinary.com/dh4nb9zjl/image/upload/v1708352382/webdevskool/github%20screenshots/search_puu9nb.png)

![App Screenshot](https://res.cloudinary.com/dh4nb9zjl/image/upload/v1695056937/webdevskool/github%20screenshots/admin_sjoyav.png)

## Key Features

- **Signin with Google** or using **OTP** (in registered email)
- Students can add courses in the cart, wishlist
- Purchase course using **RazorPay with refund** option
- **Filter** and **sort** courses based on different attributes
- Students can create **Instructor account** to upload courses
- Students who have Instructor account, cannot delete their account
- After uploading courses, admin will **approve or reject** the course from **admin panel** - https://webdevskool-admin.vercel.app/
- Courses with Approved status, will be published for purchase
- Students can provide **feedback** with **rating** on enrolled courses, also can **modify** & **delete** their feedback
- **Edit user profile** at any time
- Fully **responsive**



## Optimizations

 - Implement **lazy loading** to improve performance by increasing page loading by 20% 
 - Apply **debouncing** to limit API calls at the time of searching
 - Implement **event propagation** for better optimization




## Run Locally

Clone the project

```bash
  git clone https://github.com/sp004/webdev-learning-app.git
```

Go to the project directory

```bash
  cd webdev-learning-app
```

Install client dependencies and start client app

```bash
  cd client
  npm install
  npm run start
```

Install server dependencies and start server

```bash
  cd server
  npm install
  npm run dev
```

Install admin dependencies and start admin app

```bash
  cd admin
  npm install
  npm run dev
```
