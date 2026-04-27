import { StrictMode }                from 'react'
import { createRoot }                from 'react-dom/client'
import { lazy, Suspense }            from 'react'
import { RouterProvider,
         createBrowserRouter }       from 'react-router-dom'
import './index.css';

import Error       from './Components/Error.jsx'
import ShimmerCard from './Components/Shimmerui.jsx'
import ProtectedRoute from './Components/ProtectedRoute.jsx' // ✅ import

const Search         = lazy(() => import('./Components/Search.jsx'));
const Productdetails = lazy(() => import('./Components/Productdetails.jsx'));
const ProductItem    = lazy(() => import('./Components/ProductItem.jsx'));
const App            = lazy(() => import('./App.jsx'));
const Cart           = lazy(() => import('./Cart.jsx'));
const Cartitem       = lazy(() => import('./Components/Cartitem.jsx'));
const Sign           = lazy(() => import('./Components/Sign.jsx'));
const Register       = lazy(() => import('./Components/Register.jsx'));

const Loading = <div className="text-center text-2xl">Loading...</div>;

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<ShimmerCard />}>
        <App />
      </Suspense>
    ),
    errorElement: <Error />,
    children: [
      {
        path: "productdetails/:id",
        element: (
          <Suspense fallback={Loading}>
            <ProductItem />
          </Suspense>
        ),
      },
      {
        path: "search",
        element: (
          <Suspense fallback={Loading}>
            <Search />
          </Suspense>
        ),
      },
      {
        path: "productdetails",
        element: (
          <Suspense fallback={Loading}>
            <Productdetails />
          </Suspense>
        ),
      },

      // ✅ Protected Routes — only accessible when logged in
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Suspense fallback={Loading}>
              <Cart />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "cartitem",
        element: (
          <ProtectedRoute>
            <Suspense fallback={Loading}>
              
              <Cartitem />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      // ✅ Public Routes — accessible without login
      {
        path: "signin",
        element: (
          <Suspense fallback={Loading}>
            <Sign />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={Loading}>
            <Register />
          </Suspense>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={appRouter} />
);