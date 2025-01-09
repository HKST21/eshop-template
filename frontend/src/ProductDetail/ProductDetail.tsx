import  { useEffect,  useState } from "react";
import { useParams } from "react-router-dom";
import eshop from "../class/eshopFeClass";
import { Product } from '../types/types';



export function ProductDetail() {

    const [product, setProduct] = useState<Product | null>(null);

    const { id } = useParams(); // bere id z routy

    useEffect(() => {

        const loadProduct = async () => {
            
            if (id) {
                const productWithDetail = await eshop.getProductById(id);

                setProduct(productWithDetail)
            }
        }
        loadProduct()
    },[id])


    return (
        <div>
            {product?.name}
            <p/>
            {product?.description}
            <p/>
            {product?.imageUrl}
            <p/>
            {product?.stockQuantity}
            <p/>
            {product?.price}
        </div>

    )


}