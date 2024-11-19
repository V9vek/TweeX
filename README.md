## TweeX

https://github.com/user-attachments/assets/8cf1e8df-367e-4fee-8efa-0c9577109124

## Features
- **Post Tweets**: Share your thoughts with the world in real-time.
- **Follow Users**: Stay updated with the latest posts from your favorite people.
- **Responsive Design**: A seamless experience across devices.
- **Fast and Scalable**: Built with a modern tech stack to handle growth efficiently.

---

## Tech Stack
### Frontend
The frontend of Tweexx is designed to deliver a dynamic and seamless user experience, leveraging cutting-edge libraries and frameworks. Here's an overview:

- **Framework**:  
  Built on [Next.js](https://nextjs.org/) (v15.0.0-rc.0), a powerful React-based framework that ensures server-side rendering (SSR), static site generation (SSG), and API route integration.

- **Styling**:  
  - **Tailwind CSS**: A utility-first CSS framework for creating a sleek, responsive, and customizable user interface.
  - **Tailwind CSS Animate**: Adds polished animations and transitions to enhance interactivity.

- **UI Components**:  
  - **Radix UI**: Provides accessible and highly customizable components, such as dialogs, dropdown menus, tooltips, tabs, and toasts.
  - **Lucide React**: A modern and flexible icon library.

- **State Management**:  
  - **React Context API**: Simplifies global state management for themes and other app-wide states.
  - **@tanstack/react-query**: Handles complex asynchronous data fetching and caching efficiently, with developer tools for debugging.

- **Optimistic Updates**:  
  - Implemented using **@tanstack/react-query**, ensuring that user interactions like likes, follows, or retweets are reflected instantly on the UI, even before the backend confirms the operation.  
  - This approach provides a smoother and more responsive user experience, making the app feel lightning-fast.

- **Rich Text and File Uploads**:  
  - **Tiptap**: A modern WYSIWYG editor with support for extensions like placeholders and starter kits.  
  - **UploadThing**: Simplifies file uploads with an intuitive API.

- **Forms and Validation**:  
  - **React Hook Form**: A performant library for managing forms with minimal re-renders.  
  - **Zod**: Schema-based form validation for better type safety.  
  - **@hookform/resolvers**: Integrates `react-hook-form` with Zod for seamless validation.

- **Advanced Features**:  
  - **React Cropper**: Allows users to crop and adjust images before uploading.  
  - **React Intersection Observer**: Implements lazy loading and infinite scrolling efficiently.  
  - **Date-fns**: Simplifies date formatting and manipulation across the app.  

- **Theming**:  
  - **Next Themes**: Offers light/dark mode switching for a customizable user experience.

### Backend
The backend of Tweexx is designed to be efficient, scalable, and secure, leveraging modern serverless and database technologies. Here's a detailed breakdown:

- **API**:  
  - Built using [Next.js API routes](https://nextjs.org/docs/api-routes/introduction) for seamless integration with the frontend and support for serverless deployments.  
  - Provides RESTful endpoints for handling posts, user management, and interactions.  

- **Database**:  
  - Hosted on [Vercel's database offerings](https://vercel.com/docs/storage) with support for serverless solutions like Postgres and MySQL.  
  - **Prisma ORM**: Used for database schema management, migrations, and type-safe queries, ensuring a robust connection to the database.  

- **Authentication**:  
  - Powered by [Lucia](https://lucia-auth.com/), a modern authentication library with seamless integration for Next.js.  
  - Supports token-based authentication and OAuth with third-party providers like Google and GitHub, ensuring secure user login and session management.  

### TODO
- [ ] **Integrate Chat Feature**:  
  Implement a real-time chat system to enhance user interaction. Options include WebSocket-based solutions or integrating with platforms like Stream Chat.  

- [ ] **Multiple OAuth Logins**:  
  Expand support for more OAuth providers (e.g., Facebook, Twitter, LinkedIn) to make user registration and login more flexible.  

- [ ] **Caching**:  
  Introduce caching mechanisms (e.g., Redis or in-memory caching) to improve response times for frequently accessed data, such as user profiles and timelines.