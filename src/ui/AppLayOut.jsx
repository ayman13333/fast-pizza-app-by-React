import { Outlet, useNavigation } from "react-router-dom";
import CartOverview from "../features/cart/CartOverview";
import Header from "./Header";
import Loader from "./Loader";

//we must tell app layout to use child routes 
//this is by Outlet


//Outlet: render every child componant refer to yhe route
//كل مييجي مثلا /cart
//هتعمل render to this component in AppLayOut component
export default function AppLayOut() {

  const navigation=useNavigation();
  const isLoading=navigation.state==='loading';

  return (
    <div className="grid-rows-[auto_1fr_auto] grid h-screen">
    {isLoading && <Loader />}
      <Header />
      <div className="overflow-scroll">
      <main className="max-w-3xl mx-auto ">
        <Outlet />
      </main>
      </div>

      <CartOverview />
    </div>
  )
}
