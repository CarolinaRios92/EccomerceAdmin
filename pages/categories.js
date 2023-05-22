import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({swal}){
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState("")

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
        const data = {name, parentCategory}
        if(editedCategory){
            await axios.put("/api/categories", {...data, _id:editedCategory._id})
            setEditedCategory(null);
        } else {
            await axios.post("/api/categories", data);
        }
        setName("");
        setParentCategory("");
        fetchCategories()
    }

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id)
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
                await axios.delete("/api/categories?_id="+category._id)
            }
            fetchCategories();
        }).catch(error => {
            console.log(error);
        }); 
    }

    return(
        <Layout>
            <h1>Categories</h1>

            <label>{editedCategory ? `Edit category ${editedCategory.name}` : "Create new category"}</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input 
                    className="mb-0" 
                    type="text" 
                    placeholder="Category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
                
                <select 
                    className="mb-0" 
                    value={parentCategory} 
                    onChange={e => setParentCategory(e.target.value)}>
                    <option value={0}>No parent category</option>
                    {categories.length > 0 && categories.map(category => (
                        <option value={category._id}>{category.name}</option>
                    ))}
                </select>

                <button type="submit" className="btn-primary py-1">Save</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category name</td>
                        <td>Parent category</td>
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
        </Layout>
    )
}
export default withSwal(({swal}, ref) => (
    <Categories swal={swal}/> 
))