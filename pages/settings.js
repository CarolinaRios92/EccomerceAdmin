import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function SettingsPage(){
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [featuredLoading, setFeaturedLoading] = useState(false);
    const [featuredProductId, setFeaturedProductId] = useState("")

    useEffect(() => {
        setProductsLoading(true);
        axios.get("/api/products").then(response => {
            setProducts(response.data);
            setProductsLoading(false);
        });
        setFeaturedLoading(true);
        axios.get("/api/settings?name=featuredProductId").then(response => {
            setFeaturedProductId(response.data.value)
            setFeaturedLoading(false);
        })
    }, []);

    async function saveSettings(){
        await axios.put("/api/settings", {
            name: "featuredProductId",
            value: featuredProductId
        }).then(() => {
            Swal.fire({
                title: "Cambio guardado",
                icon: "success",
            })
        })
    }

    return (
        <Layout>
            <h1>Configuración</h1>
            {(productsLoading || featuredLoading) && (
                <Spinner fullWidth={true}/>
            )}
            {(!productsLoading || !featuredLoading) && (
                <>
                    <label>Producto Destacado</label>
                    <select value={featuredProductId} onChange={(e) => setFeaturedProductId(e.target.value)}>
                        {products.length > 0 && products.map(product => (
                            <option value={product._id}>{product.title}</option>
                        ))}
                    </select>
                    <div>
                        <button
                            onClick={saveSettings} 
                            className="btn-primary">
                                Guardar Cambios
                        </button>
                    </div>
                </>
            )}
            
        </Layout>
    )
}