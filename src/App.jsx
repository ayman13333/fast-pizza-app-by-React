import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./ui/Home";
import Menu, { loader as menuLoader } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import Order, { loader as orderLoader } from "./features/order/Order";
import { action as updateOrderAction} from "./features/order/UpdateOrder";
import CreateOrder, {
  action as createOrderAction,
} from "./features/order/CreateOrder";
import AppLayOut from "./ui/AppLayOut";
import Error from "./ui/Error";
//we used this to fetching data in routes  in 6.4 version
const router = createBrowserRouter([
  {
    element: <AppLayOut />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader,
        errorElement: <Error />,
      },
      { path: "/cart", element: <Cart /> },
      {
        path: "/order/:orderId",
        element: <Order />,
        loader: orderLoader,
        action:updateOrderAction,
        errorElement: <Error />,
      },
      {
        path: "/order/new",
        element: <CreateOrder />,
        action: createOrderAction,
        errorElement: <Error />,
      },
    ],
  },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
