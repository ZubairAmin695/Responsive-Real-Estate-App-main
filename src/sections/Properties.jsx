import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../components/DarkModeContext';
import { FaBath, FaBed, FaMapMarkerAlt, FaVideo, FaCamera } from 'react-icons/fa';
import { MdSpaceDashboard } from 'react-icons/md';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'aframe';
import { Entity, Scene } from 'aframe-react';
import Modal from 'react-modal';
import { useAuthContext } from '../components/AuthContext';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Properties = (props) => {    
    const { user } = useAuthContext();
    const [properties, setProperties] = useState([]);
    const [newProperty, setNewProperty] = useState({
        name: '',
        price: '',
        address: '',
        bath: '',
        bed: '',
        area: '',
        owner: '',
        images: [],
        about: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    useEffect(() => {
        AOS.init({
            offset: 200,
            duration: 800,
            easing: 'ease-in-sine',
            delay: 100,
        });

        // Fetch properties from the API when the component mounts
        const fetchProperties = async () => {
            try {
              const response = await axios.post('http://localhost:1337/api/v1/en/property/list');
              console.log(response);  // Check the response from the API
              setProperties(response.data.data);
            } catch (error) {
              console.error("Error fetching properties:", error);
              alert("Error: " + error.response?.status);  // Log the exact error
            }
          };
          
        fetchProperties();
    }, []);
    useEffect(() => {
        if (props.properties) {
            setProperties(props.properties);
        }
    }, [props.properties]);
    
    const { darkMode } = useDarkMode();

    // Handle input changes for text fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProperty({ ...newProperty, [name]: value });
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers)
            .then(images => {
                setNewProperty((prevState) => ({
                    ...prevState,
                    images: [...prevState.images, ...images]
                }));
            })
            .catch(error => {
                console.error("Error uploading images:", error);
                alert("Failed to upload images. Please try again.");
            });
    };

    // Submit form to add or update a property
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                property_name: newProperty.name,
                property_price: parseFloat(newProperty.price),
                property_address: newProperty.address,
                property_baths: parseInt(newProperty.bath, 10),
                property_beds: parseInt(newProperty.bed, 10),
                property_area: newProperty.area,
                property_owner: newProperty.owner,
                property_image: newProperty.images, // Send array of images
                property_description: newProperty.about,
            };

            if (isEditing) {
                // If editing, send PUT request to update property
                const response = await axios.post(`http://localhost:1337/api/v1/en/property/edit/${editingId}`, payload);
                const updatedProperties = [...properties];
                updatedProperties[editingIndex] = response.data.data;
                setProperties(updatedProperties);
                alert("Property updated successfully!");
            } else {
                // If adding a new property, send POST request
                const response = await axios.post('http://localhost:1337/api/v1/en/property/add', payload);
                setProperties([...properties, response.data.data]);
                alert("Property added successfully!");
            }

            // Reset form
            setNewProperty({
                name: '',
                price: '',
                address: '',
                bath: '',
                bed: '',
                area: '',
                owner: '',
                images: [],
                about: ''
            });
            setIsEditing(false);
            setEditingIndex(null);
            setEditingId(null);
        } catch (error) {
            console.error("Error saving property:", error);
            alert("Failed to save property. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Edit a property
    const handleEdit = (index) => {
        const property = properties[index];
        let images = [];

        // Parse property_image if it's a stringified array
        if (typeof property.property_image === "string") {
            images = property.property_image.split(",");
        } else {
            images = [property.property_image]; // Fallback for single image
        }

        setNewProperty({
            name: property.property_name,
            price: property.property_price.toString(),
            address: property.property_address,
            bath: property.property_baths.toString(),
            bed: property.property_beds.toString(),
            area: property.property_area,
            owner: property.property_owner,
            images: images,
            about: property.property_description,
        });
        setIsEditing(true);
        setEditingIndex(index);
        setEditingId(property.property_id);
    };


    // Delete a property
    const handleDelete = async (index, id) => {
        if (!window.confirm("Are you sure you want to delete this property?")) return;

        try {
            const response = await axios.get(`http://localhost:1337/api/v1/en/property/delete/${id}`);
            if (response.status === 200) {
                // Remove the property from the UI if the deletion was successful
                setProperties(properties.filter((_, i) => i !== index));
                alert("Property deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting property:", error);
            alert("Failed to delete property. Please try again.");
        }
    };

    // Delete a specific image from the property
    const handleDeleteImage = (imageIndex) => {
        const updatedImages = newProperty.images.filter((_, i) => i !== imageIndex);
        setNewProperty((prevState) => ({
            ...prevState,
            images: updatedImages
        }));
    };

    // Open modal to show the selected image
    const openModal = (image) => {
        setSelectedImage(image);
        setIsModalOpen(true);
        console.log("open model")
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage('');
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
    };


    return (
        <div className={`${darkMode ? 'dark bg-black' : 'light bg-transparent'}`}>
            <section className="lg:w[90%] m-auto lg:px-20 px-6 py-20 w-full flex flex-col justify-center items-start gap-10">
                <div className='flex flex-col justify-center items-start gap-4'>
                    <h1 data-aos="zoom-in" className='text-red-500 dark:text-white'>PROPERTIES</h1>
                    <h1 data-aos="zoom-in" className='text-black text-4xl font-semibold dark:text-white'>Explore the Latest</h1>
                </div>

                {/* Property Form */}
                {user ? (
                    <>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mb-10">
                        <input type="text" name="name" value={newProperty.name} onChange={handleInputChange} placeholder="Name" required />
                        <input type="text" name="price" value={newProperty.price} onChange={handleInputChange} placeholder="Price" required />
                        <input type="text" name="address" value={newProperty.address} onChange={handleInputChange} placeholder="Address" required />
                        <input type="text" name="bath" value={newProperty.bath} onChange={handleInputChange} placeholder="Baths" required />
                        <input type="text" name="bed" value={newProperty.bed} onChange={handleInputChange} placeholder="Beds" required />
                        <input type="text" name="area" value={newProperty.area} onChange={handleInputChange} placeholder="Area" required />
                        <input type="text" name="owner" value={newProperty.owner} onChange={handleInputChange} placeholder="Owner" required />
                        
                        {/* Image Upload */}
                        <input type="file" onChange={handleImageUpload} accept="image/*" />
                        <textarea name="about" value={newProperty.about} onChange={handleInputChange} placeholder="About the property" />
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                             {loading ? 'Saving...' : isEditing ? 'Update Property' : 'Add Property'}
                        </button>
                    </form>
                                    {/* Display Uploaded Images */}
                {newProperty.images.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-6">
                        {newProperty.images.map((image, index) => (
                            <div key={index} className="relative">
                                <img src={image} alt={`Property ${index}`} className="w-32 h-32 object-cover" onClick={() => openModal(image)} />
                                <button onClick={() => handleDeleteImage(index)} className="absolute top-0 right-0 bg-red-600 text-white p-1">X</button>
                            </div>
                        ))}
                    </div>
                )} </>
                ) : (
                    <p className="text-gray-500 dark:text-gray-300">Please log in to add or edit properties.</p>
                )}

                {/* Properties Grid */}
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-8">
                {properties.map((item, index) => {
                    let images = [];

                    // Parse property_image if it's a stringified array
                    if (typeof item.property_image === "string") {
                        images = item.property_image.split(",");
                    } else {
                        images = [item.property_image]; // Fallback for single image
                    }

                    return (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                            {/* Image Slider */}
                            <Slider {...settings} className="rounded-t-xl overflow-hidden">
                                {images.map((img, imgIndex) => (
                                    <div key={imgIndex} className="h-[250px]" onClick={() => openModal(img)}>
                                        <img
                                            src={img}
                                            alt={`Property ${imgIndex + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </Slider>

                            {/* Property Info */}
                            <div className="p-6">
                                <h1 className="text-xl text-black font-semibold dark:text-white">
                                    {item.property_name}
                                </h1>
                                <h1 className="text-xl text-green-600 font-bold dark:text-white">
                                    {item.property_address}
                                </h1>
                                <h1 className="text-xl text-blue-600 font-bold dark:text-white">
                                    {item.property_price}
                                </h1>
                                <p className="dark:text-white">{item.property_description}</p>

                                {/* Property Features */}
                                <div className="flex gap-4 mt-4">
                                    <div className="flex items-center gap-2">
                                        <FaBath className="text-blue-400" />
                                        <h1 className="dark:text-white">{item.property_baths}</h1>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaBed className="text-blue-400" />
                                        <h1 className="dark:text-white">{item.property_beds}</h1>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MdSpaceDashboard className="text-blue-400" />
                                        <h1 className="dark:text-white">{item.property_area}</h1>
                                    </div>
                                </div>

                                {/* Edit and Delete Buttons (Only for Logged-in Users) */}
                                {user && (
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button onClick={() => handleEdit(index)} className="px-4 py-2 bg-yellow-500 text-white rounded">Edit</button>
                                        <button onClick={() => handleDelete(index, item.property_id)} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

                {/* Modal for 360° Image View */}
                <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="Modal" overlayClassName="Overlay">
                <button onClick={closeModal} className="absolute top-0 right-0 m-4 p-2 bg-red-600 text-white">
                    Close
                </button>
                <Scene embedded>
                    <Entity primitive="a-sky" src={selectedImage} rotation="0 -130 0" />
                </Scene>
            </Modal>
            </section>
        </div>
    );
};

export default Properties;
