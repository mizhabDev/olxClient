import React, { useState, useRef } from "react";
import { Camera, Upload, X, ChevronDown, AlertTriangle } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



const SellPage = () => {
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [images, setImages] = useState([]);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const fileInputRef = useRef(null);

    const categories = [
        "Electronics",
        "Vehicles",
        "Property",
        "Furniture",
        "Fashion",
        "Books",
        "Sports",
        "Services",
        "Jobs",
        "Other"
    ];

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages].slice(0, 10)); // Max 10 images
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        const newImages = imageFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages].slice(0, 10));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // text fields (EXACT names)
        formData.append("productName", productName);
        formData.append("productPrice", price);
        formData.append("productLocation", location);
        formData.append("productCatogery", category); // ⚠️ spelling matters
        
        // files
        images.forEach((img) => {
            formData.append("productImage", img.file);
        });

        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/product`,
                formData,
                {
                    withCredentials: true, // 🔑 SEND COOKIE
                }
            );

            console.log("Product created:", res.data);
        } catch (error) {
            console.error(
                "Error submitting product:",
                error.response?.data || error.message
            );
        }
    };


    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
                    Upload Your Product
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Name */}
                    <div>
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-5 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                            required
                        />
                    </div>

                    {/* Category Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-5 py-3.5 text-left flex items-center justify-between focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                        >
                            <span className={category ? "text-white" : "text-gray-400"}>
                                {category || "Category (Dropdown)"}
                            </span>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isCategoryOpen && (
                            <div className="absolute z-20 w-full mt-2 bg-[#1e293b] border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => {
                                            setCategory(cat);
                                            setIsCategoryOpen(false);
                                        }}
                                        className="w-full px-5 py-3 text-left text-gray-300 hover:bg-orange-500/20 hover:text-white transition-colors"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description Textarea */}
                    <div>
                        <textarea
                            placeholder="Description (Textarea)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-5 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all resize-none"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <input
                            type="number"
                            placeholder="Price (Numeric)"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-5 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                            min="0"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <input
                            type="text"
                            placeholder="Location (e.g., Kerala, Mumbai)"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-5 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                            required
                        />
                    </div>

                    {/* Photos Section */}
                    <div>
                        <label className="text-white font-medium mb-3 block">Photos</label>

                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className="relative bg-[#1e293b]/30 border border-dashed border-slate-600 rounded-xl p-8 text-center transition-all hover:border-orange-500/50 hover:bg-[#1e293b]/50"
                        >
                            {/* Image Previews */}
                            {images.length > 0 && (
                                <div className="flex flex-wrap gap-3 mb-6">
                                    {images.map((img, index) => (
                                        <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                                            <img
                                                src={img.preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                            >
                                                <X className="w-5 h-5 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Area */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-[#1e293b]/80 border border-slate-600 flex items-center justify-center">
                                    <Camera className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-400 text-sm">Drag and drop to mene here</p>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-2.5 bg-[#1e293b] border border-slate-600 rounded-lg text-white text-sm font-medium hover:bg-[#1e293b]/80 hover:border-slate-500 transition-all flex items-center gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload Images
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transform transition-all duration-200 hover:-translate-y-0.5"
                        >
                            Publish Listing
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellPage;
