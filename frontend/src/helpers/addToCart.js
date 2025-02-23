import { useContext } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AddToCart = async (e, id,authToken) => {
    e?.stopPropagation();
    e?.preventDefault();

    const response = await fetch(SummaryApi.addToCartProduct.url, {
        method: SummaryApi.addToCartProduct.method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`, // Add token to Authorization header
        },
        body: JSON.stringify({ productId: id }),
    });

    const responseData = await response.json();

    if (responseData.success) {
        toast.success(responseData.message);
    }

    if (responseData.error) {
        toast.error(responseData.message);
    }

    return responseData;
};

export default AddToCart;
