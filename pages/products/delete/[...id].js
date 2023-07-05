import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

export default function DeleteProductPage(){
    const router = useRouter();
    const [productInfo, setProductInfo] = useState();
    const [titleProductLoading, setTitleProductLoading] = useState(false);
    const {id} = router.query;

    useEffect(() => {
        if(!id){
            return;
        }
        setTitleProductLoading(true);
        axios.get("/api/products?id="+id).then(response => {
            setProductInfo(response.data);
            setTitleProductLoading(false);
        })
    }, [id]);

    function goBack(){
        router.push("/products");
    }

    async function deleteProduct(){
        await axios.delete("/api/products?id="+id);
        goBack();
    }

return (
    <Layout>
        {titleProductLoading && (
                    <Spinner fullWidth={true}/>
        )}
        {!titleProductLoading && (
            <div>
                <h1 className="text-center">Esta seguro que quiere eliminar el producto "{productInfo?.title}"?</h1>
                <div className="flex gap-2 justify-center">
                    <button 
                        className="btn-red"
                        onClick={deleteProduct}>
                            Si
                    </button>
                    <button 
                        className="btn-default" 
                        onClick={goBack}>
                            No
                    </button>
                </div>
            </div>
        )}
    </Layout>
)
}