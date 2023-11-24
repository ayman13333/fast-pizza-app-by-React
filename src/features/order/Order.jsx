// Test ID: IIDSAT

import { useFetcher, useLoaderData } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import OrderItem from "./OrderItem";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";
import { useEffect } from "react";
import UpdateOrder from "./UpdateOrder";

function Order() {
  const order=useLoaderData();
  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff

  const fetcher=useFetcher();

  useEffect(()=>{
   if(!fetcher.data && fetcher.state=='idle') fetcher.load('/menu');
  },[fetcher]);

  //console.log(fetcher.data);

  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="
    px-4 py-6 space-y-8
    ">
      <div className="flex flex-wrap items-center justify-between gap-3" >
        <h2 className="text-xl font-semibold">
        Order #{id} status
        </h2>

        <div className="space-x-2">
          {priority &&
          <span 
          className="rounded-full bg-red-500 px-3 py-1 
          text-sm font-semibold uppercase text-red-50 tracking-wide" >Priority</span>}
          <span
          className="rounded-full bg-green-500 px-3 py-1 
          text-sm font-semibold uppercase text-green-50 tracking-wide"
          >{status} order</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-xs text-stone-500">(Estimated delivery: {formatDate(estimatedDelivery)})</p>
      </div>

      <ul className="divide-stone-200 divide-y border-b border-t">
      {cart.map(item=>
        <OrderItem 
        item={item} 
        key={item.pizzaId}
        isLoadingIngredients={fetcher.state=='loading'}
        ingredients={fetcher.data?.find(el=>el.id===item.pizzaId).ingredients??[]}
         />
        )}
      </ul>

      <div className="space-y-2 bg-stone-200 px-6 py-5" >
        <p className="text-sm font-medium text-stone-600">Price pizza: {formatCurrency(orderPrice)}</p>
        {priority && <p className="text-sm font-medium text-stone-600">Price priority: {formatCurrency(priorityPrice)}</p>}
        <p className="font-bold">To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>
      </div>

      {!priority && <UpdateOrder order={order} />}
    </div>
  );
}

export async function loader({params}){

  const Order= await getOrder(params.orderId);
  return Order;
}

export default Order;
