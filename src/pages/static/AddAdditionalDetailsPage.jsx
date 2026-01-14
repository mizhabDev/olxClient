import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Smartphone, Laptop, Tv, Camera, Refrigerator,
    Car, Bike, Truck, Home, Building2,
    Sofa, Bed, Armchair,
    Shirt, Watch, ShoppingBag,
    BookOpen, GraduationCap,
    Dumbbell, Trophy,
    Wrench, Code, Users,
    Briefcase, Clock,
    Package, ChevronDown, ChevronRight, Layers, Filter, ArrowLeft, Loader2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Layout from '../../components/home/Layout';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const CategoriesPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    // Product fetch states
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);
    const [filters, setFilters] = useState({});

    // Category-specific filter definitions
    const categoryFilters = {
        // Vehicles filters
        2: {
            fields: [
                { name: 'kmDriven', label: 'KM Driven', type: 'number', placeholder: 'e.g. 50000' },
                { name: 'year', label: 'Year', type: 'select', options: Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString()) },
                { name: 'fuelType', label: 'Fuel Type', type: 'select', options: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'] },
                { name: 'transmission', label: 'Transmission', type: 'select', options: ['Manual', 'Automatic'] },
                { name: 'owners', label: 'No. of Owners', type: 'select', options: ['1st Owner', '2nd Owner', '3rd Owner', '4+ Owners'] }
            ]
        },
        // Property filters
        3: {
            fields: [
                { name: 'bedrooms', label: 'Bedrooms', type: 'select', options: ['1', '2', '3', '4', '5+'] },
                { name: 'bathrooms', label: 'Bathrooms', type: 'select', options: ['1', '2', '3', '4+'] },
                { name: 'furnishing', label: 'Furnishing', type: 'select', options: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'] },
                { name: 'area', label: 'Area (sq.ft)', type: 'number', placeholder: 'e.g. 1200' },
                { name: 'floor', label: 'Floor', type: 'select', options: ['Ground', '1', '2', '3', '4', '5+', 'Top Floor'] },
                { name: 'facing', label: 'Facing', type: 'select', options: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'] }
            ]
        },
        // Electronics filters
        1: {
            fields: [
                { name: 'condition', label: 'Condition', type: 'select', options: ['Brand New', 'Like New', 'Good', 'Fair', 'For Parts'] },
                { name: 'warranty', label: 'Warranty', type: 'select', options: ['Under Warranty', 'Warranty Expired', 'No Warranty'] },
                { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Samsung, Apple' },
                { name: 'age', label: 'Age (months)', type: 'number', placeholder: 'e.g. 12' }
            ]
        },
        // Furniture filters
        4: {
            fields: [
                { name: 'condition', label: 'Condition', type: 'select', options: ['Brand New', 'Like New', 'Good', 'Fair'] },
                { name: 'material', label: 'Material', type: 'select', options: ['Wood', 'Metal', 'Plastic', 'Fabric', 'Leather', 'Glass', 'Mixed'] },
                { name: 'age', label: 'Age (years)', type: 'number', placeholder: 'e.g. 2' },
                { name: 'color', label: 'Color', type: 'text', placeholder: 'e.g. Brown, White' }
            ]
        },
        // Fashion filters
        5: {
            fields: [
                { name: 'condition', label: 'Condition', type: 'select', options: ['Brand New with Tags', 'Brand New', 'Like New', 'Good', 'Fair'] },
                { name: 'size', label: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'] },
                { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Nike, Zara' },
                { name: 'color', label: 'Color', type: 'text', placeholder: 'e.g. Black, Red' }
            ]
        },
        // Books filters
        6: {
            fields: [
                { name: 'condition', label: 'Condition', type: 'select', options: ['Brand New', 'Like New', 'Good', 'Fair', 'Acceptable'] },
                { name: 'edition', label: 'Edition', type: 'text', placeholder: 'e.g. 1st, 2nd, Latest' },
                { name: 'language', label: 'Language', type: 'select', options: ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Other'] }
            ]
        },
        // Sports filters
        7: {
            fields: [
                { name: 'condition', label: 'Condition', type: 'select', options: ['Brand New', 'Like New', 'Good', 'Fair'] },
                { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Nike, Adidas' },
                { name: 'age', label: 'Age (months)', type: 'number', placeholder: 'e.g. 6' }
            ]
        },
        // Services filters
        8: {
            fields: [
                { name: 'experience', label: 'Experience (years)', type: 'number', placeholder: 'e.g. 5' },
                { name: 'availability', label: 'Availability', type: 'select', options: ['Immediate', 'Within a week', 'Weekends only', 'Flexible'] },
                { name: 'serviceArea', label: 'Service Area', type: 'text', placeholder: 'e.g. Mumbai, Delhi NCR' }
            ]
        },
        // Jobs filters
        9: {
            fields: [
                { name: 'salary', label: 'Salary Range (₹/month)', type: 'text', placeholder: 'e.g. 20000-30000' },
                { name: 'experience', label: 'Experience Required', type: 'select', options: ['Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years'] },
                { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Mumbai, Bangalore' },
                { name: 'workType', label: 'Work Type', type: 'select', options: ['Work from Office', 'Work from Home', 'Hybrid', 'Field Work'] }
            ]
        }
    };

    const categories = [
        {
            id: 1,
            name: "Electronics",
            emoji: "📱",
            icon: <Smartphone className="w-5 h-5" />,
            color: "from-blue-500 to-cyan-500",
            subcategories: [
                { name: "Mobiles", icon: <Smartphone className="w-4 h-4" />, items: ["Smartphones", "Feature phones", "Accessories (chargers, cases)"] },
                { name: "Computers & Laptops", icon: <Laptop className="w-4 h-4" />, items: ["Laptops", "Desktops", "Monitors", "Keyboards / Mouse"] },
                { name: "TV, Audio & Video", icon: <Tv className="w-4 h-4" />, items: ["TVs", "Speakers", "Headphones"] },
                { name: "Cameras", icon: <Camera className="w-4 h-4" />, items: ["DSLR / Mirrorless", "Action cameras"] },
                { name: "Home Appliances", icon: <Refrigerator className="w-4 h-4" />, items: ["Fridge", "Washing Machine", "AC", "Microwave"] },
                { name: "Other", icon: <Package className="w-4 h-4" />, items: ["Other electronics not listed above"], isOther: true }
            ]
        },
        {
            id: 2,
            name: "Vehicles",
            emoji: "🚗",
            icon: <Car className="w-5 h-5" />,
            color: "from-red-500 to-orange-500",
            subcategories: [
                { name: "Cars", icon: <Car className="w-4 h-4" />, items: ["Sedan", "SUV", "Hatchback", "Luxury"] },
                { name: "Motorcycles & Scooters", icon: <Bike className="w-4 h-4" />, items: ["Sports bikes", "Cruisers", "Scooters"] },
                { name: "Bicycles", icon: <Bike className="w-4 h-4" />, items: ["Mountain", "Road", "Hybrid"] },
                { name: "Commercial Vehicles", icon: <Truck className="w-4 h-4" />, items: ["Trucks", "Pickups"] },
                { name: "Spare Parts", icon: <Wrench className="w-4 h-4" />, items: ["Engine parts", "Body parts", "Accessories"] },
                { name: "Rentals", icon: <Car className="w-4 h-4" />, items: ["Car rentals", "Bike rentals"] },
                { name: "Other", icon: <Package className="w-4 h-4" />, items: ["Other vehicles not listed above"], isOther: true }
            ]
        },
        {
            id: 3,
            name: "Property",
            emoji: "🏠",
            icon: <Home className="w-5 h-5" />,
            color: "from-green-500 to-emerald-500",
            subcategories: [
                { name: "For Sale - House", icon: <Home className="w-4 h-4" />, items: ["Independent house", "Villa", "Bungalow"] },
                { name: "For Sale - Flat / Apartment", icon: <Building2 className="w-4 h-4" />, items: ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"] },
                { name: "For Sale - Land / Plot", icon: <Home className="w-4 h-4" />, items: ["Residential", "Commercial", "Agricultural"] },
                { name: "For Rent - House", icon: <Home className="w-4 h-4" />, items: ["Independent house", "Villa"] },
                { name: "For Rent - Flat", icon: <Building2 className="w-4 h-4" />, items: ["1 BHK", "2 BHK", "3 BHK"] },
                { name: "PG / Hostel", icon: <Building2 className="w-4 h-4" />, items: ["Single sharing", "Double sharing", "Triple sharing"] },
                { name: "Commercial Property", icon: <Building2 className="w-4 h-4" />, items: ["Office", "Shop", "Warehouse"] },
                { name: "Other", icon: <Package className="w-4 h-4" />, items: ["Other properties not listed above"], isOther: true }
            ]
        },
        {
            id: 4,
            name: "Furniture",
            emoji: "🛋️",
            icon: <Sofa className="w-5 h-5" />,
            color: "from-amber-500 to-yellow-500",
            subcategories: [
                { name: "Sofa", icon: <Sofa className="w-4 h-4" />, items: ["L-shaped", "3-seater", "Recliner"] },
                { name: "Bed", icon: <Bed className="w-4 h-4" />, items: ["King size", "Queen size", "Single"] },
                { name: "Dining Table", icon: <Armchair className="w-4 h-4" />, items: ["4-seater", "6-seater", "8-seater"] },
                { name: "Wardrobe", icon: <Armchair className="w-4 h-4" />, items: ["Sliding door", "Hinged door", "Walk-in"] },
                { name: "Office Furniture", icon: <Armchair className="w-4 h-4" />, items: ["Desk", "Office chair", "Bookshelf"] },
                { name: "Home Decor", icon: <Sofa className="w-4 h-4" />, items: ["Wall art", "Rugs", "Lamps"] },
                { name: "Other", icon: <Package className="w-4 h-4" />, items: ["Other furniture not listed above"], isOther: true }
            ]
        },
        {
            id: 5,
            name: "Fashion",
            emoji: "👗",
            icon: <Shirt className="w-5 h-5" />,
            color: "from-pink-500 to-rose-500",
            subcategories: [
                { name: "Men - Clothing", icon: <Shirt className="w-4 h-4" />, items: ["Shirts", "T-shirts", "Pants", "Suits"] },
                { name: "Men - Footwear", icon: <ShoppingBag className="w-4 h-4" />, items: ["Sneakers", "Formal shoes", "Sandals"] },
                { name: "Men - Watches", icon: <Watch className="w-4 h-4" />, items: ["Analog", "Digital", "Smart watches"] },
                { name: "Women - Clothing", icon: <Shirt className="w-4 h-4" />, items: ["Dresses", "Sarees", "Tops", "Kurtis"] },
                { name: "Women - Footwear", icon: <ShoppingBag className="w-4 h-4" />, items: ["Heels", "Flats", "Sneakers"] },
                { name: "Women - Jewelry", icon: <ShoppingBag className="w-4 h-4" />, items: ["Necklaces", "Earrings", "Bracelets"] },
                { name: "Kids", icon: <Shirt className="w-4 h-4" />, items: ["Boys clothing", "Girls clothing", "Baby clothes"] },
                { name: "Bags & Accessories", icon: <ShoppingBag className="w-4 h-4" />, items: ["Handbags", "Wallets", "Belts"] },
                { name: "Other", icon: <Package className="w-4 h-4" />, items: ["Other fashion items not listed above"], isOther: true }
            ]
        },
        {
            id: 6,
            name: "Books",
            emoji: "📚",
            icon: <BookOpen className="w-5 h-5" />,
            color: "from-indigo-500 to-purple-500",
            subcategories: [
                { name: "Academic / Textbooks", icon: <GraduationCap className="w-4 h-4" />, items: ["School books", "College textbooks", "Reference books"] },
                { name: "Competitive Exam Books", icon: <BookOpen className="w-4 h-4" />, items: ["UPSC", "JEE/NEET", "Banking exams"] },
                { name: "Novels", icon: <BookOpen className="w-4 h-4" />, items: ["Fiction", "Non-fiction", "Thriller", "Romance"] },
                { name: "Magazines", icon: <BookOpen className="w-4 h-4" />, items: ["News", "Lifestyle", "Technology"] },
                { name: "Children's Books", icon: <BookOpen className="w-4 h-4" />, items: ["Story books", "Comics", "Activity books"] },
                { name: "Other", icon: <Package className="w-4 h-4" />, items: ["Other books not listed above"], isOther: true }
            ]
        },
        {
            id: 7,
            name: "Sports",
            emoji: "⚽",
            icon: <Trophy className="w-5 h-5" />,
            color: "from-teal-500 to-cyan-500",
            subcategories: [
                { name: "Gym & Fitness", icon: <Dumbbell className="w-4 h-4" />, items: ["Dumbbells", "Treadmill", "Yoga mats"] },
                { name: "Outdoor Sports", icon: <Trophy className="w-4 h-4" />, items: ["Camping gear", "Hiking equipment"] },
                { name: "Cricket", icon: <Trophy className="w-4 h-4" />, items: ["Bats", "Balls", "Pads", "Gloves"] },
                { name: "Football", icon: <Trophy className="w-4 h-4" />, items: ["Footballs", "Shin guards", "Boots"] },
                { name: "Indoor Games", icon: <Trophy className="w-4 h-4" />, items: ["Table tennis", "Chess", "Carrom"] },
                { name: "Sports Accessories", icon: <Dumbbell className="w-4 h-4" />, items: ["Bags", "Water bottles", "Wristbands"] },
                { name: "Other", icon: <Package className="w-4 h-4" />, items: ["Other sports items not listed above"], isOther: true }
            ]
        },
        {
            id: 8,
            name: "Services",
            emoji: "🔧",
            icon: <Wrench className="w-5 h-5" />,
            color: "from-slate-500 to-gray-500",
            subcategories: [
                { name: "Plumbing", icon: <Wrench className="w-4 h-4" />, items: ["Pipe repair", "Tap installation", "Drainage"] },
                { name: "Electrical", icon: <Wrench className="w-4 h-4" />, items: ["Wiring", "AC repair", "Appliance repair"] },
                { name: "Painting", icon: <Wrench className="w-4 h-4" />, items: ["Interior", "Exterior", "Waterproofing"] },
                { name: "Web Development", icon: <Code className="w-4 h-4" />, items: ["Website design", "E-commerce", "SEO"] },
                { name: "App Development", icon: <Code className="w-4 h-4" />, items: ["Android", "iOS", "Cross-platform"] },
                { name: "Tuition", icon: <Users className="w-4 h-4" />, items: ["School subjects", "Languages", "Music"] },
                { name: "Coaching", icon: <Users className="w-4 h-4" />, items: ["Competitive exams", "Sports coaching"] },
                { name: "Repair Services", icon: <Wrench className="w-4 h-4" />, items: ["Mobile repair", "Laptop repair", "TV repair"] },
                { name: "Other", icon: <Package className="w-4 h-4" />, items: ["Other services not listed above"], isOther: true }
            ]
        },
        {
            id: 9,
            name: "Jobs",
            emoji: "💼",
            icon: <Briefcase className="w-5 h-5" />,
            color: "from-violet-500 to-purple-500",
            subcategories: [
                { name: "Full-time", icon: <Briefcase className="w-4 h-4" />, items: ["IT jobs", "Sales", "Marketing", "Finance"] },
                { name: "Part-time", icon: <Clock className="w-4 h-4" />, items: ["Data entry", "Customer support", "Tutoring"] },
                { name: "Freelance", icon: <Briefcase className="w-4 h-4" />, items: ["Writing", "Design", "Development"] },
                { name: "Internships", icon: <GraduationCap className="w-4 h-4" />, items: ["Engineering", "Marketing", "HR"] },
                { name: "Driver", icon: <Car className="w-4 h-4" />, items: ["Personal driver", "Delivery driver", "Cab driver"] },
                { name: "Office Staff", icon: <Users className="w-4 h-4" />, items: ["Receptionist", "Admin", "Clerk"] },
                { name: "Other", icon: <Package className="w-4 h-4" />, items: ["Other jobs not listed above"], isOther: true }
            ]
        },
        {
            id: 10,
            name: "Other",
            emoji: "📦",
            icon: <Package className="w-5 h-5" />,
            color: "from-gray-500 to-zinc-500",
            subcategories: [
                { name: "Miscellaneous", icon: <Package className="w-4 h-4" />, items: ["Items that don't fit other categories"] }
            ]
        }
    ];

    // Fetch product on mount
    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await axios.get(
                    `${BACKEND_URL}/api/product/${productId}`,
                    { withCredentials: true }
                );

                const productData = res.data.data;
                setProduct(productData);

                // Auto-select category based on product's category
                const productCategory = productData.productCatogery || productData.productCategory;
                if (productCategory) {
                    const matchedCategory = categories.find(
                        cat => cat.name.toLowerCase() === productCategory.toLowerCase()
                    );
                    if (matchedCategory) {
                        setSelectedCategory(matchedCategory);
                    }
                }
            } catch (err) {
                setError("Failed to load product details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleSubcategorySelect = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setIsSubcategoryOpen(false);
    };

    const handleFilterChange = (fieldName, value) => {
        setFilters(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);

            // Transform filters object into array of {key, value} pairs
            const additionalDetailsArray = Object.entries(filters)
                .filter(([key, value]) => value !== '' && value !== null && value !== undefined)
                .map(([key, value]) => ({
                    key,
                    value: isNaN(Number(value)) ? value : Number(value)
                }));

            const payload = {
                subCategory: selectedSubcategory?.name,
                additionalDetails: additionalDetailsArray
            };

            const res = await axios.post(
                `${BACKEND_URL}/api/product/addAdditionalDetails/${productId}`,
                payload,
                { withCredentials: true }
            );

            console.log('Product updated:', res.data);
            // Navigate to the product page after successful update
            navigate(`/product/${productId}`);
        } catch (err) {
            console.error('Error updating product:', err);
            setError('Failed to update product details.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const renderFilterField = (field) => {
        if (field.type === 'select') {
            return (
                <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                        {field.label}
                    </label>
                    <select
                        value={filters[field.name] || ''}
                        onChange={(e) => handleFilterChange(field.name, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
                    >
                        <option value="" className="bg-[#0f172a]">Select {field.label}</option>
                        {field.options.map((option, idx) => (
                            <option key={idx} value={option} className="bg-[#0f172a]">{option}</option>
                        ))}
                    </select>
                </div>
            );
        } else if (field.type === 'number') {
            return (
                <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                        {field.label}
                    </label>
                    <input
                        type="number"
                        value={filters[field.name] || ''}
                        onChange={(e) => handleFilterChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                </div>
            );
        } else {
            return (
                <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                        {field.label}
                    </label>
                    <input
                        type="text"
                        value={filters[field.name] || ''}
                        onChange={(e) => handleFilterChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                </div>
            );
        }
    };

    const currentCategoryFilters = selectedCategory ? categoryFilters[selectedCategory.id] : null;

    // Loading State
    if (loading) {
        return (
            <>
                <Navbar />
                <Layout>
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-xl text-gray-300">Loading product details…</p>
                        </motion.div>
                    </div>
                </Layout>
                <Footer />
            </>
        );
    }

    // Error State
    if (error) {
        return (
            <>
                <Navbar />
                <Layout>
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl"
                        >
                            <p className="text-xl text-red-400 mb-4">{error}</p>
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold"
                            >
                                Go Back
                            </button>
                        </motion.div>
                    </div>
                </Layout>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Layout>
                <div className="min-h-[60vh] py-8">
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={handleBack}
                        className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back</span>
                    </motion.button>

                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                            <Layers className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 text-sm font-medium">Add More Details</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Complete Your <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Listing</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Add more details about your product to attract more buyers.
                        </p>
                    </motion.div>

                    {/* Product Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl mx-auto mb-8"
                    >
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                {product?.productPhotoSrc?.[0] && (
                                    <img
                                        src={`${BACKEND_URL}${product.productPhotoSrc[0]}`}
                                        alt={product.productName}
                                        className="w-20 h-20 rounded-xl object-cover"
                                    />
                                )}
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-white">{product?.productName}</h2>
                                    <p className="text-lg text-purple-400 font-semibold">₹{product?.productPrice?.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Category Display (Read-only) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="max-w-2xl mx-auto space-y-6"
                    >
                        {selectedCategory && (
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Category
                                </label>
                                <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-5 py-4 flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedCategory.color} flex items-center justify-center text-white`}>
                                        {selectedCategory.icon}
                                    </div>
                                    <span className="text-white font-medium">
                                        {selectedCategory.emoji} {selectedCategory.name}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Subcategory Dropdown */}
                        {selectedCategory && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="relative"
                            >
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Select Subcategory in {selectedCategory.name}
                                </label>
                                <button
                                    onClick={() => setIsSubcategoryOpen(!isSubcategoryOpen)}
                                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-5 py-4 flex items-center justify-between hover:bg-white/10 hover:border-white/20 transition-all"
                                >
                                    {selectedSubcategory ? (
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedCategory.color} bg-opacity-50 flex items-center justify-center text-white/80`}>
                                                {selectedSubcategory.icon}
                                            </div>
                                            <span className="text-white font-medium">{selectedSubcategory.name}</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">Select one of these...</span>
                                    )}
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isSubcategoryOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Subcategory Dropdown Menu */}
                                <AnimatePresence>
                                    {isSubcategoryOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 max-h-80 overflow-y-auto"
                                        >
                                            {selectedCategory.subcategories.map((subcat, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSubcategorySelect(subcat)}
                                                    className={`w-full px-5 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors ${selectedSubcategory?.name === subcat.name ? 'bg-white/10' : ''}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedCategory.color} bg-opacity-30 flex items-center justify-center text-white/70`}>
                                                        {subcat.icon}
                                                    </div>
                                                    <span className="text-white">{subcat.name}</span>
                                                    {subcat.isOther && (
                                                        <span className="ml-auto text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Optional</span>
                                                    )}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* Dynamic Filters Section */}
                        <AnimatePresence>
                            {selectedSubcategory && currentCategoryFilters && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedCategory.color} flex items-center justify-center text-white`}>
                                            <Filter className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">Additional Details</h3>
                                            <p className="text-sm text-gray-400">Fill in more information for better results</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentCategoryFilters.fields.map(renderFilterField)}
                                    </div>

                                    {/* Price Input - Common for all */}
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-400">
                                                    Min Price (₹)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={filters.minPrice || ''}
                                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                                    placeholder="e.g. 1000"
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-400">
                                                    Max Price (₹)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={filters.maxPrice || ''}
                                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                                    placeholder="e.g. 50000"
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Selected Items Display */}
                    <AnimatePresence>
                        {selectedSubcategory && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-2xl mx-auto mt-8"
                            >
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedCategory.color} flex items-center justify-center text-white`}>
                                            {selectedSubcategory.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{selectedSubcategory.name}</h3>
                                            <p className="text-sm text-gray-400">in {selectedCategory.name}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-4">
                                        <p className="text-sm text-gray-400 mb-3">Available item types:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSubcategory.items.map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg text-sm text-gray-300 hover:bg-purple-500/20 transition-colors cursor-pointer"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Selection Summary */}
                    {selectedCategory && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="max-w-2xl mx-auto mt-8"
                        >
                            <div className="flex items-center justify-center gap-2 text-gray-400 flex-wrap">
                                <span className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                                    {selectedCategory.emoji} {selectedCategory.name}
                                </span>
                                {selectedSubcategory && (
                                    <>
                                        <ChevronRight className="w-4 h-4" />
                                        <span className="px-3 py-1.5 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
                                            {selectedSubcategory.name}
                                        </span>
                                    </>
                                )}
                                {Object.keys(filters).length > 0 && (
                                    <>
                                        <ChevronRight className="w-4 h-4" />
                                        <span className="px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20 text-green-400">
                                            {Object.keys(filters).filter(k => filters[k]).length} filters applied
                                        </span>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <AnimatePresence>
                        {selectedSubcategory && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-2xl mx-auto mt-8"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={submitting}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold text-lg rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                                    onClick={handleSubmit}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Additional Details'
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Layout>
            <Footer />
        </>
    );
};

export default CategoriesPage;
