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
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [goToProducts, setGoToProducts] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productProperties, setProductProperties] = useState(existingProperties || null);
    const router = useRouter();

    const [productProp, setProductProp] = useState([]);

    useEffect(() => {
        setCategoriesLoading(true);
        axios.get("/api/categories").then(result => {
            setCategories(result.data);
            setCategoriesLoading(false);
        })
    }, []);

    const propertiesToFill = [];

    var nameProperty = "";

    if(categories?.length > 0 && category){
        let catInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        nameProperty = catInfo.properties[0].name;
        while(catInfo?.parent?._id){
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        };
    }
    
    const properySelectProducts = [];
    const unitsPropertySelect = [];

    if(productProperties !== null){
        for(const property in productProperties[nameProperty]){
            properySelectProducts.push(property);
            unitsPropertySelect.push(productProperties[nameProperty][property])
        }
    } 

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

    function handleDeleteProperty(property, e){
        e.preventDefault()
        delete productProperties[nameProperty][property]
        setProductProperties({...productProperties});
    }

    function addStock(e){
        e.preventDefault();
        
        const propName = productProp[0];
        const propValue = productProp[1];
        const propUnits = productProp[2];

        if(productProperties !== null && productProperties[propName][propValue] !== undefined){
            alert("Ya tenes ese producto")
            return;
        } 
            setProductProperties(prev => {
                const newProductProps = {...prev};
                if(productProperties === null){
                    newProductProps[propName] = {};
                    newProductProps[propName][propValue] = propUnits;
                }
                newProductProps[propName][propValue] = propUnits;
                return newProductProps;
            });

            setProductProp([]);
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

    function deleteImage(e, value, index){
        e.preventDefault()
        const newImages = images.filter((img) => images.indexOf(img) !== index);
        setImages(newImages);
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
                
                {categoriesLoading && (
                    <Spinner />
                )}

                {propertiesToFill.length > 0 && propertiesToFill.map((property, index) => (
                    <form
                        key={index} 
                        className="flex flex-row gap-3">
                        <div className="basis-2/4">
                            <label>
                                {property.name[0].toUpperCase() + property.name.substring(1)}
                            </label>
                            <div>
                                <select
                                    value={productProp[1] || "default"} 
                                    required
                                    defaultValue="default"
                                    onChange={(e) => setProductProp([property.name, e.target.value])}>
                                        <option 
                                            disabled
                                            value="default">Seleccionar</option>
                                    {property.values.map(value => (
                                        <option className="capitalize" value={value}>{value}</option>
                                    ))} 
                                </select>
                            </div>
                        </div>

                        <div className="basis-1/4">   
                            <label>Unidades</label>
                            <input
                                className="py-1.5"
                                min="1"
                                required
                                type="number"
                                value={productProp[2] || 0}
                                placeholder="unidades"
                                onChange={(e) => setProductProp(prev => [prev[0], prev[1] , e.target.value])}/>                 
                        </div>

                        <div className="flex h-fit items-end pt-7 basis-1/4">
                            <button
                                disabled={productProp.length < 3}
                                className="btn-primary"
                                onClick={addStock}>
                                    Agregar
                            </button>
                        </div>

                    </form>
                ))
                }

                <div className="flex gap-2">
                    {properySelectProducts.length > 0 && unitsPropertySelect.length > 0 && properySelectProducts.map((property, index) => (
                        <div key={property}>
                            <div className="bg-cyan-500 p-2 rounded-sm text-sm text-white">
                                {`${property} ${unitsPropertySelect[index]} unid`}
                                <button
                                    className="text-black cursor-pointer pl-2 font-semibold"
                                    onClick={(e) => handleDeleteProperty(property, e)}>
                                    X
                                </button>
                            </div>
                        </div>
                ))}
                </div>


                <label>
                    Fotos:
                </label>
                <div className="mb-2 flex flex-wrap gap-1">
                    <ReactSortable 
                        list={images} 
                        setList={updateImagesOrder}
                        className="flex flex-wrap gap-1">
                        
                        {!!images?.length && images.map((link, index) => (
                            <div className="h-28 bg-white p-2 shadow-sm rounded-sm border border-gray-200 flex items-start gap-1">
                                <img src={link} className="rounded-lg"/>
                                <button
                                    className="shadow-sm rounded-sm bg-gray-300 p-0.5 font-semibold text-xs"
                                    onClick={(e) => deleteImage(e, link, index)}>
                                        X
                                    </button>
                            </div>
                        ))}

                    </ReactSortable>
                  
                    {isUploading && (
                        <div className="h-24 p-1 flex items-center">
                            <Spinner />
                        </div>
                    )}
                    <label className="w-24 h-24 cursor-pointer text-center text-primary flex flex-col items-center justify-center text-sm gap-1 rounded-sm bg-white shadow-sm border border-primary">
                        <svg className="w-7 h-7" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <div>
                            Agregar imagen
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

                <button type="submit" className="btn-primary">Guardar</button>
            </form>
        </div>
    )
}