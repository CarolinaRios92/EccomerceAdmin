import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({swal}){
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState("");
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, [])

    function fetchCategories(){
        axios.get("/api/categories").then(result => {
            setCategories(result.data);
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
        swal.fire({
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
                            Save
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
                    {categories.length > 0 && categories.map(category => (
                        <tr>
                            <td>{category.name}</td>
                            <td>{category.parent?.name}</td>
                            <td>
                                <button 
                                    className="btn-primary mr-1"
                                    onClick={() => editCategory(category)}>
                                        Edit
                                </button>

                                <button 
                                    className="btn-primary"
                                    onClick={() => deleteCategory(category)}>
                                        Delete
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
export default withSwal(({swal}, ref) => (
    <Categories swal={swal}/> 
))