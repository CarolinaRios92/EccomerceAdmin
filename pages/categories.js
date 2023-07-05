import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Categories(){
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState("");
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, [])

    function fetchCategories(){
        setIsLoading(true);
        axios.get("/api/categories").then(result => {
            setCategories(result.data);
            setIsLoading(false);
        })
    }

    async function saveCategory(e){
        e.preventDefault();
        const data = {
            name, 
            parentCategory,
            properties: properties.map(property => ({
                name: property.name,
                values: property.values.split(","),
            }))
        };
        if(editedCategory){
            await axios.put("/api/categories", {...data, _id:editedCategory._id})
            setEditedCategory(null);
        } else {
            await axios.post("/api/categories", data);
        }
        setName("");
        setParentCategory("");
        setProperties([]);
        fetchCategories()
    }

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties?.map(({name, values}) => ({
                name,
                values: values.join(",")
            }))
        );
    }

    function deleteCategory(category){
        Swal.fire({
            title: "Estas seguro?",
            text: `Quieres eliminar de forma permanente la categoria ${category.name}`,
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d55",
            confirmButtonText: "Si, borralo!",
            reverseButtons: true,
        }).then(async result => {
            if(result.isConfirmed){
                await axios.delete("/api/categories?_id="+category._id);
            }
            fetchCategories();
        }).catch(error => {
            console.log(error);
        }); 
    }

    function addProperty(){
        setProperties(prev => {
            return [...prev, {name:"", values:""}];
        })
    }

    function handlePropertyNameChange(index, property, newName){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    }

    function handlePropertyValuesChange(index, property, newValues){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        })
    }

    function removeProperty(indexToRemove){
        setProperties(prev => {
            return [...prev].filter((property, pIndex) => {
                return pIndex !== indexToRemove;
            })
        })
    }

    return(
        <Layout>
            <h1>Categorias</h1>

            <label>{editedCategory 
                ? `Editar categoria ${editedCategory.name}` 
                : "Crear una nueva categoria"}
            </label>

            <form onSubmit={saveCategory}>

                <div className="flex gap-1">

                    <input 
                    type="text" 
                    placeholder="Nombre de la Categoria"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
                
                    <select 
                        value={parentCategory} 
                        onChange={e => setParentCategory(e.target.value)}>
                        
                        <option value="">Sin categoria padre</option>
                        {categories.length > 0 && categories.map(category => (
                            <option 
                                key={category._id} 
                                value={category._id}>
                                    {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block">Propiedades</label>
                    <button 
                        type="button"
                        onClick={addProperty}
                        className="btn-default text-sm mb-2 mt-1">
                            Agregar una nueva propiedad
                    </button>

                    {properties?.length > 0 && properties.map((property, index) => (
                        <div key={index} className="flex gap-1 mb-2">
                            <input 
                                type="text" 
                                placeholder="Nombre de propiedad (ejemplo: color)"
                                value={property.name} 
                                className="mb-0"
                                onChange={(e) => handlePropertyNameChange(index, property, e.target.value)}/>
                            <input 
                                type="text" 
                                placeholder="valores, separados por comas" 
                                value={property.values}
                                className="mb-0"
                                onChange={(e) => handlePropertyValuesChange(index, property, e.target.value)}/>
                            
                            <button
                                onClick={() => removeProperty(index)}
                                type="button"
                                className="btn-red">
                                    Remove
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="flex gap-1">
                    {editedCategory && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditedCategory(null);
                                setName("");
                                setParentCategory("");
                                setProperties([]);
                            }}
                            className="btn-default">
                            Cancelar
                        </button>
                    )}

                    <button 
                        type="submit" 
                        className="btn-primary py-1">
                            Guardar
                    </button>
                </div>
            </form>
            {!editedCategory && ( 
            
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Categoria</td>
                        <td>Categoria padre</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={3}>
                                <div className="py-6">
                                    <Spinner fullWidth={true} />
                                </div>
                            </td>
                        </tr>
                    )}
                    {categories.length > 0 && categories.map(category => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category.parent?.name}</td>
                            <td className="flex">
                                <button 
                                    className="btn-default mr-1 flex items-center gap-1 text-sm"
                                    onClick={() => editCategory(category)}>
                                        <svg className="w-3 h-3" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                        Editar
                                </button>

                                <button 
                                    className="btn-red flex items-center gap-1 text-sm"
                                    onClick={() => deleteCategory(category)}>
                                        <svg className="w-3 h-3" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                        Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}    
        </Layout>
    )
}