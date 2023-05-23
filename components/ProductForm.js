import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm ({
    _id,
    title:existingTitle, 
    description:existingDescription, 
    price:existingPrice,
    images:existingImages,
    category:existingCategory,
    properties: existingProperties,
}){    
    const [title, setTitle] = useState(existingTitle || "");
    const [description, setDescription] = useState(existingDescription || "");
    const [price, setPrice] = useState(existingPrice || "");
    const [images, setImages] = useState(existingImages || []);
    const [category, setCategory] = useState(existingCategory || "");
    const [isUploading, setIsUploading] = useState(false);
    const [goToProducts, setGoToProducts] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productProperties, setProductProperties] = useState(existingProperties || {});
    const router = useRouter();

    useEffect(() => {
        axios.get("/api/categories").then(result => {
            setCategories(result.data);
        })
    }, [])

    async function saveProduct(e){
        e.preventDefault();
        const data = {
                    title, 
                    description, 
                    price, 
                    images, 
                    category, 
                    properties:productProperties
        };
        if(_id){
            // update
            await axios.put("/api/products", {...data, _id});
        } else {
            // create
            await axios.post("/api/products", data);
        }
        setGoToProducts(true);        
    }

    if(goToProducts){
        router.push("/products")
    }

    async function uploadImages(e){
        const files = e.target?.files;
        if(files?.length > 0){
            setIsUploading(true);
            const data = new FormData();
            for (const file of files){
                data.append("file", file)
            }
            const res = await axios.post("/api/upload", data);
            console.log(res.data);
            setImages(oldImages => {
                return [...oldImages, ...res.data];
            });
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images){
        setImages(images);
    }

    const propertiesToFill = [];
    if(categories?.length > 0 && category){
        let catInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        while(catInfo?.parent?._id){
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    function setProductProp(propName, value){
        setProductProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[propName] = value;
            return newProductProps;
        })
    }

    return (
        <div>
            <form onSubmit = {saveProduct}>

                <label>Nombre del Producto:</label>
                <input 
                    type="text" 
                    placeholder="Product name" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}/>
                
                <label>Categoria:</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Uncategorized</option>
                    {categories.length > 0 && categories.map(category => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>
                
                {propertiesToFill.length > 0 && propertiesToFill.map(property => (
                    <div className="flex gap-1">
                        <div>
                            {property.name}
                        </div>
                        <select
                            value={productProperties[property.name]} 
                            onChange={(e) => setProductProp(property.name, e.target.value)}>
                            {property.values.map((value => (
                                <option value={value}>{value}</option>
                            )))}
                        </select>
                    </div>
                ))
                }

                <label>
                    Fotos:
                </label>
                <div className="mb-2 flex flex-wrap gap-1">
                    <ReactSortable 
                        list={images} 
                        setList={updateImagesOrder}
                        className="flex flex-wrap gap-1">
                        
                        {!!images?.length && images.map(link => (
                            <div className="h-24">
                                <img src={link} className="rounded-lg"/>
                            </div>
                        ))}

                    </ReactSortable>
                  
                    {isUploading && (
                        <div className="h-24 p-1 flex items-center">
                            <Spinner />
                        </div>
                    )}
                    <label className="w-24 h-24 cursor-pointer text-center text-gray-500 flex items-center justify-center text-sm gap-1 rounded-lg bg-gray-200">
                        <svg className="w-7 h-7" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <div>
                            Upload
                        </div>
                        <input type="file" className="hidden" onChange={(e) => uploadImages(e)}/>
                    </label>
                </div>

                <label>Descripción: </label>
                <textarea 
                    value={description} 
                    placeholder="Description" 
                    onChange={e => setDescription(e.target.value)}></textarea>

                <label>Precio: </label>
                <input 
                    type="number" 
                    placeholder="Price" 
                    value={price} 
                    onChange={e => setPrice(e.target.value)}/>

                <button type="submit" className="btn-primary">Save</button>
            </form>
        </div>
    )
}