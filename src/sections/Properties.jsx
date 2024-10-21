import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../components/DarkModeContext';
import { FaBath, FaBed, FaMapMarkerAlt, FaVideo, FaCamera } from 'react-icons/fa';
import { MdSpaceDashboard } from 'react-icons/md';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'aframe';
import { Entity, Scene } from 'aframe-react'; // A-Frame for 360 VR
import Modal from 'react-modal'; // Modal for showing the images in a popup

const Properties = () => {
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
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [selectedImage, setSelectedImage] = useState(''); // Selected image for 360 view

    useEffect(() => {
        AOS.init({
            offset: 200,
            duration: 800,
            easing: 'ease-in-sine',
            delay: 100,
        });
    }, []);

    const { darkMode } = useDarkMode();

    // Handle input changes for text fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProperty({ ...newProperty, [name]: value });
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const blob = reader.result;
            setNewProperty((prevState) => ({
                ...prevState,
                images: [...prevState.images, blob]
            }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    // Add a new property or update an existing one
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            const updatedProperties = [...properties];
            updatedProperties[editingIndex] = newProperty;
            setProperties(updatedProperties);
            setIsEditing(false);
            setEditingIndex(null);
        } else {
            setProperties([...properties, newProperty]);
        }
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
    };

    // Edit a property
    const handleEdit = (index) => {
        setNewProperty(properties[index]);
        setIsEditing(true);
        setEditingIndex(index);
    };

    // Delete a property
    const handleDelete = (index) => {
        const filteredProperties = properties.filter((_, i) => i !== index);
        setProperties(filteredProperties);
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

    return (
        <div className={`${darkMode ? 'dark bg-black' : 'light bg-transparent'}`}>
            <section className="lg:w[90%] m-auto lg:px-20 px-6 py-20 w-full flex flex-col justify-center items-start gap-10">
                <div className='flex flex-col justify-center items-start gap-4'>
                    <h1 data-aos="zoom-in" className='text-red-500 dark:text-white'>PROPERTIES</h1>
                    <h1 data-aos="zoom-in" className='text-black text-4xl font-semibold dark:text-white'>Explore the Latest</h1>
                </div>

                {/* Property Form */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mb-10">
                    <input type="text" name="name" value={newProperty.name} onChange={handleInputChange} placeholder="Name" required />
                    <input type="text" name="price" value={newProperty.price} onChange={handleInputChange} placeholder="Price" required />
                    <input type="text" name="address" value={newProperty.address} onChange={handleInputChange} placeholder="Address" required />
                    <input type="text" name="bath" value={newProperty.bath} onChange={handleInputChange} placeholder="Baths" required />
                    <input type="text" name="bed" value={newProperty.bed} onChange={handleInputChange} placeholder="Beds" required />
                    <input type="text" name="area" value={newProperty.area} onChange={handleInputChange} placeholder="Area" required />
                    <input type="text" name="owner" value={newProperty.owner} onChange={handleInputChange} placeholder="Owner" required />
                    
                    {/* Image Upload Input */}
                    <input type="file" onChange={handleImageUpload} accept="image/*" />
                    <textarea name="about" value={newProperty.about} onChange={handleInputChange} placeholder="About the property" />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                        {isEditing ? 'Update Property' : 'Add Property'}
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
                )}

                {/* Properties Grid */}
                <div id='grid-box' className='w-full grid lg:grid-cols-3 grid-cols-1 justify-center items-center gap-8'>
                    {properties.map((item, index) => (
                        <div data-aos="zoom-in" data-aos-delay="200" key={index} className='bg-white dark:bg-gray-800 rounded-xl w-full'>
                            <div id='image-box' className='bg-cover bg-center h-[250px] rounded-xl p-4 flex flex-col justify-between items-end'>
                                {item.images.map((image, idx) => (
                                    <img key={idx} src={image} alt={`Property ${idx}`} className="w-full h-32 object-cover" onClick={() => openModal(image)} />
                                ))}

                                {/* Property Details */}
                                <div id='bottom' className='flex justify-between items-end w-full'>
                                    <div className='flex justify-start items-center gap-2'>
                                        <FaMapMarkerAlt className='text-white' />
                                        <h1 className='text-white'>{item.address}</h1>
                                    </div>
                                    <div className='flex justify-center items-center gap-4'>
                                        <FaVideo className='text-white' />
                                        <FaCamera className='text-white' />
                                    </div>
                                </div>
                            </div>

                            {/* Property Info */}
                            <div className='px-6 py-3'>
                                <h1 className='text-xl text-black font-semibold dark:text-white'>{item.name}</h1>
                                <h1 className='text-xl text-blue-600 font-bold dark:text-white'>{item.price}</h1>
                                <p className='dark:text-white'>{item.about}</p>

                                <div className='flex gap-4 mt-4'>
                                    <div className='flex items-center gap-2'>
                                        <FaBath className='text-blue-400' />
                                        <h1 className='dark:text-white'>{item.bath}</h1>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <FaBed className='text-blue-400' />
                                        <h1 className='dark:text-white'>{item.bed}</h1>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <MdSpaceDashboard className='text-blue-400' />
                                        <h1 className='dark:text-white'>{item.area}</h1>
                                    </div>
                                </div>

                                {/* Edit and Delete Buttons */}
                                <div className='flex justify-end gap-2'>
                                    <button onClick={() => handleEdit(index)} className="px-4 py-2 bg-yellow-500 text-white rounded">Edit</button>
                                    <button onClick={() => handleDelete(index)} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal for 360° Image View */}
                <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="Modal" overlayClassName="Overlay">
                    <button onClick={closeModal} className="absolute top-0 right-0 m-4 p-2 bg-red-600 text-white">Close</button>
                    <Scene embedded>
                        <Entity primitive="a-sky" src={selectedImage} rotation="0 -130 0" />
                    </Scene>
                </Modal>
            </section>
        </div>
    );
};

export default Properties;
