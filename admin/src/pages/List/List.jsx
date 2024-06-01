import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify';

const List = ({url="http://localhost:4000"}) => {
    const [list, setList] = useState([]);
    const [editing, setEditing] = useState(false);
    const [currentFood, setCurrentFood] = useState({});

    const fetchList = async() => {
        const response = await axios.get(`${url}/api/food/list`);
        if(response.data.success){
            setList(response.data.data);
        }else{
            toast.error("Error fetching food list");
        }
    }

    const removeFood = async(foodId) =>{
        const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
        await fetchList();
        if(response.data.success){
            toast.success(response.data.message);
        }else{
            toast.error("Error removing food");
        }
    }

    const updateFood = async() => {
        const formData = new FormData();
        formData.append('id', currentFood._id);
        formData.append('name', currentFood.name);
        formData.append('description', currentFood.description);
        formData.append('price', currentFood.price);
        formData.append('category', currentFood.category);
        if (currentFood.image) {
            formData.append('image', currentFood.image);
        }

        const response = await axios.post(`${url}/api/food/update`, formData);
        await fetchList();
        if(response.data.success){
            toast.success(response.data.message);
            setEditing(false);
            setCurrentFood({});
        }else{
            toast.error("Error updating food");
        }
    }

    const handleEditClick = (food) => {
        setEditing(true);
        setCurrentFood(food);
    }

    useEffect(()=>{
        fetchList();
    },[])

    return (
        <div className='list add flex-col'>
            <p>All Foods List</p>
            <div className="list-table">
                <div className="list-table-format">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Action</b>
                </div>
                {list.map((item, index) => (
                    <div key={index} className='list-table-format'>
                        <img src={`${url}/images/`+item.image} alt="" />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>₹{item.price}</p>
                        <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
                        <p onClick={() => handleEditClick(item)} className='cursor'>Edit</p>
                    </div>
                ))}
            </div>
            {editing && (
                <div className="edit-form">
                    <h2>Edit Food</h2>
                    <input type="text" value={currentFood.name} onChange={(e) => setCurrentFood({...currentFood, name: e.target.value})} placeholder="Name" />
                    <input type="text" value={currentFood.description} onChange={(e) => setCurrentFood({...currentFood, description: e.target.value})} placeholder="Description" />
                    <input type="text" value={currentFood.price} onChange={(e) => setCurrentFood({...currentFood, price: e.target.value})} placeholder="Price" />
                    <input type="text" value={currentFood.category} onChange={(e) => setCurrentFood({...currentFood, category: e.target.value})} placeholder="Category" />
                    <input type="file" onChange={(e) => setCurrentFood({...currentFood, image: e.target.files[0]})} />
                    <button onClick={updateFood}>Update</button>
                    <button onClick={() => setEditing(false)}>Cancel</button>
                </div>
            )}
        </div>
    )
}

export default List
